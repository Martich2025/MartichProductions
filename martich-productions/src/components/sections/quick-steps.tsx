'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Calendar } from 'lucide-react'

const QuickSteps = () => {
  const steps = [
    { icon: Search, title: 'Check', desc: 'Drop your site/socials. We’ll check and show easy wins.' },
    { icon: FileText, title: 'Mini Plan', desc: '90‑day outline with hooks, cadence, and fixes—clear and simple.' },
    { icon: Calendar, title: 'Book a Free Call', desc: 'Pick a time to map it with Mark or Krystal.' },
  ]
  return (
    <section className="py-8 sm:py-10 bg-mp-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" aria-label="How it works">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-mp-gray-800 bg-mp-black/40 p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-mp-gold/10 flex items-center justify-center"><Icon className="w-5 h-5 text-mp-gold" /></div>
                  <div>
                    <div className="text-sm font-semibold text-white">{s.title}</div>
                    <div className="text-xs text-mp-gray-400">{s.desc}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { QuickSteps }


