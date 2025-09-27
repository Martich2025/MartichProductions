'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-mp-black text-mp-white px-6">
      <div className="max-w-xl text-center">
        <h2 className="text-display text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-mp-gray-300 mb-6">We hit an issue generating your journey. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()} className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Try Again</Button>
          <Button href="/engine/map" variant="outline">Restart Journey</Button>
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <pre className="mt-6 text-xs text-mp-gray-400 whitespace-pre-wrap overflow-auto">{error?.message}</pre>
        )}
      </div>
    </div>
  )
}


