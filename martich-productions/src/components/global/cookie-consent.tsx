'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = typeof localStorage !== 'undefined' ? localStorage.getItem('mp_cookie_consent') : 'accepted'
    if (!consent) {
      const t = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('mp_cookie_consent', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[11000]">
      <div className="mx-auto max-w-5xl m-4 rounded-2xl bg-mp-charcoal border border-mp-gray-800 p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="text-sm text-mp-gray-300">
            We use cookies to improve your experience and analyze performance. See our{' '}
            <Link href="/legal/privacy" className="underline hover:text-mp-gold">Privacy Policy</Link>.
          </div>
          <button onClick={accept} className="ml-auto px-3 py-2 rounded-lg bg-mp-gold text-mp-black text-sm hover:bg-mp-gold-600">Accept</button>
          <button aria-label="Close" onClick={() => setShow(false)} className="p-2 rounded-lg text-mp-gray-400 hover:bg-mp-gray-800"><X className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  )
}


