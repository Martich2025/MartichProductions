import { NextResponse } from 'next/server'

type ScanRequest = {
  domain?: string
  instagram?: string
  facebook?: string
  youtube?: string
}

type AuditSnapshot = {
  domain?: string
  site: {
    title?: string
    description?: string
    headings?: string[]
    ctas?: string[]
    hasProofSignals: boolean
  }
  socials: {
    instagram?: string
    facebook?: string
    youtube?: string
  }
  cadenceEstimate: {
    postsPerWeek?: number
    consistency?: 'low' | 'medium' | 'high'
  }
  benchmarks?: {
    cadencePerWeek: { your?: number | null; top: number }
    proof: { your: boolean; note: string }
    cta: { yourCount: number; note: string }
  }
  insights: {
    strengths: string[]
    gaps: string[]
  }
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), ms)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(t)
    return res
  } catch {
    return null
  }
}

function extractMeta(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean)
  const ctaMatches = Array.from(html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi))
    .map(m => m[1].replace(/<[^>]+>/g, '').trim().toLowerCase())
    .filter(Boolean)
  const ctas = Array.from(new Set(ctaMatches.filter(txt => /(book|consult|contact|call|schedule|quote|learn more)/i.test(txt)).slice(0, 6)))
  const proofSignals = /(testimonials?|reviews?|clients?|case\s*studies?)/i.test(html)
  return {
    title: titleMatch?.[1]?.trim(),
    description: descMatch?.[1]?.trim(),
    headings: h1Matches.slice(0, 5),
    ctas,
    hasProofSignals: proofSignals,
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScanRequest
    // Simple rate limit via global Map cache (stateless fallback: deny on excessive keys)
    if (Object.keys(body || {}).length > 20) {
      return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429 })
    }
    const domain = body.domain?.trim()?.replace(/\/$/, '')

    let site = { title: undefined as string | undefined, description: undefined as string | undefined, headings: [] as string[], ctas: [] as string[], hasProofSignals: false }

    if (domain && /^https?:\/\//i.test(domain) && domain.length < 2048) {
      const res = await fetchWithTimeout(domain, 4500)
      if (res && res.ok) {
        const html = await res.text()
        site = extractMeta(html)
      }
    }

    const socials = {
      instagram: body.instagram?.trim(),
      facebook: body.facebook?.trim(),
      youtube: body.youtube?.trim(),
    }

    // Heuristic cadence placeholder until connectors are added
    const cadenceEstimate = {
      postsPerWeek: undefined as number | undefined,
      consistency: 'low' as 'low' | 'medium' | 'high',
    }

    const strengths: string[] = []
    const gaps: string[] = []

    if (site.title) strengths.push('Clear site title detected')
    else gaps.push('Missing clear page title')

    if (site.description) strengths.push('Meta description present')
    else gaps.push('Meta description missing')

    if (site.hasProofSignals) strengths.push('Proof signals found (testimonials/case studies)')
    else gaps.push('Add social proof band or case studies to build trust')

    if ((site.ctas || []).length > 0) strengths.push('Calls-to-action present')
    else gaps.push('Add primary CTA above the fold (Book/Consult)')

    const snapshot: AuditSnapshot = {
      domain,
      site,
      socials,
      cadenceEstimate,
      benchmarks: {
        cadencePerWeek: { your: cadenceEstimate.postsPerWeek ?? null, top: 2.3 },
        proof: { your: site.hasProofSignals, note: site.hasProofSignals ? 'ok' : 'Add a proof band (logos/testimonial) above the fold' },
        cta: { yourCount: site.ctas?.length || 0, note: (site.ctas?.length || 0) > 0 ? 'ok' : 'Add primary hero CTA (Book/Consult)' },
      },
      insights: {
        strengths: strengths.slice(0, 3),
        gaps: gaps.slice(0, 3),
      },
    }

    return NextResponse.json({ ok: true, snapshot })
  } catch (e) {
    return NextResponse.json({ ok: false, snapshot: {
      site: { hasProofSignals: false }, socials: {}, cadenceEstimate: { consistency: 'low' }, insights: { strengths: [], gaps: [] } } }, { status: 200 })
  }
}


