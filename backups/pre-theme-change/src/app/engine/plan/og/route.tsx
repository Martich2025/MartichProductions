import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
// Note: alt/size/contentType are only valid on opengraph-image.tsx, not route handlers

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get('pid') || ''
  let hooks: unknown[] = []
  let cadence: string = 'steady'
  let score: number | undefined
  let persona: string | undefined
  let targetScore: number | undefined
  if (pid) {
    try {
      const url = new URL('/api/engine/plan/get', req.url)
      url.searchParams.set('pid', pid)
      const res = await fetch(url.toString(), { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        hooks = (data?.plan?.hooks || []).slice(0, 3)
        cadence = (data?.plan?.choices?.cadence) || 'steady'
        score = data?.audit?.score
        persona = data?.plan?.choices?.persona
        targetScore = data?.audit?.targetScore
      }
    } catch {}
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          color: 'white',
          padding: '48px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 42, color: '#D4AF37', letterSpacing: 1 }}>Martich Productions</div>
        <div>
          <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 12 }}>90‑Day Mini Plan</div>
          {persona && <div style={{ fontSize: 28, color: '#9CA3AF', marginBottom: 6 }}>{String(persona).toUpperCase()}</div>}
          {hooks.length > 0 && (
            <div style={{ fontSize: 28, opacity: 0.85 }}>
              {hooks.map((h, i) => (
                <div key={i}>• {String(h).slice(0, 80)}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, opacity: 0.9 }}>
          <div>Cadence: {String(cadence)}</div>
          <div>
            {typeof score === 'number'
              ? `Score: ${Math.max(0, Math.min(100, score))}/100` + (typeof targetScore === 'number' ? ` (Δ +${Math.max(0, targetScore - (score || 0))})` : '')
              : 'engine.martichproductions.com'}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}


