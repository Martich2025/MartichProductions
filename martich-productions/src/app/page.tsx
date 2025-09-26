import { MainLayout } from '@/components/layout/main-layout'
import { Hero } from '@/components/sections/hero'
import { Process } from '@/components/sections/process'
import { WorkShowcase } from '@/components/sections/work-showcase'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { TeamBand } from '@/components/sections/team-band'
import { generateOrganizationSchema, generateLocalBusinessSchema, generateVideoObjectSchema } from '@/lib/seo'
import { Ecosystem } from '@/components/sections/ecosystem'
import { StatsBand } from '@/components/sections/stats-band'
import { QuickSteps } from '@/components/sections/quick-steps'
import { MicroFAQ } from '@/components/sections/micro-faq'

export default function Home() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()
  const heroVideoSchema = generateVideoObjectSchema({
    name: 'Cinematic Studio Reel',
    description: 'Cinematic brand storytelling reel showcasing resorts, real estate, and hospitality.',
    thumbnailUrl: '/og-image.svg',
    contentUrl: 'https://player.vimeo.com/video/1108471932',
    uploadDate: new Date().toISOString(),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(heroVideoSchema),
        }}
      />
      <MainLayout>
        <Hero />
        <QuickSteps />
        <StatsBand />
        <MicroFAQ />
        <WorkShowcase />
        <Ecosystem />
        <TeamBand />
        <Process />
        <Testimonials />
        <CTA />
      </MainLayout>
    </>
  )
}
