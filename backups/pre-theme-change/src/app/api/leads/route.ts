import { NextResponse } from 'next/server'

function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined
  return input.slice(0, 500)
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0]
    const body = await request.json()
    if (Object.keys(body || {}).length > 50) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }

    // Basic validation & size limits
    const email = sanitize(body.email)
    const role = sanitize(body.role)
    const timeline = sanitize(body.timeline)
    const message = sanitize(body.message)
    const consent = Boolean(body.consent)

    if (!email || !isValidEmail(email) || !consent) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
    }

    // naive rate limit: deny if body contains too many keys or message too long
    if (Object.keys(body).length > 25) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }
    // Optional: audit snapshot and utm/referrer
    const audit = typeof body.audit === 'object' ? body.audit : undefined
    const utm = typeof body.utm === 'object' ? body.utm : undefined
    const referrer = typeof body.referrer === 'string' ? body.referrer : undefined

    // Optional: send to Slack and CRM if configured
    try {
      const slack = process.env.SLACK_WEBHOOK_URL
      if (slack) {
        await fetch(slack, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `New Lead\nEmail: ${email}\nRole: ${role || '—'}\nTimeline: ${timeline || '—'}\nMessage: ${(message || '').slice(0, 200)}` }),
        })
      }
    } catch {}
    try {
      const crm = process.env.CRM_WEBHOOK_URL
      if (crm) {
        await fetch(crm, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            role,
            timeline,
            message,
            consent,
            ip,
            audit,
            utm,
            referrer,
            source: 'lead_form',
          }),
        })
      }
    } catch {}

    // Mirror to analytics endpoint
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'lead_submit', properties: { email, role, timeline, message, consent, ip, audit, utm, referrer } }),
      })
    } catch {}
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}


