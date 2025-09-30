'use client'

import React from 'react'
import { Home, Video, Drone, Edit, Share2, CheckCircle, ArrowRight, Star, Users, Clock, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function RealtorsPage() {
  const services = [
    {
      icon: Home,
      title: 'Luxury Property Tours',
      description: 'Cinematic property tours that showcase every detail and create emotional connections with potential buyers.',
      features: [
        'Interior & exterior tours',
        'Lifestyle staging',
        'Neighborhood highlights',
        'Virtual staging integration'
      ]
    },
    {
      icon: Video,
      title: 'Marketing Videos',
      description: 'Compelling marketing content that sells properties faster and for higher prices.',
      features: [
        'Property highlight reels',
        'Agent branding videos',
        'Neighborhood showcases',
        'Client testimonial videos'
      ]
    },
    {
      icon: Drone,
      title: 'Aerial Property Shots',
      description: 'Breathtaking aerial cinematography that captures the full scope and setting of luxury properties.',
      features: [
        'Property overview aerials',
        'Neighborhood context shots',
        'Landscape & views',
        'Sunset/sunrise captures'
      ]
    },
    {
      icon: Share2,
      title: 'Social Media Content',
      description: 'Platform-optimized content that drives engagement and generates qualified leads.',
      features: [
        'Instagram Reels & Stories',
        'Facebook marketing videos',
        'TikTok property content',
        'YouTube channel management'
      ]
    }
  ]

  const results = [
    {
      metric: '340%',
      label: 'Average Increase in Views',
      description: 'Properties with our videos receive significantly more online attention'
    },
    {
      metric: '45%',
      label: 'Faster Sale Time',
      description: 'Properties sell faster when marketed with professional video content'
    },
    {
      metric: '$127K',
      label: 'Average Price Increase',
      description: 'Properties with video marketing sell for higher prices'
    },
    {
      metric: '78%',
      label: 'More Qualified Leads',
      description: 'Video content attracts more serious, qualified buyers'
    }
  ]

  const pricing = [
    {
      name: 'Single Property',
      price: '$5,000',
      description: 'Perfect for individual luxury listings',
      features: [
        '1-2 day production',
        'Property tour video',
        'Aerial shots included',
        'Social media clips',
        'Basic editing & color grading',
        '30-day revision period'
      ]
    },
    {
      name: 'Agent Package',
      price: '$15,000',
      description: 'Ideal for active luxury agents',
      features: [
        '3-5 properties',
        'Agent branding video',
        'Neighborhood showcase',
        'Social media content',
        'Advanced editing & effects',
        '60-day revision period'
      ]
    },
    {
      name: 'Brokerage Package',
      price: '$50,000+',
      description: 'Complete marketing solution for luxury brokerages',
      features: [
        'Unlimited properties',
        'Team branding content',
        'Market area showcases',
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
                Real Estate Video Marketing
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                High-end property tours and marketing content that sells luxury listings 
                faster and for higher prices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold group"
                >
                  Book a Free Consult
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  href="/work?filter=realtors" 
                  variant="outline" 
                  size="lg"
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Real Estate Work
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
                Our video marketing consistently delivers measurable results for luxury real estate professionals.
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
                Our Real Estate Services
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                We specialize in creating compelling content that showcases luxury properties 
                and attracts qualified buyers.
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
                Choose the package that best fits your real estate business needs.
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
                  <Card className={`h-full ${package_.name === 'Agent Package' ? 'ring-2 ring-mp-gold' : ''}`}>
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
                        className={`w-full ${package_.name === 'Agent Package' ? 'bg-mp-gold text-mp-black hover:bg-mp-gold-dark' : ''}`}
                        variant={package_.name === 'Agent Package' ? 'default' : 'outline'}
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
                Ready to Sell More Properties?
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Let's discuss how our video marketing can help you sell luxury properties 
                faster and for higher prices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold group"
                >
                  Book a Free Consult
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  href="/work?filter=realtors" 
                  variant="outline" 
                  size="lg"
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Real Estate Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
