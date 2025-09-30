import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  if (!token) return NextResponse.redirect(new URL('/engine/map?step=book', req.url))
  const nowIso = new Date().toISOString()
  const { rows } = await sql`SELECT id FROM bookings WHERE reschedule_token = ${token} AND reschedule_expires > ${nowIso} LIMIT 1`
  if (!rows[0]) return NextResponse.redirect(new URL('/engine/map?step=book', req.url))
  // In a real system, we would present a UI to pick a new slot; for now just redirect to booking step with token
  const url = new URL('/engine/map?step=book', req.url)
  url.searchParams.set('r', token)
  return NextResponse.redirect(url)
}


