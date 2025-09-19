'use client'

import React, { useState } from 'react'
import { Play, ArrowRight, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MetricGrid, MetricItem } from '@/components/ui/metric-grid'
import { Card, CardContent } from '@/components/ui/card'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const WorkShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()

  const featuredWork = [
    {
      id: 3,
      title: 'Meet Bill Oosland – Culinary Director at Horseshoe Bay Resort',
      client: 'Horseshoe Bay Resort',
      category: 'Hospitality',
      image: '/placeholder.svg',
      vimeo: 'https://player.vimeo.com/video/1109206034?title=0&byline=0&portrait=0',
      description: 'A behind-the-scenes look at culinary leadership at a premier Texas resort—craft, team, and guest experience.',
      metrics: {
        views: '1.2M',
        engagement: '15.3%',
        reservations: '+200%'
      }
    },
    {
      id: 1,
      title: 'Luxury Resort Brand Story',
      client: 'The Grand Resort',
      category: 'Resorts',
      image: '/placeholder.svg',
      video: '/placeholder-resort-video.mp4',
      description: 'A cinematic brand story showcasing the resort\'s luxury amenities and stunning location.',
      metrics: {
        views: '2.5M',
        engagement: '12.5%',
        bookings: '+340%'
      }
    },
    {
      id: 2,
      title: 'Real Estate Property Tour',
      client: 'Elite Properties',
      category: 'Realtors',
      image: '/placeholder.svg',
      video: '/placeholder-realtor-video.mp4',
      description: 'A high-end property tour that sold the $2.5M listing in just 3 weeks.',
      metrics: {
        views: '850K',
        engagement: '8.2%',
        leads: '+180%'
      }
    }
  ]

  const categories = ['All', 'Resorts', 'Realtors', 'Hospitality', 'Weddings & Events']

  return (
    <section className="py-16 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: headerVisible ? 1 : 0, y: headerVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-cinematic font-display text-white mb-8">Featured Work</h2>
          <p className="text-hero text-mp-gray-700 max-w-4xl mx-auto mb-12 font-light">
            See how we've helped luxury brands tell their story and drive real business results 
            through cinematic content.
          </p>

          {/* Enhanced Category Filter */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-mp-gold text-mp-black'
                    : 'bg-mp-charcoal text-mp-gray-300 hover:bg-mp-gray-800 border border-mp-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Work Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16">
          {featuredWork
            .filter(work => activeCategory === 'All' || work.category === activeCategory)
            .map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className="group overflow-hidden bg-mp-charcoal border border-mp-gray-800 h-full flex flex-col">
                {/* Video/Image Thumbnail */}
                <div className="relative aspect-video bg-mp-charcoal overflow-hidden">
                  {('vimeo' in work) ? null : (
                    <div className="absolute inset-0 bg-mp-black/40 z-10" />
                  )}
                  
                  {/* Play Button with Enhanced Animation */}
                  {('vimeo' in work) ? null : (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <motion.div 
                        className="w-20 h-20 bg-mp-gold/95 rounded-full flex items-center justify-center shadow-gold-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-8 h-8 text-mp-black ml-1" />
                      </motion.div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-30">
                    <span className="bg-mp-gold/95 text-mp-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {work.category}
                    </span>
                  </div>

                  {/* Social Actions */}
                  <div className="absolute top-6 right-6 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-mp-black/50 backdrop-blur-sm rounded-full hover:bg-mp-gold/20 transition-colors">
                      <Heart className="w-4 h-4 text-mp-white" />
                    </button>
                    <button className="p-2 bg-mp-black/50 backdrop-blur-sm rounded-full hover:bg-mp-gold/20 transition-colors">
                      <Share2 className="w-4 h-4 text-mp-white" />
                    </button>
                  </div>

                  {/* Thumbnail or Vimeo embed */}
                  {('vimeo' in work) ? (
                    <iframe
                      title={work.title}
                      className="absolute inset-0 w-full h-full"
                      src={`${(work as unknown as { vimeo: string }).vimeo}&autoplay=0&muted=1`}
                      frameBorder={0}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={index < 2}
                    />
                  )}
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-display text-2xl font-bold text-white mb-2 group-hover:text-mp-gold transition-colors duration-200">
                    {work.title}
                  </h3>
                  <p className="text-mp-gold font-semibold text-sm mb-4">
                    {work.client}
                  </p>
                  <p className="text-mp-gray-300 mb-6 leading-relaxed line-clamp-3">
                    {work.description}
                  </p>

                  <MetricGrid
                    items={Object.entries(work.metrics).map(([key, value]) => ({
                      key,
                      value: String(value),
                      label: key,
                    })) as MetricItem[]}
                    className="mb-6"
                  />

                  {/* Enhanced CTA */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-auto border-2 border-mp-gold text-mp-gold hover:bg-mp-gold hover:text-mp-black font-semibold py-3"
                    href={`/work/${work.id}`}
                  >
                    View Case Study
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative bg-mp-charcoal rounded-3xl p-12 lg:p-16 text-mp-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              
            </div>
            
            <div className="relative z-10">
              <h3 className="text-cinematic font-display mb-8">
                <span className="block">Ready to Create</span>
                <span className="block text-mp-gold">Your Success Story?</span>
              </h3>
              <p className="text-hero text-mp-gray-200 mb-12 max-w-3xl mx-auto font-light">
                Let's discuss your project and see how we can help you achieve 
                similar results with our cinematic storytelling approach.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <Button 
                  href="/book" 
                  size="lg" 
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 px-10 py-4 text-lg font-bold"
                >
                  Map My 90‑Day Rollout
                </Button>
                <Button 
                  href="/work" 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-mp-white/80 text-mp-white hover:bg-mp-gold/10 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  View All Work
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { WorkShowcase }
