'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { trackCTAClick, analytics } from '@/lib/analytics'
import { ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  const [showBg, setShowBg] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowBg(true), 50)
    return () => clearTimeout(t)
  }, [])
  const [subCopy, setSubCopy] = useState('One studio to run the whole engine—cinematic films, conversion‑first pages, and best‑time publishing—so attention turns into booked business while you run the company.')

  // A/B test subheadline (A|B)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let v = sessionStorage.getItem('hero_sub_v') as 'A' | 'B' | null
    if (!v) {
      v = Math.random() < 0.5 ? 'A' : 'B'
      sessionStorage.setItem('hero_sub_v', v)
    }
    if (v === 'B') {
      setSubCopy('Social + web as one revenue engine—hero film, proof, and best‑time publishing that turns attention into booked business while you run the company.')
    }
    analytics.customEvent('hero_sub_variant', { variant: v })
  }, [])

  // Trust metrics moved to StatsBand below hero to avoid duplication

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden pt-20 md:pt-28 pb-16">
      {/* Cinematic Video Background with reduced-motion fallback */}
      <div className="absolute inset-0 z-0">
        <div className="hidden motion-safe:block">
          {showBg && (
          <iframe
            title="Cinematic background reel"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '100vw', height: '56.25vw', minWidth: '177.78vh', minHeight: '100vh' }}
            src="https://player.vimeo.com/video/1108471932?autoplay=1&muted=1&loop=1&background=1&controls=0&byline=0&title=0&portrait=0&dnt=1"
            frameBorder={0}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            loading="lazy"
          />)}
        </div>
        <div className="block motion-safe:hidden">
          <Image src="/placeholder.svg" alt="Background placeholder (video disabled)" fill priority sizes="100vw" className="object-cover" />
        </div>

        {/* Sophisticated Overlay */}
        <div className="hero-overlay" />
        
        {/* Additional gradient for better text contrast */}
        <div className="absolute inset-0 bg-canvas/40 z-[3]" />

        {/* Bottom fade to black to soften cutoff */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 z-[4] bg-gradient-to-b from-transparent to-black" />
      </div>


      {/* Content */}
      <div className="relative z-[10] container mx-auto px-4 sm:px-6 lg:px-8 text-center" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-brand-wash border border-brand/20 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium text-brand">
              Texas's Premier Media Production Studio
            </span>
          </motion.div>

          {/* Main Headline - Cinematic Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-cinematic font-display text-primary mb-6"
          >
            <span className="block">One Partner.</span>
            <span className="block text-brand">Your Entire Brand Engine.</span>
          </motion.h1>

          {/* Subheadline - Enhanced Typography */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-hero text-primary mb-8 max-w-4xl mx-auto leading-relaxed font-light"
          >
            {subCopy}
          </motion.p>

          {/* Trust Band (thin, non-intrusive) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            aria-label="Trusted by"
            className="mb-5"
          >
            <div className="text-[11px] tracking-wider uppercase text-tertiary mb-2">Trusted by teams across Texas</div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-90">
              <Image src="/client-logos/espn-logo.png" alt="ESPN" width={92} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/miss-usa-logo.png" alt="Miss USA" width={92} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/horseshoe-bay-logo.png" alt="Horseshoe Bay" width={120} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/loraloma-logo.png" alt="Loraloma" width={110} height={24} className="h-6 w-auto" />
              <Image src="/client-logos/moreland-properties-logo.png" alt="Moreland Properties" width={150} height={24} className="h-6 w-auto" />
            </div>
          </motion.div>

          {/* Trust logos removed to avoid duplication with StatsBand */}

          {/* Helper line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-center mb-3"
          >
            <div className="text-[12px] text-tertiary" aria-hidden="true">Start here: 90‑second check, no commitment</div>
          </motion.div>

          {/* CTA Buttons - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8"
          >
            <Button 
              href="/engine/map" 
              size="lg" 
              aria-label="Start the Map My Growth Engine"
              onClick={() => trackCTAClick('Map My Growth Engine', 'hero_primary')}
              className="px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold w-full sm:w-auto min-h-[56px]"
            >
              Map My Growth Engine
              <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
            </Button>
            <Button 
              href="/work" 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/80 text-primary hover:bg-brand-wash hover:text-primary px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold backdrop-blur-sm w-full sm:w-auto min-h-[56px]"
            >
              See Client Outcomes
            </Button>
          </motion.div>

          {/* Trust band moved to dedicated StatsBand component */}
        </motion.div>
      </div>

      
    </section>
  )
}

export { Hero }
