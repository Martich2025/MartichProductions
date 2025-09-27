'use client'

import React from 'react'
import { motion } from 'framer-motion'

const MicroFAQ = () => {
  const faqs = [
    { q: 'What do I get?', a: 'A simple 90‑day plan + a free mapping call to lock film, photo, web, and social.' },
    { q: 'How long does this take?', a: '90 seconds to check. The call is 20 minutes. We can start right away.' },
    { q: 'What’s included?', a: 'Cinematic film + photography, conversion‑first web, and best‑time social publishing.' },
  ]
  return (
    <section className="py-10 sm:py-12 bg-mp-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {faqs.map((f, i) => (
            <motion.div key={f.q} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-mp-gray-800 bg-mp-black/40 p-3 sm:p-4">
              <div className="text-sm font-semibold text-white mb-1">{f.q}</div>
              <div className="text-xs text-mp-gray-400">{f.a}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { MicroFAQ }


