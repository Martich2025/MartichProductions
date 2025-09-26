'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    __mp_popup_open?: boolean
  }
}
import { ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

export function StickyCTA() {
  const [show, setShow] = useState(false)
  const [pulse, setPulse] = useState(false)
  const pathname = usePathname()

  // Hide on pages that already show a contextual sticky bar or sensitive flows
  const disabled = (() => {
    if (!pathname) return false
    return [
      '/engine/map',
      '/engine/plan',
      '/work',
      '/services',
      '/book',
    ].some((p) => pathname === p || pathname.startsWith(p + '/'))
  })()

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
    const p1 = setTimeout(() => setPulse(true), 16000)
    const p2 = setTimeout(() => setPulse(false), 24000)
    return () => { clearTimeout(t); clearTimeout(p1); clearTimeout(p2) }
  }, [])

  if (!show || disabled) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10500]" role="region" aria-label="Consult CTA" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}>
      <div className="mx-auto max-w-5xl m-3">
        <div className="rounded-2xl bg-mp-charcoal/90 supports-[backdrop-filter]:bg-mp-charcoal/70 backdrop-blur border border-mp-gray-800 p-2 sm:p-4 flex items-center gap-3 shadow-xl relative">
          <div className="text-sm sm:text-base text-mp-gray-200">Have a project in mind? Book a free mapping call.</div>
          <div className="ml-auto flex items-center gap-2">
            <Button href="/engine/map?step=book" onClick={() => { analytics.customEvent('global_sticky_cta_book'); setShow(false) }} className={`bg-mp-gold text-mp-black hover:bg-mp-gold-600 ${pulse ? 'animate-pulse' : ''}`}>
              Book Call
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <button
              aria-label="Dismiss"
              onClick={() => { analytics.customEvent('global_sticky_cta_dismiss'); localStorage.setItem('mp_sticky_snoozed_until', String(Date.now() + 6*60*60*1000)); setShow(false) }}
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


