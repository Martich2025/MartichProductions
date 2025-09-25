'use client'

import React from 'react'
import Image from 'next/image'
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
                href="/engine/map"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
              {/* Client Logos */}
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/espn-logo.png" alt="ESPN" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/miss-usa-logo.png" alt="Miss USA Pageant" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/moreland-properties-logo.png" alt="Moreland Properties" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/carvahal-group-logo.png" alt="Carvahal Group" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/the-club-logo.png" alt="The Club" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/horseshoe-bay-logo.png" alt="Horseshoe Bay Resort" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/whittlesey-logo.png" alt="Whittlesey Landscape Supplies" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/loraloma-logo.png" alt="LORALOMA" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
              <div className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <Image src="/client-logos/thomas-ranch-logo.png" alt="Thomas Ranch" width={128} height={48} className="max-h-12 w-auto filter brightness-0 invert" onError={(e) => { try { (e.target as HTMLImageElement).src = '/placeholder.svg' } catch {} }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { CTA }
