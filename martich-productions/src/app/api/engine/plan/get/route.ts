import { NextRequest, NextResponse } from 'next/server'
import { getPlan } from '../store'

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get('pid') || ''
  if (!pid) return NextResponse.json({ ok: false }, { status: 400 })
  const row = await getPlan(pid)
  if (!row) return NextResponse.json({ ok: false }, { status: 404 })
  return NextResponse.json({ ok: true, ...row, pid })
}


