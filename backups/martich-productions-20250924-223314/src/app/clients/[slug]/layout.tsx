'use client'

import React, { useEffect, useState } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [varsLoaded, setVarsLoaded] = useState(false)

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('theme.json', { cache: 'no-store' })
        const theme = await res.json()
        const root = document.documentElement
        if (theme.colors) {
          root.style.setProperty('--mp-gold', theme.colors.primary || '#D4AF37')
          root.style.setProperty('--mp-bg-primary', theme.colors.background || '#0A0A0A')
          root.style.setProperty('--mp-card-bg', theme.colors.surface || '#1A1A1A')
          root.style.setProperty('--mp-text-primary', theme.colors.text || '#FFFFFF')
        }
        setVarsLoaded(true)
      } catch {
        setVarsLoaded(true)
      }
    }
    loadTheme()
  }, [])

  return (
    <div style={{ opacity: varsLoaded ? 1 : 0 }}>
      {children}
    </div>
  )
}


