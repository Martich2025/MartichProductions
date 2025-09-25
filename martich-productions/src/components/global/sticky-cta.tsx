'use client'

import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    __mp_popup_open?: boolean
  }
}
import { ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StickyCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const snoozedUntil = Number(localStorage.getItem('mp_sticky_snoozed_until') || '0')
    if (Date.now() < snoozedUntil) return
    const already = sessionStorage.getItem('mp_sticky_seen_session') === '1'
    if (already) return
    const t = setTimeout(() => {
      if (!window.__mp_popup_open) {
        setShow(true)
        sessionStorage.setItem('mp_sticky_seen_session', '1')
      }
    }, 10000)
    return () => clearTimeout(t)
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
              onClick={() => { localStorage.setItem('mp_sticky_snoozed_until', String(Date.now() + 6*60*60*1000)); setShow(false) }}
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


