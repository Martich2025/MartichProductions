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
  site?: { title?: string; description?: string; headings?: string[]; ctas?: string[]; hasProofSignals?: boolean }
  insights?: { strengths: string[]; gaps: string[] }
}

export async function POST(req: NextRequest) {
  try {
    const { to, plan, audit }: { to: string; plan: MiniPlan; audit?: AuditSnapshot } = await req.json()
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

    const lines = [
      `<p>Here is your 90‑Day Mini Plan summary.</p>`,
      `<p><strong>Persona:</strong> ${persona} &nbsp;&nbsp; <strong>Tone:</strong> ${tone} &nbsp;&nbsp; <strong>Cadence:</strong> ${cadence}</p>`,
    ]
    if (audit) {
      lines.push(`<p><strong>Weakpoints:</strong></p><ul>${(audit.insights?.gaps || []).slice(0,5).map(g => `<li>${g}</li>`).join('')}</ul>`)
      lines.push(`<p><strong>Snapshot:</strong> CTAs: ${(audit.site?.ctas || []).slice(0,3).join(', ') || '—'}; Proof: ${audit.site?.hasProofSignals ? 'Present' : 'Missing'}</p>`)
    }
    lines.push(`<p><strong>Hooks:</strong></p><ul>${(plan.hooks || []).slice(0,5).map(h => `<li>${h}</li>`).join('')}</ul>`)
    lines.push(`<p>View your plan: <a href="${baseUrl}/engine/plan">${baseUrl}/engine/plan</a></p>`)

    // Create PDF attachment
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 48 })
      const chunks: Buffer[] = []
      doc.on('data', (c) => chunks.push(Buffer.from(c)))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      doc.fontSize(18).text('Martich Productions — 90‑Day Mini Plan', { align: 'left' })
      doc.moveDown(0.5)
      doc.fontSize(12).text(`Persona: ${persona}   Tone: ${tone}   Cadence: ${cadence}`)
      doc.moveDown()
      if (audit) {
        doc.fontSize(14).text('Weakpoints', { underline: true })
        const gaps = (audit.insights?.gaps || []).slice(0, 6)
        if (gaps.length) gaps.forEach((g) => doc.fontSize(11).text(`• ${g}`))
        else doc.fontSize(11).text('• None detected from public signals')
        doc.moveDown()
      }
      doc.fontSize(14).text('Hooks', { underline: true })
      ;(plan.hooks || []).slice(0, 10).forEach((h) => doc.fontSize(11).text(`• ${h}`))
      doc.end()
    })

    await resend.emails.send({
      from,
      to,
      subject: 'Your 90‑Day Mini Plan',
      html: `<div>${lines.join('')}</div>`,
      attachments: [
        {
          filename: 'mini-plan.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}


