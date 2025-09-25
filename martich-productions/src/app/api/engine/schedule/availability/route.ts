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
})

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })

  try {
    const { searchParams } = new URL(request.url)
    const parsed = QuerySchema.safeParse({
      days: searchParams.get('days') || undefined,
      step: searchParams.get('step') || undefined,
      tzOffset: searchParams.get('tzOffset') || undefined,
    })
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 })

    const days = parsed.data.days ?? 14
    const step = parsed.data.step ?? 30
    const tzOffset = parsed.data.tzOffset ?? -300 // Default CT during DST

    // Ensure bookings table exists (id uuid primary key, start_time timestamptz, end_time timestamptz, meta jsonb)
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        notes TEXT,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    const now = new Date()
    const nowUtcMs = now.getTime()

    // Fetch existing bookings over the next window to exclude
    const windowEnd = new Date(nowUtcMs + days * 24 * 60 * 60 * 1000)
    const { rows: booked } = await sql<{ start_time: string; end_time: string }[]>`
      SELECT start_time, end_time FROM bookings WHERE start_time < ${windowEnd.toISOString()} AND end_time > ${now.toISOString()}
    `

    function isBooked(slotStart: Date, slotEnd: Date) {
      for (const b of booked) {
        const bStart = new Date(b.start_time).getTime()
        const bEnd = new Date(b.end_time).getTime()
        const s = slotStart.getTime()
        const e = slotEnd.getTime()
        if (s < bEnd && e > bStart) return true
      }
      return false
    }

    // Business hours in local minutes [start, end)
    const startMinutes = 9 * 60
    const endMinutes = 17 * 60

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

      const slots: string[] = []
      for (let m = startMinutes; m < endMinutes; m += step) {
        // local date at minutes m
        const localSlot = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()))
        localSlot.setUTCMinutes(m)
        // convert to UTC by subtracting offset
        const slotStart = new Date(localSlot.getTime() - tzOffset * 60 * 1000)
        const slotEnd = new Date(slotStart.getTime() + step * 60 * 1000)
        if (slotEnd.getTime() <= nowUtcMs) continue
        if (isBooked(slotStart, slotEnd)) continue
        slots.push(slotStart.toISOString())
      }
      out.days.push({ date: dayUtc.toISOString().slice(0, 10), slots })
    }

    return NextResponse.json({ ok: true, ...out })
  } catch (e) {
    console.error('availability error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


