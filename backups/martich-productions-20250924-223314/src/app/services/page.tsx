'use client'

import React from 'react'
import { Camera, Video, Drone, Edit, Share2, ArrowRight, CheckCircle, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function ServicesPage() {
  const services = [
    {
      id: 'resorts',
      title: 'Luxury Resorts',
      description: 'Cinematic storytelling that showcases your resort\'s unique amenities and creates an emotional connection with potential guests.',
      icon: Camera,
      features: [
        'Resort brand storytelling',
        'Amenity showcase videos',
        'Guest experience documentation',
        'Social media content creation',
        'Website video integration',
        'Drone aerial cinematography'
      ],
      priceRange: '$25,000 - $100,000+',
      href: '/services/resorts'
    },
    {
      id: 'realtors',
      title: 'Real Estate',
      description: 'High-end property tours and marketing content that sells luxury listings faster and for higher prices.',
      icon: Video,
      features: [
        'Luxury property tours',
        'Virtual staging integration',
        'Neighborhood showcase',
        'Agent branding content',
        'Social media marketing',
        'Drone property aerials'
      ],
      priceRange: '$5,000 - $50,000+',
      href: '/services/realtors'
    },
    {
      id: 'hospitality',
      title: 'Hospitality',
      description: 'Compelling content that drives reservations and enhances the guest experience for restaurants, hotels, and venues.',
      icon: Drone,
      features: [
        'Restaurant experience videos',
        'Hotel suite showcases',
        'Event documentation',
        'Food & beverage content',
        'Venue marketing materials',
        'Guest testimonial videos'
      ],
      priceRange: '$10,000 - $75,000+',
      href: '/services/hospitality'
    }
    ,
    {
      id: 'weddings-events',
      title: 'Weddings & Events',
      description: 'Elegant, story-driven coverage for weddings, galas, and corporate events with cinematic delivery.',
      icon: Share2,
      features: [
        'Full-day wedding coverage',
        'Highlight & full-ceremony films',
        'Multi-cam audio & speeches',
        'Same-day social edits',
        'Event recap films',
        'Photo add-on packages'
      ],
      priceRange: '$8,000 - $60,000+',
      href: '/services/weddings-events'
    }
    ,
    {
      id: 'social-web-engine',
      title: 'Social & Web Engine',
      description: 'AI-powered social + site management that turns content into revenue, end to end.',
      icon: Bot,
      features: [
        'Content OS + asset ingestion',
        'AI hooks/captions + best-time scheduling',
        'Auto-publish with DM keyword flows',
        'Site sync blocks + tracked CTAs',
        'Dashboards + A/B hooks',
        'Client portal + approvals (optional)'
      ],
      priceRange: '$5,000 - $25,000+/mo',
      href: '/services/social-web-engine'
    }
  ]

  const processSteps = [
    {
      icon: Camera,
      title: 'Pre-Production',
      description: 'Planning, storyboarding, and creative strategy development'
    },
    {
      icon: Video,
      title: 'Production',
      description: 'Professional filming with state-of-the-art equipment'
    },
    {
      icon: Edit,
      title: 'Post-Production',
      description: 'Professional editing, color grading, and sound design'
    },
    {
      icon: Share2,
      title: 'Delivery',
      description: 'Multi-format delivery optimized for all platforms'
    }
  ]

  const includedServices = [
    'Professional videography & photography',
    'Drone aerial cinematography',
    'Professional lighting & audio',
    'Post-production editing',
    'Color grading & sound design',
    'Multiple format delivery',
    'Social media optimization',
    'Performance tracking setup'
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
                Our Services
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                Don’t buy assets—hire the engine. Each service plugs into one flow from plan → shoot → edit → publish → measure, so every piece compounds into revenue.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                          <Icon className="w-8 h-8 text-mp-gold" />
                        </div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <p className="text-mp-gray">{service.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-mp-gold mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="text-center mb-6">
                          <div className="text-sm text-mp-gray mb-2">Starting from</div>
                          <div className="text-2xl font-bold text-mp-gold">{service.priceRange}</div>
                        </div>
                        <Button 
                          href={service.href} 
                          className="w-full group"
                        >
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
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
                Our Process
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                From concept to delivery, we follow a proven methodology that ensures 
                your content not only looks amazing but drives real business results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-mp-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-mp-gold" />
                    </div>
                    <h3 className="text-display text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-mp-gray">
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                  What's Included
                </h2>
                <p className="text-xl text-mp-gray mb-8">
                  Every project includes our full-service approach with professional 
                  equipment, expert crew, and comprehensive post-production.
                </p>
                <ul className="space-y-4">
                  {includedServices.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-mp-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-mp-charcoal rounded-2xl p-8 text-mp-white"
              >
                <h3 className="text-display text-2xl font-bold mb-6">
                  Ready to Get Started?
                </h3>
                <p className="text-mp-gray-light mb-8">
                  Let's discuss your project and create a custom proposal 
                  tailored to your specific needs and goals.
                </p>
                <div className="space-y-4">
                  <Button 
                    href="/book" 
                    size="lg" 
                    className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold"
                  >
                    Map My 90‑Day Rollout
                  </Button>
                  <Button 
                    href="/work" 
                    variant="outline" 
                    size="lg"
                    className="w-full border-mp-white text-mp-white hover:bg-mp-gold/10"
                  >
                    View Our Work
                  </Button>
                </div>
              </motion.div>
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
                Let's Create Something Amazing Together
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Ready to elevate your brand with cinematic content that drives results? 
                Let's discuss your project and see how we can help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  href="/book" 
                  size="lg" 
                  className="bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold"
                >
                  Book a Free Consult
                </Button>
                <Button 
                  href="/work" 
                  variant="outline" 
                  size="lg"
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Our Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
