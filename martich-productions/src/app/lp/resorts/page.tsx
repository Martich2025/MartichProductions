'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function ResortsLP() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
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
        <section className="py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Resort Content That Books Stays</h1>
            <p className="text-xl text-mp-gray-light mb-8">From brand films to room tours and amenity reels—built to convert across web and social.</p>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Plan My Next Shoot <ArrowRight className="ml-2 w-5 h-5"/></Button>
            <div className="text-sm text-mp-gray-400 mt-2">Get a 90‑day rollout with deliverables and timelines.</div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Signature Brand Story","Suite & Amenity Tours","Always‑On Social Edits"].map((f) => (
                <div key={f} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
                  <CheckCircle className="w-5 h-5 text-mp-gold mb-3"/>
                  <div className="text-white font-semibold mb-1">{f}</div>
                  <div className="text-sm text-mp-gray-300">Plan → produce → publish with landing pages and tracked CTAs.</div>
                </div>
              ))}
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
                <div key={s.t} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800 text-center">
                  <div className="text-white font-semibold mb-2">{s.t}</div>
                  <div className="text-sm text-mp-gray-300">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-mp-black text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-mp-gold font-bold mb-2">Recent outcomes</div>
            <div className="text-mp-gray-300 mb-6">+340% bookings • +180% leads • 2–4× content output per shoot</div>
            <Button href="/work?filter=resorts" variant="outline" className="">See Resort Outcomes <ArrowRight className="ml-2 w-5 h-5"/></Button>
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-mp-charcoal/95 border-t border-mp-gray-800 p-3 backdrop-blur-sm">
          <Button href="/book" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Plan My Shoot</Button>
        </div>
      </div>
    </MainLayout>
  )
}


