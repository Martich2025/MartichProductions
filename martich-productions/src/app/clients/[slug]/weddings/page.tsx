import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { VideoPlayer } from '@/components/media/video-player'
import { Button } from '@/components/ui/button'

interface PageProps { params: Promise<{ slug: string }> }

export default function ClientWeddingsMicrosite({ params }: PageProps) {
  const [client, setClient] = React.useState('Client')
  type SiteData = {
    weddings?: {
      hero?: { heading?: string; sub?: string; ctaText?: string; video?: { mp4?: string; webm?: string; poster?: string } }
    }
  }
  const [site, setSite] = React.useState<SiteData | null>(null)
  React.useEffect(() => {
    ;(async () => {
      try {
        const p = await params
        setClient(p.slug || 'Client')
        const res = await fetch('/clients/' + (p.slug || '') + '/site.json', { cache: 'no-store' })
        const s = await res.json()
        setSite(s)
      } catch {
        setClient('Client')
      }
    })()
  }, [params])
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        {/* Hero Video (data-driven) */}
        <section className="relative">
          <div className="relative w-full aspect-[16/9] bg-mp-black">
            <VideoPlayer
              id={`${client}-weddings-hero`}
              srcWebm={site?.weddings?.hero?.video?.webm}
              srcMp4={site?.weddings?.hero?.video?.mp4}
              poster={site?.weddings?.hero?.video?.poster}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-mp-black/80 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-display text-3xl sm:text-4xl font-bold text-white mb-3">{site?.weddings?.hero?.heading || (client + ' Weddings')}</h1>
            <p className="text-mp-gray-200 mb-4">{site?.weddings?.hero?.sub || 'Cinematic, story‑driven films with full ceremony and social edits.'}</p>
            <Button href="/book" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">{site?.weddings?.hero?.ctaText || 'Check Availability'}</Button>
          </div>
        </section>

        {/* Sections could include gallery, packages, FAQ, contact */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
            <p className="text-mp-gray-300">This is a scaffolding for a full client microsite. We’ll slot their media, palette, and copy here.</p>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


