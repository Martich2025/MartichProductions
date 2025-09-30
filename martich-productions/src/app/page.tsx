import { MainLayout } from '@/components/layout/main-layout'
import { Hero } from '@/components/sections/hero'
import { Process } from '@/components/sections/process'
import { WorkShowcase } from '@/components/sections/work-showcase'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo'
import { Ecosystem } from '@/components/sections/ecosystem'
import { StatsBand } from '@/components/sections/stats-band'

export default function Home() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

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
      <MainLayout>
        <Hero />
        <StatsBand />
        <WorkShowcase />
        <Ecosystem />
        <Process />
        <Testimonials />
        <CTA />
      </MainLayout>
    </>
  )
}
