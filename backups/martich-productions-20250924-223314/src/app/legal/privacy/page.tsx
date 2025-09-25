'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <section className="bg-mp-black text-mp-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-mp-gray-300 mb-4">Last updated: {new Date().getFullYear()}</p>

          <p className="text-mp-gray-200 mb-6">We respect your privacy. This policy explains what data we collect, how we use it, and your choices.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-mp-gray-300">
            <li>Contact information you submit (name, email, phone).</li>
            <li>Site analytics (pages viewed, device, referral, approximate location).</li>
            <li>Form and booking details you provide for services.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-mp-gray-300">
            <li>Respond to inquiries and deliver services.</li>
            <li>Improve our site and offerings (analytics, A/B testing).</li>
            <li>Marketing communications with opt‑out available anytime.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">Sharing</h2>
          <p className="text-mp-gray-300">We do not sell personal data. We use trusted processors (hosting, analytics, CRM) under contractual safeguards.</p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Your Choices</h2>
          <ul className="list-disc pl-6 space-y-2 text-mp-gray-300">
            <li>Opt out of marketing via any email footer link.</li>
            <li>Request access or deletion by emailing info@martichproductions.com.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-mp-gray-300">Questions? Email info@martichproductions.com.</p>
        </div>
      </section>
    </MainLayout>
  )
}


