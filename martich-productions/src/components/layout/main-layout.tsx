import React from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { ConvertPopup } from '@/components/global/convert-popup'
import { CookieConsent } from '@/components/global/cookie-consent'
import { StickyCTA } from '@/components/global/sticky-cta'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for keyboard users */}
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-brand focus:text-canvas focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Header />
      <main id="content" role="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ConvertPopup />
      <CookieConsent />
      <StickyCTA />
    </div>
  )
}

export { MainLayout }
