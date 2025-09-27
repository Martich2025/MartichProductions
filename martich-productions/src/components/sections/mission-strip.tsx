'use client'

import React from 'react'
import { motion } from 'framer-motion'

const MissionStrip = () => {
  return (
    <section className="py-6 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="rounded-xl border border-mp-gray-800 bg-mp-black/40 p-3 sm:p-4 text-center"
          aria-label="Our mission"
        >
          <p className="text-sm sm:text-base text-mp-gray-200">
            One partner to run the whole engine—cinematic film + photography, conversion‑first web, and best‑time social—measured in booked business.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export { MissionStrip }


