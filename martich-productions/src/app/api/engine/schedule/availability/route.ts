import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { z } from 'zod'

export const runtime = 'nodejs'

// simple in-memory rate limit per ip
const counts = new Map<string, { c: number; t: number }>()
const WINDOW_MS = 60_000
const MAX = 20

function rateLimit(ip: string | null) {
  const key = ip || 'unknown'
  const now = Date.now()
  const entry = counts.get(key) || { c: 0, t: now }
  if (now - entry.t > WINDOW_MS) {
    entry.c = 1
    entry.t = now
  } else {
    entry.c += 1
  }
  counts.set(key, entry)
  return entry.c <= MAX
}

const QuerySchema = z.object({
  days: z.coerce.number().min(1).max(30).optional(),
  step: z.coerce.number().min(15).max(120).optional(),
  tzOffset: z.coerce.number().min(-720).max(840).optional(), // minutes offset from UTC (local = UTC + tzOffset)
  bufferMin: z.coerce.number().min(0).max(180).optional(),
  blackout: z.string().optional(), // comma-separated YYYY-MM-DD
  producerId: z.string().uuid().optional(),
})

export async function GET(request: NextRequest) {
  const fwd = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const ip = (fwd ? fwd.split(',')[0].trim() : real) || 'unknown'
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })

  try {
    const { searchParams } = new URL(request.url)
    const parsed = QuerySchema.safeParse({
      days: searchParams.get('days') || undefined,
      step: searchParams.get('step') || undefined,
      tzOffset: searchParams.get('tzOffset') || undefined,
      bufferMin: searchParams.get('bufferMin') || undefined,
      blackout: searchParams.get('blackout') || undefined,
    })
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 })

    const days = parsed.data.days ?? 14
    const step = parsed.data.step ?? 30
    const tzOffset = parsed.data.tzOffset ?? -300 // Default CT during DST
    const bufferMin = parsed.data.bufferMin ?? 10
    const producerId = parsed.data.producerId
    const blackoutSet = new Set(
      (parsed.data.blackout || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    )

    // Ensure tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        notes TEXT,
        producer_id UUID,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        timezone TEXT DEFAULT 'America/Chicago',
        active BOOLEAN DEFAULT TRUE,
        daily_start_minutes INT DEFAULT 9*60,
        daily_end_minutes INT DEFAULT 17*60,
        slack_webhook_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS employee_blackouts (
        id UUID PRIMARY KEY,
        employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
        day DATE NOT NULL
      );
    `

    const now = new Date()
    const nowUtcMs = now.getTime()

    // Fetch existing bookings over the next window to exclude
    const windowEnd = new Date(nowUtcMs + days * 24 * 60 * 60 * 1000)
    const { rows: booked } = await sql<{ start_time: string; end_time: string; producer_id: string | null }>`
      SELECT start_time, end_time, producer_id FROM bookings WHERE start_time < ${windowEnd.toISOString()} AND end_time > ${now.toISOString()}
    `

    function isBooked(slotStart: Date, slotEnd: Date) {
      for (const b of booked) {
        // If filtering by producer, only consider bookings for that producer
        if (producerId && b.producer_id && b.producer_id !== producerId) continue
        const bStart = new Date(b.start_time).getTime()
        const bEnd = new Date(b.end_time).getTime()
        const s = slotStart.getTime()
        const e = slotEnd.getTime()
        if (s < bEnd && e > bStart) return true
      }
      return false
    }

    // Load producer schedule (defaults if not provided)
    let startMinutes = 9 * 60
    let endMinutes = 17 * 60
    let blackoutSetProducer = new Set<string>()
    if (producerId) {
      const emp = await sql<{ daily_start_minutes: number | null; daily_end_minutes: number | null }>`
        SELECT daily_start_minutes, daily_end_minutes FROM employees WHERE id = ${producerId} AND active = TRUE LIMIT 1
      `
      if (emp.rows[0]) {
        startMinutes = emp.rows[0].daily_start_minutes ?? startMinutes
        endMinutes = emp.rows[0].daily_end_minutes ?? endMinutes
      }
      const ebo = await sql<{ day: string }>`
        SELECT day FROM employee_blackouts WHERE employee_id = ${producerId} AND day >= ${now.toISOString().slice(0,10)} AND day <= ${windowEnd.toISOString().slice(0,10)}
      `
      blackoutSetProducer = new Set(ebo.rows.map(r => r.day))
    }

    const out: { days: { date: string; slots: string[] }[] } = { days: [] }
    for (let d = 0; d < days; d++) {
      const dayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      dayUtc.setUTCDate(dayUtc.getUTCDate() + d)

      // Compute local weekday
      const localMs = dayUtc.getTime() + tzOffset * 60 * 1000
      const local = new Date(localMs)
      const weekday = local.getUTCDay() // 0 Sun ... 6 Sat
      if (weekday === 0 || weekday === 6) {
        out.days.push({ date: dayUtc.toISOString().slice(0, 10), slots: [] })
        continue
      }

      const dayIso = dayUtc.toISOString().slice(0, 10)
      if (blackoutSet.has(dayIso) || blackoutSetProducer.has(dayIso)) {
        out.days.push({ date: dayIso, slots: [] })
        continue
      }

      const slots: string[] = []
      for (let m = startMinutes; m < endMinutes; m += step) {
        // local date at minutes m
        const localSlot = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()))
        localSlot.setUTCMinutes(m)
        // convert to UTC by subtracting offset
        const slotStart = new Date(localSlot.getTime() - tzOffset * 60 * 1000)
        const slotEnd = new Date(slotStart.getTime() + step * 60 * 1000)
        if (slotEnd.getTime() <= nowUtcMs) continue
        // apply buffer before/after existing bookings
        const bufferedStart = new Date(slotStart.getTime() - bufferMin * 60 * 1000)
        const bufferedEnd = new Date(slotEnd.getTime() + bufferMin * 60 * 1000)
        // If producer filtering is on, exclude slots booked for that producer
        if (isBooked(bufferedStart, bufferedEnd)) continue
        slots.push(slotStart.toISOString())
      }
      out.days.push({ date: dayIso, slots })
    }

    return NextResponse.json({ ok: true, ...out })
  } catch (e) {
    console.error('availability error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


