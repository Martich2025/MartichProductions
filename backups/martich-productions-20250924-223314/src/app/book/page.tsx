'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/site'
import { motion } from 'framer-motion'

export default function BookConsult() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget_range: '',
    timeline: '',
    message: '',
    consent: false
  })

  const [journey, setJourney] = useState<{ persona?: string; focus?: string; cadence?: string } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Prefill from Engine Map journey params
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const persona = params.get('persona') || undefined
    const focus = params.get('focus') || undefined
    const cadence = params.get('cadence') || undefined
    if (persona || focus || cadence) {
      setJourney({ persona, focus, cadence })
      const personaToProject: Record<string, string> = {
        resort: 'resort',
        realtor: 'realtor',
        hospitality: 'hospitality',
        events: 'weddings-events',
      }
      setFormData(prev => ({
        ...prev,
        project_type: persona && personaToProject[persona] ? personaToProject[persona] : prev.project_type,
        message: prev.message || `From Engine Map → Persona: ${persona || '—'} | Focus: ${focus || '—'} | Cadence: ${cadence || '—'}`,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.project_type || !formData.timeline || !formData.consent) {
      setIsSubmitting(false)
      alert('Please complete required fields and consent to proceed.')
      return
    }
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const projectTypes = [
    { value: 'resort', label: 'Luxury Resort' },
    { value: 'realtor', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'weddings-events', label: 'Weddings & Events' },
    { value: 'social-web-engine', label: 'Social & Web Engine' },
    { value: 'other', label: 'Other' }
  ]

  const budgetRanges = [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-plus', label: '$100,000+' }
  ]

  const timelines = [
    { value: 'asap', label: 'ASAP (Rush job)' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ]

  if (isSubmitted) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-mp-gray-light py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="p-8">
              <CardContent>
                <div className="w-16 h-16 bg-mp-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-mp-gold" />
                </div>
                <h1 className="text-display text-2xl font-bold text-white mb-4">
                  Thank You!
                </h1>
                <p className="text-mp-gray mb-6">
                  We've received your consultation request and will get back to you 
                  within 24 hours to schedule your free strategy call.
                </p>
                <div className="space-y-4">
                  <Button href="/" className="w-full">
                    Back to Home
                  </Button>
                  <Button href="/work" variant="outline" className="w-full">
                    View Our Work
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {journey && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 rounded-xl border border-mp-gold/30 bg-mp-charcoal/60 p-4"
              >
                <div className="text-sm text-mp-gray-300">Pre‑filled from your Engine Map</div>
                <div className="mt-1 text-white font-medium">
                  Persona: <span className="text-mp-gold">{journey.persona}</span>
                  <span className="mx-2 text-mp-gray-500">•</span>
                  Focus: <span className="text-mp-gold">{journey.focus}</span>
                  <span className="mx-2 text-mp-gray-500">•</span>
                  Cadence: <span className="text-mp-gold">{journey.cadence}</span>
                </div>
                <div className="mt-2 text-sm">
                  Not quite right? <a href="/engine/map" className="text-mp-gold underline">Remap my plan</a>
                </div>
              </motion.div>
            )}
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Book a Free Consult
              </h1>
              <p className="text-xl text-mp-gray max-w-3xl mx-auto">
                Ready to create something extraordinary? Let's discuss your project 
                and see how we can help you achieve your goals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name *"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          label="Email Address *"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        <Input
                          label="Company Name"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                          label="Project Type *"
                          name="project_type"
                          value={formData.project_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Select>

                        <Select
                          label="Budget Range"
                          name="budget_range"
                          value={formData.budget_range}
                          onChange={handleInputChange}
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <Select
                        label="Timeline *"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((timeline) => (
                          <option key={timeline.value} value={timeline.value}>
                            {timeline.label}
                          </option>
                        ))}
                      </Select>

                      <Textarea
                        label="Project Description"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your project, goals, and any specific requirements..."
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full shadow-gold"
                        loading={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Book Free Consult'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    <div className="pt-2">
                      <label className="flex items-start space-x-3 text-sm text-mp-gray-300">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={!!formData.consent}
                          onChange={handleCheckboxChange}
                          className="mt-1"
                          required
                        />
                        <span>
                          I consent to be contacted by Martich Productions and agree to the Privacy Policy.
                        </span>
                      </label>
                    </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                {/* What to Expect */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 text-mp-gold mr-2" />
                      What to Expect
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-mp-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>30-minute strategy call</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-mp-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Project scope discussion</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-mp-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Budget and timeline review</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-mp-gold mr-2 mt-0.5 flex-shrink-0" />
                        <span>Custom proposal within 48 hours</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 text-mp-gold mr-2" />
                      Contact Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Email:</strong><br />
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-mp-gold hover:underline">
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                      <div>
                        <strong>Phone:</strong><br />
                        <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-mp-gold hover:underline">
                          {CONTACT_PHONE}
                        </a>
                      </div>
                      <div>
                        <strong>Response Time:</strong><br />
                        Within 24 hours
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Choose Us */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Us?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• 15+ years of experience</li>
                      <li>• Luxury brand expertise</li>
                      <li>• Cinematic storytelling</li>
                      <li>• Proven results</li>
                      <li>• Full-service production</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
