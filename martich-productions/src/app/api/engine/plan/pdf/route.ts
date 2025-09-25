import { NextRequest } from 'next/server'
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
  socials?: { instagram?: string; facebook?: string; youtube?: string }
  cadenceEstimate?: { postsPerWeek?: number; consistency?: 'low' | 'medium' | 'high' }
  insights?: { strengths: string[]; gaps: string[] }
}

export async function POST(req: NextRequest) {
  const { plan, audit }: { plan: MiniPlan; audit?: AuditSnapshot } = await req.json()

  const doc = new PDFDocument({ margin: 48 })
  const chunks: Buffer[] = []
  return await new Promise<Response>((resolve) => {
    doc.on('data', (c) => chunks.push(Buffer.from(c)))
    doc.on('end', () => {
      const pdf = Buffer.concat(chunks)
      resolve(new Response(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="mini-plan.pdf"',
        },
      }))
    })

    doc.fontSize(18).text('Martich Productions — 90‑Day Mini Plan', { align: 'left' })
    doc.moveDown(0.5)
    const persona = plan?.choices?.persona || '—'
    const tone = plan?.choices?.tone || 'Elegant'
    const cadence = (plan?.choices?.cadence as string | undefined) || 'steady'
    doc.fontSize(12).text(`Persona: ${persona}   Tone: ${tone}   Cadence: ${cadence}`)
    doc.moveDown()

    if (audit) {
      // Snapshot
      doc.fontSize(14).text('Snapshot', { underline: true })
      doc.moveDown(0.25)
      const ctas = (audit?.site?.ctas || []).slice(0, 3).join(', ') || '—'
      const proof = audit?.site?.hasProofSignals ? 'Present' : 'Missing'
      doc.fontSize(11).text(`CTAs: ${ctas}`)
      doc.text(`Proof: ${proof}`)
      const wins = (audit?.insights?.strengths || []).slice(0, 5)
      if (wins.length) {
        doc.moveDown(0.25)
        doc.fontSize(11).text('Wins:')
        wins.forEach((w) => doc.text(`• ${w}`))
      }
      doc.moveDown()

      // Weakpoints
      const gaps = (audit?.insights?.gaps || []).slice(0, 6)
      doc.fontSize(14).text('Weakpoints', { underline: true })
      if (gaps.length) {
        gaps.forEach((g) => doc.fontSize(11).text(`• ${g}`))
      } else {
        doc.fontSize(11).text('• None detected from public signals')
      }
      doc.moveDown()

      // Fix Plan (derived)
      doc.fontSize(14).text('Fix Plan (Next 30–90 days)', { underline: true })
      const siteTasks: string[] = []
      if (!audit?.site?.hasProofSignals) siteTasks.push('Add proof band (6 client logos + 1 testimonial) above the fold')
      if (!audit?.site?.title) siteTasks.push('Clarify hero headline to a single value line')
      if ((audit?.site?.ctas || []).length === 0) siteTasks.push('Add primary CTA (Book/Consult) in hero and header')
      if (siteTasks.length) {
        doc.fontSize(12).text('Site Conversion:')
        siteTasks.forEach((t) => doc.fontSize(11).text(`• ${t}`))
      }
      const cadenceTasks = cadence === 'surge'
        ? ['Publish 5 reels/week + 2 longform/week', 'Weekly recap and promote winners']
        : cadence === 'fast'
        ? ['Publish 3 reels/week + 1–2 longform/week', 'Pin hero film on site + socials']
        : ['Publish 2 reels/week + 1 longform/week', 'Add CTA end-cards to reels']
      doc.moveDown(0.25)
      doc.fontSize(12).text('Social Cadence:')
      cadenceTasks.forEach((t) => doc.fontSize(11).text(`• ${t}`))
      doc.moveDown(0.25)
      doc.fontSize(12).text('Content:')
      doc.fontSize(11).text('• Produce hero film + micro-verticals aligned to hooks')
      doc.fontSize(11).text('• Map weekly anchors (reveal/authority/lifestyle) to calendar')
      doc.moveDown()

      // Calendar Summary (4 weeks)
      doc.fontSize(14).text('Calendar Summary (First 4 Weeks)', { underline: true })
      const weekItems = cadence === 'surge'
        ? ['Reel', 'Reel', 'Carousel', 'Hero beat']
        : cadence === 'fast'
        ? ['Reel', 'Carousel', 'Hero beat']
        : ['Reel', 'Hero beat']
      for (let w = 1; w <= 4; w++) {
        doc.fontSize(12).text(`Week ${w}:`)
        weekItems.forEach((label) => doc.fontSize(11).text(`• ${label}`))
        doc.moveDown(0.25)
      }
      doc.moveDown()
    }

    doc.fontSize(14).text('Hooks', { underline: true })
    ;(plan?.hooks || []).slice(0, 10).forEach((h: string) => doc.fontSize(11).text(`• ${h}`))
    doc.moveDown()

    doc.fontSize(14).text('Captions', { underline: true })
    ;(plan?.captions || []).slice(0, 10).forEach((c: string) => doc.fontSize(11).text(`• ${c}`))
    doc.moveDown()

    doc.fontSize(14).text('Titles', { underline: true })
    ;(plan?.titles || []).slice(0, 10).forEach((t: string) => doc.fontSize(11).text(`• ${t}`))
    doc.moveDown()

    doc.fontSize(14).text('Storyboard Beats', { underline: true })
    ;(plan?.beats || []).slice(0, 10).forEach((b: string) => doc.fontSize(11).text(`• ${b}`))

    doc.end()
  })
}


