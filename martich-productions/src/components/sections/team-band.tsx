'use client'

import React from 'react'
import { motion } from 'framer-motion'

const TeamBand = () => {
  return (
    <section className="py-10 sm:py-12 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-mp-gray-800 bg-mp-black/40 p-4 sm:p-6"
          aria-label="Your producers"
        >
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-wide text-mp-gray-400 mb-1">You’ll work with</div>
            <div className="text-sm sm:text-base text-mp-gray-200">
              <span className="text-mp-gold font-semibold">Mark</span> (Director) &nbsp;•&nbsp; <span className="text-mp-gold font-semibold">Krystal</span> (Producer)
            </div>
            <div className="text-[12px] text-mp-gray-500 mt-1">Cinematic film + photography • conversion-first web • social that ships</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { TeamBand }


