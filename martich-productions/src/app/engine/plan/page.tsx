'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { trackPageView, analytics } from '@/lib/analytics'

export default function MiniPlanPage() {
  type Tone = 'Elegant' | 'Bold' | 'Minimal' | 'Friendly'
  type MiniPlan = {
    choices?: { [key: string]: string | null | undefined; persona?: string | null; tone?: Tone }
    form?: { name?: string; email?: string; phone?: string; company?: string; consent?: boolean }
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

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL
  const [plan, setPlan] = useState<MiniPlan | null>(null)
  const [audit, setAudit] = useState<AuditSnapshot | null>(null)

  useEffect(() => {
    trackPageView('/engine/plan')
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const pid = params.get('pid')
      if (pid) {
        ;(async () => {
          try {
            const r = await fetch('/api/engine/plan/get?pid=' + encodeURIComponent(pid))
            const j = await r.json()
            if (j?.ok) {
              setPlan(j.plan)
              setAudit(j.audit)
              return
            }
          } catch {}
          // fallback to session
          const choices = JSON.parse(sessionStorage.getItem('engine_map_choices') || '{}')
          const form = JSON.parse(sessionStorage.getItem('engine_map_form') || '{}')
          const planData = JSON.parse(sessionStorage.getItem('engine_mini_plan') || '{}')
          const auditData = JSON.parse(sessionStorage.getItem('engine_mini_plan_audit') || '{}')
          setPlan({ choices, form, ...planData })
          setAudit(auditData)
        })()
      } else {
        const choices = JSON.parse(sessionStorage.getItem('engine_map_choices') || '{}')
        const form = JSON.parse(sessionStorage.getItem('engine_map_form') || '{}')
        const planData = JSON.parse(sessionStorage.getItem('engine_mini_plan') || '{}')
        const auditData = JSON.parse(sessionStorage.getItem('engine_mini_plan_audit') || '{}')
        setPlan({ choices, form, ...planData })
        setAudit(auditData)
      }
      analytics.customEvent('engine_plan_view', { hasHooks: (planData?.hooks || []).length || 0 })
    } catch {}
  }, [])

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const url = new URL(window.location.href)
    return url.toString()
  }, [])

  async function downloadPdf() {
    try {
      analytics.customEvent('engine_plan_pdf')
      const res = await fetch('/api/engine/plan/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, audit }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mini-plan.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {}
  }

  async function emailPlan() {
    try {
      analytics.customEvent('engine_plan_email_server')
      const to = plan?.form?.email || ''
      if (!to) return
      await fetch('/api/engine/plan/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, plan, audit }),
      })
    } catch {}
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white">
        <section className="py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Your 90‑Day Mini Plan</h1>
            {plan ? (
              <div className="space-y-6">
                {audit && (
                  <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Snapshot</div>
                    <div className="text-sm text-mp-gray-300 mb-1">CTAs: {(audit?.site?.ctas || []).slice(0,3).join(', ') || '—'}</div>
                    <div className="text-sm text-mp-gray-300 mb-1">Proof: {audit?.site?.hasProofSignals ? 'Present' : 'Missing'}</div>
                    <div className="text-sm text-mp-gray-300">Wins/Gaps: {(audit?.insights?.strengths || []).length}/{(audit?.insights?.gaps || []).length}</div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-1">Persona</div>
                    <div className="text-mp-gray-300">{plan?.choices?.persona || '—'}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-1">Tone</div>
                    <div className="text-mp-gray-300">{plan?.choices?.tone || 'Elegant'}</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Hooks</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {(plan?.hooks || []).map((h: string, i: number) => <li key={i}>• {h}</li>)}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Captions</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {(plan?.captions || []).map((c: string, i: number) => <li key={i}>• {c}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Titles</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {(plan?.titles || []).map((t: string, i: number) => <li key={i}>• {t}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Storyboard Beats</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {(plan?.beats || []).map((b: string, i: number) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
                {/* 12-week calendar grid */}
                <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">12‑Week Cadence Preview</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, w) => (
                      <div key={w} className="p-3 rounded-lg border border-mp-gray-800 bg-mp-black/40">
                        <div className="text-xs text-mp-gray-400 mb-1">Week {w + 1}</div>
                        <ul className="text-sm text-mp-gray-300 space-y-1">
                          <li>• Reel ({plan?.choices?.cadence || 'steady'})</li>
                          <li>• Carousel/Short</li>
                          <li>• Hero beat</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => { navigator.clipboard.writeText(shareUrl); analytics.customEvent('engine_plan_copy_link') }} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Copy Link</Button>
                  <Button variant="outline" onClick={downloadPdf}>Download PDF</Button>
                  <Button variant="outline" onClick={emailPlan}>Email Me This</Button>
                  <Button href="/engine/map?step=book" variant="outline">Book Mapping Call</Button>
                  {calendlyUrl && (
                    <Button href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Schedule on Calendly</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-mp-gray-300">No plan found. <a className="text-mp-gold underline" href="/engine/map">Start the engine map</a>.</div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


