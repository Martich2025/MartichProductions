import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  if (!token) return NextResponse.redirect(new URL('/engine/map?step=book', req.url))
  const nowIso = new Date().toISOString()
  const { rows } = await sql`DELETE FROM bookings WHERE cancel_token = ${token} AND cancel_expires > ${nowIso} RETURNING id`
  // Regardless of outcome, redirect to booking step with a note param
  const url = new URL('/engine/map?step=book', req.url)
  url.searchParams.set('canceled', rows[0]?.id ? '1' : '0')
  return NextResponse.redirect(url)
}


