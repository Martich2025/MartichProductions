'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black text-mp-white flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-display text-4xl font-bold mb-3">Page not found</h1>
          <p className="text-mp-gray-300 mb-8">The link may be broken or the page may have moved. Want to map your growth engine instead?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/engine/map" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">Map My Growth Engine</Button>
            <Button href="/" variant="outline">Go Home</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}


