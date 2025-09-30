'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StickyCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('mp_sticky_cta_dismissed') === '1'
    if (!dismissed) {
      const t = setTimeout(() => setShow(true), 8000)
      return () => clearTimeout(t)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10500]">
      <div className="mx-auto max-w-5xl m-3">
        <div className="rounded-2xl bg-mp-charcoal border border-mp-gray-800 p-3 sm:p-4 flex items-center gap-3 shadow-xl">
          <div className="text-sm sm:text-base text-mp-gray-200">
            Ready to plan your next shoot? Book a free 15‑min consult.
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button href="/book" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
              Book Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <button
              aria-label="Dismiss"
              onClick={() => { sessionStorage.setItem('mp_sticky_cta_dismissed', '1'); setShow(false) }}
              className="p-2 rounded-lg text-mp-gray-400 hover:bg-mp-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


