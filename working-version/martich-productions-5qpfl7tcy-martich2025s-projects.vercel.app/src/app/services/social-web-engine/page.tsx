'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, BarChart3, Calendar, Bot, Send, ShieldCheck, ArrowRight } from 'lucide-react'
import Script from 'next/script'
import { generateServiceSchema } from '@/lib/seo'

export default function SocialWebEnginePage() {
  const pillars = [
    {
      icon: Calendar,
      title: 'Content OS',
      description: 'Single source of truth for assets, posts, calendars, approvals, analytics, rights.'
    },
    {
      icon: Bot,
      title: 'AI Workflow',
      description: 'Transcription, hook mining, caption drafts, best-time scheduling, quiet hours.'
    },
    {
      icon: Send,
      title: 'Publish & Automate',
      description: 'Auto-post with retries and dead-letter; DM keyword flows and lead capture.'
    },
    {
      icon: BarChart3,
      title: 'Learn & Optimize',
      description: 'Dashboards for winners/losers; A/B hooks; cadence tests; ROI-guided allocation.'
    }
  ]

  const architecture = [
    'Next.js app + Vercel (fast, secure, scalable)',
    'Clerk Organizations (client portals, roles, SSO-ready)',
    'Upstash Redis + Vercel Cron (queues, retries, scheduling)',
    'Mux (video), R2/S3 (file vaults) with signed URLs',
    'OpenAI + Whisper (copy, hooks, transcription)',
    'Vercel Analytics + PostHog (events, funnels, reporting)',
    'Meta Graph, X, TikTok, YouTube, LinkedIn (connectors; OAuth per client)'
  ]

  const workflow = [
    {
      step: 'Ingest',
      detail: 'Upload media → auto-transcribe → extract topics, people, locations → generate formats (Reels/Shorts/carousels).'
    },
    {
      step: 'Plan',
      detail: 'AI calendar suggests cadence and channel mix; best-time predictions and quiet hours.'
    },
    {
      step: 'Create',
      detail: '3–5 hook variants, platform-aware captions/hashtags, rights checks; humor dial + banned terms.'
    },
    {
      step: 'Publish',
      detail: 'Auto-post with retries; DM keywords ("quote", "rates") trigger flows; site pages update in sync.'
    },
    {
      step: 'Learn',
      detail: 'Ingest metrics (watch time, saves, CTR, leads); promote winners; evolve prompts automatically.'
    }
  ]

  const packages = [
    {
      name: 'Launch',
      price: '$5,000/mo+',
      bullets: [
        'Content OS setup + 8–12 posts/mo',
        'Guided hooks/captions; baseline analytics',
        'Site CTAs + booking + basic reporting'
      ]
    },
    {
      name: 'Scale',
      price: '$12,000/mo+',
      bullets: [
        '20–30 posts/mo across platforms',
        'A/B hooks, best-time posting, DM automations',
        'Case-study pages + monthly intelligence report'
      ]
    },
    {
      name: 'Pro',
      price: 'Custom',
      bullets: [
        'White-label client portal + SSO',
        'Full connectors + queue reliability + SLAs',
        'Cohort benchmarking + quarterly strategy'
      ]
    }
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        <Script id="jsonld-service-swe" type="application/ld+json">
          {JSON.stringify(
            generateServiceSchema({
              name: 'Social & Web Engine',
              description: 'AI-powered social + site management that turns content into revenue, end to end.',
              category: 'MarketingService',
              priceRange: '$5,000 - $25,000+/mo',
              areaServed: 'Texas, United States'
            })
          )}
        </Script>
        {/* Hero */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Run Social + Web as One Revenue Engine
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                We operate your content OS, posting, landing pages, and analytics in one loop—so winners scale, losers get fixed, and your pipeline grows.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
                  Map My 90‑Day Rollout
                </Button>
                <Button href="/work" variant="outline" size="lg" className="border-mp-white text-mp-white hover:bg-mp-gold/10">
                  View Case Studies
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, i) => {
                const Icon = p.icon
                return (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Card className="h-full">
                      <CardHeader className="text-center">
                        <div className="w-14 h-14 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-7 h-7 text-mp-gold" />
                        </div>
                        <CardTitle className="text-lg">{p.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-mp-gray text-sm text-center">{p.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl font-bold mb-4">Architecture</h2>
                <p className="text-mp-gray-light mb-6">Built on proven, scalable components for reliability and speed.</p>
                <ul className="space-y-3">
                  {architecture.map((a, i) => (
                    <li key={i} className="flex items-start">
                      <ShieldCheck className="w-5 h-5 text-mp-gold mr-3 mt-0.5" />
                      <span className="text-mp-gray-light">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Card className="bg-mp-black border-mp-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl">System Flow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-mp-gray-300 text-sm">
                      {workflow.map((w) => (
                        <div key={w.step} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-mp-gold text-mp-black font-bold mr-3">
                            {w.step[0]}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{w.step}</div>
                            <div>{w.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-display text-3xl font-bold text-white mb-8 text-center">Engagement Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{p.name}</span>
                        <span className="text-mp-gold text-lg font-bold">{p.price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {p.bullets.map((b) => (
                          <li key={b} className="flex items-start text-sm">
                            <Sparkles className="w-4 h-4 text-mp-gold mr-2 mt-0.5" /> {b}
                          </li>
                        ))}
                      </ul>
                      <Button href="/book" className="w-full group">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee + CTA */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="mb-6 text-mp-gray-200">
                <strong>60‑Day Pilot.</strong> If we miss the agreed leading indicators, we fix it or you don’t renew.
              </div>
              <h2 className="text-display text-3xl font-bold mb-6">Run Social + Web as One Engine</h2>
              <p className="text-mp-gray-light mb-8">
                Book a consult to map your rollout. We’ll stand up the engine, connect your platforms,
                and drive content that converts into booked business.
              </p>
              <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Map My 90‑Day Rollout</Button>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


