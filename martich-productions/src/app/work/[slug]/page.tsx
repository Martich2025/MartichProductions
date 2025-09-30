'use client'

import React from 'react'
import Script from 'next/script'
import { generateVideoObjectSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { analytics } from '@/lib/analytics'
import { Play, ArrowLeft, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import Link from 'next/link'

export default function CaseStudyPage() {
  // This would normally fetch data based on the slug
  // For now, we'll use placeholder data
  const caseStudy = {
    title: 'Luxury Resort Brand Story',
    client: 'The Grand Resort',
    category: 'resorts',
    problem: 'The Grand Resort needed to differentiate itself in a crowded luxury market and increase bookings during the off-season.',
    approach: 'We created a cinematic brand story that showcased the resort\'s unique amenities, stunning location, and exceptional service through emotional storytelling.',
    execution: 'Our team spent 5 days on location, capturing the resort\'s beauty through drone aerials, intimate guest moments, and behind-the-scenes service excellence. We used professional lighting and state-of-the-art equipment to ensure every shot was perfect.',
    results: [
      { metric: '340%', label: 'Increase in Bookings' },
      { metric: '2.5M', label: 'Video Views' },
      { metric: '12.5%', label: 'Engagement Rate' },
      { metric: '$2.3M', label: 'Revenue Generated' }
    ],
    quote: 'Martich Productions transformed our marketing with their cinematic storytelling. The results speak for themselves - 340% increase in bookings and our brand recognition has never been stronger.',
    quoteAuthor: 'Sarah Johnson',
    quoteRole: 'Marketing Director',
    videoUrl: '/placeholder-video.mp4',
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg', '/placeholder-3.jpg'],
    publishedAt: '2024-01-15',
    readTime: '8 min read'
  }

  return (
    <MainLayout>
      <Script id="case-video-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(generateVideoObjectSchema({
          name: caseStudy.title,
          description: caseStudy.problem,
          thumbnailUrl: caseStudy.images[0] || '/placeholder.svg',
          contentUrl: caseStudy.videoUrl,
          uploadDate: caseStudy.publishedAt,
        }))}
      </Script>
      <Script id="case-breadcrumb-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Work', url: '/work' },
          { name: caseStudy.title, url: `/work/${caseStudy.title.toLowerCase().replace(/\s+/g,'-')}` },
        ]))}
      </Script>
      <Script id="case-article-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: caseStudy.title,
          datePublished: caseStudy.publishedAt,
          author: { '@type': 'Organization', name: 'Martich Productions' },
          publisher: { '@type': 'Organization', name: 'Martich Productions' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': typeof window !== 'undefined' ? window.location.href : '' },
          description: caseStudy.problem,
        })}
      </Script>
      <div className="min-h-screen bg-mp-black">
        {/* Back Button */}
        <section className="py-8 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/work" className="inline-flex items-center text-mp-gold hover:text-mp-gold-dark transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Work
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-mp-gold/10 text-mp-gold text-sm font-medium mb-6">
                {caseStudy.category.charAt(0).toUpperCase() + caseStudy.category.slice(1)}
              </div>
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                {caseStudy.client}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-mp-gray-light">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(caseStudy.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {caseStudy.readTime}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="aspect-video bg-mp-charcoal rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-mp-gold/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <Play className="w-8 h-8 text-mp-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-mp-white">
                  <p className="text-sm">Click to play case study video</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
              <h2 className="text-display text-3xl font-bold text-white mb-6">
                  The Challenge
                </h2>
                <p className="text-xl text-mp-gray leading-relaxed">
                  {caseStudy.problem}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
              <h2 className="text-display text-3xl font-bold text-white mb-6">
                  Our Approach
                </h2>
                <p className="text-xl text-mp-gray leading-relaxed">
                  {caseStudy.approach}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Execution Section */}
        <section className="py-20 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
              <h2 className="text-display text-3xl font-bold text-white mb-6">
                  The Execution
                </h2>
                <p className="text-xl text-mp-gray leading-relaxed">
                  {caseStudy.execution}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
            <h2 className="text-display text-3xl font-bold text-white mb-16 text-center">
                The Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {caseStudy.results.map((result, index) => (
                  <motion.div
                    key={result.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-mp-gold mb-2">
                      {result.metric}
                    </div>
                    <div className="text-mp-gray">
                      {result.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <blockquote className="text-2xl lg:text-3xl font-medium text-mp-white mb-8 leading-relaxed">
                "{caseStudy.quote}"
              </blockquote>
              <div className="text-mp-gold font-semibold text-lg">
                {caseStudy.quoteAuthor}
              </div>
              <div className="text-mp-gray-light">
                {caseStudy.quoteRole}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-xl text-mp-gray mb-8">
                Let's discuss your project and see how we can help you achieve 
                similar results with our cinematic storytelling approach.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  onClick={() => analytics.customEvent('work_case_cta_book', { case: caseStudy.title })}
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 shadow-gold group"
                >
                  Book a Free Consult
                  <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  href="/work" 
                  variant="outline" 
                  size="lg"
                  onClick={() => analytics.customEvent('work_case_cta_more_work', { case: caseStudy.title })}
                >
                  View More Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Next 7 Days Plan */}
        <section className="py-12 bg-mp-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto p-4 rounded-xl border border-mp-gray-800 bg-mp-black/40">
              <h3 className="text-xl font-semibold text-white mb-3">Next 7 Days</h3>
              <ul className="text-mp-gray-300 text-sm space-y-1">
                <li>• Align on hooks, story beats, and shotlist</li>
                <li>• Lock locations, talent, and schedule</li>
                <li>• Capture hero film + micro verticals</li>
                <li>• Ship conversion updates and tracked CTAs</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
