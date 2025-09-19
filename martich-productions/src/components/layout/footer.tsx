'use client'

import React from 'react'
import Link from 'next/link'
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Linkedin, ArrowRight, Sparkles, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_ADDRESS } from '@/lib/site'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navigation = {
    work: [
      { name: 'Case Studies', href: '/work' },
      { name: 'Resort Work', href: '/work?filter=resorts' },
      { name: 'Realtor Work', href: '/work?filter=realtors' },
      { name: 'Hospitality Work', href: '/work?filter=hospitality' },
      { name: 'Weddings & Events Work', href: '/work?filter=weddings-events' },
    ],
    services: [
      { name: 'Luxury Resorts', href: '/services/resorts' },
      { name: 'Realtors', href: '/services/realtors' },
      { name: 'Hospitality', href: '/services/hospitality' },
      { name: 'Weddings & Events', href: '/services/weddings-events' },
      { name: 'Social & Web Engine', href: '/services/social-web-engine' },
      { name: 'Full Service', href: '/services' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Resources', href: '/resources' },
      { name: 'Book a Consult', href: '/book' },
      { name: 'Client Login', href: '/client' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/legal/privacy' },
      { name: 'Terms of Service', href: '/legal/terms' },
    ],
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/martichproductions', icon: Instagram, color: 'hover:text-pink-500' },
    { name: 'Facebook', href: 'https://www.facebook.com/martichproductions', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'YouTube', href: 'https://www.youtube.com/c/MartichProductions', icon: Youtube, color: 'hover:text-red-600' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/martich-productions', icon: Linkedin, color: 'hover:text-blue-700' },
  ]

  const stats = [
    { label: 'Projects Completed', value: '500+' },
    { label: 'Happy Clients', value: '200+' },
    { label: 'Years Experience', value: '15+' },
    { label: 'Awards Won', value: '25+' },
  ]

  return (
    <footer className="relative bg-mp-black text-mp-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 border-b border-mp-gray-700/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-mp-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-mp-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                  <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mp-gold transition-colors duration-200">
                    <Camera className="h-6 w-6 text-mp-black group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <span className="text-display text-2xl font-bold group-hover:text-mp-gold transition-colors duration-300">
                    Martich Productions
                  </span>
                  <div className="text-sm text-mp-gray-400">Cinematic Media Excellence</div>
                </div>
              </Link>
              
              <p className="text-mp-gray-300 mb-8 max-w-md leading-relaxed">
                High-end media production with a personal touch. We create cinematic content 
                that drives results for luxury resorts, realtors, and hospitality brands.
              </p>
              
              {/* Enhanced Contact Info */}
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 rounded-lg bg-mp-gold/10 group-hover:bg-mp-gold/20 transition-colors duration-300">
                    <Mail className="h-4 w-4 text-mp-gold" />
                  </div>
                  <a 
                    href={`mailto:${CONTACT_EMAIL}`} 
                    className="text-mp-gray-300 hover:text-mp-gold transition-colors duration-300"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 rounded-lg bg-mp-gold/10 group-hover:bg-mp-gold/20 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-mp-gold" />
                  </div>
                  <a 
                    href={`tel:${CONTACT_PHONE_TEL}`} 
                    className="text-mp-gray-300 hover:text-mp-gold transition-colors duration-300"
                  >
                    {CONTACT_PHONE}
                  </a>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 rounded-lg bg-mp-gold/10 group-hover:bg-mp-gold/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-mp-gold" />
                  </div>
                  <span className="text-mp-gray-300">
                    {CONTACT_ADDRESS}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Removed 'Our Work' section to reduce redundancy */}

          {/* Enhanced Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-display text-lg font-semibold mb-6 flex items-center">
              <Sparkles className="h-5 w-5 text-mp-gold mr-2" />
              Services
            </h3>
            <ul className="space-y-3">
              {navigation.services.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center text-mp-gray-300 hover:text-mp-gold transition-all duration-300 group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-display text-lg font-semibold mb-6 flex items-center">
              <Zap className="h-5 w-5 text-mp-gold mr-2" />
              Company
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center text-mp-gray-300 hover:text-mp-gold transition-all duration-300 group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 border-t border-mp-gray-700/50"
        >
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-mp-charcoal rounded-2xl p-8 lg:p-12 border border-mp-gray-800">
                <h3 className="text-display text-2xl lg:text-3xl font-bold mb-4 text-white">
                  Book a Free 20‑Minute Mapping Call
                </h3>
                <p className="text-mp-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                  We’ll map your next 90 days—shoot plan, channel mix, and quick wins. No pressure, real value.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    href="/book" 
                    size="lg" 
                    className="bg-mp-gold hover:bg-mp-gold-600 text-mp-black font-bold text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Book a Free Consult
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Bottom Section */}
        <div className="py-8 border-t border-mp-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-mp-gray-400 text-sm"
            >
              © {currentYear} Martich Productions. All rights reserved.
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-mp-gray-400 hover:text-mp-gold transition-colors duration-300 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl bg-mp-gray-800/50 hover:bg-mp-gold/10 text-mp-gray-400 ${item.color} transition-all duration-300 group`}
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
