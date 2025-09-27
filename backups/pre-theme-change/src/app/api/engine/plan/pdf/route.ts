import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { CONTACT_EMAIL, CONTACT_PHONE_TEL } from '@/lib/site'

export const runtime = 'nodejs'

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
  site?: {
    title?: string
    description?: string
    headings?: string[]
    ctas?: string[]
    hasProofSignals?: boolean
    canonical?: string
    og?: { title?: string; description?: string }
    schema?: { hasOrganization?: boolean }
    contact?: { hasEmail?: boolean; hasPhone?: boolean }
    seo?: { noindex?: boolean }
    ecosystem?: { linksTotal?: number; linksExternal?: number; images?: number; videos?: number }
    a11y?: { h1Count?: number; imagesMissingAlt?: number }
  }
  socials?: { instagram?: string; facebook?: string; youtube?: string }
  cadenceEstimate?: { postsPerWeek?: number; consistency?: 'low' | 'medium' | 'high' }
  insights?: { strengths: string[]; gaps: string[] }
  benchmarks?: {
    cadencePerWeek?: { your?: number | null; top: number }
    proof?: { your: boolean; note: string }
    cta?: { yourCount: number; note: string }
  }
  score?: number
  socialsMeta?: {
    instagram?: { followersApprox?: number }
    facebook?: { followersApprox?: number }
    youtube?: { subscribersApprox?: number }
  }
  targetScore?: number
  opportunity?: number
  confidence?: number
  schemaChecklist?: { hasOrganization?: boolean; hasLocalBusiness?: boolean; hasBreadcrumbList?: boolean; hasVideoObject?: boolean; hasArticle?: boolean }
  issues?: { id: string; title: string; severity: 'low' | 'medium' | 'high'; fix: string }[]
}

