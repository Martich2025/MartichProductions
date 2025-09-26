import { NextRequest, NextResponse } from 'next/server'
import { getPlan } from '../store'

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get('pid') || ''
  if (!pid) return NextResponse.json({ ok: false }, { status: 400 })
  const row = await getPlan(pid)
  if (!row) return NextResponse.json({ ok: false }, { status: 404 })
  // Server-side analytics mirror: plan view
  try {
    await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'engine_plan_view_server',
        properties: { pid, hasHooks: (row.plan?.hooks || []).length },
        timestamp: new Date().toISOString(),
        session_id: undefined,
        user_id: undefined,
      }),
    })
  } catch {}
  return NextResponse.json({ ok: true, ...row, pid })
}


