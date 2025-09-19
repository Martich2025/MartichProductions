import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { VideoPlayer } from '@/components/media/video-player'
import { Button } from '@/components/ui/button'

interface PageProps { params: Promise<{ slug: string }> }

export default function ClientHospitalityMicrosite({ params }: PageProps) {
  const [client, setClient] = React.useState('Client')
  type VideoConfig = { mp4?: string; webm?: string; poster?: string }
  type Hero = { heading?: string; sub?: string; ctaText?: string; video?: VideoConfig }
  type ClientSite = { hospitality?: { hero?: Hero } }
  const [site, setSite] = React.useState<ClientSite | null>(null)
  React.useEffect(() => { (async () => { try { const p = await params; setClient(p.slug || 'Client'); const res = await fetch('/clients/' + (p.slug || '') + '/site.json', { cache: 'no-store' }); setSite(await res.json()) } catch { setClient('Client') } })() }, [params])
  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        <section className="relative">
          <div className="relative w-full aspect-[16/9] bg-mp-black">
            <VideoPlayer id={`${client}-hospitality-hero`} srcWebm={site?.hospitality?.hero?.video?.webm} srcMp4={site?.hospitality?.hero?.video?.mp4} poster={site?.hospitality?.hero?.video?.poster} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-mp-black/80 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-display text-3xl sm:text-4xl font-bold text-white mb-3">{site?.hospitality?.hero?.heading || (client + ' Hospitality')}</h1>
            <p className="text-mp-gray-200 mb-4">{site?.hospitality?.hero?.sub || 'Restaurant experiences, hotel & venue tours, and guest testimonial films.'}</p>
            <Button href="/book" className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">{site?.hospitality?.hero?.ctaText || 'Plan My Campaign'}</Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}


