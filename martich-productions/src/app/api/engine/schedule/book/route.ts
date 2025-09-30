import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'
import { CONTACT_EMAIL, ORG_NAME } from '@/lib/site'
import { v4 as uuidv4_res } from 'uuid'

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
  rescheduleToken: z.string().optional(),
  producerId: z.string().uuid().optional(),
  planPid: z.string().uuid().optional(),
  shareUrl: z.string().url().optional(),
  service: z.string().optional(),
  persona: z.string().optional(),
  role: z.string().optional(),
  focus: z.string().optional(),
  cadence: z.string().optional(),
  timeline: z.string().optional(),
  site: z.string().optional(),
})

async function sendSlack(message: string, blocks?: unknown) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blocks ? { text: message, blocks } : { text: message }),
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
  const fwd = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const ip = (fwd ? fwd.split(',')[0].trim() : real) || 'unknown'
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })

  try {
    const json = await request.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_body', details: parsed.error.issues }, { status: 400 })

    const { name, email, phone, notes, startIso, durationMin, rescheduleToken, producerId, planPid, shareUrl, service, persona, role, focus, cadence, timeline, site } = parsed.data
    const start = new Date(startIso)
    const end = new Date(start.getTime() + durationMin * 60 * 1000)

    // server-side analytics mirror: booking attempt
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'engine_booking_attempt_server', properties: { email, start: start.toISOString() }, timestamp: new Date().toISOString(), session_id: undefined, user_id: undefined })
      })
    } catch {}

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        notes TEXT,
        producer_id UUID,
        plan_pid UUID,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        reschedule_token TEXT,
        reschedule_expires TIMESTAMPTZ,
        cancel_token TEXT,
        cancel_expires TIMESTAMPTZ,
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

    // Determine target producer (respect requested producer if available; otherwise auto-assign)
    async function pickProducer(): Promise<{ id: string; name: string | null; email: string | null } | null> {
      if (producerId) {
        const { rows } = await sql<{ id: string; name: string | null; email: string | null }>`
          SELECT id, name, email FROM employees WHERE id = ${producerId} AND active = TRUE LIMIT 1
        `
        return rows[0] || null
      }
      // Choose least-loaded available producer for this slot
      const { rows: emps } = await sql<{ id: string; name: string | null; email: string | null }>`
        SELECT id, name, email FROM employees WHERE active = TRUE
      `
      if (emps.length === 0) return null
      // Filter out producers with a conflict at this time
      const { rows: conflicts } = await sql<{ producer_id: string }>`
        SELECT producer_id FROM bookings WHERE start_time < ${end.toISOString()} AND end_time > ${start.toISOString()} AND producer_id IS NOT NULL
      `
      const conflicting = new Set(conflicts.map(c => c.producer_id))
      const available = emps.filter(e => !conflicting.has(e.id))
      if (available.length === 0) return null
      // Least load in next 14 days
      const windowEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      const { rows: loads } = await sql<{ producer_id: string; count: number }>`
        SELECT producer_id, COUNT(*)::int AS count FROM bookings WHERE producer_id IS NOT NULL AND start_time < ${windowEnd} GROUP BY producer_id
      `
      const loadMap = new Map(loads.map(l => [l.producer_id, l.count]))
      available.sort((a, b) => (loadMap.get(a.id) || 0) - (loadMap.get(b.id) || 0))
      return available[0]
    }

    const assigned = await pickProducer()
    if (!assigned) return NextResponse.json({ ok: false, error: 'no_producer_available' }, { status: 409 })

    // conflict check per assigned producer (ignore the booking being rescheduled, if applicable)
    const { rows: conflicts } = await sql<{ id: string }>`
      SELECT id FROM bookings WHERE producer_id = ${assigned.id} AND start_time < ${end.toISOString()} AND end_time > ${start.toISOString()}
    `
    if (conflicts.length > 0) {
      if (!rescheduleToken) return NextResponse.json({ ok: false, error: 'slot_taken' }, { status: 409 })
      // If rescheduling, it's a conflict unless the only conflict is the same booking being moved
      const self = await sql<{ id: string }>`SELECT id FROM bookings WHERE reschedule_token = ${rescheduleToken} LIMIT 1`
      const selfId = self.rows[0]?.id
      const otherConflict = conflicts.find(c => c.id !== selfId)
      if (otherConflict) return NextResponse.json({ ok: false, error: 'slot_taken' }, { status: 409 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://martichproductions.com'
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    let id = ''
    let cancelToken = ''
    let effectiveRescheduleToken = rescheduleToken || ''
    if (rescheduleToken) {
      // Update existing booking by token
      const existing = await sql<{ id: string }>`SELECT id FROM bookings WHERE reschedule_token = ${rescheduleToken} AND reschedule_expires > ${new Date().toISOString()} LIMIT 1`
      if (!existing.rows[0]) return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 })
      id = existing.rows[0].id
      await sql`
        UPDATE bookings SET start_time = ${start.toISOString()}, end_time = ${end.toISOString()}, notes = ${notes || null}, producer_id = ${assigned.id}, plan_pid = ${planPid || null}
        WHERE id = ${id}
      `
      const row = await sql<{ cancel_token: string }>`SELECT cancel_token FROM bookings WHERE id = ${id} LIMIT 1`
      cancelToken = row.rows[0]?.cancel_token || ''
    } else {
      id = uuidv4()
      effectiveRescheduleToken = uuidv4_res()
      cancelToken = uuidv4_res()
      await sql`
        INSERT INTO bookings (id, name, email, phone, notes, producer_id, plan_pid, start_time, end_time, reschedule_token, reschedule_expires, cancel_token, cancel_expires)
        VALUES (${id}, ${name}, ${email}, ${phone || null}, ${notes || null}, ${assigned.id}, ${planPid || null}, ${start.toISOString()}, ${end.toISOString()}, ${effectiveRescheduleToken}, ${expiry.toISOString()}, ${cancelToken}, ${expiry.toISOString()})
      `
    }

    const slackText = `${rescheduleToken ? 'Rescheduled' : 'New'} Mapping Call\nProducer: ${assigned.name || assigned.id}\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\nWhen: ${start.toISOString()} → ${end.toISOString()}\nNotes: ${notes || '—'}`
    const planLink = planPid ? `${baseUrl}/engine/plan?pid=${planPid}` : (shareUrl || null)
    const slackBlocks = [
      { type: 'header', text: { type: 'plain_text', text: rescheduleToken ? 'Rescheduled Mapping Call' : 'New Mapping Call' } },
      { type: 'section', fields: [
        { type: 'mrkdwn', text: `*Client*: ${name}` },
        { type: 'mrkdwn', text: `*Email*: ${email}` },
        phone ? { type: 'mrkdwn', text: `*Phone*: ${phone}` } : undefined,
        { type: 'mrkdwn', text: `*Producer*: ${assigned.name || assigned.id}` },
        { type: 'mrkdwn', text: `*When*: ${start.toISOString()} → ${end.toISOString()}` },
        service ? { type: 'mrkdwn', text: `*Service*: ${service}` } : undefined,
        persona ? { type: 'mrkdwn', text: `*Persona*: ${persona}` } : undefined,
        role ? { type: 'mrkdwn', text: `*Role*: ${role}` } : undefined,
        focus ? { type: 'mrkdwn', text: `*Focus*: ${focus}` } : undefined,
        cadence ? { type: 'mrkdwn', text: `*Cadence*: ${cadence}` } : undefined,
        timeline ? { type: 'mrkdwn', text: `*Timeline*: ${timeline}` } : undefined,
        site ? { type: 'mrkdwn', text: `*Site*: ${site}` } : undefined,
      ].filter(Boolean) },
      planLink ? { type: 'section', text: { type: 'mrkdwn', text: `*Plan*: ${planLink}` } } : undefined,
      notes ? { type: 'section', text: { type: 'mrkdwn', text: `*Notes*\n${notes}` } } : undefined,
      { type: 'actions', elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Reschedule' }, url: `${baseUrl}/api/engine/schedule/reschedule?token=${effectiveRescheduleToken}` },
        { type: 'button', text: { type: 'plain_text', text: 'Cancel' }, url: `${baseUrl}/api/engine/schedule/cancel?token=${cancelToken}` },
      ] },
    ].filter(Boolean)
    await sendSlack(slackText, slackBlocks)
    // Per-producer Slack webhook (if configured)
    try {
      const { rows: empRow } = await sql<{ slack_webhook_url: string | null }>`SELECT slack_webhook_url FROM employees WHERE id = ${assigned.id} LIMIT 1`
      const hook = empRow[0]?.slack_webhook_url
      if (hook) {
        await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `You were assigned a Mapping Call with ${name} (${email}) at ${start.toISOString()}`, blocks: slackBlocks }) })
      }
    } catch {}

    // server-side analytics mirror: producer assignment
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'engine_booking_assigned_producer_server', properties: { producerId: assigned.id }, timestamp: new Date().toISOString(), session_id: undefined, user_id: undefined })
      })
    } catch {}

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
              producerId: assigned.id,
            planPid: planPid || null,
            shareUrl: planLink || null,
            service: service || null,
            persona: persona || null,
            role: role || null,
            focus: focus || null,
            cadence: cadence || null,
            timeline: timeline || null,
            site: site || null,
          }),
        })
      } catch {}
    }

    // Email confirmations with ICS (if Resend configured)
    const resendKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
    if (resendKey) {
      const resend = new Resend(resendKey)
      const organizerEmail = (assigned.email && assigned.email.includes('@')) ? assigned.email : (CONTACT_EMAIL || from)
      const summary = `${ORG_NAME} — Mapping Call`
      const description = `Mapping Call with Martich Productions.${rescheduleToken ? ' (Rescheduled)' : ''}\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`
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
        <p>
          <a href="${baseUrl}/api/engine/schedule/reschedule?token=${effectiveRescheduleToken}" target="_blank" rel="noopener noreferrer">Reschedule</a>
          &nbsp;|&nbsp;
          <a href="${baseUrl}/api/engine/schedule/cancel?token=${cancelToken}" target="_blank" rel="noopener noreferrer">Cancel</a>
        </p>
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

    return NextResponse.json({ ok: true, id, producer: { id: assigned.id } })
  } catch (e) {
    console.error('booking error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


