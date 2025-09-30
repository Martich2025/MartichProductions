'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function WeddingsLP() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        <Script id="jsonld-service-weddings" type="application/ld+json">
          {JSON.stringify(
            generateServiceSchema({
              name: 'Cinematic Wedding Films',
              description: 'Elegant, story‑driven wedding coverage with highlight film, full ceremony, speeches, and social edits.',
              category: 'WeddingService',
              priceRange: '$8,000 - $35,000+',
              areaServed: 'Texas, United States'
            })
          )}
        </Script>
        <section className="py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <motion.h1 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-display text-3xl sm:text-4xl font-bold mb-4">Cinematic Wedding Films</motion.h1>
            <motion.p initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-xl text-mp-gray-light mb-8">Elegant, story‑driven coverage crafted with precision—so you can relive the day forever.</motion.p>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Check Availability <ArrowRight className="ml-2 w-5 h-5"/></Button>
            <div className="text-sm text-mp-gray-400 mt-2">Reply within 24h • no obligation</div>
          </div>
        </section>

        {/* Proof band */}
        <section className="py-10 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {v:'98%', l:'Client Satisfaction'},
                {v:'15+ yrs', l:'Experience'},
                {v:'50M+', l:'Views Generated'},
                {v:'+200%', l:'Referral Mentions'},
              ].map((m) => (
                <div key={m.l} className="text-center bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
                  <div className="text-2xl font-bold text-mp-gold tabular-nums mb-1">{m.v}</div>
                  <div className="text-xs uppercase text-mp-gray-300 metric-label">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Story‑Driven Films","Crystal‑Clear Audio","Luxury‑Grade Crew"].map((f) => (
                <div key={f} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
                  <CheckCircle className="w-5 h-5 text-mp-gold mb-3"/>
                  <div className="text-white font-semibold mb-1">{f}</div>
                  <div className="text-sm text-mp-gray-300">Meticulous capture, unobtrusive operation, on‑brand edits for social and film.</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-display text-2xl font-bold text-white mb-6 text-center">How it works (90 days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {t:'Plan', d:'Date, story, music, and must‑have moments locked.'},
                {t:'Produce', d:'Director + crew capture with multi‑mic audio and aerials.'},
                {t:'Publish', d:'Highlight film, full ceremony, speeches, and social cuts.'},
              ].map((s) => (
                <div key={s.t} className="bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800 text-center">
                  <div className="text-white font-semibold mb-2">{s.t}</div>
                  <div className="text-sm text-mp-gray-300">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h3 className="text-white font-bold text-xl mb-4 text-center">FAQs</h3>
            <div className="space-y-4 text-sm text-mp-gray-300">
              <div>
                <div className="font-medium text-white mb-1">Do you work with planners?</div>
                <p>Yes—timeline and shot list coordination with your planner is standard.</p>
              </div>
              <div>
                <div className="font-medium text-white mb-1">How fast is delivery?</div>
                <p>Same‑day social edit optional; highlight in 4–6 weeks; full films shortly after.</p>
              </div>
              <div>
                <div className="font-medium text-white mb-1">Travel?</div>
                <p>Texas‑based; we travel worldwide. Travel is quoted up front.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <div className="text-mp-gold font-bold mb-2">What couples love</div>
            <div className="text-mp-gray-300 mb-6">Same‑day social edits • Full ceremony film • Multi‑cam speeches • Director + second shooter</div>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Start My Date Hold <ArrowRight className="ml-2 w-5 h-5"/></Button>
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-mp-charcoal/95 border-t border-mp-gray-800 p-3 backdrop-blur-sm">
          <Button href="/book" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Check Availability</Button>
        </div>
      </div>
    </MainLayout>
  )
}


