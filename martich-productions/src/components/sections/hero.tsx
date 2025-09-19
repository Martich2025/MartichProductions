'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Trust metrics moved to StatsBand below hero to avoid duplication

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden pt-20 md:pt-28 pb-16">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Vimeo Background */}
        <iframe
          title="vimeo-player"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '100vw', height: '56.25vw', minWidth: '177.78vh', minHeight: '100vh' }}
          src="https://player.vimeo.com/video/1108471932?autoplay=1&muted=1&loop=1&background=1&controls=0&byline=0&title=0&portrait=0&dnt=1"
          frameBorder={0}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          onLoad={() => setIsVideoLoaded(true)}
        />

        {/* Sophisticated Overlay */}
        <div className="hero-overlay" />
        
        {/* Additional gradient for better text contrast */}
        <div className="absolute inset-0 bg-mp-black/40 z-[3]" />

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
            className="inline-flex items-center space-x-2 bg-mp-gold/10 border border-mp-gold/20 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-mp-gold" />
            <span className="text-sm font-medium text-mp-gold">
              Texas's Premier Media Production Studio
            </span>
          </motion.div>

          {/* Main Headline - Cinematic Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-cinematic font-display text-mp-white mb-6"
          >
            <span className="block">One Partner.</span>
            <span className="block text-mp-gold">Your Entire Brand Engine.</span>
          </motion.h1>

          {/* Subheadline - Enhanced Typography */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-hero text-mp-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed font-light"
          >
            We plan, shoot, edit, and publish your content engine—video, site, and social—so results compound while you run the business.
          </motion.p>

          {/* CTA Buttons - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8"
          >
            <Button 
              href="/book" 
              size="lg" 
              className="px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold w-full sm:w-auto min-h-[56px]"
            >
              Map My Growth Engine
              <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
            </Button>
            <Button 
              href="/work" 
              variant="outline" 
              size="lg"
              className="border-2 border-mp-white/80 text-mp-white hover:bg-mp-gold/10 hover:text-mp-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold backdrop-blur-sm w-full sm:w-auto min-h-[56px]"
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
