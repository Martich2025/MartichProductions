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
      <Header />
      <main className="flex-1">
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
