import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Create minimal employee tables if not exist
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

    const { rows } = await sql<{ id: string; name: string; email: string | null; timezone: string | null; daily_start_minutes: number | null; daily_end_minutes: number | null }>`
      SELECT id, name, email, timezone, daily_start_minutes, daily_end_minutes FROM employees WHERE active = TRUE ORDER BY name ASC
    `
    return NextResponse.json({ ok: true, employees: rows })
  } catch (e) {
    console.error('employees list error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}


