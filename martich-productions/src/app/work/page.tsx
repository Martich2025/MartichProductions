'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import Image from 'next/image'
import { Play, Filter, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MetricGrid, MetricItem } from '@/components/ui/metric-grid'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { generateBreadcrumbSchema } from '@/lib/seo'
import { StickyConsultBar } from '@/components/global/sticky-consult-bar'
import { analytics } from '@/lib/analytics'
import { trackCTAClick } from '@/lib/analytics'
import Link from 'next/link'

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [ctaText, setCtaText] = useState('View Case Study')

  // Read filter from query (?filter=)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const q = params.get('filter')
    if (q) setActiveFilter(q)
    // AB test CTA text
    let v = sessionStorage.getItem('work_cta_v') as 'A' | 'B' | null
    if (!v) {
      v = Math.random() < 0.5 ? 'A' : 'B'
      sessionStorage.setItem('work_cta_v', v)
    }
    if (v === 'B') setCtaText('See Results')
    analytics.customEvent('work_cta_variant', { variant: v })
  }, [])

  const caseStudies = [
    {
      id: 0,
      title: 'Austin Luxury Listing Launch',
      client: 'Bill Oosland',
      category: 'realtors',
      image: '/placeholder.svg',
      video: '/placeholder-realtor-video.mp4',
      description: 'Full-funnel listing launch: story film + 12 verticals + property page.',
      metrics: {
        views: '1.9M',
        engagement: '13.4%',
        leads: '+220%'
      },
      slug: 'bill-oosland'
    },
    {
      id: 1,
      title: 'Luxury Resort Brand Story',
      client: 'The Grand Resort',
      category: 'resorts',
      image: '/placeholder.svg',
      video: '/placeholder-resort-video.mp4',
      description: 'A cinematic brand story showcasing the resort\'s luxury amenities and stunning location.',
      metrics: {
        views: '2.5M',
        engagement: '12.5%',
        bookings: '+340%'
      },
      slug: 'luxury-resort-brand-story'
    },
    {
      id: 2,
      title: 'Real Estate Property Tour',
      client: 'Elite Properties',
      category: 'realtors',
      image: '/placeholder.svg',
      video: '/placeholder-realtor-video.mp4',
      description: 'A high-end property tour that sold the $2.5M listing in just 3 weeks.',
      metrics: {
        views: '850K',
        engagement: '8.2%',
        leads: '+180%'
      },
      slug: 'real-estate-property-tour'
    },
    {
      id: 3,
      title: 'Restaurant Experience',
      client: 'Bella Vista Restaurant',
      category: 'hospitality',
      image: '/placeholder.svg',
      video: '/placeholder-restaurant-video.mp4',
      description: 'A mouth-watering food story that increased reservations by 200%.',
      metrics: {
        views: '1.2M',
        engagement: '15.3%',
        reservations: '+200%'
      },
      slug: 'restaurant-experience'
    },
    {
      id: 4,
      title: 'Hotel Suite Showcase',
      client: 'The Plaza Hotel',
      category: 'hospitality',
      image: '/placeholder.svg',
      video: '/placeholder-hotel-video.mp4',
      description: 'An elegant suite tour that drove luxury bookings and brand recognition.',
      metrics: {
        views: '1.8M',
        engagement: '11.2%',
        bookings: '+280%'
      },
      slug: 'hotel-suite-showcase'
    },
    {
      id: 5,
      title: 'Luxury Home Listing',
      client: 'Prestige Realty',
      category: 'realtors',
      image: '/placeholder.svg',
      video: '/placeholder-mansion-video.mp4',
      description: 'A stunning mansion tour that sold for $4.2M in record time.',
      metrics: {
        views: '3.1M',
        engagement: '9.8%',
        leads: '+250%'
      },
      slug: 'luxury-home-listing'
    },
    {
      id: 7,
      title: 'Timeless Wedding Film',
      client: 'Sophia & James',
      category: 'weddings-events',
      image: '/placeholder-wedding.jpg',
      video: '/placeholder-wedding-video.mp4',
      description: 'An elegant, story-driven wedding film capturing the day with cinematic polish.',
      metrics: {
        views: '1.1M',
        engagement: '14.1%',
        inquiries: '+220%'
      },
      slug: 'timeless-wedding-film'
    },
    {
      id: 6,
      title: 'Spa & Wellness Retreat',
      client: 'Serenity Spa Resort',
      category: 'resorts',
      image: '/placeholder.svg',
      video: '/placeholder-spa-video.mp4',
      description: 'A tranquil spa experience that increased bookings by 150%.',
      metrics: {
        views: '950K',
        engagement: '13.7%',
        bookings: '+150%'
      },
      slug: 'spa-wellness-retreat'
    }
  ]

  const filters = [
    { value: 'all', label: 'All Work' },
    { value: 'resorts', label: 'Resorts' },
    { value: 'realtors', label: 'Realtors' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'weddings-events', label: 'Weddings & Events' }
  ]

  const filteredCaseStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === activeFilter)

  const labelMap: Record<string, string> = {
    views: 'Views',
    engagement: 'Engagement',
    bookings: 'Bookings',
    leads: 'Leads',
    reservations: 'Bookings'
  }

  return (
    <MainLayout>
      <Script id="work-breadcrumb-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Work', url: '/work' },
        ]))}
      </Script>
      <div className="min-h-screen bg-mp-black">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Our Work
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                These outcomes were produced by a single, integrated team—from concept to publish to site conversion. That’s why the numbers compound.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-6 sm:py-8 bg-mp-black border-b border-mp-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-mp-gray">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter by:</span>
              </div>
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    activeFilter === filter.value
                      ? 'bg-mp-gold text-mp-black'
                      : 'bg-mp-charcoal text-mp-gray-300 hover:bg-mp-gray-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Nudge: Need help choosing? */}
        <section className="py-6 sm:py-8 bg-mp-black border-y border-mp-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-mp-charcoal/60 rounded-lg p-4">
              <p className="text-sm text-mp-gray-300">Not sure which direction fits? Map your engine in 90 seconds and get a mini plan.</p>
              <Link href="/engine/map" className="text-mp-gold hover:text-mp-gold-600 text-sm font-semibold">Map my engine →</Link>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-12 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group h-full"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    {/* Video/Image Thumbnail */}
                    <div className="relative aspect-video bg-mp-charcoal overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-mp-black/80 to-transparent z-10" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 bg-mp-gold/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Play className="w-6 h-6 text-mp-black ml-1" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-30">
                        <span className="bg-mp-gold text-mp-black px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {study.category}
                        </span>
                      </div>

                      {/* Optimized Thumbnail */}
                      <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={index < 2}
                      />
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-display text-xl font-semibold text-white mb-2">
                        {study.title}
                      </h3>
                      <p className="text-mp-gray text-sm mb-4">
                        {study.client}
                      </p>
                      <p className="text-mp-gray mb-6">
                        {study.description}
                      </p>

                      {/* Metrics */}
                      <MetricGrid
                        items={Object.entries(study.metrics).map(([key, value]) => ({
                          key,
                          value: String(value),
                          label: labelMap[key] || key,
                        })) as MetricItem[]}
                        className="mb-6"
                      />

                      {/* CTA */}
                      <Button 
                        variant="outline" 
                        className="w-full mt-auto group"
                        onClick={() => { trackCTAClick(ctaText,'work_grid_card'); analytics.customEvent('work_cta_click', { variant: ctaText }) }}
                        href={`/work/${study.slug}`}
                      >
                        {ctaText}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCaseStudies.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-mp-gray text-lg">
                  No case studies found for the selected filter.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Let's discuss your project and see how we can help you achieve 
                similar results with our cinematic storytelling approach.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  onClick={() => trackCTAClick('Book a Free Consult','work_footer_primary')}
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 shadow-gold"
                >
                  Book a Free Consult
                </Button>
                <Button 
                  href="/services" 
                  variant="outline" 
                  size="lg"
                  onClick={() => trackCTAClick('View Our Services','work_footer_secondary')}
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Our Services
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <StickyConsultBar />
    </MainLayout>
  )
}
