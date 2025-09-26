'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

export function StickyConsultBar() {
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const d = sessionStorage.getItem('sticky_consult_dismissed') === '1'
      setDismissed(d)
    } catch {}
    const t = setTimeout(() => !dismissed && setVisible(true), 2000)
    const p = setTimeout(() => setPulse(true), 9000)
    const p2 = setTimeout(() => setPulse(false), 16000)
    return () => { clearTimeout(t); clearTimeout(p); clearTimeout(p2) }
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30" role="region" aria-label="Consult CTA" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-2xl border border-mp-gray-800 bg-mp-charcoal/90 backdrop-blur supports-[backdrop-filter]:bg-mp-charcoal/70 p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 shadow-lg`}>
          <button aria-label="Dismiss" className="absolute right-2 top-2 text-mp-gray-400 hover:text-mp-gray-200" onClick={() => { setDismissed(true); try { sessionStorage.setItem('sticky_consult_dismissed','1') } catch {} }}>×</button>
          <div className="flex-1 text-sm text-mp-gray-300">Have a project in mind? Book a free mapping call.</div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              href="/engine/map?step=book"
              onClick={() => { analytics.customEvent('services_sticky_cta_book'); setDismissed(true); try { sessionStorage.setItem('sticky_consult_dismissed','1') } catch {} }}
              className={`w-full sm:w-auto h-9 px-3 text-sm sm:h-10 sm:px-4 ${pulse ? 'bg-mp-gold text-mp-black animate-pulse' : 'bg-mp-gold text-mp-black hover:bg-mp-gold-600'}`}
            >
              Book Call
            </Button>
            <Button
              variant="outline"
              href="/work"
              onClick={() => analytics.customEvent('services_sticky_cta_work')}
              className="w-full sm:w-auto h-9 px-3 text-sm sm:h-10 sm:px-4"
            >
              View Work
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


