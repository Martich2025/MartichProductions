'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Brain, Compass, Rocket, Sparkles, Video, Wand2, CheckCircle } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { trackPageView, analytics } from '@/lib/analytics'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', consent: false })

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

  const container = 'max-w-4xl mx-auto'
  const card = 'bg-mp-charcoal/80 border border-mp-gray-800 rounded-2xl p-6 sm:p-8'

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white">
        <section className="py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {steps.map((s, i) => (
                  <div key={s.id} className={`h-1 w-10 rounded-full ${i <= stepIndex ? 'bg-mp-gold' : 'bg-mp-gray-800'}`} />
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
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Compass className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Interactive</div>
                    </div>
                    <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Map My Growth Engine</h1>
                    <p className="text-mp-gray-300 text-lg mb-6">
                      A cinematic, AI‑guided walkthrough that drafts your 90‑day content + site plan—formats, hooks, release cadence—so you can see the system before we build it.
                    </p>
                    {/* Progressive profile capture */}
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Your Name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'name' }) }} />
                      <Input label="Email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'email' }) }} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => next()} disabled={!isEmailValid} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 disabled:opacity-60">
                        {isEmailValid ? 'Start Mapping' : 'Enter Email to Start'} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button href="/work" variant="outline">See Outcomes</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Persona</div>
                    </div>
                    <h2 className="text-display text-2xl font-semibold mb-4">Who are you building for?</h2>
                    <p className="text-mp-gray-300 mb-6">This tunes the formats, calendar, and on‑site conversion paths.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {([
                        { k: 'resort', label: 'Luxury Resort' },
                        { k: 'realtor', label: 'Realtor / Brokerage' },
                        { k: 'hospitality', label: 'Hospitality / Venue' },
                        { k: 'events', label: 'Weddings & Events' },
                      ] as {k: Persona; label: string}[]).map((p) => (
                        <button
                          key={p.k}
                          onClick={() => { setPersona(p.k); next({ persona: p.k }) }}
                          className={`text-left p-4 rounded-xl border ${persona === p.k ? 'border-mp-gold' : 'border-mp-gray-800'} bg-mp-black/40 hover:border-mp-gold transition-colors`}
                        >
                          <div className="font-semibold">{p.label}</div>
                          <div className="text-sm text-mp-gray-400">Tailored hooks, visuals, and funnels</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Company" value={form.company} onChange={(e) => { setForm({ ...form, company: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'company' }) }} />
                      <Input label="Phone" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); analytics.customEvent('engine_profile_partial', { field: 'phone' }) }} />
                    </div>
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
                    <h2 className="text-display text-2xl font-semibold mb-4">Signature Hooks & Formats</h2>
                    <p className="text-mp-gray-300 mb-6">Pick a focus to shape your 90‑day run. Choose a tone and generate live assets.</p>
                    <div className="mb-4">
                      <div className="text-sm text-mp-gray-400 mb-2">Tone</div>
                      <div className="flex flex-wrap gap-2">
                        {(['Elegant', 'Bold', 'Minimal', 'Friendly'] as const).map(t => (
                          <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-full border ${tone === t ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { k: 'authority', title: 'Authority', desc: 'Walk‑throughs, POV, expert breakdowns' },
                        { k: 'lifestyle', title: 'Lifestyle', desc: 'Hero film + micro verticals' },
                        { k: 'conversion', title: 'Conversion', desc: 'Short hooks driving to property/site' },
                      ].map((f) => (
                        <button
                          key={f.k}
                          onClick={() => next({ focus: f.k })}
                          className="text-left p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40 hover:border-mp-gold transition-colors"
                        >
                          <div className="font-semibold">{f.title}</div>
                          <div className="text-sm text-mp-gray-400">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                      <Button
                        onClick={async () => {
                          setAiLoading(true)
                          try {
                            const res = await fetch('/api/engine/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ persona, focus: choices.focus, cadence: choices.cadence, tone }),
                            })
                            if (!res.ok) {
                              // graceful client-side fallback mirrors API fallback
                              const fallback = {
                                hooks: [
                                  `Inside ${choices.focus || 'brand'}: 3 features buyers miss`,
                                  '60 seconds: why this stands out',
                                  'POV walk‑through: the hidden moments that sell',
                                  'From first frame to booking: flow explained',
                                  'Twilight reveal: the scene that converts',
                                ],
                                titles: [
                                  'Story — An Elegant Tour',
                                  'In 60 Seconds: Authority Edition',
                                  'What Makes This Special',
                                  'Designed To Convert',
                                  'Twilight Tour',
                                ],
                                captions: [
                                  'Hook → proof → offer. Coverage built to convert.',
                                  'One day, multi‑format output. Steady cadence.',
                                  'POV + lifestyle + hero film. Site orchestration included.',
                                  'From scroll to inquiry in under 30s.',
                                  'Shot to publish in 48h.',
                                ],
                                beats: [
                                  'Hook: 2s reveal',
                                  'Proof: 3 features close‑up',
                                  'Lifestyle: human scale',
                                  'Offer: CTA to book/view',
                                ],
                              }
                              setAiData(fallback)
                              return
                            }
                            const data = await res.json()
                            setAiData({ hooks: data.hooks, captions: data.captions, titles: data.titles, beats: data.beats })
                            analytics.customEvent('engine_ai_generate', { persona, ...choices, tone })
                          } finally {
                            setAiLoading(false)
                          }
                        }}
                        className="bg-mp-gold text-mp-black hover:bg-mp-gold-600"
                      >
                        {aiLoading ? 'Generating…' : 'Generate Hooks + Captions'}
                      </Button>
                    </div>
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
                    <h2 className="text-display text-2xl font-semibold mb-4">90‑Day Release Calendar</h2>
                    <p className="text-mp-gray-300 mb-6">Select a publishing cadence—our engine paces and sequences for compounding reach.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { k: 'steady', title: 'Steady', desc: '2x/wk verticals + 1x/wk longform' },
                        { k: 'fast', title: 'Fast', desc: '3x/wk verticals + 1–2x/wk longform' },
                        { k: 'surge', title: 'Surge', desc: '5x/wk verticals + 2x/wk longform' },
                      ].map((c) => (
                        <button
                          key={c.k}
                          onClick={() => next({ cadence: c.k })}
                          className="text-left p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40 hover:border-mp-gold transition-colors"
                        >
                          <div className="font-semibold">{c.title}</div>
                          <div className="text-sm text-mp-gray-400">{c.desc}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 4 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">System</div>
                    </div>
                    <h2 className="text-display text-2xl font-semibold mb-4">Site + Social Engine</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Content Ops</div>
                        <div className="text-sm text-mp-gray-400">Shotlist → Batch Edit → QC → Calendar → Publish</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Site Conversion</div>
                        <div className="text-sm text-mp-gray-400">Hero + Proof + Offer → CTA orchestration → Lead</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">AI Assist</div>
                        <div className="text-sm text-mp-gray-400">Hooks, captions, titles, and weekly recap—auto‑drafted</div>
                      </div>
                      <div className="p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
                        <div className="font-semibold mb-1">Measurement</div>
                        <div className="text-sm text-mp-gray-400">Views → Engaged → Leads → Consults → Bookings</div>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={back}>Back</Button>
                      <Button onClick={() => next()} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">See My Plan</Button>
                    </div>
                  </div>
                )}

                {stepIndex === 5 && (
                  <div className={card}>
                    <div className="flex items-center gap-3 mb-3">
                      <Wand2 className="w-5 h-5 text-mp-gold" />
                      <div className="uppercase tracking-wider text-xs text-mp-gray-400">Your Plan</div>
                    </div>
                    <h2 className="text-display text-2xl font-semibold mb-4">Your Personal 90‑Day Plan</h2>
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
                        <h2 className="text-display text-2xl font-semibold mb-4">Book Your Mapping Call</h2>
                        <p className="text-mp-gray-300 mb-6">We’ll review this plan and map your next 90 days—no pressure, real value.</p>
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
                                  project_type: persona || 'social-web-engine',
                                  timeline: choices.cadence || 'flexible',
                                  message: `Engine Map → Persona: ${persona || ''} | Focus: ${choices.focus || ''} | Cadence: ${choices.cadence || ''} | Tone: ${tone}`,
                                  consent: form.consent,
                                  path: '/engine/map',
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
                            <Input label="Full Name *" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <Input label="Email *" type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <Input label="Company" name="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                          </div>
                          <label className="flex items-start gap-2 text-sm text-mp-gray-300">
                            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1" />
                            <span>I consent to be contacted by Martich Productions and agree to the Privacy Policy.</span>
                          </label>
                          <Button type="submit" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting…' : 'Book Free Mapping Call'}
                          </Button>
                          <div className="text-xs text-mp-gray-500">We’ll reply within 24 hours.</div>
                        </form>
                        <div className="mt-6">
                          <Button variant="outline" onClick={back}>Back</Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-mp-gold" />
                        </div>
                        <h3 className="text-display text-2xl font-bold mb-2">Thank you!</h3>
                        <p className="text-mp-gray-300 mb-6">We received your request. We’ll reach out within 24 hours to schedule your mapping call.</p>
                        <div className="flex justify-center gap-3">
                          <Button href="/work" variant="outline">View Our Work</Button>
                          <Button href="/" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Back to Home</Button>
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


