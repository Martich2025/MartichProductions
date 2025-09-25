import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import { CookieConsent } from '@/components/global/cookie-consent'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif"
  ],
});

export const metadata: Metadata = {
  title: "Martich Productions - High-End Media Production & Cinematic Storytelling",
  description: "Professional videography and photography for luxury resorts, realtors, and hospitality brands. Cinematic content that drives results and tells your story.",
  keywords: [
    "videography",
    "photography", 
    "luxury resorts",
    "realtors",
    "hospitality",
    "cinematic",
    "media production",
    "Texas",
    "professional video"
  ],
  authors: [{ name: "Martich Productions" }],
  creator: "Martich Productions",
  publisher: "Martich Productions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://martichproductions.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Martich Productions - High-End Media Production",
    description: "Professional videography and photography for luxury resorts, realtors, and hospitality brands.",
    url: 'https://martichproductions.com',
    siteName: 'Martich Productions',
    images: [
      {
        url: '/placeholder.svg',
        width: 1200,
        height: 630,
        alt: 'Martich Productions - High-End Media Production',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Martich Productions - High-End Media Production",
    description: "Professional videography and photography for luxury resorts, realtors, and hospitality brands.",
    images: ['/placeholder.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
              <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
                <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
                <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
                <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
                <link rel="icon" type="image/png" sizes="256x256" href="/favicon-256.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon-192.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="theme-color" content="#D4AF37" />
                <meta name="msapplication-TileColor" content="#0A0A0A" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
              </head>
      <body className="font-body antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}
