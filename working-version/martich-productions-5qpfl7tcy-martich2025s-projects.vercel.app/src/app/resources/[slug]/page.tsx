'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

interface PageProps { params: Promise<{ slug: string }> }

const LIB: Record<string, { title: string; type: string; summary: string; cta: string }> = {
  'ultimate-video-production-guide': {
    title: 'Ultimate Video Production Planning Guide',
    type: 'Guide (PDF)',
    summary:
      'Plan your next shoot with confidence—from brief and storyboard to shot list, schedule, and delivery checklist. Includes templates.',
    cta: 'Get the Guide',
  },
  'luxury-resort-marketing-checklist': {
    title: 'Luxury Resort Marketing Checklist',
    type: 'Checklist',
    summary:
      'Everything a resort needs to prep for a high‑impact content sprint: locations, talent, brand cues, offers, and CTA routing.',
    cta: 'Download Checklist',
  },
  'real-estate-video-best-practices': {
    title: 'Real Estate Video Best Practices',
    type: 'Article',
    summary:
      'Hooks, pacing, and distribution plays that move listings faster—optimized for IG/TT/YouTube and Zillow embeds.',
    cta: 'Read Now',
  },
  'behind-scenes-resort-shoot': {
    title: 'Behind the Scenes: Resort Shoot',
    type: 'Video',
    summary:
      'How we run a multi‑location resort production day—the gear, crew roles, and run‑of‑show that keeps momentum high.',
    cta: 'Watch BTS',
  },
  'hospitality-content-strategy-template': {
    title: 'Hospitality Content Strategy Template',
    type: 'Template',
    summary:
      'Quarterly content map for restaurants and venues—pillars, cadence, offer mapping, and analytics goals.',
    cta: 'Use the Template',
  },
  'drone-cinematography-techniques': {
    title: 'Drone Cinematography Techniques',
    type: 'Article',
    summary:
      'Smooth reveal shots, parallax passes, and safety/permit notes for aerial work that elevates the story.',
    cta: 'Read Now',
  },
  'case-study-2-5m-property-sale': {
    title: 'Case Study: $2.5M Property Sale',
    type: 'Case Study',
    summary:
      'Story + distribution that moved a $2.5M listing in three weeks. Assets, sequence, and performance metrics.',
    cta: 'View Case Study',
  },
  'equipment-guide-beginners': {
    title: 'Equipment Guide for Beginners',
    type: 'Guide',
    summary:
      'Camera bodies, lenses, audio, and lighting kits that scale from starter to pro without wasting budget.',
    cta: 'Get the Guide',
  },
}

export default function ResourceDetail({ params }: PageProps) {
  const [slug, setSlug] = React.useState('')
  const [data, setData] = React.useState<{ title: string; type: string; summary: string; cta: string } | null>(null)

  React.useEffect(() => {
    ;(async () => {
      const p = await params
      setSlug(p.slug)
      setData(LIB[p.slug] || null)
    })()
  }, [params])

  const title = data?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const type = data?.type || 'Resource'
  const summary = data?.summary || 'Detailed resource coming soon.'
  const ctaText = data?.cta || 'Back to Resources'

  return (
    <MainLayout>
      <section className="bg-mp-black text-mp-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="text-sm text-mp-gray-400 mb-2">{type}</p>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-mp-gray-300 mb-8">{summary}</p>
          <div className="flex gap-3">
            <Button href="/resources" variant="outline" className="border-mp-gold text-mp-gold hover:bg-mp-gold hover:text-mp-black">
              Back to Resources
            </Button>
            <Button href="/book" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
              {ctaText}
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}


