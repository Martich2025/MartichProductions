'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function ResortsLP() {
  function startFreeCheck() {
    try {
      const existing = JSON.parse(window.sessionStorage.getItem('engine_map_choices') || '{}')
      const next = { ...existing, persona: 'resort', service: 'Film', focus: 'Direct bookings', tone: 'Elegant' }
      window.sessionStorage.setItem('engine_map_choices', JSON.stringify(next))
    } catch {}
    if (typeof window !== 'undefined') window.location.assign('/engine/map')
  }

  // Simple ROI calculator
  const [rooms, setRooms] = useState<number>(150)
  const [adr, setAdr] = useState<number>(300)
  const [occ, setOcc] = useState<number>(60)
  const [uplift, setUplift] = useState<number>(8)
  const nights = 30
  const baseMonthly = Math.max(0, rooms) * nights * Math.max(0, adr) * (Math.max(0, Math.min(100, occ)) / 100)
  const upliftValue = Math.round(baseMonthly * (Math.max(0, uplift) / 100))

  return (
    <MainLayout>
      <div className="min-h-screen bg-canvas">
        <Script id="jsonld-service-resorts" type="application/ld+json">
          {JSON.stringify(
            generateServiceSchema({
              name: 'Resort Content Production',
              description: 'Brand films, suite & amenity tours, and always‑on social content that books stays.',
              category: 'MarketingService',
              priceRange: '$25,000 - $100,000+',
              areaServed: 'Texas, United States'
            })
          )}
        </Script>
        <section className="py-16 bg-surface text-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Resort Content That Books Stays</h1>
            <p className="text-xl text-secondary mb-8">From brand films to room tours and amenity reels—built to convert across web and social.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={startFreeCheck} size="lg" className="bg-brand text-canvas hover:bg-brand-600">Start Free Check <ArrowRight className="ml-2 w-5 h-5"/></Button>
              <Button href="/book" variant="outline" size="lg">Book a Resort Mapping Call</Button>
            </div>
            <div className="text-sm text-tertiary mt-2">90‑second check → Mini Plan → 20‑min call. No commitment.</div>
          </div>
        </section>

        {/* Trust band */}
        <section className="py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-[11px] tracking-wider uppercase text-tertiary mb-3">Trusted by teams across Texas</div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-90">
              <Image src="/client-logos/horseshoe-bay-logo.png" alt="Horseshoe Bay" width={120} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/loraloma-logo.png" alt="Loraloma" width={110} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/the-club-logo.png" alt="The Club" width={110} height={24} className="h-6 w-auto" />
            </div>
          </div>
        </section>

        {/* Outcome snapshot */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Signature Brand Story","Suite & Amenity Tours","Always‑On Social Edits"].map((f) => (
                <div key={f} className="bg-surface rounded-xl p-6 border border-subtle">
                  <CheckCircle className="w-5 h-5 text-brand mb-3"/>
                  <div className="text-white font-semibold mb-1">{f}</div>
                  <div className="text-sm text-secondary">Plan → produce → publish with landing pages and tracked CTAs.</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI mini-calculator */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-surface rounded-2xl p-6 border border-subtle">
              <div className="text-display text-2xl font-bold text-white mb-2">Will this pencil?</div>
              <div className="text-sm text-tertiary mb-4">Quick estimate. Adjust numbers to your resort. Actual results vary.</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm text-secondary">Rooms
                  <input type="number" value={rooms} onChange={(e) => setRooms(parseInt(e.target.value || '0', 10))} className="mt-1 w-full rounded-md bg-canvas border border-subtle px-3 py-2" />
                </label>
                <label className="text-sm text-secondary">ADR ($)
                  <input type="number" value={adr} onChange={(e) => setAdr(parseInt(e.target.value || '0', 10))} className="mt-1 w-full rounded-md bg-canvas border border-subtle px-3 py-2" />
                </label>
                <label className="text-sm text-secondary">Occupancy (%)
                  <input type="number" value={occ} onChange={(e) => setOcc(parseInt(e.target.value || '0', 10))} className="mt-1 w-full rounded-md bg-canvas border border-subtle px-3 py-2" />
                </label>
                <label className="text-sm text-secondary">Potential lift (%)
                  <input type="number" value={uplift} onChange={(e) => setUplift(parseInt(e.target.value || '0', 10))} className="mt-1 w-full rounded-md bg-canvas border border-subtle px-3 py-2" />
                </label>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg border border-subtle bg-canvas/40">
                  <div className="text-tertiary text-xs mb-1">Monthly revenue (est.)</div>
                  <div className="text-white font-semibold">${Math.round(baseMonthly).toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg border border-subtle bg-canvas/40">
                  <div className="text-tertiary text-xs mb-1">Potential lift</div>
                  <div className="text-brand font-semibold">+${upliftValue.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg border border-subtle bg-canvas/40">
                  <div className="text-tertiary text-xs mb-1">Next step</div>
                  <Button onClick={startFreeCheck} className="bg-brand text-canvas hover:bg-brand-600 w-full">Start Free Check</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-display text-2xl font-bold text-white mb-6 text-center">How it works (90 days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {t:'Plan', d:'Calendar, deliverables, and rooms/amenities prioritized.'},
                {t:'Produce', d:'2–3 day shoot; aerials; talent and lifestyle coverage.'},
                {t:'Publish', d:'Site pages and social rollout with tracked CTAs.'},
              ].map((s) => (
                <div key={s.t} className="bg-surface rounded-xl p-6 border border-subtle text-center">
                  <div className="text-white font-semibold mb-2">{s.t}</div>
                  <div className="text-sm text-secondary">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-canvas text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-brand font-bold mb-2">Recent outcomes</div>
            <div className="text-secondary mb-6">+340% bookings • +180% leads • 2–4× content output per shoot</div>
            <Button href="/work?filter=resorts" variant="outline" className="">See Resort Outcomes <ArrowRight className="ml-2 w-5 h-5"/></Button>
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-surface/95 border-t border-subtle p-3 backdrop-blur-sm">
          <Button onClick={startFreeCheck} className="w-full bg-brand text-canvas hover:bg-brand-600">Start Free Check</Button>
        </div>
      </div>
    </MainLayout>
  )
}


