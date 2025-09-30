'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    __mp_popup_open?: boolean
  }
}

const DISMISS_DAYS = 7
const DELAY_MS = 30000 // 30s first-time delay
const SCROLL_THRESHOLD = 0.6 // 60% scroll fallback

function isMobile() {
  if (typeof navigator === 'undefined') return false
  return /Mobi|Android/i.test(navigator.userAgent)
}

export function ConvertPopup() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('')
  const [timeline, setTimeline] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [variant, setVariant] = useState<'guide' | 'case'>('guide')
  const shownRef = useRef(false)

  const storage = useMemo(() => ({
    get snoozedUntil() {
      if (typeof localStorage === 'undefined') return 0
      const v = localStorage.getItem('mp_popup_snoozed_until')
      return v ? Number(v) : 0
    },
    set snoozedUntil(ts: number) {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem('mp_popup_snoozed_until', String(ts))
    },
    get converted() {
      if (typeof localStorage === 'undefined') return false
      return localStorage.getItem('mp_popup_converted') === '1'
    },
    set converted(v: boolean) {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem('mp_popup_converted', v ? '1' : '0')
    },
    get seenSession() {
      if (typeof sessionStorage === 'undefined') return false
      return sessionStorage.getItem('mp_popup_seen_session') === '1'
    },
    set seenSession(v: boolean) {
      if (typeof sessionStorage === 'undefined') return
      sessionStorage.setItem('mp_popup_seen_session', v ? '1' : '0')
    },
  }), [])

  const canShow = useCallback(() => {
    if (storage.converted) return false
    if (storage.seenSession) return false
    if (Date.now() < storage.snoozedUntil) return false
    const path = typeof window !== 'undefined' ? window.location.pathname : ''
    if (path.startsWith('/client') || path.startsWith('/book') || path.startsWith('/api')) return false
    // avoid clashing with other popups
    if (typeof window !== 'undefined' && window.__mp_popup_open) return false
    return true
  }, [storage])

  // Choose variant once per session
  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    const v = sessionStorage.getItem('mp_popup_variant') as 'guide' | 'case' | null
    if (v) setVariant(v)
    else {
      const pick = Math.random() < 0.5 ? 'guide' : 'case'
      setVariant(pick)
      sessionStorage.setItem('mp_popup_variant', pick)
    }
  }, [])

  // Timers: delay and scroll
  useEffect(() => {
    if (!canShow() || shownRef.current) return

    let opened = false
    const openOnce = () => {
      if (!opened) {
        opened = true
        shownRef.current = true
        storage.seenSession = true
        window.__mp_popup_open = true
        setOpen(true)
      }
    }

    const delay = window.setTimeout(() => {
      if (canShow()) openOnce()
    }, DELAY_MS)

    const onScroll = () => {
      const y = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h > 0 && y / h >= SCROLL_THRESHOLD && canShow()) {
        openOnce()
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll)

    // Exit intent (desktop only)
    const onMouseOut = (e: MouseEvent) => {
      if (isMobile()) return
      if (e.clientY <= 0 && canShow()) {
        openOnce()
        window.removeEventListener('mouseout', onMouseOut)
      }
    }
    window.addEventListener('mouseout', onMouseOut)

    return () => {
      window.clearTimeout(delay)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [canShow, storage])

  useEffect(() => {
    // focus trap basic
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    return () => prev?.focus?.()
  }, [open])

  const closeAndSnooze = () => {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000
    storage.snoozedUntil = until
    window.__mp_popup_open = false
    setOpen(false)
  }

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStep(2)
  }

  const submitLead = async () => {
    setSubmitting(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: role || null,
          timeline: timeline || null,
          path: window.location.pathname,
          utm: Object.fromEntries(params.entries()),
          userAgent: navigator.userAgent,
          variant,
        }),
      })
      if (res.ok) {
        storage.converted = true
        // Success view
        setStep(1)
        setOpen(true)
        setSubmitting(false)
        // Replace modal with success state
        const success = document.getElementById('mp-success')
        if (success) success.focus()
        // Close after a delay
        setTimeout(() => { setOpen(false); window.__mp_popup_open = false }, 3000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  // Layout: modal on desktop, bottom sheet on mobile
  const containerBase = isMobile()
    ? 'fixed inset-x-0 bottom-0 z-[10000]'
    : 'fixed inset-0 z-[10000] flex items-center justify-center'

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-mp-black/80" onClick={closeAndSnooze} />

      {/* Sheet / Modal */}
      <div className={containerBase}>
        <div className={`${isMobile() ? 'w-full rounded-t-2xl' : 'w-full max-w-md rounded-2xl'} bg-mp-charcoal border border-mp-gray-800 mx-auto p-6 shadow-xl relative`} role="dialog" aria-modal="true" aria-label={variant === 'guide' ? 'Get the Social and Web Engine Playbook' : 'See What Top Clients Are Booking'}>
          <button aria-label="Close" onClick={closeAndSnooze} className="absolute right-3 top-3 p-2 rounded-lg text-mp-gray-300 hover:bg-mp-gray-800">
            <X className="w-5 h-5" />
          </button>

          <h3 id="mp-convert-title" className="text-display text-2xl font-bold text-white mb-2">
            {variant === 'guide' ? 'Get the Social + Web Engine Playbook' : 'See What Top Clients Are Booking'}
          </h3>
          <p className="text-mp-gray-300 mb-6">
            {variant === 'guide'
              ? 'The 90‑day rollout we use to grow luxury brands—calendar, hooks, pages, and KPIs.'
              : 'Get 3 short case studies: Resorts, Realtors, and Events—formats, budgets, and outcomes.'}
          </p>

          {step === 1 && (
            <form onSubmit={onSubmitEmail} className="space-y-4">
              <label className="block text-sm text-mp-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full h-11 rounded-lg bg-mp-black border border-mp-gray-700 px-3 text-white placeholder:text-mp-gray-500 focus:border-mp-gold focus:outline-none"
              />
              <Button type="submit" className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">Email Me the Playbook</Button>
              <button type="button" onClick={closeAndSnooze} className="w-full text-sm text-mp-gray-400 hover:text-mp-gray-200">No thanks</button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="text-sm text-mp-gray-300 mb-2">Your role</div>
                <div className="flex flex-wrap gap-2">
                  {['Resort', 'Realtor', 'Venue', 'Other'].map((r) => (
                    <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-full border ${role === r ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-mp-gray-300 mb-2">Timeline</div>
                <div className="flex flex-wrap gap-2">
                  {['0–30 days', '30–60 days', '60+ days'].map((t) => (
                    <button key={t} onClick={() => setTimeline(t)} className={`px-3 py-1.5 rounded-full border ${timeline === t ? 'border-mp-gold text-white' : 'border-mp-gray-700 text-mp-gray-300'} hover:border-mp-gold`}>{t}</button>
                  ))}
                </div>
              </div>
              <Button onClick={submitLead} disabled={submitting} className="w-full bg-mp-gold text-mp-black hover:bg-mp-gold-600">
                {submitting ? 'Sending…' : variant === 'guide' ? 'Send the Playbook' : 'Send the Case Studies'}
              </Button>
              <div className="text-xs text-mp-gray-500 text-center">Trusted by Texas luxury brands • Unsubscribe anytime</div>
            </div>
          )}

          {/* Success message (screen-reader target) */}
          <div id="mp-success" tabIndex={-1} className="sr-only">Thanks! Check your email for the download.</div>
        </div>
      </div>
    </div>
  )
}


