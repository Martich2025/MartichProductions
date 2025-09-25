'use client'

import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    __mp_popup_open?: boolean
  }
}
import { X } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const accepted = localStorage.getItem('mp_cookie_consent') === 'accepted'
    const snoozedUntil = Number(localStorage.getItem('mp_cookie_snoozed_until') || '0')
    if (accepted || Date.now() < snoozedUntil) return
    const t = setTimeout(() => {
      window.__mp_popup_open = true
      setShow(true)
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  const accept = () => {
    localStorage.setItem('mp_cookie_consent', 'accepted')
    window.__mp_popup_open = false
    setShow(false)
  }

  const dismiss = () => {
    const day = 24 * 60 * 60 * 1000
    localStorage.setItem('mp_cookie_snoozed_until', String(Date.now() + day))
    window.__mp_popup_open = false
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
          <button aria-label="Close" onClick={dismiss} className="p-2 rounded-lg text-mp-gray-400 hover:bg-mp-gray-800"><X className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  )
}


