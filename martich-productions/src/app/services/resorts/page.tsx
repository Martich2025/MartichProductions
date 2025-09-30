'use client'

import React from 'react'
import { Camera, Video, Drone, Edit, Share2, CheckCircle, ArrowRight, Star, Users, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function ResortsPage() {
  const services = [
    {
      icon: Camera,
      title: 'Resort Brand Storytelling',
      description: 'Cinematic narratives that showcase your resort\'s unique character and create emotional connections with potential guests.',
      features: [
        'Brand narrative development',
        'Guest journey documentation',
        'Lifestyle content creation',
        'Emotional storytelling'
      ]
    },
    {
      icon: Video,
      title: 'Amenity Showcase Videos',
      description: 'Professional videos highlighting your resort\'s amenities, from spa treatments to dining experiences.',
      features: [
        'Spa & wellness content',
        'Dining experience videos',
        'Recreation facility tours',
        'Guest activity documentation'
      ]
    },
    {
      icon: Drone,
      title: 'Aerial Cinematography',
      description: 'Breathtaking aerial shots that capture the scale and beauty of your resort property.',
      features: [
        'Property overview shots',
        'Beach and landscape aerials',
        'Architectural highlights',
        'Sunset/sunrise captures'
      ]
    },
    {
      icon: Share2,
      title: 'Social Media Content',
      description: 'Platform-optimized content that drives engagement and bookings across all social channels.',
      features: [
        'Instagram Reels & Stories',
        'Facebook marketing videos',
        'TikTok content creation',
        'YouTube channel management'
      ]
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Discovery & Strategy',
      description: 'We dive deep into your resort\'s unique story, target audience, and marketing goals.',
      duration: '1-2 weeks'
    },
    {
      step: 2,
      title: 'Pre-Production',
      description: 'Storyboarding, shot planning, and logistics coordination for seamless production.',
      duration: '2-3 weeks'
    },
    {
      step: 3,
      title: 'Production',
      description: 'Professional filming with state-of-the-art equipment and expert crew.',
      duration: '3-5 days'
    },
    {
      step: 4,
      title: 'Post-Production',
      description: 'Professional editing, color grading, and optimization for all platforms.',
      duration: '2-3 weeks'
    }
  ]

  const pricing = [
    {
      name: 'Essential',
      price: '$25,000',
      description: 'Perfect for smaller resorts or single campaigns',
      features: [
        '1-2 day production',
        'Up to 3 video deliverables',
        'Basic editing & color grading',
        'Social media optimization',
        '30-day revision period'
      ]
    },
    {
      name: 'Professional',
      price: '$50,000',
      description: 'Comprehensive package for established resorts',
      features: [
        '3-5 day production',
        'Up to 8 video deliverables',
        'Advanced editing & effects',
        'Drone cinematography',
        'Multi-platform optimization',
        '60-day revision period'
      ]
    },
    {
      name: 'Luxury',
      price: '$100,000+',
      description: 'Complete brand transformation package',
      features: [
        '5+ day production',
        'Unlimited video deliverables',
        'Cinema-grade production',
        'Full aerial coverage',
        'Ongoing content strategy',
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
                Luxury Resort Marketing
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                Cinematic storytelling that showcases your resort's unique amenities and 
                creates an emotional connection with potential guests.
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
                  href="/work?filter=resorts" 
                  variant="outline" 
                  size="lg"
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Resort Work
                </Button>
              </div>
            </motion.div>
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
                Our Resort Services
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                We specialize in creating compelling content that drives bookings and 
                enhances your resort's reputation in the luxury market.
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
                From initial concept to final delivery, we follow a proven methodology 
                that ensures your resort content exceeds expectations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-mp-gold text-mp-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-display text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-mp-gray mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-center justify-center text-sm text-mp-gold">
                    <Clock className="w-4 h-4 mr-1" />
                    {step.duration}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
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
                Investment Options
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                Choose the package that best fits your resort's needs and marketing goals.
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
                  <Card className={`h-full ${package_.name === 'Professional' ? 'ring-2 ring-mp-gold' : ''}`}>
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
                        className={`w-full ${package_.name === 'Professional' ? 'bg-mp-gold text-mp-black hover:bg-mp-gold-dark' : ''}`}
                        variant={package_.name === 'Professional' ? 'default' : 'outline'}
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
                Ready to Elevate Your Resort's Marketing?
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Let's discuss your resort's unique story and create content that 
                drives bookings and enhances your brand reputation.
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
                  href="/work?filter=resorts" 
                  variant="outline" 
                  size="lg"
                  className="border-mp-white text-mp-white hover:bg-mp-gold/10"
                >
                  View Resort Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
