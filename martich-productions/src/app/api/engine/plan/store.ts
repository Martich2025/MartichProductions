import { randomUUID } from 'crypto'

type Tone = 'Elegant' | 'Bold' | 'Minimal' | 'Friendly'
export type MiniPlan = {
  choices?: { [key: string]: string | null | undefined; persona?: string | null; tone?: Tone; cadence?: string }
  hooks?: string[]
  captions?: string[]
  titles?: string[]
  beats?: string[]
}
export type AuditSnapshot = {
  domain?: string
  site?: { title?: string; description?: string; headings?: string[]; ctas?: string[]; hasProofSignals?: boolean }
  socials?: { instagram?: string; facebook?: string; youtube?: string }
  cadenceEstimate?: { postsPerWeek?: number; consistency?: 'low' | 'medium' | 'high' }
  benchmarks?: { cadencePerWeek?: { your?: number | null; top: number }; proof?: { your: boolean; note: string }; cta?: { yourCount: number; note: string } }
  insights?: { strengths: string[]; gaps: string[] }
}

const mem = (globalThis as unknown as { __MP_PLANS__?: Record<string, { plan: MiniPlan; audit?: AuditSnapshot; created_at: string }> })
if (!mem.__MP_PLANS__) mem.__MP_PLANS__ = {}

export async function savePlan(plan: MiniPlan, audit?: AuditSnapshot): Promise<string> {
  // Try Postgres first
  try {
    const { sql } = await import('@vercel/postgres')
    await sql`create table if not exists plans (
      pid uuid primary key,
      plan jsonb not null,
      audit jsonb,
      created_at timestamptz default now()
    )` as unknown as Promise<void>
    const pid = randomUUID()
    await sql`insert into plans (pid, plan, audit) values (${pid}, ${JSON.stringify(plan)}::jsonb, ${audit ? JSON.stringify(audit) : null}::jsonb)`
    return pid
  } catch {
    // fallback to memory
    const pid = randomUUID()
    mem.__MP_PLANS__![pid] = { plan, audit, created_at: new Date().toISOString() }
    return pid
  }
}

export async function getPlan(pid: string): Promise<{ plan: MiniPlan; audit?: AuditSnapshot; created_at: string } | null> {
  try {
    const { sql } = await import('@vercel/postgres')
    await sql`create table if not exists plans (
      pid uuid primary key,
      plan jsonb not null,
      audit jsonb,
      created_at timestamptz default now()
    )` as unknown as Promise<void>
    const { rows } = await sql<{ plan: MiniPlan; audit?: AuditSnapshot; created_at: string }>`select plan, audit, created_at from plans where pid = ${pid} limit 1`
    if (!rows?.[0]) return null
    return rows[0]
  } catch {
    return mem.__MP_PLANS__?.[pid] || null
  }
}


