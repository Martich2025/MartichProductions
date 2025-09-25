'use client'

import React from 'react'
import { ArrowLeft, Calendar, Clock, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import Link from 'next/link'

export default function BillOoslandCaseStudy() {
  const caseStudy = {
    title: 'Austin Luxury Listing Launch',
    client: 'Bill Oosland',
    category: 'realtors',
    summary:
      "A full-funnel listing campaign for a $3.2M Westlake property—story film, micro verticals, and on‑site web landing. Built to compound across MLS, social, and paid retargeting.",
    problem:
      'Bill needed a launch that reached qualified buyers fast without discounting the brand. Previous content lacked narrative, multi-format coverage, and conversion flow.',
    approach:
      'We mapped the 90‑day rollout: hero film + 12 verticals, agent walk‑throughs, lifestyle b‑roll, and a high-converting property page. Distribution covered Instagram, YouTube, TikTok, email, and retargeting. On-site capture and same‑day selects accelerated publish.',
    execution:
      'Shot list designed for 2–4× content output in one day. We staged golden‑hour exteriors, twilight drone, chef‑style kitchen lifestyle, and realtor POV for hooks. Edit pipeline delivered first cut in 48 hours; verticals batched for 6‑week cadence.',
    results: [
      { metric: '+220%', label: 'Qualified Buyer Leads' },
      { metric: '1.9M', label: 'Cross‑platform Views' },
      { metric: '13.4%', label: 'Avg. Engagement' },
      { metric: '45% faster', label: 'Time‑to‑Publish' },
    ],
    publishedAt: '2025-06-12',
    readTime: '6 min read',
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        {/* Back */}
        <section className="py-8 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/work" className="inline-flex items-center text-mp-gold hover:text-mp-gold-400 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Work
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-mp-gold/10 text-mp-gold text-sm font-medium mb-6 capitalize">
                {caseStudy.category}
              </div>
              <h1 className="text-display text-4xl lg:text-5xl font-bold mb-4">{caseStudy.title}</h1>
              <p className="text-xl text-mp-gray-light mb-6">{caseStudy.client}</p>
              <p className="text-mp-gray-300 text-lg mb-6">{caseStudy.summary}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-mp-gray-light">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(caseStudy.publishedAt).toLocaleDateString()}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{caseStudy.readTime}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="aspect-video bg-mp-charcoal rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-mp-gold/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-mp-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-mp-white"><p className="text-sm">Bill Oosland — Listing Story Film</p></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Challenge */}
        <section className="py-20 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-display text-3xl font-bold text-white mb-6">The Challenge</h2>
                <p className="text-xl text-mp-gray leading-relaxed">{caseStudy.problem}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-display text-3xl font-bold text-white mb-6">Our Approach</h2>
                <p className="text-xl text-mp-gray leading-relaxed">{caseStudy.approach}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Execution */}
        <section className="py-20 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-display text-3xl font-bold text-white mb-6">The Execution</h2>
                <p className="text-xl text-mp-gray leading-relaxed">{caseStudy.execution}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <h2 className="text-display text-3xl font-bold text-white mb-16 text-center">The Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {caseStudy.results.map((r) => (
                  <div key={r.label} className="text-center">
                    <div className="text-4xl font-bold text-mp-gold mb-2">{r.metric}</div>
                    <div className="text-mp-gray">{r.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center max-w-4xl mx-auto">
              <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">Ready to Launch Your Listing?</h2>
              <p className="text-xl text-mp-gray-light mb-8">Let’s map your 90‑day plan—content, channels, and the property page that converts.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Book a Free Consult</Button>
                <Button href="/services/realtors" variant="outline" size="lg" className="border-mp-white text-mp-white hover:bg-mp-gold/10">See Realtor Services</Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


