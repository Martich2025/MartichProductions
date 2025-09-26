'use client'

import React from 'react'
import { Utensils, Video, Drone, Share2, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { StickyConsultBar } from '@/components/global/sticky-consult-bar'
import { trackCTAClick } from '@/lib/analytics'

export default function HospitalityPage() {
  const services = [
    {
      icon: Utensils,
      title: 'Restaurant Experience Videos',
      description: 'Mouth-watering content that showcases your culinary offerings and creates desire for dining experiences.',
      features: [
        'Food preparation videos',
        'Chef interviews & stories',
        'Dining atmosphere captures',
        'Menu item highlights'
      ]
    },
    {
      icon: Video,
      title: 'Hotel & Venue Tours',
      description: 'Compelling tours that highlight your property\'s unique features and guest amenities.',
      features: [
        'Suite & room showcases',
        'Amenity highlights',
        'Event space tours',
        'Guest experience documentation'
      ]
    },
    {
      icon: Drone,
      title: 'Aerial Hospitality Shots',
      description: 'Breathtaking aerial cinematography that captures the full scope and setting of your property.',
      features: [
        'Property overview aerials',
        'Surrounding area context',
        'Architectural highlights',
        'Sunset/sunrise captures'
      ]
    },
    {
      icon: Share2,
      title: 'Social Media Content',
      description: 'Platform-optimized content that drives reservations and enhances guest engagement.',
      features: [
        'Instagram Reels & Stories',
        'Facebook marketing videos',
        'TikTok content creation',
        'YouTube channel management'
      ]
    }
  ]

  const results = [
    {
      metric: '200%',
      label: 'Average Increase in Reservations',
      description: 'Restaurants see significant booking increases with video marketing'
    },
    {
      metric: '150%',
      label: 'Social Media Engagement',
      description: 'Hospitality content drives higher engagement rates'
    },
    {
      metric: '85%',
      label: 'Guest Satisfaction',
      description: 'Video content sets proper expectations and improves guest experience'
    },
    {
      metric: '300%',
      label: 'Brand Recognition',
      description: 'Professional content significantly boosts brand awareness'
    }
  ]

  const pricing = [
    {
      name: 'Restaurant Package',
      price: '$10,000',
      description: 'Perfect for individual restaurants or cafes',
      features: [
        '1-2 day production',
        'Food & atmosphere videos',
        'Chef interview included',
        'Social media clips',
        'Basic editing & color grading',
        '30-day revision period'
      ]
    },
    {
      name: 'Hotel Package',
      price: '$25,000',
      description: 'Comprehensive package for hotels and venues',
      features: [
        '2-3 day production',
        'Room & amenity tours',
        'Aerial shots included',
        'Guest testimonial videos',
        'Advanced editing & effects',
        '60-day revision period'
      ]
    },
    {
      name: 'Hospitality Group',
      price: '$75,000+',
      description: 'Complete solution for hospitality groups',
      features: [
        '5+ day production',
        'Multiple property coverage',
        'Brand storytelling content',
        'Ongoing content strategy',
        'Cinema-grade production',
        '90-day revision period'
      ]
    }
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        {/* Hero Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Hospitality Marketing
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                Compelling content that drives reservations and enhances the guest 
                experience for restaurants, hotels, and venues.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  onClick={() => trackCTAClick('Book a Free Consult','hospitality_hero_primary')}
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 shadow-gold group"
                >
                  Book a Free Consult
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  href="/work?filter=hospitality" 
                  variant="outline" 
                  size="lg"
                  onClick={() => trackCTAClick('View Hospitality Work','hospitality_hero_secondary')}
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Hospitality Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-mp-gray-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Proven Results
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                Our hospitality content consistently drives measurable results for restaurants, 
                hotels, and venues.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-mp-gold mb-2">
                    {result.metric}
                  </div>
                  <div className="text-lg font-semibold text-white mb-2">
                    {result.label}
                  </div>
                  <div className="text-sm text-mp-gray">
                    {result.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Our Hospitality Services
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                We specialize in creating compelling content that showcases your hospitality 
                offerings and drives guest engagement.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-8">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mb-6">
                          <Icon className="w-8 h-8 text-mp-gold" />
                        </div>
                        <h3 className="text-display text-xl font-semibold text-white mb-4">
                          {service.title}
                        </h3>
                        <p className="text-mp-gray mb-6">
                          {service.description}
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-mp-gold mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-mp-gray">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-mp-gray-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Investment Options
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                Choose the package that best fits your hospitality business needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricing.map((package_, index) => (
                <motion.div
                  key={package_.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full ${package_.name === 'Hotel Package' ? 'ring-2 ring-mp-gold' : ''}`}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{package_.name}</CardTitle>
                      <div className="text-3xl font-bold text-mp-gold mb-2">
                        {package_.price}
                      </div>
                      <p className="text-mp-gray text-sm">
                        {package_.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {package_.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-mp-gold mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-mp-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        href="/book" 
                        onClick={() => trackCTAClick('Get Started','hospitality_pricing_cta')}
                        className={`w-full ${package_.name === 'Hotel Package' ? 'bg-mp-gold text-mp-black hover:bg-mp-gold-600' : ''}`}
                        variant={package_.name === 'Hotel Package' ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">
                Ready to Boost Your Hospitality Business?
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Let's discuss how our content can help you drive more reservations 
                and enhance your guest experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  onClick={() => trackCTAClick('Book a Free Consult','hospitality_footer_primary')}
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-600 shadow-gold group"
                >
                  Book a Free Consult
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  href="/work?filter=hospitality" 
                  variant="outline" 
                  size="lg"
                  onClick={() => trackCTAClick('View Hospitality Work','hospitality_footer_secondary')}
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Hospitality Work
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
