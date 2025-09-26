import { NextRequest, NextResponse } from 'next/server'
import { savePlan, type MiniPlan, type AuditSnapshot } from '../store'

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


