'use client'

import React from 'react'
import { Camera, Heart, Users, Award, Star, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function AboutPage() {
  const values = [
    {
      icon: Camera,
      title: 'Cinematic Excellence',
      description: 'We bring Hollywood-level production quality to every project, ensuring your content stands out in a crowded market.'
    },
    {
      icon: Heart,
      title: 'Client-First Approach',
      description: 'Your success is our success. We\'re committed to understanding your vision and delivering results that exceed expectations.'
    },
    {
      icon: Users,
      title: 'Collaborative Partnership',
      description: 'We work closely with your team throughout the entire process, ensuring seamless communication and perfect execution.'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Our track record speaks for itself - 500+ successful projects and countless satisfied clients across luxury industries.'
    }
  ]

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '50M+', label: 'Views Generated' }
  ]

  const team = [
    {
      name: 'Mark Martich',
      role: 'Co-founder & Creative Director',
      bio: 'With over 15 years of experience in videography and photography, Mark brings a unique blend of technical expertise and creative vision to every project.',
      image: '/placeholder-mark.jpg'
    },
    {
      name: 'Krystal Martich',
      role: 'Co-founder & Producer',
      bio: 'Krystal oversees project management and client relations, ensuring every detail is perfect and every client feels valued throughout the process.',
      image: '/placeholder-krystal.jpg'
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
                About Martich Productions
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                We’re a stewardship partner. Clients stay for years because we own the details—content, platforms, and performance—while you run the business.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
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
                  Our Story
                </h2>
                <div className="space-y-4 text-mp-gray">
                  <p>
                    Mark and Krystal Martich founded Martich Productions with a simple mission: 
                    to create high-end media production with a personal touch. With 15+ years 
                    of global experience in videography and photography, they merge creativity, 
                    cinematic expertise, and storytelling to create content that inspires and drives results.
                  </p>
                  <p>
                    What started as a passion for visual storytelling has evolved into a full-service 
                    production company that serves luxury resorts, realtors, and hospitality brands 
                    across Texas and beyond. We believe that every brand has a unique story to tell, 
                    and we're here to help you tell it in the most compelling way possible.
                  </p>
                  <p>
                    Our approach combines the professionalism of a large agency with the personal 
                    attention and creative flexibility of a boutique studio. When you work with us, 
                    you're not just another client - you're part of our creative family.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Placeholder for team photo */}
                <div className="aspect-[4/3] bg-mp-gray-light rounded-2xl flex items-center justify-center">
                  <div className="text-center text-mp-gray">
                    <Camera className="w-16 h-16 mx-auto mb-4" />
                    <p>Team Photo Coming Soon</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Values
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                These core principles guide everything we do, from initial concept 
                to final delivery and beyond.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-mp-gold" />
                        </div>
                        <h3 className="text-display text-xl font-semibold text-white mb-4">
                          {value.title}
                        </h3>
                        <p className="text-mp-gray">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
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
                Meet the Team
              </h2>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                The creative minds behind Martich Productions, bringing decades 
                of combined experience to every project.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <CardContent className="p-8">
                      {/* Placeholder for member photo */}
                      <div className="w-32 h-32 bg-mp-gray-light rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-mp-gray" />
                      </div>
                      <h3 className="text-display text-2xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-mp-gold font-medium mb-4">
                        {member.role}
                      </p>
                      <p className="text-mp-gray">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">
                Our Impact
              </h2>
              <p className="text-xl text-mp-gray-light max-w-3xl mx-auto">
                Numbers don't lie. Here's what we've accomplished for our clients 
                over the years.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-mp-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-mp-gray-light">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-mp-gray-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Work Together?
              </h2>
              <p className="text-xl text-mp-gray mb-8">
                Let's discuss your project and see how we can help you achieve 
                your goals with our cinematic storytelling approach.
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
