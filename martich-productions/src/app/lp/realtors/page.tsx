'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function RealtorsLP() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        <Script id="jsonld-service-realtors" type="application/ld+json">
          {JSON.stringify(
            generateServiceSchema({
              name: 'Real Estate Video Production',
              description: 'Cinematic listing tours, neighborhood context, and agent brand films with multi‑format delivery.',
              category: 'MarketingService',
              priceRange: '$5,000 - $50,000+',
              areaServed: 'Texas, United States'
            })
          )}
        </Script>
        <section className="py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className="text-display text-3xl sm:text-4xl font-bold mb-4">Sell Listings Faster with Cinematic Tours</h1>
            <p className="text-xl text-mp-gray-light mb-8">High‑end property films, neighborhood context, agent branding, and social edits—built to move buyers.</p>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Hold My Shoot Slot <ArrowRight className="ml-2 w-5 h-5"/></Button>
            <div className="text-sm text-mp-gray-400 mt-2">We’ll reply within 24 hours with packages and a timeline.</div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Luxury Listing Tours","Agent Brand Films","Always‑On Social Clips"].map((f) => (
                <div key={f} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
                  <CheckCircle className="w-5 h-5 text-mp-gold mb-3"/>
                  <div className="text-white font-semibold mb-1">{f}</div>
                  <div className="text-sm text-mp-gray-300">Turn interest into showings with films made for MLS, web, YouTube, and Reels.</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-display text-2xl font-bold text-white mb-6 text-center">How it works (30–60 days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {t:'Plan', d:'Listing brief, story angles, and distribution mapped.'},
                {t:'Produce', d:'Half‑ to full‑day shoot; aerials; agent brand shots.'},
                {t:'Publish', d:'MLS, YouTube, and vertical clips with tracking links.'},
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
            <div className="text-mp-gray-300 mb-6">Listings sold in 3 weeks • +180% qualified leads • 2–4× content per shoot</div>
            <Button href="/work?filter=realtors" variant="outline">See Realtor Outcomes <ArrowRight className="ml-2 w-5 h-5"/></Button>
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-mp-charcoal/95 border-t border-mp-gray-800 p-3 backdrop-blur-sm">
          <Button href="/book" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Hold My Shoot Slot</Button>
        </div>
      </div>
    </MainLayout>
  )
}


