'use client'

import { useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-display text-4xl font-bold mb-3">Something went wrong</h1>
          <p className="text-mp-gray-300 mb-8">We’ve logged the issue. In the meantime, you can map your growth engine or go back home.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/engine/map" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Map My Growth Engine</Button>
            <Button onClick={() => reset()} variant="outline">Try Again</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}


