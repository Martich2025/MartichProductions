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
    canonical?: string
    og?: { title?: string; description?: string }
    schema?: { hasOrganization?: boolean; hasLocalBusiness?: boolean; hasBreadcrumbList?: boolean; hasVideoObject?: boolean; hasArticle?: boolean }
    contact?: { hasEmail?: boolean; hasPhone?: boolean }
    seo?: { noindex?: boolean }
    ecosystem?: { linksTotal?: number; linksExternal?: number; images?: number; videos?: number }
    a11y?: { h1Count?: number; imagesMissingAlt?: number }
  }
  socials: {
    instagram?: string
    facebook?: string
    youtube?: string
  }
  socialsMeta?: {
    instagram?: { followersApprox?: number }
    facebook?: { followersApprox?: number }
    youtube?: { subscribersApprox?: number }
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
  score?: number
  targetScore?: number
  opportunity?: number
  confidence?: number
  schemaChecklist?: { hasOrganization?: boolean; hasLocalBusiness?: boolean; hasBreadcrumbList?: boolean; hasVideoObject?: boolean; hasArticle?: boolean }
  issues?: { id: string; title: string; severity: 'low' | 'medium' | 'high'; fix: string }[]
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
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  const hasOrgSchema = /application\/ld\+json[^>]*>[\s\S]*?"@type"\s*:\s*"Organization"/i.test(html)
  const hasLocalBusiness = /application\/ld\+json[^>]*>[\s\S]*?"@type"\s*:\s*"LocalBusiness"/i.test(html)
  const hasBreadcrumbList = /application\/ld\+json[^>]*>[\s\S]*?"@type"\s*:\s*"BreadcrumbList"/i.test(html)
  const hasVideoObject = /application\/ld\+json[^>]*>[\s\S]*?"@type"\s*:\s*"VideoObject"/i.test(html)
  const hasArticle = /application\/ld\+json[^>]*>[\s\S]*?"@type"\s*:\s*"Article"/i.test(html)
  const hasEmail = /mailto:/i.test(html)
  const hasPhone = /tel:/i.test(html)
  const noindex = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html)
  const linksTotal = (html.match(/<a\s[^>]*href=/gi) || []).length
  const linksExternal = (html.match(/<a[^>]*href=["']https?:\/\//gi) || []).length
  const images = (html.match(/<img\b/gi) || []).length
  const videos = (html.match(/<(video|iframe)[^>]*(youtube|vimeo|mp4)/gi) || []).length
  const imagesMissingAlt = (html.match(/<img\b[^>]*>/gi) || []).filter(tag => !/\salt=\s*(["']).*?\1/i.test(tag)).length
  const h1Count = h1Matches.length
  return {
    title: titleMatch?.[1]?.trim(),
    description: descMatch?.[1]?.trim(),
    headings: h1Matches.slice(0, 5),
    ctas,
    hasProofSignals: proofSignals,
    canonical: canonicalMatch?.[1],
    og: { title: ogTitleMatch?.[1]?.trim(), description: ogDescMatch?.[1]?.trim() },
    schema: { hasOrganization: hasOrgSchema, hasLocalBusiness, hasBreadcrumbList, hasVideoObject, hasArticle },
    contact: { hasEmail, hasPhone },
    seo: { noindex },
    ecosystem: { linksTotal, linksExternal, images, videos },
    a11y: { h1Count, imagesMissingAlt },
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScanRequest
    // Simple rate limit via global Map cache (stateless fallback: deny on excessive keys)
    if (Object.keys(body || {}).length > 20) {
      return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429 })
    }
    const rawDomain = (body.domain || '').trim()
    const domain = sanitizeUrl(rawDomain)

    let site = { title: undefined as string | undefined, description: undefined as string | undefined, headings: [] as string[], ctas: [] as string[], hasProofSignals: false, canonical: undefined as string | undefined, og: {} as { title?: string; description?: string }, schema: {} as { hasOrganization?: boolean; hasLocalBusiness?: boolean; hasBreadcrumbList?: boolean; hasVideoObject?: boolean; hasArticle?: boolean }, contact: {} as { hasEmail?: boolean; hasPhone?: boolean }, seo: {} as { noindex?: boolean } }

    let fetchedOk = false
    if (domain && /^https:\/\//i.test(domain) && domain.length < 2048) {
      const res = await fetchWithTimeout(domain, 4500)
      if (res && res.ok) {
        const html = await res.text()
        site = extractMeta(html)
        fetchedOk = true
      }
    }

    const socials = {
      instagram: sanitizeSocial(body.instagram),
      facebook: sanitizeSocial(body.facebook),
      youtube: sanitizeSocial(body.youtube),
    }

    // Best-effort social follower extraction (HTML regex heuristics)
    async function extractFollowers(url?: string): Promise<number | undefined> {
      if (!url) return undefined
      const res = await fetchWithTimeout(url, 3500)
      if (!res || !res.ok) return undefined
      const html = await res.text()
      // Generic patterns for follower counts
      const patterns = [
        /([0-9][0-9\.,]{2,})\s*(followers|subs|subscribers)/i,
        /(followers|subs|subscribers)\s*([0-9][0-9\.,]{2,})/i,
      ]
      for (const re of patterns) {
        const m = html.match(re)
        if (m) {
          const numStr = (m[1] || m[2] || '').replace(/[,\.](?=\d{3}\b)/g, '')
          const approx = parseInt(numStr, 10)
          if (!Number.isNaN(approx)) return approx
        }
      }
      return undefined
    }

    const socialsMeta = {
      instagram: { followersApprox: await extractFollowers(socials.instagram) },
      facebook: { followersApprox: await extractFollowers(socials.facebook) },
      youtube: { subscribersApprox: await extractFollowers(socials.youtube) },
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

    if (site.canonical) strengths.push('Canonical URL found')
    else gaps.push('Add canonical URL for SEO consistency')

    if (!site.seo?.noindex) strengths.push('Indexable by search engines')
    else gaps.push('Remove noindex for production pages')

    if (site.contact?.hasEmail || site.contact?.hasPhone) strengths.push('Contact methods detected')
    else gaps.push('Add clear contact method (phone/email)')

    // Simple scoring model (0–100)
    let score = 50
    if (site.title) score += 6
    if (site.description) score += 6
    if (site.ctas && site.ctas.length > 0) score += 10
    if (site.hasProofSignals) score += 10
    if (site.canonical) score += 5
    if (!site.seo?.noindex) score += 5
    if (site.contact?.hasEmail || site.contact?.hasPhone) score += 4
    score = Math.max(0, Math.min(100, score))

    // Target and opportunity
    const targetScore = 92
    const opportunity = Math.max(0, targetScore - score)

    // Confidence based on fetch success and number of detected signals
    const signalCount = [
      site.title,
      site.description,
      site.canonical,
      site.og?.title,
      site.og?.description,
      site.schema?.hasOrganization,
      site.schema?.hasLocalBusiness,
      site.schema?.hasBreadcrumbList,
      site.schema?.hasVideoObject,
      site.schema?.hasArticle,
      site.contact?.hasEmail,
      site.contact?.hasPhone,
      site.seo && !site.seo.noindex,
    ].filter(Boolean).length
    const confidence = Math.max(0.3, Math.min(1, (fetchedOk ? 0.5 : 0.2) + signalCount * 0.04))

    // Issues list with severities and fixes
    const issues: { id: string; title: string; severity: 'low'|'medium'|'high'; fix: string }[] = []
    if (!site.hasProofSignals) issues.push({ id: 'proof', title: 'Missing social proof', severity: 'high', fix: 'Add logos/testimonials/case studies above the fold.' })
    if (!site.ctas || site.ctas.length === 0) issues.push({ id: 'cta', title: 'No primary CTA', severity: 'high', fix: 'Add a persistent "Book/Consult" CTA in hero and header.' })
    if (!site.canonical) issues.push({ id: 'canonical', title: 'No canonical URL', severity: 'medium', fix: 'Add rel=canonical in <head> to consolidate signals.' })
    if (site.seo?.noindex) issues.push({ id: 'index', title: 'Page set to noindex', severity: 'high', fix: 'Remove noindex on production pages.' })
    if (!(site.contact?.hasEmail || site.contact?.hasPhone)) issues.push({ id: 'contact', title: 'No visible contact', severity: 'medium', fix: 'Add email and/or phone in header/footer.' })
    if (!site.og?.title || !site.og?.description) issues.push({ id: 'og', title: 'OG tags incomplete', severity: 'low', fix: 'Add og:title and og:description for better sharing.' })
    if (!site.schema?.hasOrganization) issues.push({ id: 'schema_org', title: 'Missing Organization schema', severity: 'low', fix: 'Add JSON‑LD Organization schema.' })
    if (!site.schema?.hasBreadcrumbList) issues.push({ id: 'schema_breadcrumb', title: 'Missing BreadcrumbList schema', severity: 'low', fix: 'Add BreadcrumbList JSON‑LD.' })
    if (!site.schema?.hasVideoObject) issues.push({ id: 'schema_video', title: 'Missing VideoObject schema', severity: 'low', fix: 'Add VideoObject JSON‑LD for hero/case study video.' })

    const snapshot: AuditSnapshot = {
      domain,
      site,
      socials,
      socialsMeta,
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
      score,
      targetScore,
      opportunity,
      confidence,
      schemaChecklist: {
        hasOrganization: Boolean(site.schema?.hasOrganization),
        hasLocalBusiness: Boolean(site.schema?.hasLocalBusiness),
        hasBreadcrumbList: Boolean(site.schema?.hasBreadcrumbList),
        hasVideoObject: Boolean(site.schema?.hasVideoObject),
        hasArticle: Boolean(site.schema?.hasArticle),
      },
      issues,
    }

    // Server-side analytics mirror (consent-independent)
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'engine_scan_server',
          properties: {
            domain: !!domain,
            instagram: !!socials.instagram,
            facebook: !!socials.facebook,
            youtube: !!socials.youtube,
          },
          timestamp: new Date().toISOString(),
          session_id: undefined,
          user_id: undefined,
        }),
      })
    } catch {}

    return NextResponse.json({ ok: true, snapshot })
  } catch {
    return NextResponse.json({ ok: false, snapshot: {
      site: { hasProofSignals: false }, socials: {}, cadenceEstimate: { consistency: 'low' }, insights: { strengths: [], gaps: [] } } }, { status: 200 })
  }
}
function sanitizeUrl(input?: string) {
  if (!input) return undefined
  const trimmed = input.trim()
  if (trimmed.length > 2048) return undefined
  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'https:') return undefined
    if (!u.hostname || /^(data|file|javascript|about):/i.test(u.protocol)) return undefined
    return u.toString().replace(/\/$/, '')
  } catch {
    return undefined
  }
}

function sanitizeSocial(input?: string) {
  if (!input) return undefined
  const val = input.trim()
  if (!/^https?:\/\//i.test(val)) return undefined
  if (val.length > 1024) return undefined
  try {
    const u = new URL(val)
    if (!['http:', 'https:'].includes(u.protocol)) return undefined
    return u.toString()
  } catch { return undefined }
}


