'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'

export default function TermsOfService() {
  return (
    <MainLayout>
      <section className="bg-mp-black text-mp-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-mp-gray-300 mb-4">Effective: {new Date().getFullYear()}</p>

          <p className="text-mp-gray-200 mb-6">These Terms govern your use of the Martich Productions website and services.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Use of Site</h2>
          <p className="text-mp-gray-300">You agree not to misuse the site, attempt to access restricted areas, or infringe on IP rights.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Intellectual Property</h2>
          <p className="text-mp-gray-300">All content on this site is owned by or licensed to Martich Productions. You may not copy or distribute without permission.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
          <p className="text-mp-gray-300">The site is provided “as is.” We disclaim warranties to the extent permitted by law.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Governing Law</h2>
          <p className="text-mp-gray-300">Texas law governs these Terms. Disputes will be resolved in Texas courts.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-mp-gray-300">For questions about these Terms, email info@martichproductions.com.</p>
        </div>
      </section>
    </MainLayout>
  )
}


