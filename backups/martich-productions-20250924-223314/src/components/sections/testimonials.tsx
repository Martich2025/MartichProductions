'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Our bookings jumped 340%—the film made guests feel the resort.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "The Grand Resort",
      rating: 5,
      project: "Luxury Resort Brand Story"
    },
    {
      id: 2,
      quote: "Listed, posted, sold in three weeks—cinematic tour did the work.",
      author: "Michael Chen",
      role: "Senior Realtor",
      company: "Elite Properties",
      rating: 5,
      project: "High‑End Property Tour"
    }
  ]

  return (
    <section className="py-20 bg-mp-gray-light content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-mp-gray max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say 
            about working with Martich Productions.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-mp-gold" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-mp-gold fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-mp-gray-200 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="border-t border-mp-gray-light pt-4">
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-mp-gray">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-mp-gold font-medium">
                      {testimonial.company}
                    </div>
                    <div className="text-xs text-mp-gray mt-1">
                      Project: {testimonial.project}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-mp-charcoal rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-mp-gold mb-2">
                  98%
                </div>
                <div className="text-mp-gray-light">
                  Client Satisfaction Rate
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-mp-gold mb-2">
                  500+
                </div>
                <div className="text-mp-gray-light">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-mp-gold mb-2">
                  15+
                </div>
                <div className="text-mp-gray-light">
                  Years of Experience
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-mp-gold mb-2">
                  50M+
                </div>
                <div className="text-mp-gray-light">
                  Views Generated
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { Testimonials }
