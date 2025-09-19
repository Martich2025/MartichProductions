'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function GuidePage() {
  return (
    <MainLayout>
      <section className="py-24 bg-mp-black text-mp-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-display text-4xl font-bold mb-4">Production Planning Guide</h1>
          <p className="text-mp-gray-300 mb-8">Thanks for your interest. We’ll email you the guide shortly. Want to talk through your timeline now?</p>
          <Button href="/book" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Book a 15‑min Consult</Button>
        </div>
      </section>
    </MainLayout>
  )
}


