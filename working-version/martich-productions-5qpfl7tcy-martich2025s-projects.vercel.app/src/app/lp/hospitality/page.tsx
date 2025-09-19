'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function HospitalityLP() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        <Script id="jsonld-service-hospitality" type="application/ld+json">
          {JSON.stringify(
            generateServiceSchema({
              name: 'Hospitality Content Production',
              description: 'Restaurant experience films, hotel & venue tours, and guest testimonials that drive reservations.',
              category: 'MarketingService',
              priceRange: '$10,000 - $75,000+',
              areaServed: 'Texas, United States'
            })
          )}
        </Script>
        <section className="py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Hospitality Content That Drives Reservations</h1>
            <p className="text-xl text-mp-gray-light mb-8">Restaurant films, hotel & venue tours, and always‑on social edits designed to convert.</p>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Plan My Campaign <ArrowRight className="ml-2 w-5 h-5"/></Button>
            <div className="text-sm text-mp-gray-400 mt-2">Get a 90‑day rollout with deliverables and timelines.</div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Restaurant Experience","Hotel & Venue Tours","Guest Testimonial Films"].map((f) => (
                <div key={f} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
                  <CheckCircle className="w-5 h-5 text-mp-gold mb-3"/>
                  <div className="text-white font-semibold mb-1">{f}</div>
                  <div className="text-sm text-mp-gray-300">Capture desire and trust across web and social, with landing pages that convert.</div>
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
                {t:'Plan', d:'Menu/amenities, shoot list, and calendar set.'},
                {t:'Produce', d:'On‑site capture; lifestyle; chef/guest testimonials.'},
                {t:'Publish', d:'Site pages, Reels/Shorts, and tracked CTAs.'},
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
            <div className="text-mp-gray-300 mb-6">+200% reservations • +150% engagement • brand recognition up 3×</div>
            <Button href="/work?filter=hospitality" variant="outline">See Hospitality Outcomes <ArrowRight className="ml-2 w-5 h-5"/></Button>
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-mp-charcoal/95 border-t border-mp-gray-800 p-3 backdrop-blur-sm">
          <Button href="/book" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Plan My Campaign</Button>
        </div>
      </div>
    </MainLayout>
  )
}


