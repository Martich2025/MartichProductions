'use client'

import React from 'react'
import { Search, Lightbulb, Camera, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const Process = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discovery',
      description: 'We dive deep into your brand, goals, and vision to understand what makes you unique.',
      details: [
        'Brand analysis & positioning',
        'Target audience research',
        'Competitive landscape review',
        'Project scope definition'
      ]
    },
    {
      icon: Lightbulb,
      title: 'Creative',
      description: 'Our team crafts a compelling narrative and visual strategy that resonates with your audience.',
      details: [
        'Concept development',
        'Storyboard creation',
        'Visual style guide',
        'Content calendar planning'
      ]
    },
    {
      icon: Camera,
      title: 'Production',
      description: 'Professional filming and photography with state-of-the-art equipment and expert crew.',
      details: [
        'Professional equipment setup',
        'Cinematic filming techniques',
        'High-quality photography',
        'Drone & specialty shots'
      ]
    },
    {
      icon: Truck,
      title: 'Delivery',
      description: 'Final content delivered with ongoing support and optimization for maximum impact.',
      details: [
        'Professional editing & post-production',
        'Multiple format delivery',
        'Social media optimization',
        'Performance tracking & reporting'
      ]
    }
  ]

  return (
    <section className="py-20 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Signature Process
          </h2>
          <p className="text-xl text-mp-gray max-w-3xl mx-auto">
            From concept to delivery, we follow a proven methodology that ensures 
            your content not only looks amazing but drives real business results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-mp-gold text-mp-black rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-4 mb-6">
                      <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="w-8 h-8 text-mp-gold" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-display text-xl font-semibold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-mp-gray-300 mb-6">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="text-sm text-mp-gray space-y-1.5">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-left">
                          <span className="mt-1 mr-2 text-mp-gold">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-mp-gold/30 transform -translate-y-1/2" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-mp-gray-300 mb-6">
            Ready to start your project?
          </p>
          <a
            href="/book"
            className="inline-flex items-center px-8 py-3 bg-mp-gold text-mp-black font-semibold rounded-lg hover:bg-mp-gold-600 transition-colors duration-200"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export { Process }
