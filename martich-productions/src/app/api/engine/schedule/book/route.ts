import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'
import { CONTACT_EMAIL, ORG_NAME } from '@/lib/site'

export const runtime = 'nodejs'

// naive rate limit
const counts = new Map<string, { c: number; t: number }>()
const WINDOW_MS = 60_000
const MAX = 10

function rateLimit(ip: string | null) {
  const key = ip || 'unknown'
  const now = Date.now()
  const entry = counts.get(key) || { c: 0, t: now }
  if (now - entry.t > WINDOW_MS) { entry.c = 1; entry.t = now } else { entry.c += 1 }
  counts.set(key, entry)
  return entry.c <= MAX
}

const BodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  startIso: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'invalid_date'),
  durationMin: z.number().min(15).max(120).default(30),
})

async function sendSlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })
  } catch {}
}

function formatIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) + 'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) + 'Z'
  )
}

function createIcs(options: { uid: string; start: Date; end: Date; summary: string; description: string; organizerEmail: string; organizerName?: string; attendeeEmail?: string; location?: string; }): string {
  const { uid, start, end, summary, description, organizerEmail, organizerName, attendeeEmail, location } = options
  const dtStamp = formatIcsDate(new Date())
  const dtStart = formatIcsDate(start)
  const dtEnd = formatIcsDate(end)
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//Martich Productions//Scheduling//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    organizerName ? `ORGANIZER;CN=${organizerName}:MAILTO:${organizerEmail}` : `ORGANIZER:MAILTO:${organizerEmail}`,
    attendeeEmail ? `ATTENDEE;CN=${attendeeEmail};RSVP=TRUE:MAILTO:${attendeeEmail}` : '',
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.join('\r\n')
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })

  try {
    const json = await request.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_body', details: parsed.error.issues }, { status: 400 })

    const { name, email, phone, notes, startIso, durationMin } = parsed.data
    const start = new Date(startIso)
    const end = new Date(start.getTime() + durationMin * 60 * 1000)

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

    // conflict check
    const { rows: conflicts } = await sql`
      SELECT id FROM bookings WHERE start_time < ${end.toISOString()} AND end_time > ${start.toISOString()} LIMIT 1
    `
    if (conflicts.length > 0) {
      return NextResponse.json({ ok: false, error: 'slot_taken' }, { status: 409 })
    }

    const id = uuidv4()
    await sql`
      INSERT INTO bookings (id, name, email, phone, notes, start_time, end_time)
      VALUES (${id}, ${name}, ${email}, ${phone || null}, ${notes || null}, ${start.toISOString()}, ${end.toISOString()})
    `

    await sendSlack(`New Mapping Call Booked\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\nWhen: ${start.toISOString()} → ${end.toISOString()}\nNotes: ${notes || '—'}`)

    // Optional CRM webhook
    const crmUrl = process.env.CRM_WEBHOOK_URL
    if (crmUrl) {
      try {
        await fetch(crmUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            name,
            email,
            phone,
            notes,
            start: start.toISOString(),
            end: end.toISOString(),
            source: 'engine_map',
          }),
        })
      } catch {}
    }

    // Email confirmations with ICS (if Resend configured)
    const resendKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
    if (resendKey) {
      const resend = new Resend(resendKey)
      const organizerEmail = CONTACT_EMAIL || from
      const summary = `${ORG_NAME} — Mapping Call`
      const description = `Mapping Call with Martich Productions.\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`
      const ics = createIcs({
        uid: id,
        start,
        end,
        summary,
        description,
        organizerEmail,
        organizerName: ORG_NAME,
        attendeeEmail: email,
        location: 'Online',
      })
      const icsBuffer = Buffer.from(ics, 'utf-8')

      const html = `
        <p>Hi ${name.split(' ')[0] || 'there'},</p>
        <p>Your mapping call with <strong>${ORG_NAME}</strong> is booked.</p>
        <p><strong>When:</strong> ${start.toLocaleString()} – ${end.toLocaleString()}</p>
        <p>We’ll send a meeting link and review your plan together.</p>
        <p>— ${ORG_NAME}</p>
      `
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: `Confirmed: Mapping Call with ${ORG_NAME}`,
          html,
          attachments: [{ filename: 'mapping-call.ics', content: icsBuffer, contentType: 'text/calendar' }],
        })
      } catch {}
      try {
        await resend.emails.send({
          from,
          to: organizerEmail,
          subject: `New Booking: ${name}`,
          html: `New booking from ${name} (${email})${phone ? `, ${phone}` : ''}.` ,
          attachments: [{ filename: `${name}-mapping-call.ics`, content: icsBuffer, contentType: 'text/calendar' }],
        })
      } catch {}
    }

    return NextResponse.json({ ok: true, id })
  } catch (e) {
    console.error('booking error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


