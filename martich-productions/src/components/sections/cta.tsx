'use client'

import React from 'react'
import { ArrowRight, Calendar, Phone, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/site'

const CTA = () => {
  const contactMethods = [
    {
      icon: Calendar,
      title: 'Map My 90‑Day Rollout',
      description: 'We’ll review goals and leave you with a plan—no obligation',
      action: 'Get My Plan',
      href: '/book'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      action: CONTACT_PHONE,
      href: `tel:${CONTACT_PHONE_TEL}`
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your project details',
      action: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`
    }
  ]

  return (
    <section className="py-20 bg-mp-black text-mp-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Hand Us the Keys?
            </h2>
            <p className="text-xl text-mp-gray-light mb-8 max-w-3xl mx-auto">
              We’ll operate your content, site, and social as one compounding system—measured in leads and bookings.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                href="/book" 
                size="lg" 
                className="bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold group"
              >
                Map My 90‑Day Rollout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-mp-gold" />
                  </div>
                  <h3 className="text-display text-xl font-semibold mb-2">
                    {method.title}
                  </h3>
                  <p className="text-mp-gray-light mb-4">
                    {method.description}
                  </p>
                  <a
                    href={method.href}
                    className="inline-flex items-center text-mp-gold hover:text-mp-gold-light transition-colors duration-200 font-medium"
                  >
                    {method.action}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-mp-gray"
          >
            <p className="text-mp-gray-light mb-6">
              Trusted by luxury brands across Texas and beyond
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {/* Placeholder for client logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-mp-gray rounded flex items-center justify-center">
                  <span className="text-xs text-mp-gray-light">Logo {i}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { CTA }
