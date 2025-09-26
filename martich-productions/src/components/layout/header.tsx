'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Camera, ChevronDown, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock page scroll when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow || ''
    }
    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isMenuOpen])

  const navigation = [
    { 
      name: 'Work', 
      href: '/work',
      description: 'See our cinematic portfolio',
      icon: Camera
    },
    { 
      name: 'Services', 
      href: '/services',
      description: 'What we offer',
      icon: Sparkles,
      hasDropdown: true
    },
    { 
      name: 'About', 
      href: '/about',
      description: 'Our story',
      icon: Zap
    },
    { 
      name: 'Resources', 
      href: '/resources',
      description: 'Tools & guides',
      icon: Camera
    },
  ]

  const services = [
    { name: 'Luxury Resorts', href: '/services/resorts', description: 'Cinematic resort content' },
    { name: 'Realtors', href: '/services/realtors', description: 'Property showcase videos' },
    { name: 'Hospitality', href: '/services/hospitality', description: 'Restaurant & venue content' },
    { name: 'Weddings & Events', href: '/services/weddings-events', description: 'Elegant weddings & event films' },
    { name: 'Social & Web Engine', href: '/services/social-web-engine', description: 'AI-powered social + site engine' },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-mp-black border-b border-mp-gold/20 shadow-lg' 
          : 'bg-mp-black border-b border-mp-gold/10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" prefetch={false} className="flex items-center space-x-3 group" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined') window.location.assign('/') }}>
              <div className="relative">
                <div className="flex h-[56px] w-[56px] sm:h-[63px] sm:w-[63px] items-center justify-center">
                  <Image src="/favicon-64.png" alt="MP" width={63} height={63} priority className="h-[56px] w-[56px] sm:h-[63px] sm:w-[63px]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-display text-xl font-bold text-white group-hover:text-mp-gold transition-colors duration-300 whitespace-nowrap">
                  <span className="hidden sm:inline">Martich Productions</span>
                </span>
                <span className="text-xs text-mp-gray-300 hidden lg:block">
                  Media + Web + Social
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="relative group">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-mp-gold transition-all duration-300 font-medium group-hover:bg-mp-gold/10"
                      onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      )}
                    </Link>
                  </motion.div>

                  {/* Enhanced Dropdown */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-mp-charcoal rounded-2xl shadow-2xl border border-mp-gold/20 overflow-hidden"
                          onMouseEnter={() => setActiveDropdown(item.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                Our Services
                              </h3>
                              <p className="text-sm text-mp-gray-300">
                                Professional media production for every industry
                              </p>
                            </div>
                            <div className="space-y-2">
                              {services.map((service) => (
                                <Link
                                  key={service.name}
                                  href={service.href}
                                  prefetch={false}
                                  className="flex items-center justify-between p-3 rounded-xl hover:bg-mp-gold/10 transition-all duration-200 group"
                                >
                                  <div>
                                    <div className="font-medium text-white group-hover:text-mp-gold transition-colors duration-200">
                                      {service.name}
                                    </div>
                                    <div className="text-sm text-mp-gray-300">
                                      {service.description}
                                    </div>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-mp-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-mp-gold/20">
                              <Link
                                href="/services"
                                className="flex items-center justify-center w-full py-2 px-4 bg-mp-gold text-mp-black rounded-lg font-medium hover:bg-mp-gold-600 transition-colors duration-200"
                              >
                                View All Services
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Enhanced CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              href="/client"
              className="hover:bg-mp-gold/10 hover:text-mp-gold transition-all duration-300"
            >
              Client Login
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                href="/engine/map?step=book" 
                className="bg-mp-gold hover:bg-mp-gold-600 text-mp-black font-semibold transition-colors duration-200"
              >
                Book a Consult
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-3 rounded-xl text-white hover:bg-mp-gold/10 transition-all duration-300 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Perfect Mobile Navigation - Full Screen (opaque) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[9999] bg-mp-black"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute inset-0 bg-mp-black"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                id="mobile-menu"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b border-mp-gold/20" style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}>
                    <div className="flex items-center space-x-3">
                  <div className="flex h-[56px] w-[56px] sm:h-[63px] sm:w-[63px] items-center justify-center">
                        <Image src="/favicon-64.png" alt="MP" width={63} height={63} priority className="h-[56px] w-[56px] sm:h-[63px] sm:w-[63px]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Menu</h2>
                        <p className="text-sm text-mp-gray-300">Navigate our site</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-3 rounded-xl bg-mp-gold/10 hover:bg-mp-gold/20 text-mp-gold transition-all duration-300"
                    >
                      <X className="h-6 w-6" />
                    </motion.button>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overscroll-contain">
                    {navigation.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="flex items-center space-x-3 px-3 py-2.5 text-base font-medium text-white hover:text-mp-gold hover:bg-mp-gold/10 rounded-lg transition-all duration-200 group min-h-[40px]"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="p-2 rounded-md bg-mp-gold/20 group-hover:bg-mp-gold/30 transition-colors duration-200">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-base">{item.name}</div>
                              <div className="text-[11px] text-mp-gray-300 leading-tight">
                                {item.description}
                              </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-mp-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </Link>
                          
                          {/* Services Submenu */}
                          {item.name === 'Services' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 0.2 }}
                              className="ml-6 space-y-1 mt-2"
                            >
                              {services.map((service, serviceIndex) => (
                                <motion.div
                                  key={service.name}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + serviceIndex * 0.1 }}
                                >
                                  <Link
                                    href={service.href}
                                    prefetch={false}
                                    className="flex items-center space-x-3 px-3 py-2 text-[15px] text-mp-gray-300 hover:text-mp-gold hover:bg-mp-gold/5 rounded-md transition-all duration-200 group min-h-[38px]"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-mp-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex-1">
                                      <div className="font-medium leading-tight">{service.name}</div>
                                      <div className="text-[11px] text-mp-gray-400 leading-tight">
                                        {service.description}
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="p-6 border-t border-mp-gold/20 space-y-4 bg-mp-black/50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        variant="ghost" 
                        href="/client" 
                        className="w-full justify-center text-lg py-4 bg-mp-gold/10 hover:bg-mp-gold/20 text-white font-semibold transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Camera className="mr-3 h-5 w-5" />
                        Client Login
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        href="/engine/map?step=book" 
                        className="w-full bg-mp-gold hover:bg-mp-gold-600 text-black font-bold text-lg py-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Sparkles className="mr-3 h-5 w-5" />
                        Book a Consult
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export { Header }
