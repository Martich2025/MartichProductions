import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

const UpsertEmployee = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  email: z.string().email().optional(),
  timezone: z.string().optional(),
  active: z.boolean().optional(),
  dailyStartMinutes: z.number().min(0).max(24*60).optional(),
  dailyEndMinutes: z.number().min(0).max(24*60).optional(),
  slackWebhookUrl: z.string().url().optional(),
})

const BlackoutSchema = z.object({
  employeeId: z.string().uuid(),
  days: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    if (body && body.blackouts) {
      const parsed = BlackoutSchema.safeParse(body.blackouts)
      if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_blackouts' }, { status: 400 })
      await sql`
        CREATE TABLE IF NOT EXISTS employee_blackouts (
          id UUID PRIMARY KEY,
          employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
          day DATE NOT NULL
        );
      `
      for (const d of parsed.data.days) {
        const id = uuidv4()
        await sql`INSERT INTO employee_blackouts (id, employee_id, day) VALUES (${id}, ${parsed.data.employeeId}, ${d}) ON CONFLICT DO NOTHING`
      }
      return NextResponse.json({ ok: true })
    }

    const parsed = UpsertEmployee.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
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
    const id = parsed.data.id || uuidv4()
    await sql`
      INSERT INTO employees (id, name, email, timezone, active, daily_start_minutes, daily_end_minutes, slack_webhook_url)
      VALUES (${id}, ${parsed.data.name}, ${parsed.data.email || null}, ${parsed.data.timezone || 'America/Chicago'}, ${parsed.data.active ?? true}, ${parsed.data.dailyStartMinutes ?? 9*60}, ${parsed.data.dailyEndMinutes ?? 17*60}, ${parsed.data.slackWebhookUrl || null})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, timezone = EXCLUDED.timezone, active = EXCLUDED.active, daily_start_minutes = EXCLUDED.daily_start_minutes, daily_end_minutes = EXCLUDED.daily_end_minutes, slack_webhook_url = EXCLUDED.slack_webhook_url
    `
    return NextResponse.json({ ok: true, id })
  } catch (e) {
    console.error('admin scheduler error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


