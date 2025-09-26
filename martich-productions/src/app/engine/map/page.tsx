'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Brain, Compass, Rocket, Sparkles, Video, Wand2, CheckCircle } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { trackPageView, analytics } from '@/lib/analytics'
import { CONTACT_PHONE_TEL, CONTACT_EMAIL } from '@/lib/site'
import { Input } from '@/components/ui/input'

type Persona = 'resort' | 'realtor' | 'hospitality' | 'events'

const steps = [
  { id: 'intro', title: 'Map My Growth Engine', icon: Compass },
  { id: 'persona', title: 'Who are you building for?', icon: Brain },
  { id: 'hooks', title: 'Signature Hooks & Formats', icon: Sparkles },
  { id: 'calendar', title: '90‑Day Release Calendar', icon: Rocket },
  { id: 'system', title: 'Site + Social Engine', icon: Video },
  { id: 'plan', title: 'Your Personal Plan', icon: Wand2 },
  { id: 'book', title: 'Book Your Mapping Call', icon: Wand2 },
]

export default function MapMyEnginePage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [tone, setTone] = useState<'Elegant' | 'Bold' | 'Minimal' | 'Friendly'>('Elegant')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiData, setAiData] = useState<{ hooks?: string[]; captions?: string[]; titles?: string[]; beats?: string[] }>({})
  const [genError, setGenError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', consent: false })
  const [intake, setIntake] = useState({ domain: '', instagram: '', facebook: '', youtube: '' })
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string>('')
  const [calendarSubmitting, setCalendarSubmitting] = useState(false)
  const [snapshot, setSnapshot] = useState<{
    domain?: string
    site?: {
      title?: string
      description?: string
      headings?: string[]
      ctas?: string[]
      hasProofSignals: boolean
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
    benchmarks?: { cadencePerWeek?: { your?: number | null; top: number }; proof?: { your: boolean; note: string }; cta?: { yourCount: number; note: string } }
    insights?: { strengths: string[]; gaps: string[] }
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
  }>({})
  const [utm, setUtm] = useState<Record<string, string>>({})
  const [referrer, setReferrer] = useState<string>('')
  // calendly deprecated: using in-app scheduler

  // Focus current step heading on step change for a11y
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null)
  useEffect(() => {
    if (!stepHeadingRef.current) return
    // Give React time to paint the new step
    const t = setTimeout(() => {
      try { stepHeadingRef.current?.focus() } catch {}
    }, 0)
    return () => clearTimeout(t)
  }, [stepIndex])

  useEffect(() => {
    trackPageView('/engine/map', { step: steps[stepIndex].id })
  }, [stepIndex])

  // Deep link to a specific step
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const step = params.get('step')
    if (step) {
      const idx = steps.findIndex(s => s.id === step)
      if (idx >= 0) setStepIndex(idx)
    }
  }, [])

  // Synchronize URL step param (preserve existing UTM/reschedule tokens)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('step', steps[stepIndex].id)
      window.history.replaceState({}, '', url.toString())
    } catch {}
  }, [stepIndex])

  const next = (payload?: Record<string, string>) => {
    if (payload) setChoices((c) => ({ ...c, ...payload }))
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }
  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

  // Email gating
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email])

  // Hydrate from session once (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const c = window.sessionStorage.getItem('engine_map_choices')
      if (c) {
        const parsed = JSON.parse(c)
        setPersona(parsed.persona || null)
        setChoices(parsed.choices || {})
        setTone(parsed.tone || 'Elegant')
      }
      const f = window.sessionStorage.getItem('engine_map_form')
      if (f) {
        const parsed = JSON.parse(f)
        setForm(prev => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])

  // Persist to session on change (browser only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem('engine_map_choices', JSON.stringify({ persona, choices, tone }))
      window.sessionStorage.setItem('engine_map_form', JSON.stringify(form))
    } catch {}
  }, [persona, choices, tone, form])

  // Capture UTM and referrer
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const utmObj: Record<string, string> = {}
    ;['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
      const v = params.get(k)
      if (v) utmObj[k] = v
    })
    setUtm(utmObj)
    setReferrer(document.referrer || '')
  }, [])

  // Listen for calendar submit lifecycle from child scheduler
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStart = () => setCalendarSubmitting(true)
    const onEnd = () => setCalendarSubmitting(false)
    window.addEventListener('mp_calendar_submit_start', onStart as EventListener)
    window.addEventListener('mp_calendar_submit_end', onEnd as EventListener)
    return () => {
      window.removeEventListener('mp_calendar_submit_start', onStart as EventListener)
      window.removeEventListener('mp_calendar_submit_end', onEnd as EventListener)
    }
  }, [])

  // Fire snapshot view event once when available on step 1
  useEffect(() => {
    if (stepIndex === 1 && (snapshot?.insights || snapshot?.site)) {
      analytics.customEvent('engine_snapshot_view', { hasProof: snapshot.site?.hasProofSignals, ctas: (snapshot.site?.ctas || []).length })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  // Guard: if no snapshot, force back to step 0 from later steps
  const hasSnapshot = useMemo(() => Boolean(snapshot?.site || snapshot?.insights), [snapshot])
  useEffect(() => {
    if (!hasSnapshot && stepIndex > 0) setStepIndex(0)
  }, [hasSnapshot, stepIndex])

  const container = 'max-w-4xl mx-auto'
  const card = 'bg-mp-charcoal/80 border border-mp-gray-800 rounded-2xl p-6 sm:p-8'
  const host = useMemo(() => {
    try {
      if (!intake.domain) return ''
      const u = new URL(intake.domain)
      return u.host
    } catch {
      return ''
    }
  }, [intake.domain])

  function BookScheduler() {
    const [days, setDays] = useState<{ date: string; slots: string[] }[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedSlot, setSelectedSlot] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [employees, setEmployees] = useState<{ id: string; name: string; email?: string | null }[]>([])
    const [producerId, setProducerId] = useState<string>('')
    const tzOffset = typeof window !== 'undefined' ? -new Date().getTimezoneOffset() : -300

    useEffect(() => {
      if (typeof window === 'undefined') return
      const startEvt = new CustomEvent('mp_calendar_submit_start')
      const endEvt = new CustomEvent('mp_calendar_submit_end')
      if (submitting) window.dispatchEvent(startEvt)
      else window.dispatchEvent(endEvt)
      return () => { window.dispatchEvent(endEvt) }
    }, [submitting])

    useEffect(() => {
      let mounted = true
      analytics.customEvent('engine_booking_view')
      setLoading(true)
      fetch(`/api/engine/schedule/availability?days=14&step=30&tzOffset=${tzOffset}&bufferMin=15${producerId ? `&producerId=${producerId}` : ''}`)
        .then(r => r.json())
        .then(j => {
          if (!mounted) return
          if (j?.ok && Array.isArray(j.days)) {
            setDays(j.days)
            const totalSlots = j.days.reduce((acc: number, d: { slots: string[] }) => acc + (Array.isArray(d.slots) ? d.slots.length : 0), 0)
            analytics.customEvent('engine_booking_availability_loaded', { days: j.days.length, totalSlots })
          } else {
            setError('Could not load availability')
            analytics.customEvent('engine_booking_availability_error')
          }
        })
        .catch(() => mounted && (setError('Could not load availability'), analytics.customEvent('engine_booking_availability_error')))
        .finally(() => mounted && setLoading(false))
      return () => { mounted = false }
    }, [tzOffset, producerId])

    // Load active employees to optionally allow producer selection
    useEffect(() => {
      let mounted = true
      fetch('/api/engine/schedule/employees')
        .then(r => r.json())
        .then(j => {
          if (!mounted) return
          if (j?.ok && Array.isArray(j.employees)) {
            setEmployees(j.employees)
            if (j.employees.length === 1) setProducerId(j.employees[0].id)
          }
        })
        .catch(() => {})
      return () => { mounted = false }
    }, [])

    const localTime = (iso: string) => {
      try {
        const d = new Date(iso)
        return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      } catch { return iso }
    }

    const submitBooking = async () => {
      if (submitting) return
      if (!form.name || !form.email || !selectedSlot) return
      setSubmitting(true)
      setError('')
      try {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
        const rescheduleToken = params.get('r') || undefined
        const planPid = (() => { try { return JSON.parse(sessionStorage.getItem('engine_saved_plan_meta') || '{}').pid } catch { return undefined } })()
        const shareUrl = (() => { try { return sessionStorage.getItem('engine_saved_plan_share') || undefined } catch { return undefined } })()
        const res = await fetch('/api/engine/schedule/book', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: `Engine Map booking. Persona: ${persona || ''}, Role: ${choices.role || ''}, Focus: ${choices.focus || ''}, Cadence: ${choices.cadence || ''}, Timeline: ${choices.timeline || ''}, Tone: ${tone}, Service: ${choices.service || ''}.` + (form.company ? ` Company: ${form.company}.` : '') + (form.phone ? ` Phone: ${form.phone}.` : '')
              + (host ? ` Site: ${host}` : ''),
            startIso: selectedSlot,
            durationMin: 30,
            rescheduleToken,
            producerId: producerId || undefined,
            planPid,
            shareUrl,
            service: choices.service || undefined,
            persona: persona || undefined,
            role: choices.role || undefined,
            focus: choices.focus || undefined,
            cadence: choices.cadence || undefined,
            timeline: choices.timeline || undefined,
            site: host || undefined,
          })
        })
        if (res.ok) {
          setIsSubmitted(true)
          analytics.customEvent('engine_booking_booked', { slot: selectedSlot, role: choices.role, timeline: choices.timeline })
        } else {
          const j = await res.json().catch(() => ({}))
          setError(j?.error || 'Could not book slot')
          analytics.customEvent('engine_booking_failed', { slot: selectedSlot, error: j?.error || 'unknown' })
        }
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div className="mb-6" aria-live="polite">
        {loading && <div className="text-sm text-mp-gray-400">Loading availability…</div>}
        {/* Optional producer selection */}
        {employees.length > 1 && (
          <div className="mb-3">
            <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Meet with</div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select producer">
              <button
                type="button"
                onClick={() => { if (submitting) return; setProducerId(''); analytics.customEvent('engine_booking_producer_any') }}
                className={`px-3 py-1.5 rounded-full border ${producerId === '' ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}
                role="radio"
                aria-checked={producerId === ''}
              >Any</button>
              {employees.map(emp => (
                <button
                  type="button"
                  key={emp.id}
                  onClick={() => { if (submitting) return; setProducerId(emp.id); analytics.customEvent('engine_booking_producer', { id: emp.id, name: emp.name }) }}
                  className={`px-3 py-1.5 rounded-full border ${producerId === emp.id ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}
                  role="radio"
                  aria-checked={producerId === emp.id}
                >{emp.name}</button>
              ))}
            </div>
          </div>
        )}
        {employees.length === 1 && (
          <div className="mb-3 text-sm text-mp-gray-400">Meeting with: <span className="text-mp-gold">{employees[0].name}</span></div>
        )}
        {/* Reschedule/cancel banners */}
        {typeof window !== 'undefined' && (() => {
          const p = new URLSearchParams(window.location.search)
          const wasCanceled = p.get('canceled')
          if (wasCanceled === '1') return <div className="text-sm text-green-400 mb-2">Your booking was canceled.</div>
          if (wasCanceled === '0') return <div className="text-sm text-red-400 mb-2">Cancel link expired or invalid.</div>
          if (p.get('r')) return <div className="text-sm text-mp-gray-300 mb-2">Rescheduling: pick a new slot and confirm.</div>
          return null
        })()}
        {error && <div className="text-sm text-red-400 mb-2" role="alert" aria-live="assertive">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2" role="radiogroup" aria-label="Choose date">
              {days.map(d => (
            <button
              type="button"
              key={d.date}
              onClick={() => { if (submitting) return; setSelectedDate(d.date); setSelectedSlot(''); analytics.customEvent('engine_booking_day', { date: d.date, slots: d.slots.length }) }}
              className={`h-10 sm:h-auto p-3 rounded-xl border ${selectedDate === d.date ? 'border-mp-gold' : 'border-mp-gray-800'} bg-mp-black/40 hover:border-mp-gold text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                  disabled={submitting}
                  aria-disabled={submitting}
              role="radio"
              aria-checked={selectedDate === d.date}
              aria-label={`${new Date(d.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}, ${d.slots.length} available slots`}
            >
              <div className="text-sm font-semibold">{new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}</div>
              <div className="text-xs text-mp-gray-400">{d.slots.length} slots</div>
            </button>
          ))}
        </div>
        {selectedDate && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Slots</div>
            <div className="flex flex-wrap gap-2" role="listbox" aria-label={`Available time slots for ${new Date(selectedDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}`}>
                  {(days.find(d => d.date === selectedDate)?.slots || []).map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => { if (submitting) return; setSelectedSlot(s); analytics.customEvent('engine_booking_slot', { iso: s }) }}
                  className={`h-9 px-3 text-sm sm:h-10 sm:px-4 rounded-full border ${selectedSlot === s ? 'border-mp-gold text-white' : 'border-mp-gray-800 text-mp-gray-300'} hover:border-mp-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                      disabled={submitting}
                      aria-disabled={submitting}
                  role="option"
                  aria-selected={selectedSlot === s}
                  aria-label={`${localTime(s)} local time`}
                >{localTime(s)}</button>
              ))}
              {(days.find(d => d.date === selectedDate)?.slots || []).length === 0 && (
                <div className="text-sm text-mp-gray-400">No slots available this day.</div>
              )}
            </div>
          </div>
        )}
        <div className="mt-4 flex gap-3">
          <Button onClick={submitBooking} aria-disabled={!selectedSlot || !form.name || !form.email || submitting} aria-label="Book selected slot" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600" disabled={!selectedSlot || !form.name || !form.email || submitting}>
            {submitting ? 'Booking…' : 'Book Slot'}
          </Button>
          <div className="text-xs text-mp-gray-500 self-center">All times shown in your local timezone.</div>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white">
        <section className="py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3" role="list" aria-label={`Engine steps: step ${stepIndex + 1} of ${steps.length}`}>
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    role="listitem"
                    aria-current={i === stepIndex ? 'step' : undefined}
                    className={`h-1 w-10 rounded-full ${i <= stepIndex ? 'bg-mp-gold' : 'bg-mp-gray-800'}`}
                  />
                ))}
              </div>
              <div className="text-sm text-mp-gray-400">Step {stepIndex + 1} of {steps.length}</div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[stepIndex].id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className={container}
                  >
                {stepIndex === 0 && (
                  <div className={`${card} p-4 sm:p-8`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Compass className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Interactive</div>
                    </div>
                    <h1 ref={stepHeadingRef} tabIndex={-1} className="text-display text-3xl sm:text-4xl font-bold mb-2">Map My Growth Engine</h1>
                    <p className="text-mp-gray-300 text-lg mb-1">
                      90‑second brand scan → instant mini plan. See what we’d build, how it compounds, and what we’d fix—before you ever book.
                    </p>
                    <div className="text-sm text-mp-gray-500 mb-6">We analyze your site + socials, draft hooks and formats, outline cadence, and highlight quick wins—so your next step is obvious.</div>
                    {/* Intake: domain + socials + email */}
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Input label="Your Name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'name' }) }} />
                      <Input label="Email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'email' }) }} />
                    </div>
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Input label="Website (https://...)" value={intake.domain} onChange={(e) => setIntake({ ...intake, domain: e.target.value })} />
                      <Input label="Instagram URL" value={intake.instagram} onChange={(e) => setIntake({ ...intake, instagram: e.target.value })} />
                    </div>
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Input label="Facebook URL" value={intake.facebook} onChange={(e) => setIntake({ ...intake, facebook: e.target.value })} />
                      <Input label="YouTube URL" value={intake.youtube} onChange={(e) => setIntake({ ...intake, youtube: e.target.value })} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button disabled={!isEmailValid || scanning || (!intake.domain && !(intake.instagram || intake.facebook || intake.youtube))} aria-disabled={!isEmailValid || scanning || (!intake.domain && !(intake.instagram || intake.facebook || intake.youtube))} onClick={async () => {
                        if (!isEmailValid) return
                        setScanning(true)
                        setScanError('')
                        analytics.customEvent('engine_scan_start', { domain: intake.domain, instagram: intake.instagram ? 1 : 0, facebook: intake.facebook ? 1 : 0, youtube: intake.youtube ? 1 : 0 })
                        try {
                          const r = await fetch('/api/engine/scan', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(intake),
                          })
                          if (!r.ok) {
                            setScanError('We couldn’t fetch public signals right now. Please check the URL or try again in a moment.')
                            return
                          }
                          const j = await r.json().catch(() => null)
                          if (j?.snapshot) {
                            setSnapshot(j.snapshot)
                            analytics.customEvent('engine_scan_complete', { hasProof: j.snapshot?.site?.hasProofSignals, ctas: (j.snapshot?.site?.ctas || []).length })
                            next()
                          } else {
                            setScanError('We couldn’t parse your site. Please verify the URL is https:// and publicly reachable.')
                          }
                        } catch {
                          setScanError('Network issue while scanning. Please try again.')
                        }
                        setScanning(false)
                      }} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 disabled:opacity-60">
                        <span aria-live="polite" aria-busy={scanning}>
                          {scanning ? 'Scanning…' : isEmailValid ? 'Scan & Start' : 'Enter Email to Start'}
                        </span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button href="/work" variant="outline">See Outcomes</Button>
                    </div>
                    {scanError && (
                      <div className="mt-3 text-sm text-red-400" role="alert" aria-live="assertive">{scanError}</div>
                    )}
                    {!intake.domain && !(intake.instagram || intake.facebook || intake.youtube) && (
                      <div className="mt-2 text-sm text-mp-gray-400" role="status" aria-live="polite">Add an https:// website or at least one social URL to scan.</div>
                    )}
                    <div className="text-[11px] text-mp-gray-500 mt-2">Privacy: we fetch only publicly available signals (your page HTML and social profiles). Nothing sensitive is stored; you can request deletion anytime.</div>
                        {scanning && (
                      <div className="mt-4 text-sm text-mp-gray-300">
                        {/* Radar animation */}
                        <div className="mb-3 flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border border-mp-gray-800" />
                            <div className="absolute inset-2 rounded-full border border-mp-gray-800" />
                            <div className="absolute inset-4 rounded-full border border-mp-gray-800" />
                                <div className="absolute inset-0 origin-center animate-spin motion-reduce:animate-none" style={{ animationDuration: '3s' }}>
                              <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-mp-gold/40 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                            </div>
                          </div>
                          <div className="text-xs text-mp-gray-400">Scanning public signals…</div>
                        </div>
                            <div className="animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-mp-gray-800 via-mp-gray-700 to-mp-gray-800 bg-[length:200%_100%] rounded px-3 py-2 inline-block mr-2 mb-2">Finding hooks…</div>
                            <div className="animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-mp-gray-800 via-mp-gray-700 to-mp-gray-800 bg-[length:200%_100%] rounded px-3 py-2 inline-block mr-2 mb-2">Spotting proof…</div>
                            <div className="animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-mp-gray-800 via-mp-gray-700 to-mp-gray-800 bg-[length:200%_100%] rounded px-3 py-2 inline-block mr-2 mb-2">Mapping cadence…</div>
                      </div>
                    )}
                    {/* Trust band */}
                    <div className="mt-6" aria-label="Trusted by">
                      <div className="text-xs uppercase tracking-wide text-mp-gray-500 mb-3">Trusted by teams across Texas</div>
                      <div className="flex flex-wrap items-center gap-4 opacity-80">
                        <Image src="/client-logos/espn-logo.png" alt="ESPN" width={92} height={24} className="h-6 w-auto" />
                        <Image src="/client-logos/miss-usa-logo.png" alt="Miss USA" width={92} height={24} className="h-6 w-auto" />
                        <Image src="/client-logos/horseshoe-bay-logo.png" alt="Horseshoe Bay" width={120} height={24} className="h-6 w-auto" />
                        <Image src="/client-logos/loraloma-logo.png" alt="Loraloma" width={110} height={24} className="h-6 w-auto" />
                        <Image src="/client-logos/moreland-properties-logo.png" alt="Moreland Properties" width={150} height={24} className="h-6 w-auto" />
                      </div>
                    </div>
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Persona</div>
                    </div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-1">Who are we optimizing for?</h2>
                    <div className="text-sm text-mp-gray-400 mb-4">{host ? `For ${host}` : 'Select your primary buyer/vertical'}</div>
                    {/* Snapshot summary */}
                    {(snapshot?.insights || snapshot?.site) && (
                      <div className="mb-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Score ring */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40 flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            <svg viewBox="0 0 36 36" className="w-16 h-16">
                              <path className="text-mp-gray-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
                              <path className="text-mp-gold" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" style={{ strokeDasharray: `${(snapshot.score || 0) * 0.01 * 100}, 100` }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{Math.max(0, Math.min(100, snapshot.score || 0))}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Audit Score</div>
                            <div className="text-sm text-mp-gray-300">Higher = stronger funnel (proof, CTA, basics)</div>
                          </div>
                        </div>
                        {/* KPI bars */
                        }
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">KPI Snapshot</div>
                          <div className="text-sm text-mp-gray-300">CTAs: {(snapshot.site?.ctas || []).length}</div>
                          <div className="text-sm text-mp-gray-300">Proof: {snapshot.site?.hasProofSignals ? 'Present' : 'Missing'}</div>
                          <div className="text-sm text-mp-gray-300">Canonical: {snapshot.site?.canonical ? 'Present' : 'Missing'}</div>
                          <div className="text-sm text-mp-gray-300">Indexable: {snapshot.site?.seo?.noindex ? 'No' : 'Yes'}</div>
                          {typeof snapshot.targetScore === 'number' && (
                            <div className="text-sm text-mp-gray-300">Opportunity: +{Math.max(0, (snapshot.targetScore || 0) - (snapshot.score || 0))} → target {snapshot.targetScore}</div>
                          )}
                          {typeof snapshot.confidence === 'number' && (
                            <div className="text-sm text-mp-gray-300">Confidence: {Math.round((snapshot.confidence || 0) * 100)}%</div>
                          )}
                        </div>
                        {/* Social KPI */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Social Reach (approx)</div>
                          <div className="text-sm text-mp-gray-300">Instagram: {snapshot.socialsMeta?.instagram?.followersApprox ?? '—'}</div>
                          <div className="text-sm text-mp-gray-300">Facebook: {snapshot.socialsMeta?.facebook?.followersApprox ?? '—'}</div>
                          <div className="text-sm text-mp-gray-300">YouTube: {snapshot.socialsMeta?.youtube?.subscribersApprox ?? '—'}</div>
                          <div className="text-xs text-mp-gray-500 mt-1">Note: best‑effort public estimate.</div>
                        </div>
                        {/* Ecosystem Overview */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Ecosystem Overview</div>
                          <div className="text-sm text-mp-gray-300">Links: {snapshot.site?.ecosystem?.linksTotal ?? '—'} ({snapshot.site?.ecosystem?.linksExternal ?? 0} external)</div>
                          <div className="text-sm text-mp-gray-300">Images: {snapshot.site?.ecosystem?.images ?? '—'}</div>
                          <div className="text-sm text-mp-gray-300">Videos: {snapshot.site?.ecosystem?.videos ?? '—'}</div>
                          <div className="text-xs text-mp-gray-500 mt-1">Signal density only—no private data inspected.</div>
                        </div>
                        {/* Accessibility Snapshot */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Accessibility Snapshot</div>
                          <div className="text-sm text-mp-gray-300">H1 Count: {snapshot.site?.a11y?.h1Count ?? '—'}</div>
                          <div className="text-sm text-mp-gray-300">Images missing alt: {snapshot.site?.a11y?.imagesMissingAlt ?? '—'}</div>
                          <div className="text-xs text-mp-gray-500 mt-1">Alt text improves SEO and accessibility.</div>
                        </div>
                        {/* Schema Checklist */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Schema Checklist</div>
                          <ul className="text-sm text-mp-gray-300 space-y-1">
                            <li>{snapshot.schemaChecklist?.hasOrganization ? '✓' : '—'} Organization</li>
                            <li>{snapshot.schemaChecklist?.hasLocalBusiness ? '✓' : '—'} LocalBusiness</li>
                            <li>{snapshot.schemaChecklist?.hasBreadcrumbList ? '✓' : '—'} BreadcrumbList</li>
                            <li>{snapshot.schemaChecklist?.hasVideoObject ? '✓' : '—'} VideoObject</li>
                            <li>{snapshot.schemaChecklist?.hasArticle ? '✓' : '—'} Article</li>
                          </ul>
                        </div>
                        {/* Radial Opportunity */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40 flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            {(() => {
                              const score = Math.max(0, Math.min(100, snapshot.score || 0))
                              const target = snapshot.targetScore ?? 92
                              const delta = Math.max(0, target - score)
                              const pct = Math.max(0, Math.min(100, Math.round((delta / (target || 100)) * 100)))
                              return (
                                <svg viewBox="0 0 36 36" className="w-16 h-16">
                                  <path className="text-mp-gray-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
                                  <path className="text-red-500" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" style={{ strokeDasharray: `${pct}, 100` }} />
                                </svg>
                              )
                            })()}
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">+{Math.max(0, (snapshot.targetScore || 0) - (snapshot.score || 0))}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Opportunity</div>
                            <div className="text-sm text-mp-gray-300">Delta to target score</div>
                          </div>
                        </div>
                        {/* Wins/Gaps */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-1">Wins</div>
                          <ul className="text-sm text-mp-gray-300 list-disc list-inside space-y-1">
                            {(snapshot.insights?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-1">Gaps</div>
                          <ul className="text-sm text-mp-gray-300 list-disc list-inside space-y-1">
                            {(snapshot.insights?.gaps || []).map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        {/* Issues */}
                        {Array.isArray(snapshot.issues) && snapshot.issues.length > 0 && (
                          <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40 lg:col-span-3">
                            <div className="font-semibold mb-2">Issues</div>
                            <ul className="text-sm text-mp-gray-300 space-y-1">
                              {snapshot.issues.slice(0, 6).map((iss) => (
                                <li key={iss.id} className="flex items-start gap-2">
                                  <span className={`mt-1 inline-block h-2 w-2 rounded-full ${iss.severity === 'high' ? 'bg-red-500' : iss.severity === 'medium' ? 'bg-yellow-400' : 'bg-mp-gold'}`} aria-label={`${iss.severity} severity`} />
                                  <span><span className="font-medium">{iss.title}</span> — {iss.fix}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Opportunity Narrative */}
                        <div className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40 lg:col-span-3">
                          <div className="font-semibold mb-2">Opportunity Narrative</div>
                          <div className="text-sm text-mp-gray-300">
                            {(() => {
                              const sc = Math.max(0, Math.min(100, snapshot.score || 0))
                              const target = snapshot.targetScore ?? 92
                              const delta = Math.max(0, target - sc)
                              const who = persona ? persona.charAt(0).toUpperCase() + persona.slice(1) : 'Brand'
                              const focus = choices.focus ? choices.focus.charAt(0).toUpperCase() + choices.focus.slice(1) : 'Balanced'
                              return `${who}: ${sc}/100 today, +${delta} to target. We’ll use a ${focus.toLowerCase()} track: tighten proof + CTA, then publish weekly with ${choices.cadence || 'steady'} cadence to turn views into booked calls.`
                            })()}
                          </div>
                        </div>
                        {/* Social Mosaic */}
                        <div className="lg:col-span-3">
                          <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Social Mosaic</div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {Array.from({ length: 6 }).map((_, i) => {
                              const href = intake.instagram || intake.facebook || intake.youtube || '#'
                              return (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg bg-mp-gray-800 hover:bg-mp-gray-700 transition-colors" aria-label="Social preview tile" />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-mp-gray-300 mb-6">This sets your hooks, story beats, calendar rhythm, and on‑site conversion paths.</p>
                    <div role="radiogroup" aria-label="Persona" className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {([
                        { k: 'resort', label: 'Luxury Resort' },
                        { k: 'realtor', label: 'Realtor / Brokerage' },
                        { k: 'hospitality', label: 'Hospitality / Venue' },
                        { k: 'events', label: 'Weddings & Events' },
                      ] as {k: Persona; label: string}[]).map((p) => (
                        <button
                          key={p.k}
                          onClick={() => { setPersona(p.k); next({ persona: p.k }) }}
                          role="radio"
                          aria-checked={persona === p.k}
                          className={`text-left p-3 sm:p-4 rounded-xl border ${persona === p.k ? 'border-mp-gold' : 'border-mp-gray-800'} bg-mp-black/40 hover:border-mp-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                        >
                          <div className="font-semibold">{p.label}</div>
                          <div className="text-sm text-mp-gray-400">Tailored hooks, visuals, and funnels</div>
                        </button>
                      ))}
                    </div>
                    {/* Fix Plan */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Input label="Company" value={form.company} onChange={(e) => { setForm({ ...form, company: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'company' }) }} />
                      <Input label="Phone" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'phone' }) }} />
                    </div>
                    {snapshot && (
                      <div className="mt-4 p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-2">Fix Plan</div>
                        <ul className="text-sm text-mp-gray-300 list-disc list-inside space-y-1">
                          {!snapshot.site?.hasProofSignals && <li>Add proof band above the fold (logos/testimonial/case study)</li>}
                          {(snapshot.site?.ctas || []).length === 0 && <li>Add a primary hero CTA (Book/Consult) and make it persistent</li>}
                          {!snapshot.site?.canonical && <li>Add canonical URL in &lt;head&gt; to consolidate signals</li>}
                          {snapshot.site?.seo?.noindex && <li>Remove noindex from production pages</li>}
                          {!(snapshot.site?.contact?.hasEmail || snapshot.site?.contact?.hasPhone) && <li>Add a visible contact method (email/phone) in header/footer</li>}
                        </ul>
                        {/* Opportunity Meter */}
                        <div className="mt-4">
                          <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-1">Opportunity Meter</div>
                          <div className="w-full h-3 rounded-full bg-mp-gray-900 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-mp-gold" style={{ width: `${100 - Math.max(0, Math.min(100, snapshot.score || 0))}%` }} />
                          </div>
                          <div className="text-[11px] text-mp-gray-500 mt-1">Lower score = higher opportunity. We’ll close these gaps in week 1.</div>
                        </div>
                      </div>
                    )}
                    {snapshot.benchmarks && (
                      <div className="mt-4 p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-1">Benchmarks</div>
                        <div className="text-sm text-mp-gray-300">Cadence: {snapshot.benchmarks.cadencePerWeek?.your ?? '—'}/wk vs {snapshot.benchmarks.cadencePerWeek?.top}/wk</div>
                        <div className="text-sm text-mp-gray-300">CTA: {(snapshot.benchmarks.cta?.yourCount || 0)} found; {snapshot.benchmarks.cta?.note}</div>
                      </div>
                    )}
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 2 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Formats</div>
                    </div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-4">Signature Hooks & Formats</h2>
                    <p className="text-mp-gray-300 mb-6">Pick a focus to shape your 90‑day run. Choose a tone and generate draft hooks, captions, titles, and beats.</p>
                    <div className="mb-4">
                      <div className="text-sm text-mp-gray-400 mb-2">Tone</div>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tone">
                        {(['Elegant', 'Bold', 'Minimal', 'Friendly'] as const).map(t => (
                          <button
                            key={t}
                            role="radio"
                            aria-checked={tone === t}
                            onClick={() => setTone(t)}
                            className={`h-9 px-3 text-sm sm:h-10 sm:px-4 rounded-full border ${tone === t ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Focus">
                      {[
                        { k: 'authority', title: 'Authority', desc: 'Walk‑throughs, POV, expert breakdowns' },
                        { k: 'lifestyle', title: 'Lifestyle', desc: 'Hero film + micro verticals' },
                        { k: 'conversion', title: 'Conversion', desc: 'Short hooks driving to property/site' },
                      ].map((f) => (
                        <button
                          key={f.k}
                          role="radio"
                          aria-checked={choices.focus === f.k}
                          onClick={() => next({ focus: f.k })}
                          className={`text-left p-4 rounded-xl border ${choices.focus === f.k ? 'border-mp-gold' : 'border-mp-gray-800'} bg-mp-black/40 hover:border-mp-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                        >
                          <div className="font-semibold">{f.title}</div>
                          <div className="text-sm text-mp-gray-400">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button variant="outline" onClick={back} disabled={aiLoading} aria-disabled={aiLoading}>Back</Button>
                          <Button
                            disabled={!persona || !choices.focus || aiLoading}
                            aria-disabled={!persona || !choices.focus || aiLoading}
                            aria-label={!persona || !choices.focus ? 'Select Persona and Focus to enable generation' : (aiLoading ? 'Generating content' : 'Generate Hooks and Captions')}
                            onClick={async () => {
                              setAiLoading(true)
                              setGenError('')
                          try {
                            const res = await fetch('/api/engine/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ persona, focus: choices.focus, cadence: choices.cadence, tone }),
                            })
                            if (!res.ok) {
                              // Persona-aware graceful fallback
                              const p = persona || 'realtor'
                              const f = choices.focus || 'conversion'
                              const toneWord = tone
                              const personaNoun = p === 'resort' ? 'Resort' : p === 'hospitality' ? 'Hospitality' : p === 'events' ? 'Events' : 'Realtor'
                              const focusNoun = f === 'authority' ? 'Authority' : f === 'lifestyle' ? 'Lifestyle' : 'Conversion'
                              const hooks = [
                                `${personaNoun} ${focusNoun}: 3 moments buyers miss`,
                                `Why this ${personaNoun.toLowerCase()} stands out in 60s`,
                                `${focusNoun} POV: the hidden details that sell`,
                                `From first frame to booking: our ${focusNoun.toLowerCase()} flow`,
                                `${toneWord} reveal: the scene that converts`,
                              ]
                              const titles = [
                                `${personaNoun} Story — An ${toneWord} Tour`,
                                `${focusNoun} in 60 Seconds`,
                                `What Makes This ${personaNoun} Special`,
                                `Designed To Convert — ${focusNoun}`,
                                `${toneWord} Twilight Tour`,
                              ]
                              const captions = [
                                `Hook → proof → offer. ${personaNoun} coverage built to convert.`,
                                `One day, multi‑format output. ${focusNoun} cadence.`,
                                `POV + lifestyle + hero film. Site orchestration included.`,
                                `From scroll to inquiry in under 30s.`,
                                `Shot to publish in 48h.`,
                              ]
                              const beats = [
                                'Hook: 2s reveal',
                                'Proof: 3 features close‑up',
                                'Lifestyle: human scale',
                                'Offer: CTA to book/view',
                              ]
                              setAiData({ hooks, titles, captions, beats })
                                  setGenError('Generator is busy; used a strong fallback.')
                              return
                            }
                            const data = await res.json()
                            setAiData({ hooks: data.hooks, captions: data.captions, titles: data.titles, beats: data.beats })
                            analytics.customEvent('engine_ai_generate', { persona, ...choices, tone })
                              } catch {
                                setGenError('Network hiccup; used fallback content.')
                          } finally {
                            setAiLoading(false)
                          }
                        }}
                        className="bg-mp-gold text-mp-black hover:bg-mp-gold-600"
                      >
                        {aiLoading ? 'Generating…' : (!persona || !choices.focus ? 'Choose Persona & Focus' : 'Generate Hooks + Captions')}
                      </Button>
                          {aiLoading && (
                            <div role="status" aria-live="polite" className="sr-only">Generating content…</div>
                          )}
                          {genError && (
                            <div className="text-sm text-mp-gray-400" role="status" aria-live="polite">{genError}</div>
                          )}
                    </div>
                    {aiLoading && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true" aria-live="polite" role="status">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                            <div className="h-4 w-2/3 mb-2 animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-mp-gray-800 via-mp-gray-700 to-mp-gray-800 bg-[length:200%_100%]" />
                            <div className="space-y-1">
                              {Array.from({ length: 4 }).map((__, j) => (
                                <div key={j} className="h-3 w-full animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-mp-gray-900 via-mp-gray-800 to-mp-gray-900 bg-[length:200%_100%]" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    { (aiData.hooks || aiData.captions || aiData.titles || aiData.beats) && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Hooks</div>
                          <ul className="text-mp-gray-300 text-sm space-y-1">
                            {(aiData.hooks || []).map((h, i) => <li key={i}>• {h}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Captions</div>
                          <ul className="text-mp-gray-300 text-sm space-y-1">
                            {(aiData.captions || []).map((c, i) => <li key={i}>• {c}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">YouTube Titles</div>
                          <ul className="text-mp-gray-300 text-sm space-y-1">
                            {(aiData.titles || []).map((t, i) => <li key={i}>• {t}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                          <div className="font-semibold mb-2">Storyboard Beats</div>
                          <ul className="text-mp-gray-300 text-sm space-y-1">
                            {(aiData.beats || []).map((b, i) => <li key={i}>• {b}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {stepIndex === 3 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Rocket className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Cadence</div>
                    </div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-4">90‑Day Release Calendar</h2>
                    <p className="text-mp-gray-300 mb-6">Select a publishing cadence—our engine sequences for reach now and compounding results over 90 days.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Cadence">
                      {[
                        { k: 'steady', title: 'Steady', desc: '2x/wk verticals + 1x/wk longform' },
                        { k: 'fast', title: 'Fast', desc: '3x/wk verticals + 1–2x/wk longform' },
                        { k: 'surge', title: 'Surge', desc: '5x/wk verticals + 2x/wk longform' },
                      ].map((c) => (
                        <button
                          key={c.k}
                          role="radio"
                          aria-checked={choices.cadence === c.k}
                          onClick={() => next({ cadence: c.k })}
                          className={`text-left p-4 rounded-xl border ${choices.cadence === c.k ? 'border-mp-gold' : 'border-mp-gray-800'} bg-mp-black/40 hover:border-mp-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mp-gold`}
                        >
                          <div className="font-semibold">{c.title}</div>
                          <div className="text-sm text-mp-gray-400">{c.desc}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                      {/* Preview strip */}
                      <div className="flex-1">
                        <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: 4 }).map((_, w) => {
                            const cadence = choices.cadence || 'steady'
                            const items = cadence === 'surge' ? ['Reel', 'Reel', 'Carousel', 'Hero beat'] : cadence === 'fast' ? ['Reel', 'Carousel', 'Hero beat'] : ['Reel', 'Hero beat']
                            return (
                              <div key={w} className="p-3 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                                <div className="text-xs text-mp-gray-400 mb-2">Week {w + 1}</div>
                                <ul className="text-sm text-mp-gray-300 space-y-1">
                                  {items.map((label, i) => <li key={i}>• {label}</li>)}
                                </ul>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stepIndex === 4 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">System</div>
                    </div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-4">One Engine: Social + Site</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Content Ops</div>
                        <div className="text-sm text-mp-gray-400">Shotlist → Batch Edit → QC → Calendar → Publish (best‑time)</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Site Conversion</div>
                        <div className="text-sm text-mp-gray-400">Hero + Proof + Offer → CTA orchestration → Lead capture</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">AI Assist</div>
                        <div className="text-sm text-mp-gray-400">Hooks, captions, titles, and weekly recap—auto‑drafted to speed output</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Measurement</div>
                        <div className="text-sm text-mp-gray-400">Views → Engaged → Leads → Consults → Bookings</div>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                      <Button
                        onClick={() => next()}
                        disabled={!((aiData.hooks || []).length && choices.cadence)}
                        aria-disabled={!((aiData.hooks || []).length && choices.cadence)}
                        className="bg-mp-gold text-mp-black hover:bg-mp-gold-600"
                      >{((aiData.hooks || []).length && choices.cadence) ? 'See My Plan' : 'Choose Cadence & Generate'}</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 5 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Wand2 className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Your Plan</div>
                    </div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-4">Your Personal 90‑Day Plan</h2>
                    <div className="text-mp-gray-300 mb-4">
                      We’ll tune this to <span className="text-mp-gold font-semibold">{persona || 'your brand'}</span> with a <span className="text-mp-gold font-semibold">{choices.focus || 'balanced'}</span> focus and a <span className="text-mp-gold font-semibold">{choices.cadence || 'steady'}</span> cadence.
                    </div>
                    <ul className="list-disc list-inside text-mp-gray-300 mb-6">
                      <li>Hero film + micro verticals mapped to your hooks</li>
                      <li>Weekly publish rhythm with on‑site conversion orchestration</li>
                      <li>AI‑drafted captions/titles and a Monday recap with KPI glidepath</li>
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => setStepIndex(6)} size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
                        Book My Mapping Call
                      </Button>
                      <Button href="#" variant="outline" onClick={async (e) => {
                        e.preventDefault()
                        if (typeof window === 'undefined') return
                        try {
                          const planData = { hooks: aiData.hooks || [], captions: aiData.captions || [], titles: aiData.titles || [], beats: aiData.beats || [], choices: { ...choices, persona, tone } }
                          sessionStorage.setItem('engine_mini_plan', JSON.stringify(planData))
                          sessionStorage.setItem('engine_mini_plan_audit', JSON.stringify(snapshot))
                          const res = await fetch('/api/engine/plan/save', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planData, audit: snapshot })
                          })
                          const j = await res.json()
                          analytics.customEvent('engine_plan_generate', { hooks: (aiData.hooks || []).length, pid: j?.pid })
                          const pid = j?.pid
                          try { sessionStorage.setItem('engine_saved_plan_meta', JSON.stringify({ pid })) } catch {}
                          window.location.href = pid ? `/engine/plan?pid=${pid}` : '/engine/plan'
                        } catch {
                          window.location.href = '/engine/plan'
                        }
                      }}>View Mini Plan</Button>
                      <Button variant="outline" onClick={back}>Back</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 6 && (
                  <div className={card}>
                    {!isSubmitted ? (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <Wand2 className="w-5 h-5 text-mp-gold" />
                          <div className="uppercase tracking-wider text-xs text-mp-gray-400">Booking</div>
                        </div>
                        <h2 ref={stepHeadingRef} tabIndex={-1} className="text-display text-2xl font-semibold mb-4">Book Your Mapping Call</h2>
                        <p className="text-mp-gray-300 mb-2">We’ll review this plan and map your next 90 days—no pressure, real value.</p>
                        <div className="text-[12px] text-mp-gray-500 mb-6">You’ll meet with <span className="text-mp-gold font-semibold">Mark</span> (Director) or <span className="text-mp-gold font-semibold">Krystal</span> (Producer).</div>
                        {/* Qualifiers */}
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Your Role</div>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Your Role">
                              {['Owner/Founder','Marketing Lead','Sales Lead','Agent/Broker','Other'].map((r) => (
                                <button
                                  key={r}
                                  onClick={() => { setChoices((c) => ({ ...c, role: r })); analytics.customEvent('engine_booking_role', { role: r }) }}
                                  className={`px-3 py-1.5 rounded-full border ${choices.role === r ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}
                                role="radio"
                                aria-checked={choices.role === r}
                                >{r}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Timeline</div>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Timeline">
                              {['0–30 days','30–60 days','60–90 days','90+ days'].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => { setChoices((c) => ({ ...c, timeline: t })); analytics.customEvent('engine_booking_timeline', { timeline: t }) }}
                                  className={`px-3 py-1.5 rounded-full border ${choices.timeline === t ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}
                                role="radio"
                                aria-checked={choices.timeline === t}
                                >{t}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Service interest selector */}
                        <div className="mb-4">
                          <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">What are you most interested in?</div>
                          <div className="flex flex-wrap gap-2" role="group" aria-label="Service interest">
                            {['Film','Photography','Website','Social'].map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => { setChoices((c) => ({ ...c, service: s })); analytics.customEvent('engine_booking_service', { service: s }) }}
                                className={`px-3 py-1.5 rounded-full border ${choices.service === s ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}
                                aria-pressed={choices.service === s}
                              >{s}</button>
                            ))}
                          </div>
                        </div>
                        {/* In-app scheduler */}
                        <BookScheduler />
                        {/* Post-booking next steps (shown after submit) */}
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault()
                            if (!form.name || !form.email || !form.consent) return
                            setIsSubmitting(true)
                            try {
                              const res = await fetch('/api/leads', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  name: form.name,
                                  email: form.email,
                                  phone: form.phone,
                                  company: form.company,
                                role: choices.role || (persona || undefined),
                                project_type: persona || 'social-web-engine',
                                timeline: choices.timeline || 'flexible',
                                message: `Engine Map → Persona: ${persona || ''} | Role: ${choices.role || ''} | Focus: ${choices.focus || ''} | Cadence: ${choices.cadence || ''} | Timeline: ${choices.timeline || ''} | Tone: ${tone} | Service: ${choices.service || ''}`,
                                  consent: form.consent,
                                  path: '/engine/map',
                                  audit: snapshot,
                                  utm,
                                  referrer,
                                }),
                              })
                              if (res.ok) {
                                analytics.consultSubmit({ from: 'engine_map' })
                                setIsSubmitted(true)
                              }
                            } finally {
                              setIsSubmitting(false)
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Full Name *" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <Input label="Email *" type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Phone" name="phone" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <Input label="Company" name="company" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                          </div>
                          <label className="flex items-start gap-2 text-sm text-mp-gray-300">
                            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1" />
                            <span>I consent to be contacted by Martich Productions and agree to the Privacy Policy.</span>
                          </label>
                          <Button type="submit" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600" disabled={isSubmitting} aria-describedby="booking-note">
                            {isSubmitting ? 'Submitting…' : 'Book Free Mapping Call'}
                          </Button>
                          <div id="booking-note" className="text-xs text-mp-gray-500">You’ll get a confirmation email with an .ics calendar invite. Need to reschedule? Reply to the confirmation at any time.</div>
                          <div className="text-[11px] text-mp-gray-500 mt-1">
                            Prefer a producer call? <a href={`tel:${CONTACT_PHONE_TEL}`} onClick={() => analytics.customEvent('engine_producer_call', { from: 'map_booking' })} className="underline hover:text-mp-gold">Call us</a> or <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => analytics.customEvent('engine_producer_email', { from: 'map_booking' })} className="underline hover:text-mp-gold">email the team</a>.
                          </div>
                        </form>
                        <div className="mt-6">
                          <Button variant="outline" onClick={back} disabled={isSubmitting || calendarSubmitting} aria-disabled={isSubmitting || calendarSubmitting}>Back</Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-mp-gold" />
                        </div>
                        <h3 className="text-display text-2xl font-bold mb-2">Booked—see you soon.</h3>
                        <p className="text-mp-gray-300 mb-6">We’ll confirm details by email. In the meantime, preview your Mini Plan or explore outcomes.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button href="/engine/plan" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">View My Mini Plan</Button>
                          <Button href="/work" variant="outline">See Client Outcomes</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Live Story Panel */}
              <div className="hidden lg:block">
                <div className="sticky top-20">
                  <div className="bg-mp-charcoal/80 border border-mp-gray-800 rounded-2xl p-5">
                    <div className="uppercase tracking-wider text-xs text-mp-gray-400 mb-2">Live Story</div>
                    <div className="text-lg font-semibold mb-2">{persona ? `${persona.toUpperCase()} • ${choices.focus || '—'} • ${choices.cadence || '—'}` : 'Choose your persona'}</div>
                    <div className="text-sm text-mp-gray-300 mb-4">Tone: <span className="text-mp-gold">{tone}</span></div>
                    {aiData.hooks && aiData.hooks.length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold mb-1">Top Hook</div>
                        <div className="text-mp-gray-200">{aiData.hooks[0]}</div>
                      </div>
                    )}
                    {aiData.beats && aiData.beats.length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold mb-1">Beats</div>
                        <ul className="text-sm text-mp-gray-300 space-y-1">
                          {aiData.beats.slice(0, 4).map((b, i) => <li key={i}>• {b}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="border-t border-mp-gray-800 pt-3 mt-3 text-sm text-mp-gray-300">
                      <div>Name: {form.name || '—'}</div>
                      <div>Email: {form.email || '—'}</div>
                      <div>Phone: {form.phone || '—'}</div>
                      <div>Company: {form.company || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


