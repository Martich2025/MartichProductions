'use client'

import React from 'react'
import { Heart, Camera, Mic, Users, Calendar, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function WeddingsEventsPage() {
  const packages = [
    {
      name: 'Signature',
      price: '$8,000+',
      description: 'Beautiful highlight film with ceremony and speeches audio',
      features: [
        '8 hours coverage',
        'Cinematic highlight film (4–6 min)',
        'Ceremony audio capture',
        'Licensed music',
      ],
    },
    {
      name: 'Premiere',
      price: '$18,000+',
      description: 'Full-day coverage with long-form films and multi-cam audio',
      features: [
        '10–12 hours coverage',
        'Highlight film (6–8 min) + documentary edit',
        'Multi-cam ceremony & speeches',
        'Drone & second shooter',
      ],
    },
    {
      name: 'Luxury',
      price: '$35,000+',
      description: 'Editorial-level production for weddings and large events',
      features: [
        'Multi-day coverage',
        'Same-day social edit deliverables',
        'Director + multi-crew team',
        'Custom deliverables & revisions',
      ],
    },
  ]

  const features = [
    {
      icon: Heart,
      title: 'Story-Driven Films',
      description: 'Emotional storytelling that preserves the day and the people who matter most.',
    },
    {
      icon: Mic,
      title: 'Crystal-Clear Audio',
      description: 'Multi-mic setup for vows, speeches, and priceless moments.',
    },
    {
      icon: Users,
      title: 'Experienced Crew',
      description: 'Professional team operating unobtrusively with a refined, luxury approach.',
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        {/* Hero */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Weddings & Events
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                Elegant, story-driven films crafted with cinematic precision for weddings, galas, and corporate events.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
                  Book a Consult
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button href="/work" variant="outline" size="lg" className="border-mp-white text-mp-white hover:bg-mp-gold/10">
                  View Our Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}>
                    <Card className="h-full">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-mp-gold" />
                        </div>
                        <h3 className="text-display text-xl font-semibold text-white mb-2">{f.title}</h3>
                        <p className="text-mp-gray">{f.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card className={`h-full ${i === 1 ? 'ring-2 ring-mp-gold' : ''}`}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-white">{p.name}</CardTitle>
                      <div className="text-3xl font-bold text-mp-gold mb-2">{p.price}</div>
                      <p className="text-mp-gray text-sm">{p.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {p.features.map((f, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-mp-gold mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-mp-gray-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button href="/book" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Get Started</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">Ready to Plan Your Day?</h2>
            <p className="text-xl text-mp-gray-light mb-8">We’ll build a package around your timeline and priorities.</p>
            <Button href="/book" size="lg" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
              Book a Consult
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


