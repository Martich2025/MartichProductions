import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import PDFDocument from 'pdfkit'

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
    seo?: { noindex?: boolean }
    ecosystem?: { linksTotal?: number; linksExternal?: number; images?: number; videos?: number }
    a11y?: { h1Count?: number; imagesMissingAlt?: number }
  }
  insights?: { strengths: string[]; gaps: string[] }
  score?: number
  targetScore?: number
  confidence?: number
  schemaChecklist?: { hasOrganization?: boolean; hasLocalBusiness?: boolean; hasBreadcrumbList?: boolean; hasVideoObject?: boolean; hasArticle?: boolean }
}

export async function POST(req: NextRequest) {
  try {
    const { to, plan, audit, shareUrl }: { to: string; plan: MiniPlan; audit?: AuditSnapshot; shareUrl?: string } = await req.json()
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://martichproductions.com'

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'email_disabled' }, { status: 200 })
    }

    const resend = new Resend(apiKey)
    const persona = plan?.choices?.persona || '—'
    const tone = plan?.choices?.tone || 'Elegant'
    const cadence = plan?.choices?.cadence || 'steady'
    const score = audit?.score
    const target = typeof audit?.targetScore === 'number' ? audit?.targetScore : 92
    const delta = typeof score === 'number' ? Math.max(0, target - Math.max(0, Math.min(100, score))) : undefined

    const lines = [
      `<p>Here is your 90‑Day Mini Plan summary.</p>`,
      `<p><strong>Persona:</strong> ${persona} &nbsp;&nbsp; <strong>Tone:</strong> ${tone} &nbsp;&nbsp; <strong>Cadence:</strong> ${cadence}</p>`,
    ]
    if (typeof score === 'number') {
      lines.push(`<p><strong>Score:</strong> ${Math.max(0, Math.min(100, score))}/100${typeof delta === 'number' ? ` &nbsp;&nbsp; <strong>Opportunity Δ:</strong> +${delta}` : ''}</p>`)
    }
    if (audit) {
      const gapsList = (audit.insights?.gaps || []).slice(0,5).map(g => `<li>${g}</li>`).join('')
      lines.push(`<p><strong>Weakpoints:</strong></p><ul>${gapsList || '<li>None detected</li>'}</ul>`)
      lines.push(`<p><strong>Snapshot:</strong> CTAs: ${(audit.site?.ctas || []).slice(0,3).join(', ') || '—'}; Proof: ${audit.site?.hasProofSignals ? 'Present' : 'Missing'}; Canonical: ${audit.site?.canonical ? 'Present' : 'Missing'}; Indexable: ${audit.site?.seo?.noindex ? 'No' : 'Yes'}</p>`)
      const schema = audit.schemaChecklist || {}
      lines.push(`<p><strong>Schema:</strong> Org: ${schema.hasOrganization ? '✓' : '—'}; LocalBusiness: ${schema.hasLocalBusiness ? '✓' : '—'}; BreadcrumbList: ${schema.hasBreadcrumbList ? '✓' : '—'}; VideoObject: ${schema.hasVideoObject ? '✓' : '—'}; Article: ${schema.hasArticle ? '✓' : '—'}</p>`)
      const a11y = audit.site?.a11y || {}
      lines.push(`<p><strong>Accessibility:</strong> H1: ${typeof a11y.h1Count === 'number' ? a11y.h1Count : '—'}; Images missing alt: ${typeof a11y.imagesMissingAlt === 'number' ? a11y.imagesMissingAlt : '—'}</p>`)
      if (typeof audit.confidence === 'number') {
        lines.push(`<p><strong>Confidence:</strong> ${Math.round((audit.confidence || 0) * 100)}%</p>`)
      }
    }
    lines.push(`<p><strong>Hooks:</strong></p><ul>${(plan.hooks || []).slice(0,5).map(h => `<li>${h}</li>`).join('')}</ul>`)
    const planLink = shareUrl && typeof shareUrl === 'string' ? shareUrl : `${baseUrl}/engine/plan`
    lines.push(`<p>View your plan: <a href="${planLink}">${planLink}</a></p>`)
    lines.push(`<p>Book a mapping call: <a href="${baseUrl}/engine/map?step=book">${baseUrl}/engine/map?step=book</a></p>`)

    // Create PDF attachment (lightweight summary)
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 48 })
      const chunks: Buffer[] = []
      doc.on('data', (c) => chunks.push(Buffer.from(c)))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      doc.fontSize(18).text('Martich Productions — 90‑Day Mini Plan', { align: 'left' })
      doc.moveDown(0.5)
      doc.fontSize(12).text(`Persona: ${persona}   Tone: ${tone}   Cadence: ${cadence}`)
      if (typeof score === 'number') doc.fontSize(12).text(`Score: ${Math.max(0, Math.min(100, score))}/100${typeof delta === 'number' ? `  (Δ +${delta})` : ''}`)
      doc.moveDown()
      if (audit) {
        doc.fontSize(14).text('Snapshot', { underline: true })
        doc.fontSize(11).text(`CTAs: ${(audit.site?.ctas || []).slice(0,3).join(', ') || '—'}`)
        doc.fontSize(11).text(`Proof: ${audit.site?.hasProofSignals ? 'Present' : 'Missing'}`)
        doc.fontSize(11).text(`Canonical: ${audit.site?.canonical ? 'Present' : 'Missing'}`)
        doc.fontSize(11).text(`Indexable: ${audit.site?.seo?.noindex ? 'No' : 'Yes'}`)
        const schema = audit.schemaChecklist || {}
        doc.fontSize(11).text(`Schema: Org ${schema.hasOrganization ? '✓' : '—'}, LB ${schema.hasLocalBusiness ? '✓' : '—'}, BL ${schema.hasBreadcrumbList ? '✓' : '—'}, VO ${schema.hasVideoObject ? '✓' : '—'}, Article ${schema.hasArticle ? '✓' : '—'}`)
        const a11y = audit.site?.a11y || {}
        doc.fontSize(11).text(`A11y: H1 ${typeof a11y.h1Count === 'number' ? a11y.h1Count : '—'}, Missing alt ${typeof a11y.imagesMissingAlt === 'number' ? a11y.imagesMissingAlt : '—'}`)
        doc.moveDown(0.5)
        doc.fontSize(14).text('Weakpoints', { underline: true })
        const gaps = (audit.insights?.gaps || []).slice(0, 6)
        if (gaps.length) gaps.forEach((g) => doc.fontSize(11).text(`• ${g}`))
        else doc.fontSize(11).text('• None detected from public signals')
        doc.moveDown(0.5)
      }
      doc.fontSize(14).text('Hooks', { underline: true })
      ;(plan.hooks || []).slice(0, 10).forEach((h) => doc.fontSize(11).text(`• ${h}`))
      doc.moveDown(0.5)
      doc.fontSize(12).text('Next 7 Days')
      doc.fontSize(11).text('• Implement proof band and primary hero CTA')
      doc.fontSize(11).text('• Lock cadence and shotlist for hero + verticals')
      doc.fontSize(11).text('• Ship conversion pages; enable analytics events')
      doc.end()
    })

    await resend.emails.send({
      from,
      to,
      subject: `Your 90‑Day Mini Plan${typeof score === 'number' ? ` — Score ${Math.max(0, Math.min(100, score))}/100` : ''}`,
      html: `<div>${lines.join('')}</div>`,
      attachments: [
        {
          filename: 'mini-plan.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    // server-side analytics mirror: plan email
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL || '/api/analytics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'engine_plan_email_server', properties: { hasAudit: !!audit, hooks: (plan.hooks||[]).length }, timestamp: new Date().toISOString(), session_id: undefined, user_id: undefined })
      })
    } catch {}

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}


