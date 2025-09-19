// Content Models
export interface CaseStudy {
  id: string
  title: string
  client: string
  vertical: 'resorts' | 'realtors' | 'hospitality' | 'other'
  slug: string
  problem: string
  approach: string
  execution: string
  results_metrics: string[]
  reel_mux_id?: string
  images: string[]
  quote: string
  quote_author: string
  quote_role: string
  seo: SEOData
  published_at: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  category: 'resorts' | 'realtors' | 'hospitality'
  description: string
  inclusions: string[]
  price_range: {
    min: number
    max: number
    currency: string
  }
  faqs: FAQ[]
  assets: string[]
  seo: SEOData
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client: string
  quote: string
  role: string
  project_slug: string
  rating: number
  created_at: string
}

export interface ClientLogo {
  id: string
  name: string
  logo_url: string
  link?: string
  created_at: string
}

export interface Resource {
  id: string
  title: string
  content_mdx: string
  excerpt: string
  assets: string[]
  seo: SEOData
  published_at: string
  created_at: string
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface SEOData {
  meta_title: string
  meta_description: string
  og_image: string
  schema_jsonld?: Record<string, unknown>
}

export interface GlobalContent {
  nav: NavigationItem[]
  footer: FooterContent
  social_links: SocialLink[]
  proof_metrics: ProofMetric[]
  ctas: CTA[]
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  children?: NavigationItem[]
}

export interface FooterContent {
  company_name: string
  tagline: string
  social_links: SocialLink[]
  legal_links: LegalLink[]
  contact_info: ContactInfo
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'twitter'
  url: string
  label: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export interface ProofMetric {
  id: string
  value: string
  label: string
  description?: string
}

export interface CTA {
  id: string
  text: string
  href: string
  variant: 'primary' | 'secondary' | 'outline'
  size: 'sm' | 'md' | 'lg'
}

// Form Types
export interface ConsultFormData {
  name: string
  email: string
  phone: string
  company: string
  project_type: 'resort' | 'realtor' | 'hospitality' | 'other'
  budget_range: string
  timeline: string
  message: string
  source: string
}

export interface NewsletterFormData {
  email: string
  source: string
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties: Record<string, unknown>
  timestamp: string
  session_id: string
  user_id?: string
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Component Props Types - 2024/2025 Standards
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  asChild?: boolean
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export interface VideoProps {
  src: string
  poster?: string
  title: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

// Social Media Types
export interface SocialPost {
  id: string
  platform: 'instagram' | 'facebook'
  content: string
  media_urls: string[]
  scheduled_at: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  metrics?: SocialMetrics
  created_at: string
  updated_at: string
}

export interface SocialMetrics {
  impressions: number
  reach: number
  engagement: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  ctr: number
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer' | 'client'
  organization_id: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  settings: OrganizationSettings
  created_at: string
  updated_at: string
}

export interface OrganizationSettings {
  branding: {
    logo_url?: string
    primary_color?: string
    secondary_color?: string
  }
  social_media: {
    platforms: string[]
    quiet_hours: QuietHours
    banned_terms: string[]
  }
  notifications: {
    email: boolean
    slack?: string
  }
}

export interface QuietHours {
  timezone: string
  weekdays: {
    start: string
    end: string
  }
  weekends: {
    start: string
    end: string
  }
  holidays: string[]
}
