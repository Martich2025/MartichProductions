'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { trackPageView, analytics } from '@/lib/analytics'
import { useToast } from '@/components/global/toast'
import { CONTACT_PHONE_TEL, CONTACT_EMAIL } from '@/lib/site'

export default function MiniPlanPage() {
  type Tone = 'Elegant' | 'Bold' | 'Minimal' | 'Friendly'
  type MiniPlan = {
    choices?: { [key: string]: string | null | undefined; persona?: string | null; tone?: Tone; service?: string | null }
    form?: { name?: string; email?: string; phone?: string; company?: string; consent?: boolean }
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
    benchmarks?: { cadencePerWeek?: { your?: number | null; top: number }; proof?: { your: boolean; note: string }; cta?: { yourCount: number; note: string } }
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

  const [plan, setPlan] = useState<MiniPlan | null>(null)
  const [audit, setAudit] = useState<AuditSnapshot | null>(null)
  const [pulseCta, setPulseCta] = useState(false)
  const kpiLoggedRef = React.useRef(false)

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
              // Merge session choices (role/timeline, etc.) into fetched plan choices for better context
              const sessionChoices = JSON.parse(sessionStorage.getItem('engine_map_choices') || '{}') as MiniPlan['choices']
              const mergedChoices = { ...(sessionChoices || {}), ...(j.plan?.choices || {}) }
              setPlan({ ...j.plan, choices: mergedChoices })
              setAudit(j.audit)
              return
            }
          } catch {}
          // fallback to session
          const choices = JSON.parse(sessionStorage.getItem('engine_map_choices') || '{}')
          const form = JSON.parse(sessionStorage.getItem('engine_map_form') || '{}')
          const planData = JSON.parse(sessionStorage.getItem('engine_mini_plan') || '{}')
          const auditData = JSON.parse(sessionStorage.getItem('engine_mini_plan_audit') || '{}')
          const mergedChoices = { ...(choices || {}), ...((planData?.choices) || {}) }
          setPlan({ ...planData, choices: mergedChoices, form })
          setAudit(auditData)
        })()
      } else {
        const choices = JSON.parse(sessionStorage.getItem('engine_map_choices') || '{}')
        const form = JSON.parse(sessionStorage.getItem('engine_map_form') || '{}')
        const planData = JSON.parse(sessionStorage.getItem('engine_mini_plan') || '{}')
        const auditData = JSON.parse(sessionStorage.getItem('engine_mini_plan_audit') || '{}')
        const mergedChoices = { ...(choices || {}), ...((planData?.choices) || {}) }
        setPlan({ ...planData, choices: mergedChoices, form })
        setAudit(auditData)
      }
      const current = JSON.parse(sessionStorage.getItem('engine_mini_plan') || '{}') as MiniPlan
      analytics.customEvent('engine_plan_view', { hasHooks: (current?.hooks || []).length || 0 })
    } catch {}
  }, [])

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const url = new URL(window.location.href)
    try { sessionStorage.setItem('engine_saved_plan_share', url.toString()) } catch {}
    return url.toString()
  }, [])

  function applyChoice(key: string, value: string) {
    setPlan((prev) => {
      if (!prev) return prev
      const next: MiniPlan = { ...prev, choices: { ...(prev.choices || {}), [key]: value } }
      try { sessionStorage.setItem('engine_mini_plan', JSON.stringify(next)) } catch {}
      analytics.customEvent('plan_choice_apply', { key, value })
      return next
    })
  }

  const [stickyEmail, setStickyEmail] = useState('')
  const [sendingSticky, setSendingSticky] = useState(false)
  const [stickyEmailMsg, setStickyEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const emailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(stickyEmail), [stickyEmail])
  const [lastStickySentAt, setLastStickySentAt] = useState<number>(0)
  const { show } = useToast()
  const COOLDOWN_MS = 15_000
  const stickyOnCooldown = Date.now() - lastStickySentAt < COOLDOWN_MS
  const remainingMs = Math.max(0, COOLDOWN_MS - (Date.now() - lastStickySentAt))
  const [stickyDismissed, setStickyDismissed] = useState(false)
  const stickyViewedRef = React.useRef(false)

  // Show toast exactly once when sticky email succeeds
  useEffect(() => {
    if (stickyEmailMsg?.type === 'success') {
      show('Plan sent to your inbox', 'success')
    }
  }, [stickyEmailMsg, show])

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
      const res = await fetch('/api/engine/plan/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, plan, audit, shareUrl }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j?.ok !== false) {
        show('Plan sent to your inbox', 'success')
      } else {
        show('Could not send email right now. Please try again.', 'error')
      }
    } catch {}
  }

  // Subtle pulse on sticky CTA after 10s idle
  useEffect(() => {
    const t = setTimeout(() => setPulseCta(true), 10000)
    const stop = setTimeout(() => setPulseCta(false), 17000)
    return () => { clearTimeout(t); clearTimeout(stop) }
  }, [])

  // Log KPI view once when both plan and audit are loaded
  useEffect(() => {
    if (plan && audit && !kpiLoggedRef.current) {
      analytics.customEvent('plan_kpi_view', {
        hooks: (plan.hooks || []).length,
        ctas: (audit.site?.ctas || []).length,
        proof: Boolean(audit.site?.hasProofSignals),
      })
      kpiLoggedRef.current = true
    }
  }, [plan, audit])

  // Sticky CTA dismiss restore
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const v = sessionStorage.getItem('plan_sticky_dismissed') === '1'
      setStickyDismissed(v)
    } catch {}
  }, [])

  // Sticky CTA impression
  useEffect(() => {
    if (stickyDismissed) return
    if (!stickyViewedRef.current) {
      analytics.customEvent('plan_sticky_view')
      stickyViewedRef.current = true
    }
  }, [stickyDismissed])

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white">
        <section className="py-12 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-2">Your 90‑Day Mini Plan</h1>
            <div className="text-mp-gray-400 mb-4">A fast, visual outline of the first 90 days—hooks, cadence, and site fixes—so you know exactly what we’ll build and why it converts.</div>
            {plan ? (
              <div className="space-y-6">
                {audit && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Snapshot</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Score Ring */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14">
                          <svg viewBox="0 0 36 36" className="w-14 h-14">
                            <path className="text-mp-gray-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
                            <path className="text-mp-gold" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" style={{ strokeDasharray: `${(audit.score || 0) * 0.01 * 100}, 100` }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{Math.max(0, Math.min(100, audit.score || 0))}</div>
                        </div>
                        <div>
                          <div className="text-sm">Audit Score</div>
                          <div className="text-xs text-mp-gray-400">Higher = stronger funnel</div>
                        </div>
                      </div>
                      {/* KPI */}
                      <div>
                        <div className="text-sm text-mp-gray-300 mb-1">CTAs: {(audit?.site?.ctas || []).slice(0,3).join(', ') || '—'}</div>
                        <div className="text-sm text-mp-gray-300 mb-1">Proof: {audit?.site?.hasProofSignals ? 'Present' : 'Missing'}</div>
                        <div className="text-sm text-mp-gray-300">Canonical: {audit?.site?.canonical ? 'Present' : 'Missing'}</div>
                        {typeof audit.targetScore === 'number' && (
                          <div className="text-sm text-mp-gray-300">Opportunity: +{Math.max(0, (audit.targetScore || 0) - (audit.score || 0))} → target {audit.targetScore}</div>
                        )}
                        {typeof audit.confidence === 'number' && (
                          <div className="text-sm text-mp-gray-300">Confidence: {Math.round((audit.confidence || 0) * 100)}%</div>
                        )}
                      </div>
                      {/* Social Reach */}
                      <div>
                        <div className="text-sm text-mp-gray-300 mb-1">IG: {audit.socialsMeta?.instagram?.followersApprox ?? '—'}</div>
                        <div className="text-sm text-mp-gray-300 mb-1">FB: {audit.socialsMeta?.facebook?.followersApprox ?? '—'}</div>
                        <div className="text-sm text-mp-gray-300">YT: {audit.socialsMeta?.youtube?.subscribersApprox ?? '—'}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Issue Heat Strip */}
                {audit && Array.isArray(audit.issues) && audit.issues.length > 0 && (
                  <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Issue Heat</div>
                    <div className="flex gap-1" aria-label="Issue heat strip">
                      {audit.issues.slice(0, 24).map((iss, i) => (
                        <div key={i} className={`h-2 flex-1 rounded ${iss.severity === 'high' ? 'bg-red-500' : iss.severity === 'medium' ? 'bg-yellow-400' : 'bg-mp-gold'}`} title={`${iss.title} — ${iss.severity}`} />
                      ))}
                    </div>
                    <div className="text-[11px] text-mp-gray-500 mt-1">High = red, medium = yellow, low = gold</div>
                  </div>
                )}
                {audit && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Ecosystem Overview</div>
                    <div className="text-sm text-mp-gray-300">Links: {audit.site?.ecosystem?.linksTotal ?? '—'} ({audit.site?.ecosystem?.linksExternal ?? 0} external)</div>
                    <div className="text-sm text-mp-gray-300">Images: {audit.site?.ecosystem?.images ?? '—'}</div>
                    <div className="text-sm text-mp-gray-300">Videos: {audit.site?.ecosystem?.videos ?? '—'}</div>
                  </div>
                )}
                {audit && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Accessibility Snapshot</div>
                    <div className="text-sm text-mp-gray-300">H1 Count: {audit.site?.a11y?.h1Count ?? '—'}</div>
                    <div className="text-sm text-mp-gray-300">Images missing alt: {audit.site?.a11y?.imagesMissingAlt ?? '—'}</div>
                  </div>
                )}
                {/* Schema Checklist & Issues */}
                {audit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                      <div className="font-semibold mb-2">Schema Checklist</div>
                      <ul className="text-sm text-mp-gray-300 space-y-1">
                        <li>{audit.schemaChecklist?.hasOrganization ? '✓' : '—'} Organization</li>
                        <li>{audit.schemaChecklist?.hasLocalBusiness ? '✓' : '—'} LocalBusiness</li>
                        <li>{audit.schemaChecklist?.hasBreadcrumbList ? '✓' : '—'} BreadcrumbList</li>
                        <li>{audit.schemaChecklist?.hasVideoObject ? '✓' : '—'} VideoObject</li>
                        <li>{audit.schemaChecklist?.hasArticle ? '✓' : '—'} Article</li>
                      </ul>
                    </div>
                    {Array.isArray(audit.issues) && audit.issues.length > 0 && (
                      <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-2">Issues</div>
                        <ul className="text-sm text-mp-gray-300 space-y-1">
                          {audit.issues.slice(0, 8).map((iss) => (
                            <li key={iss.id} className="flex items-start gap-2">
                              <span className={`mt-1 inline-block h-2 w-2 rounded-full ${iss.severity === 'high' ? 'bg-red-500' : iss.severity === 'medium' ? 'bg-yellow-400' : 'bg-mp-gold'}`} aria-label={`${iss.severity} severity`} />
                              <span><span className="font-medium">{iss.title}</span> — {iss.fix}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {audit && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Executive Summary</div>
                      <button
                        className="text-xs px-2 py-1 rounded border border-mp-gray-700 text-mp-gray-300 hover:border-mp-gold"
                        onClick={() => {
                          const score = Math.max(0, Math.min(100, audit.score || 0))
                          const gaps = (audit.insights?.gaps || []).slice(0, 3).join(', ')
                          const summary = `Score: ${score}/100. Top gaps: ${gaps || 'None'}. Next 7 days: proof band + primary CTA; lock cadence & shotlist; ship conversion pages & analytics.`
                          navigator.clipboard.writeText(summary)
                          analytics.customEvent('plan_copy_summary')
                          show('Summary copied to clipboard', 'success')
                        }}
                      >Copy Summary</button>
                    </div>
                    <div className="text-sm text-mp-gray-300 mb-2">Score: {Math.max(0, Math.min(100, audit.score || 0))}/100</div>
                    <div className="text-sm text-mp-gray-300 mb-1">Top gaps:</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {(audit.insights?.gaps || []).slice(0, 3).map((g, i) => <li key={i}>• {g}</li>)}
                    </ul>
                    <div className="text-sm text-mp-gray-300 mt-2">Next 7 days:</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      <li>• Implement proof band and primary hero CTA</li>
                      <li>• Lock cadence and shotlist for hero + verticals</li>
                      <li>• Ship conversion pages; enable analytics events</li>
                    </ul>
                  </div>
                )}
                {/* Research Summary & Persona Narrative */}
                {audit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                      <div className="font-semibold mb-2">Research Summary</div>
                      <div className="text-sm text-mp-gray-300">Site: {audit.domain || '—'}</div>
                      <div className="text-sm text-mp-gray-300">Instagram: {audit.socials?.instagram ? 'yes' : 'no'}</div>
                      <div className="text-sm text-mp-gray-300">Facebook: {audit.socials?.facebook ? 'yes' : 'no'}</div>
                      <div className="text-sm text-mp-gray-300">YouTube: {audit.socials?.youtube ? 'yes' : 'no'}</div>
                      {typeof audit.confidence === 'number' && (
                        <div className="text-sm text-mp-gray-300">Confidence: {Math.round((audit.confidence || 0) * 100)}%</div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                      <div className="font-semibold mb-2">Persona Narrative</div>
                      <div className="text-sm text-mp-gray-300">
                        {(() => {
                          const p = (plan?.choices?.persona || '').toString()
                          if (p === 'resort') return 'Resort: anchor the brand story with a hero film, showcase amenities in reels, and drive direct bookings via prominent CTAs.'
                          if (p === 'realtor') return 'Realtor: property story + micro verticals, persistent “Book a Tour/Consult” CTAs, and retarget hooks that convert views to showings.'
                          if (p === 'hospitality') return 'Hospitality: experience/menu reels, reservation CTAs in sticky header, and proof signals that build trust fast.'
                          if (p === 'events') return 'Events: highlight film + testimonial strip, above-the-fold inquiry CTA, and weekly reel cadence.'
                          return 'We’ll tune narrative to your buyer: proof + CTA + cadence.'
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                {/* Why this works (client-friendly) */}
                {audit && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Why this works</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      <li>• Gets attention fast</li>
                      <li>• Shows proof right away</li>
                      <li>• One clear next step</li>
                      <li>• We post every week and improve with what the data shows</li>
                    </ul>
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
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Hooks</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {(plan?.hooks || []).map((h: string, i: number) => <li key={i}>• {h}</li>)}
                  </ul>
                </div>
                {/* Hero Headline Variants */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Hero Headline Variants</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {(() => {
                      const p = (plan?.choices?.persona || '').toString()
                      const tone = (plan?.choices?.tone || 'Elegant').toString()
                      const v = [
                        p === 'resort' ? 'Your weekend should feel like this.' : p === 'realtor' ? 'See it. Feel it. Book the tour.' : p === 'hospitality' ? 'Tonight deserves the good stuff.' : p === 'events' ? 'Your day, cinematic.' : 'Make the first frame count.',
                        tone === 'Bold' ? 'Stop the scroll. Start the story.' : tone === 'Minimal' ? 'Less noise. More signal.' : tone === 'Friendly' ? 'Hey—this is worth your time.' : 'Elegance that moves.',
                        'Proof above the fold. Offer in the light.'
                      ]
                      return v.map((t, i) => <li key={i}>• {t}</li>)
                    })()}
                  </ul>
                </div>
                {/* Hero Banner Preview */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Hero Banner Preview</div>
                  <div className="rounded-xl overflow-hidden border border-mp-gray-800">
                    <div className="relative h-32 sm:h-40 bg-gradient-to-br from-mp-gray-900 to-mp-black flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="text-xl sm:text-2xl font-semibold mb-2">{(() => {
                          const p = (plan?.choices?.persona || '').toString()
                          if (p === 'resort') return 'Your weekend should feel like this.'
                          if (p === 'realtor') return 'See it. Feel it. Book the tour.'
                          if (p === 'hospitality') return 'Tonight deserves the good stuff.'
                          if (p === 'events') return 'Your day, cinematic.'
                          return 'Make the first frame count.'
                        })()}</div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {(() => {
                            const p = (plan?.choices?.persona || '').toString()
                            const ctas = p === 'resort' ? ['Book Your Stay','Explore Amenities'] : p === 'realtor' ? ['Book a Tour','See Availability'] : p === 'hospitality' ? ['Reserve a Table','View Menu'] : p === 'events' ? ['Inquire Now','See Packages'] : ['Book a Consult','See Work']
                            return ctas.map((t, i) => (
                              <button key={i} className="px-3 py-1.5 rounded-full border border-mp-gray-700 bg-mp-black/60 text-sm hover:border-mp-gold" onClick={() => applyChoice('primaryCta', t)} title="Apply this CTA">{t}</button>
                            ))
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Next Steps strip */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">What happens next</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    <li>• Mapping call: we confirm hooks, choose formats, and lock cadence</li>
                    <li>• Build: we shoot/edit the hero film + verticals; conversion pages go live</li>
                    <li>• Run: publishing begins; we review KPIs weekly and iterate</li>
                  </ul>
                </div>
                {/* Quick Wins (persona-aware) */}
                <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Quick Wins</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {!audit?.site?.hasProofSignals && <li>• Add proof band (logos/testimonial or case study) above the fold</li>}
                    {(audit?.site?.ctas || []).length === 0 && <li>• Add a primary hero CTA (Book/Consult) and make it persistent</li>}
                    {!audit?.site?.canonical && <li>• Add a canonical URL in &lt;head&gt;</li>}
                    {audit?.site?.seo?.noindex && <li>• Remove noindex from production pages</li>}
                    {!(audit?.site?.contact?.hasEmail || audit?.site?.contact?.hasPhone) && <li>• Add a visible contact method (email/phone) in header/footer</li>}
                    {plan?.choices?.persona === 'realtor' && <li>• Realtor: Property story film + micro verticals; gate with tracked CTAs</li>}
                    {plan?.choices?.persona === 'resort' && <li>• Resort: Hero brand story + amenity reels; booking CTA and proof logos</li>}
                    {plan?.choices?.persona === 'hospitality' && <li>• Hospitality: Menu/experience reels; sticky reservation CTA</li>}
                    {plan?.choices?.persona === 'events' && <li>• Events: Highlight film + testimonial strip; above-the-fold inquiry CTA</li>}
                  </ul>
                  <div className="mt-3 text-[11px] text-mp-gray-500">Why this works: Hooks win the scroll; proof reduces friction; clear CTA frames the next action. Weekly review closes the loop.</div>
                </div>
                {audit?.insights?.gaps && audit.insights.gaps.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Pains We Fix</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {audit.insights.gaps.map((g, i) => (
                        <li key={i}>• {g} → {g.toLowerCase().includes('cta') ? 'Add a primary hero CTA and sticky consult bar' : g.toLowerCase().includes('proof') ? 'Add proof band with logos/testimonial/case study' : g.toLowerCase().includes('title') ? 'Write a clear, benefit‑led title' : g.toLowerCase().includes('description') ? 'Add a concise meta description' : 'We’ll address in the first implementation sprint'}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Gap Cards (copyable) */}
                {audit?.insights?.gaps && audit.insights.gaps.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Gap Cards</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {audit.insights.gaps.slice(0, 6).map((g, i) => (
                        <div key={i} className="p-3 rounded-lg border border-mp-gray-800 bg-mp-black/40 flex items-start justify-between gap-3">
                          <div className="text-sm text-mp-gray-300">{g}</div>
                          <button
                            className="text-xs px-2 py-1 rounded border border-mp-gray-700 text-mp-gray-300 hover:border-mp-gold"
                            onClick={() => { navigator.clipboard.writeText(g); analytics.customEvent('gap_card_copy', { i }) }}
                          >Copy</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Captions</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {(plan?.captions || []).map((c: string, i: number) => <li key={i}>• {c}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                    <div className="font-semibold mb-2">Titles</div>
                    <ul className="text-mp-gray-300 text-sm space-y-1">
                      {(plan?.titles || []).map((t: string, i: number) => <li key={i}>• {t}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Storyboard Beats</div>
                  <ul className="text-mp-gray-300 text-sm space-y-1">
                    {(plan?.beats || []).map((b: string, i: number) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
                {/* 12-week calendar grid */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
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
                {/* Conversion Timeline */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Conversion Timeline (First 4 Weeks)</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {[
                      { w: 1, items: ['Audit fixes', 'Shotlist + Hero film', 'First 3 reels'] },
                      { w: 2, items: ['Launch hero film', 'Reels batch 2', 'Site CTA orchestration'] },
                      { w: 3, items: ['Reels batch 3', 'Case study shell', 'Retarget hooks'] },
                      { w: 4, items: ['Reels batch 4', 'Proof band live', 'KPI review + adjust'] },
                    ].map((x) => (
                      <div key={x.w} className="p-3 rounded-lg border border-mp-gray-800 bg-mp-black/40">
                        <div className="text-xs text-mp-gray-400 mb-1">Week {x.w}</div>
                        <ul className="text-sm text-mp-gray-300 space-y-1">
                          {x.items.map((it, i) => <li key={i}>• {it}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Channel Mix */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Channel Mix</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <div className="text-sm text-mp-gray-300">Reels/Shorts</div>
                      <div className="text-xs text-mp-gray-500">Top‑of‑funnel reach; weekly cadence</div>
                    </div>
                    <div>
                      <div className="text-sm text-mp-gray-300">Hero Film / YouTube</div>
                      <div className="text-xs text-mp-gray-500">Brand story + SEO; anchors the plan</div>
                    </div>
                    <div>
                      <div className="text-sm text-mp-gray-300">Site / Landing</div>
                      <div className="text-xs text-mp-gray-500">Proof + CTA orchestration; converts demand</div>
                    </div>
                  </div>
                </div>
                {/* Risks & Mitigation */}
                <div className="p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">Risks & Mitigation</div>
                  <ul className="text-sm text-mp-gray-300 space-y-1">
                    <li>• Inconsistent cadence → Mitigation: batch production and scheduled publish</li>
                    <li>• Weak proof → Mitigation: logos/testimonials/case study strip in hero</li>
                    <li>• Low CTA visibility → Mitigation: persistent header CTA + sticky consult bar</li>
                  </ul>
                </div>
                {/* 30 / 60 / 90 Outcomes */}
                <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                  <div className="font-semibold mb-2">30 / 60 / 90 Outcomes</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-mp-gray-400 mb-1">Day 30</div>
                      <ul className="text-sm text-mp-gray-300 space-y-1">
                        <li>• Hero film live</li>
                        <li>• Proof + CTA live</li>
                        <li>• 8–12 verticals published</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-mp-gray-400 mb-1">Day 60</div>
                      <ul className="text-sm text-mp-gray-300 space-y-1">
                        <li>• 20–30 verticals published</li>
                        <li>• First case study shell</li>
                        <li>• KPI review & retarget hooks</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-mp-gray-400 mb-1">Day 90</div>
                      <ul className="text-sm text-mp-gray-300 space-y-1">
                        <li>• 40–50 verticals published</li>
                        <li>• Case study live</li>
                        <li>• Stable consult pipeline</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => { navigator.clipboard.writeText(shareUrl); analytics.customEvent('engine_plan_copy_link'); show('Link copied to clipboard', 'success') }} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Copy Link</Button>
                  <Button variant="outline" onClick={downloadPdf}>Download PDF</Button>
                  <Button variant="outline" onClick={emailPlan}>Email Me This</Button>
                  <Button href="/engine/map?step=book" variant="outline">Book Mapping Call</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const p = plan
                      const a = audit
                      const persona = p?.choices?.persona || 'Brand'
                      const score = Math.max(0, Math.min(100, a?.score || 0))
                      const target = a?.targetScore ?? 92
                      const delta = Math.max(0, target - score)
                      const topGaps = (a?.insights?.gaps || []).slice(0, 3).join(', ')
                      const angle = (() => {
                        switch (persona) {
                          case 'resort': return 'Direct bookings via hero story + amenity reels + clear CTAs.'
                          case 'realtor': return 'More showings via property story + micro verticals + sticky “Book a Tour”.'
                          case 'hospitality': return 'Reservations via experience reels + proof band + sticky reservation CTA.'
                          case 'events': return 'Inquiries via highlight film + testimonial strip + above-the-fold CTA.'
                          default: return 'Proof + CTA + weekly cadence to turn views into booked calls.'
                        }
                      })()
                      const link = typeof window !== 'undefined' ? window.location.href : ''
                      const body = `Subject: ${persona}: 90‑Day Mini Plan (Score ${score}/100 — Δ +${delta})\n\nHi — We scanned public signals for ${persona}. Score is ${score}/100 (Δ +${delta} to target ${target}). Top gaps: ${topGaps || 'None'}. Plan angle: ${angle}\n\nView your mini plan: ${link}\n(Preview shows persona and opportunity Δ)\n\nWant a 20‑min mapping call to finalize this plan?\n\n— Martich Productions`
                      navigator.clipboard.writeText(body)
                      analytics.customEvent('plan_copy_outreach_email')
                      show('Outreach email copied', 'success')
                    }}
                  >Copy Outreach Email</Button>
                  {/* Calendly removed in favor of in‑app scheduler */}
                </div>
              </div>
            ) : (
              <div className="text-mp-gray-300">No plan found. <a className="text-mp-gold underline" href="/engine/map">Start the engine map</a>.</div>
            )}
          </div>
        </section>
        {plan && !stickyDismissed && (
          <div className="fixed inset-x-0 bottom-0 z-30" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className={`relative rounded-xl border border-mp-gray-800 bg-mp-charcoal/90 backdrop-blur supports-[backdrop-filter]:bg-mp-charcoal/70 p-3 flex flex-col sm:flex-row items-center gap-3 shadow-lg ${pulseCta ? 'ring-2 ring-mp-gold/60' : ''}`} aria-label="Plan actions">
                <button
                  aria-label="Dismiss"
                  className="absolute top-2 right-2 text-mp-gray-500 hover:text-mp-gray-300"
                  onClick={() => { setStickyDismissed(true); analytics.customEvent('plan_sticky_dismiss'); try { sessionStorage.setItem('plan_sticky_dismissed', '1') } catch {} }}
                >×</button>
                {/* Slim KPI bar */}
                {plan && audit && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full grid grid-cols-3 text-center text-[11px] text-mp-gray-400"
                    aria-label={`Plan KPIs: hooks ${(plan?.hooks || []).length}, CTAs ${(audit?.site?.ctas || []).length}, proof ${audit?.site?.hasProofSignals ? 'present' : 'missing'}`}
                  >
                    <div className="py-1 border-b border-mp-gray-800">Hooks: {(plan?.hooks || []).length}</div>
                    <div className="py-1 border-b border-mp-gray-800">CTAs found: {(audit?.site?.ctas || []).length}</div>
                    <div className="py-1 border-b border-mp-gray-800">Proof: {audit?.site?.hasProofSignals ? 'Present' : 'Missing'}</div>
                  </motion.div>
                )}
                <div className="flex-1 text-sm text-mp-gray-300">
                  <div>Ready to roll this out? Book a free mapping call.</div>
                  <div className="text-[11px] text-mp-gray-500">
                    {plan?.choices?.persona ? `We’ll tune for ${plan?.choices?.persona}` : 'We’ll tailor this to your brand'}{plan?.choices?.cadence ? ` • cadence: ${String(plan?.choices?.cadence)}` : ''} • avg reply time: 2h
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button href="/engine/map?step=book" onClick={() => analytics.customEvent('plan_sticky_cta_book', { service: plan?.choices?.service || undefined })} className={`w-full sm:w-auto h-9 px-3 text-sm sm:h-10 sm:px-4 ${pulseCta ? 'bg-mp-gold text-mp-black animate-pulse' : 'bg-mp-gold text-mp-black hover:bg-mp-gold-600'}`}>Book Call</Button>
                  <Button variant="outline" onClick={() => { navigator.clipboard.writeText(shareUrl); analytics.customEvent('plan_sticky_cta_copy'); setStickyEmailMsg({ type: 'success', text: 'Link copied to clipboard.' }) }} className="w-full sm:w-auto h-9 px-3 text-sm sm:h-10 sm:px-4">Copy Link</Button>
                </div>
                {/* Quick share via email */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={stickyEmail}
                    onChange={(e) => { setStickyEmail(e.target.value); if (stickyEmailMsg) setStickyEmailMsg(null) }}
                    className="h-9 px-3 rounded-md bg-mp-black border border-mp-gray-800 text-sm text-white placeholder:text-mp-gray-500 flex-1 sm:w-56"
                    aria-label="Email address to send this plan"
                    aria-describedby={stickyEmailMsg ? 'sticky-email-feedback' : undefined}
                    disabled={sendingSticky}
                  />
                  <Button
                    variant="outline"
                    disabled={!emailValid || sendingSticky || !plan || stickyOnCooldown}
                    onClick={async () => {
                      if (!emailValid || !plan || stickyOnCooldown) return
                      setSendingSticky(true)
                      try {
                        analytics.customEvent('plan_sticky_email_click')
                        const res = await fetch('/api/engine/plan/email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ to: stickyEmail, plan, audit }),
                        })
                        const j = await res.json().catch(() => ({}))
                        if (res.ok && j?.ok !== false) {
                          analytics.customEvent('plan_sticky_email_sent')
                          setStickyEmail('')
                          setStickyEmailMsg({ type: 'success', text: 'Sent. Check your inbox in a moment.' })
                          setLastStickySentAt(Date.now())
                        } else {
                          analytics.customEvent('plan_sticky_email_error', { error: j?.error || 'unknown' })
                          setStickyEmailMsg({ type: 'error', text: 'Could not send right now. Please try again.' })
                        }
                      } finally {
                        setSendingSticky(false)
                      }
                    }}
                  >
                    {sendingSticky ? 'Sending…' : stickyOnCooldown ? `Wait ${Math.ceil(remainingMs/1000)}s` : 'Email Me This'}
                  </Button>
                </div>
                    {stickyEmailMsg && (
                  <div id="sticky-email-feedback" role="status" aria-live="polite" className={`w-full text-[11px] mt-1 ${stickyEmailMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {stickyEmailMsg.text}
                  </div>
                )}
                <div className="w-full text-right">
                  <div className="text-[11px] text-mp-gray-500">
                    {plan?.choices?.role ? `Role: ${String(plan?.choices?.role)}` : ''}{plan?.choices?.timeline ? `${plan?.choices?.role ? ' • ' : ''}Timeline: ${String(plan?.choices?.timeline)}` : ''}
                    {(!plan?.choices?.role && !plan?.choices?.timeline) ? ' ' : ''}
                    <span className="ml-2">Prefer a producer call? <a href={`tel:${CONTACT_PHONE_TEL}`} onClick={() => analytics.customEvent('engine_producer_call', { from: 'plan_sticky' })} className="underline hover:text-mp-gold">Call</a> or <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => analytics.customEvent('engine_producer_email', { from: 'plan_sticky' })} className="underline hover:text-mp-gold">email</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}


