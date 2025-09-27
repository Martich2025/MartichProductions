'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Proof = () => {
  const metrics = [
    { value: '180–340%', label: 'More Qualified Leads (90 days)' },
    { value: '2–4×', label: 'Content Output per Shoot' },
    { value: '30–60%', label: 'Faster Time‑to‑Publish' },
  ]

  const spotlight = {
    title: 'Luxury Resort Brand Story',
    result: '+340% bookings',
    blurb: 'Plan → shoot → edit → publish in one loop. Landing pages + best‑time posting turned views into reservations.',
    href: '/work',
  }

  return (
    <section className="py-12 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-mp-gold mb-2">{m.value}</div>
                    <div className="text-sm text-mp-gray-300">{m.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Spotlight */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="text-xs uppercase tracking-wide text-mp-gray-400 mb-2">Spotlight</div>
                <h3 className="text-lg font-semibold text-white mb-1">{spotlight.title}</h3>
                <div className="text-mp-gold font-bold mb-3">{spotlight.result}</div>
                <p className="text-sm text-mp-gray-300 mb-4">{spotlight.blurb}</p>
                <Button href={spotlight.href} variant="outline" className="w-full group">
                  See Client Outcomes
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { Proof }


