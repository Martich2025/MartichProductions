import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/placeholder.svg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Martich Productions',
  section,
  tags = []
}: SEOProps): Metadata {
  const baseUrl = 'https://martichproductions.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  const defaultKeywords = [
    'videography',
    'photography',
    'luxury resorts',
    'realtors',
    'hospitality',
    'social media management',
    'content operations',
    'content os',
    'ai content workflow',
    'best time scheduling',
    'utm tracking',
    'conversion optimization',
    'client portal',
    'cinematic',
    'media production',
    'Texas',
    'professional video',
    'brand storytelling',
    'marketing videos',
    'drone cinematography'
  ]

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  return {
    title: `${title} | Martich Productions`,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: 'Martich Productions',
    publisher: 'Martich Productions',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | Martich Productions`,
      description,
      url: fullUrl,
      siteName: 'Martich Productions',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Martich Productions`,
      description,
      images: [fullImageUrl],
      creator: '@martichproductions',
      site: '@martichproductions',
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
  }
}

import { CONTACT_EMAIL, CONTACT_PHONE_TEL, CONTACT_CITY, CONTACT_STATE } from '@/lib/site'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Martich Productions',
    url: 'https://martichproductions.com',
    logo: 'https://martichproductions.com/logo.png',
    description: 'High-end media production with a personal touch. Professional videography and photography for luxury resorts, realtors, and hospitality brands.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT_CITY,
      addressRegion: CONTACT_STATE,
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE_TEL,
      contactType: 'customer service',
      email: CONTACT_EMAIL
    },
    sameAs: [
      'https://www.instagram.com/martichproductions',
      'https://www.facebook.com/martichproductions',
      'https://www.youtube.com/martichproductions',
      'https://www.linkedin.com/company/martichproductions'
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Mark Martich'
      },
      {
        '@type': 'Person',
        name: 'Krystal Martich'
      }
    ],
    foundingDate: '2009',
    numberOfEmployees: '2-10',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '31.9686',
        longitude: '-99.9018'
      },
      geoRadius: '500000'
    }
  }
}

export function generateServiceSchema(service: {
  name: string
  description: string
  category: string
  priceRange?: string
  areaServed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    category: service.category,
    provider: {
      '@type': 'Organization',
      name: 'Martich Productions',
      url: 'https://martichproductions.com'
    },
    ...(service.priceRange && {
      offers: {
        '@type': 'Offer',
        price: service.priceRange,
        priceCurrency: 'USD'
      }
    }),
    ...(service.areaServed && {
      areaServed: {
        '@type': 'Place',
        name: service.areaServed
      }
    })
  }
}

export function generateVideoObjectSchema(video: {
  name: string
  description: string
  thumbnailUrl: string
  contentUrl: string
  embedUrl?: string
  duration?: string
  uploadDate: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    contentUrl: video.contentUrl,
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
    ...(video.duration && { duration: video.duration }),
    uploadDate: video.uploadDate,
    publisher: {
      '@type': 'Organization',
      name: 'Martich Productions',
      url: 'https://martichproductions.com'
    }
  }
}

export function generateReviewSchema(review: {
  author: string
  reviewBody: string
  ratingValue: number
  bestRating: number
  worstRating: number
  datePublished: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: review.bestRating,
      worstRating: review.worstRating
    },
    datePublished: review.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Martich Productions'
    }
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://martichproductions.com${item.url}`
    }))
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://martichproductions.com/#organization',
    name: 'Martich Productions',
    image: 'https://martichproductions.com/logo.png',
    description: 'High-end media production with a personal touch. Professional videography and photography for luxury resorts, realtors, and hospitality brands.',
    url: 'https://martichproductions.com',
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT_CITY,
      addressRegion: CONTACT_STATE,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.9686',
      longitude: '-99.9018'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    },
    priceRange: '$$$',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '31.9686',
        longitude: '-99.9018'
      },
      geoRadius: '500000'
    }
  }
}
