import { NextRequest, NextResponse } from 'next/server'
import { savePlan, type MiniPlan, type AuditSnapshot } from '../store'

type Tone = 'Elegant' | 'Bold' | 'Minimal' | 'Friendly'
type MiniPlan = {
  choices?: { [key: string]: string | null | undefined; persona?: string | null; tone?: Tone; cadence?: string }
  hooks?: string[]
  captions?: string[]
  titles?: string[]
  beats?: string[]
}
type AuditSnapshot = {
  domain?: string
  site?: { title?: string; description?: string; headings?: string[]; ctas?: string[]; hasProofSignals?: boolean }
  socials?: { instagram?: string; facebook?: string; youtube?: string }
  cadenceEstimate?: { postsPerWeek?: number; consistency?: 'low' | 'medium' | 'high' }
  benchmarks?: { cadencePerWeek?: { your?: number | null; top: number }; proof?: { your: boolean; note: string }; cta?: { yourCount: number; note: string } }
  insights?: { strengths: string[]; gaps: string[] }
}

// In-memory fallback (non-persistent across cold starts)
const globalStore = globalThis as unknown as { __MP_PLANS__?: Record<string, { plan: MiniPlan; audit?: AuditSnapshot; createdAt: string }> }
if (!globalStore.__MP_PLANS__) globalStore.__MP_PLANS__ = {}

export async function POST(req: NextRequest) {
  try {
    const { plan, audit }: { plan: MiniPlan; audit?: AuditSnapshot } = await req.json()
    const pid = await savePlan(plan, audit)
    return NextResponse.json({ ok: true, pid })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}