export async function POST(req: NextRequest) {
  try {
    const { plan, audit }: { plan?: MiniPlan; audit?: AuditSnapshot } = await req.json()

    const persona = plan?.choices?.persona || '—'
    const tone: Tone = (plan?.choices?.tone as Tone) || 'Elegant'
    const cadence = plan?.choices?.cadence || 'steady'

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 48 })
      const chunks: Buffer[] = []
      doc.on('data', (c) => chunks.push(Buffer.from(c)))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      doc.fontSize(18).text('Martich Productions — 90‑Day Mini Plan', { align: 'left' })
      doc.moveDown(0.3)
      const withFill = doc as unknown as PDFDocument & { fillColor: (c: string) => PDFDocument }
      withFill.fillColor('#9CA3AF')
      doc.fontSize(11).text('A fast, visual outline of the first 90 days—hooks, cadence, and site fixes—so you know exactly what we’ll build and why it converts.')
      const genAt = new Date().toLocaleString()
      doc.fontSize(10).text(`Generated: ${genAt}`)
      withFill.fillColor('#FFFFFF')
      doc.moveDown(0.6)
      doc.fontSize(12).text(`Persona: ${persona}   Tone: ${tone}   Cadence: ${cadence}`)

      if (audit) {
        doc.moveDown()
        doc.fontSize(14).text('Snapshot', { underline: true })
        const ctas = (audit.site?.ctas || []).slice(0, 6)
        const strengths = (audit.insights?.strengths || []).slice(0, 6)
        const gaps = (audit.insights?.gaps || []).slice(0, 6)
        // KPI line-up
        const scoreVal = Math.max(0, Math.min(100, audit.score || 0))
        doc.fontSize(11).text(`Audit Score: ${scoreVal}/100`)
        // Visual score bar with typed drawing interface
        type PdfDrawDoc = PDFDocument & {
          x: number
          y: number
          rect: (x: number, y: number, w: number, h: number) => PdfDrawDoc
          fill: (color?: string) => PdfDrawDoc
          stroke: () => PdfDrawDoc
        }
        const drawDoc = doc as unknown as PdfDrawDoc
        const barX = drawDoc.x, barY = drawDoc.y + 2
        const barW = 200, barH = 6
        drawDoc.rect(barX, barY, barW, barH).fill('#1f2937')
        drawDoc.rect(barX, barY, (barW * scoreVal) / 100, barH).fill('#D4AF37')
        doc.moveDown(0.6)
        doc.fontSize(11).text(`CTAs: ${ctas.length ? ctas.join(', ') : '—'}`)
        doc.fontSize(11).text(`Proof: ${audit.site?.hasProofSignals ? 'Present' : 'Missing'}`)
        doc.fontSize(11).text(`Canonical: ${audit.site?.canonical ? 'Present' : 'Missing'}`)
        doc.fontSize(11).text(`Indexable: ${audit.site?.seo?.noindex ? 'No' : 'Yes'}`)
        if (audit.benchmarks?.cadencePerWeek) {
          const y = audit.benchmarks.cadencePerWeek.your
          const top = audit.benchmarks.cadencePerWeek.top
          doc.fontSize(11).text(`Cadence: ${y ?? '—'}/wk vs top ${top}/wk`)
        }
        if (typeof audit.targetScore === 'number') {
          const delta = Math.max(0, (audit.targetScore || 0) - (audit.score || 0))
          doc.fontSize(11).text(`Opportunity Delta: +${delta} → target ${audit.targetScore}`)
        }
        if (typeof audit.confidence === 'number') {
          doc.fontSize(11).text(`Confidence: ${Math.round((audit.confidence || 0) * 100)}%`)
        }
        // Social reach lines
        const ig = audit.socialsMeta?.instagram?.followersApprox
        const fb = audit.socialsMeta?.facebook?.followersApprox
        const yt = audit.socialsMeta?.youtube?.subscribersApprox
        if (ig || fb || yt) {
          doc.fontSize(11).text(`Social Reach (approx): IG ${ig ?? '—'} • FB ${fb ?? '—'} • YT ${yt ?? '—'}`)
        }

        // Executive Summary
        doc.moveDown(0.5)
        doc.fontSize(14).text('Executive Summary', { underline: true })
        doc.fontSize(11).text(`Score: ${Math.max(0, Math.min(100, audit.score || 0))}/100`)
        const topGaps = (audit.insights?.gaps || []).slice(0, 3)
        if (topGaps.length) {
          doc.fontSize(11).text('Top gaps:')
          topGaps.forEach(g => doc.fontSize(11).text(`• ${g}`))
        }
        doc.fontSize(11).text('Next 7 days:')
        doc.fontSize(11).text('• Implement proof band and primary hero CTA')
        doc.fontSize(11).text('• Lock cadence and shotlist for hero + verticals')
        doc.fontSize(11).text('• Ship conversion pages; enable analytics events')
      // Research Summary
      doc.moveDown(0.5)
      doc.fontSize(14).text('Research Summary', { underline: true })
      doc.fontSize(11).text(`Site: ${audit.domain || '—'}`)
      doc.fontSize(11).text(`Instagram: ${audit.socials?.instagram ? 'yes' : 'no'}`)
      doc.fontSize(11).text(`Facebook: ${audit.socials?.facebook ? 'yes' : 'no'}`)
      doc.fontSize(11).text(`YouTube: ${audit.socials?.youtube ? 'yes' : 'no'}`)
      if (typeof audit.confidence === 'number') {
        doc.fontSize(11).text(`Confidence: ${Math.round((audit.confidence || 0) * 100)}%`)
      }
        doc.moveDown(0.5)
        doc.fontSize(12).text('Wins')
        if (strengths.length) strengths.forEach(s => doc.fontSize(11).text(`• ${s}`))
        else doc.fontSize(11).text('• None detected from public signals')
        doc.moveDown(0.5)
        doc.fontSize(12).text('Gaps')
        if (gaps.length) gaps.forEach(g => doc.fontSize(11).text(`• ${g}`))
        else doc.fontSize(11).text('• None detected')

        // Fix Plan (persona-aware)
        doc.moveDown(0.5)
        doc.fontSize(12).text('Fix Plan')
        if (!audit.site?.hasProofSignals) doc.fontSize(11).text('• Add proof band above the fold (logos/testimonial/case study)')
        if (!audit.site?.ctas || audit.site.ctas.length === 0) doc.fontSize(11).text('• Add a primary hero CTA (Book/Consult) and make it persistent')
        if (!audit.site?.canonical) doc.fontSize(11).text('• Add canonical URL in <head> to consolidate signals')
        if (audit.site?.seo?.noindex) doc.fontSize(11).text('• Remove noindex from production pages')
        if (!(audit.site?.contact?.hasEmail || audit.site?.contact?.hasPhone)) doc.fontSize(11).text('• Add visible contact method (email/phone) in header/footer')
        const personaText = plan?.choices?.persona
        if (personaText === 'realtor') doc.fontSize(11).text('• Realtor: Property story film + micro verticals; gate with tracked CTAs to schedule showings')
        if (personaText === 'resort') doc.fontSize(11).text('• Resort: Hero brand story + amenity reels; add booking CTA and proof logos')
        if (personaText === 'hospitality') doc.fontSize(11).text('• Hospitality: Menu/experience reels; place reservation CTA in sticky header')
        if (personaText === 'events') doc.fontSize(11).text('• Events: Highlight film + testimonial strip; add inquiry CTA above the fold')

        // Why this converts
        doc.moveDown(0.5)
        doc.fontSize(12).text('Why This Converts')
        doc.fontSize(11).text('• Hooks prime the first 2s; proof reduces friction; clear CTA frames the next action')
        doc.fontSize(11).text('• Multi‑format cadence compounds reach while pages capture demand')
        doc.fontSize(11).text('• Weekly review closes the loop: views → engaged → leads → booked')

        // Pains We Fix (map detected gaps)
        const pains = (audit.insights?.gaps || []).slice(0, 6)
        if (pains.length) {
          doc.moveDown(0.5)
          doc.fontSize(12).text('Pains We Fix')
          pains.forEach((g) => {
            const lower = g.toLowerCase()
            const fix = lower.includes('cta') ? 'Add a primary hero CTA and sticky consult bar'
              : lower.includes('proof') ? 'Add proof band with logos/testimonial/case study'
              : lower.includes('title') ? 'Write a clear, benefit‑led title'
              : lower.includes('description') ? 'Add a concise meta description'
              : 'Address in the first implementation sprint'
            doc.fontSize(11).text(`• ${g} → ${fix}`)
          })
        // Gap Cards summary
        doc.moveDown(0.2)
        doc.fontSize(12).text('Gap Cards')
        pains.forEach((g, i) => {
          doc.fontSize(11).text(`• ${String(i + 1).padStart(2,'0')}: ${g}`)
        })
        }

        // Schema Checklist
        doc.moveDown(0.5)
        doc.fontSize(12).text('Schema Checklist')
        const schema = audit.schemaChecklist || {}
        doc.fontSize(11).text(`${schema.hasOrganization ? '✓' : '—'} Organization`)
        doc.fontSize(11).text(`${schema.hasLocalBusiness ? '✓' : '—'} LocalBusiness`)
        doc.fontSize(11).text(`${schema.hasBreadcrumbList ? '✓' : '—'} BreadcrumbList`)
        doc.fontSize(11).text(`${schema.hasVideoObject ? '✓' : '—'} VideoObject`)
        doc.fontSize(11).text(`${schema.hasArticle ? '✓' : '—'} Article`)

        // Issues
        if (Array.isArray(audit.issues) && audit.issues.length) {
          doc.moveDown(0.5)
          doc.fontSize(12).text('Issues')
          audit.issues.slice(0, 8).forEach((iss) => {
            const sev = iss.severity === 'high' ? 'HIGH' : iss.severity === 'medium' ? 'MED' : 'LOW'
            doc.fontSize(11).text(`• [${sev}] ${iss.title} — ${iss.fix}`)
          })
          // Issue Heatmap strip
          doc.moveDown(0.2)
          doc.fontSize(11).text('Heat: ', { continued: true })
          const heat = audit.issues.slice(0, 20)
          heat.forEach((iss, idx) => {
            const color = iss.severity === 'high' ? '#ef4444' : iss.severity === 'medium' ? '#f59e0b' : '#D4AF37'
            const d = doc as unknown as PDFDocument & { x: number; y: number; rect: (x: number, y: number, w: number, h: number) => unknown; fillColor: (color?: string) => unknown; fill: (color?: string) => unknown }
            const startX = d.x + (idx * 10)
            const startY = d.y - 8
            d.rect(startX, startY, 8, 4)
            d.fillColor(color)
            d.fill()
          })
        }

        // Ecosystem
        doc.moveDown(0.5)
        doc.fontSize(12).text('Ecosystem Overview')
        const eco = audit.site?.ecosystem || {}
        doc.fontSize(11).text(`Links: ${eco.linksTotal ?? '—'} (${eco.linksExternal ?? 0} external)`)
        doc.fontSize(11).text(`Images: ${eco.images ?? '—'}`)
        doc.fontSize(11).text(`Videos: ${eco.videos ?? '—'}`)

      // Accessibility Snapshot
      doc.moveDown(0.5)
      doc.fontSize(12).text('Accessibility Snapshot')
      const a11y = audit.site?.a11y || {}
      doc.fontSize(11).text(`H1 Count: ${a11y.h1Count ?? '—'}`)
      doc.fontSize(11).text(`Images missing alt: ${a11y.imagesMissingAlt ?? '—'}`)
      }

      doc.moveDown()
      doc.fontSize(14).text('Hooks', { underline: true })
      ;(plan?.hooks || []).slice(0, 10).forEach(h => doc.fontSize(11).text(`• ${h}`))

      // Hero Headline Variants
      doc.moveDown()
      doc.fontSize(14).text('Hero Headline Variants', { underline: true })
      const personaTxt = (plan?.choices?.persona || '').toString()
      const toneTxt = (plan?.choices?.tone || 'Elegant').toString()
      const variants = [
        personaTxt === 'resort' ? 'Your weekend should feel like this.' : personaTxt === 'realtor' ? 'See it. Feel it. Book the tour.' : personaTxt === 'hospitality' ? 'Tonight deserves the good stuff.' : personaTxt === 'events' ? 'Your day, cinematic.' : 'Make the first frame count.',
        toneTxt === 'Bold' ? 'Stop the scroll. Start the story.' : toneTxt === 'Minimal' ? 'Less noise. More signal.' : toneTxt === 'Friendly' ? 'Hey—this is worth your time.' : 'Elegance that moves.',
        'Proof above the fold. Offer in the light.'
      ]
      variants.forEach(v => doc.fontSize(11).text(`• ${v}`))

      // CTA Variants
      doc.moveDown()
      doc.fontSize(14).text('CTA Variants', { underline: true })
      const personaCtas = personaTxt === 'resort' ? ['Book Your Stay','Explore Amenities'] : personaTxt === 'realtor' ? ['Book a Tour','See Availability'] : personaTxt === 'hospitality' ? ['Reserve a Table','View Menu'] : personaTxt === 'events' ? ['Inquire Now','See Packages'] : ['Book a Consult','See Work']
      personaCtas.forEach(c => doc.fontSize(11).text(`• ${c}`))

      doc.moveDown()
      doc.fontSize(14).text('Captions', { underline: true })
      ;(plan?.captions || []).slice(0, 10).forEach(c => doc.fontSize(11).text(`• ${c}`))

      doc.moveDown()
      doc.fontSize(14).text('Titles', { underline: true })
      ;(plan?.titles || []).slice(0, 10).forEach(t => doc.fontSize(11).text(`• ${t}`))

      doc.moveDown()
      doc.fontSize(14).text('Storyboard Beats', { underline: true })
      ;(plan?.beats || []).slice(0, 8).forEach(b => doc.fontSize(11).text(`• ${b}`))

      // 4-Week Calendar Preview based on cadence
      doc.moveDown()
      doc.fontSize(14).text('4‑Week Calendar Preview', { underline: true })
      const cadenceKey = String(cadence || '').toLowerCase()
      const weekItems: string[][] = []
      for (let w = 0; w < 4; w++) {
        if (cadenceKey === 'surge') weekItems.push(['Reel', 'Reel', 'Carousel', 'Hero beat'])
        else if (cadenceKey === 'fast') weekItems.push(['Reel', 'Carousel', 'Hero beat'])
        else weekItems.push(['Reel', 'Hero beat'])
      }
      weekItems.forEach((items, i) => {
        doc.fontSize(12).text(`Week ${i + 1}`)
        items.forEach(label => doc.fontSize(11).text(`• ${label}`))
        doc.moveDown(0.2)
      })

      // Conversion Timeline
      doc.moveDown()
      doc.fontSize(14).text('Conversion Timeline (First 4 Weeks)', { underline: true })
      const tl: string[][] = [
        ['Audit fixes', 'Shotlist + Hero film', 'First 3 reels'],
        ['Launch hero film', 'Reels batch 2', 'Site CTA orchestration'],
        ['Reels batch 3', 'Case study shell', 'Retarget hooks'],
        ['Reels batch 4', 'Proof band live', 'KPI review + adjust'],
      ]
      tl.forEach((items, i) => {
        doc.fontSize(12).text(`Week ${i + 1}`)
        items.forEach(label => doc.fontSize(11).text(`• ${label}`))
        doc.moveDown(0.2)
      })

      // Channel Mix
      doc.moveDown()
      doc.fontSize(14).text('Channel Mix', { underline: true })
      doc.fontSize(11).text('• Reels/Shorts — top‑of‑funnel reach; weekly cadence')
      doc.fontSize(11).text('• Hero Film / YouTube — brand story + SEO; anchors the plan')
      doc.fontSize(11).text('• Site / Landing — proof + CTA orchestration; converts demand')

      // Risks & Mitigation
      doc.moveDown()
      doc.fontSize(14).text('Risks & Mitigation', { underline: true })
      doc.fontSize(11).text('• Inconsistent cadence → Mitigation: batch production and scheduled publish')
      doc.fontSize(11).text('• Weak proof → Mitigation: logos/testimonials/case study strip in hero')
      doc.fontSize(11).text('• Low CTA visibility → Mitigation: persistent header CTA + sticky consult bar')

      // 30 / 60 / 90 Outcomes
      doc.moveDown()
      doc.fontSize(14).text('30 / 60 / 90 Outcomes', { underline: true })
      doc.fontSize(12).text('Day 30')
      doc.fontSize(11).text('• Hero film live')
      doc.fontSize(11).text('• Proof + CTA live')
      doc.fontSize(11).text('• 8–12 verticals published')
      doc.moveDown(0.2)
      doc.fontSize(12).text('Day 60')
      doc.fontSize(11).text('• 20–30 verticals published')
      doc.fontSize(11).text('• First case study shell')
      doc.fontSize(11).text('• KPI review & retarget hooks')
      doc.moveDown(0.2)
      doc.fontSize(12).text('Day 90')
      doc.fontSize(11).text('• 40–50 verticals published')
      doc.fontSize(11).text('• Case study live')
      doc.fontSize(11).text('• Stable consult pipeline')

      // CTA Footer
      doc.moveDown()
      doc.fontSize(14).text('Talk With a Producer', { underline: true })
      doc.fontSize(11).text(`Email: ${CONTACT_EMAIL}   Phone: ${CONTACT_PHONE_TEL}`)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://martichproductions.com'
      const bookUrl = `${siteUrl}/engine/map?step=book`
      const drawDoc2 = doc as unknown as PDFDocument & { fillColor: (c: string) => PDFDocument }
      drawDoc2.fillColor('#9CA3AF')
      doc.text('Book a free mapping call: ', { continued: true })
      drawDoc2.fillColor('#D4AF37')
      doc.text(bookUrl, { link: bookUrl, underline: true })
      drawDoc2.fillColor('#FFFFFF')

      doc.end()
    })

    // server-side analytics mirror: plan pdf
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'engine_plan_pdf_server', properties: { hooks: (plan?.hooks || []).length }, timestamp: new Date().toISOString(), session_id: undefined, user_id: undefined })
      })
    } catch {}

    const bytes = new Uint8Array(pdfBuffer)
    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="mini-plan.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('plan pdf error', e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
