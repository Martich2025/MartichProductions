'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Camera, Send, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const Ecosystem = () => {
  const phases = [
    {
      icon: Calendar,
      title: 'Plan',
      desc: 'Brand voice, content OS, 12‑month roadmap, hooks, and calendars.'
    },
    {
      icon: Camera,
      title: 'Produce',
      desc: 'Cinematic filming, photography, aerial, and on‑brand edits.'
    },
    {
      icon: Send,
      title: 'Publish',
      desc: 'Best‑time posting, DM keyword flows, site pages and tracked CTAs.'
    },
    {
      icon: BarChart3,
      title: 'Perform',
      desc: 'Dashboards, A/B hooks, cadence tuning, quarterly strategy.'
    },
  ]

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Plan • Produce • Publish
          </h2>
          <p className="text-base sm:text-lg text-mp-gray-light">Simple and measurable. We run the engine; you run the company.</p>
        </motion.div>

        {/* Offerings band: Film, Photography, Web, Social */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8" aria-label="Our offerings">
          {[
            { title: 'Film', desc: 'Hero film, reels, aerial', href: '/services' },
            { title: 'Photography', desc: 'Brand + property', href: '/services' },
            { title: 'Web', desc: 'Conversion-first pages', href: '/services/social-web-engine' },
            { title: 'Social', desc: 'Calendar + best-time', href: '/services/social-web-engine' },
          ].map((o, i) => (
            <motion.div key={o.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <a href={o.href} className="block p-3 sm:p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40 text-center hover:border-mp-gold">
                <div className="text-sm font-semibold text-white">{o.title}</div>
                <div className="text-xs text-mp-gray-400">{o.desc}</div>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {phases.slice(0,3).map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-14 h-14 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-mp-gold" />
                    </div>
                    <div className="text-lg font-semibold text-white mb-2">{p.title}</div>
                    <p className="text-sm text-mp-gray">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { Ecosystem }


