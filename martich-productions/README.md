# Martich Productions Website

A modern, conversion-focused website for Martich Productions - a high-end media production company specializing in luxury resorts, realtors, and hospitality brands.

## 🚀 Features

### 🎬 Visual Upgrades (2025 Standards)
- **Cinematic Hero**: Full-screen video background with sophisticated overlay
- **Enhanced Typography**: Variable fonts with dramatic scaling and gradient text
- **Micro-interactions**: Hover effects, scale animations, glow effects, smooth transitions
- **Dark Mode Toggle**: Sophisticated dark/light theme switching
- **Scroll Animations**: Intersection observer-based fade-in effects
- **Mobile Optimization**: Touch-friendly navigation and thumb-optimized CTAs
- **Custom Favicons**: Complete favicon package with all sizes and manifest

### Core Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Stack**: Next.js 14, TypeScript, App Router
- **Performance Optimized**: Core Web Vitals compliant
- **SEO Ready**: Comprehensive meta tags, schema markup, sitemap
- **Analytics**: Built-in tracking for all user interactions

### Pages
- **Home**: Cinematic hero, process showcase, work highlights, testimonials
- **Work**: Case studies with filtering and detailed project pages
- **Services**: Industry-specific service pages (Resorts, Realtors, Hospitality)
- **About**: Team story, values, and company information
- **Resources**: Downloadable guides, tips, and behind-the-scenes content
- **Book Consult**: Lead capture form with calendar integration
- **Client Portal**: Secure login for existing clients

### Design System (2025 Standards)
- **Brand Colors**: Gold (#D4AF37) with full 50-950 scale, Charcoal (#1A1A1A), White (#FFFFFF)
- **Typography**: Inter Variable font with cinematic scaling and modern hierarchy
- **Components**: Reusable UI components with micro-interactions and hover effects
- **Animations**: Framer Motion + custom CSS animations (shimmer, float, pulse-glow)
- **Dark Mode**: Toggle with sophisticated dark/light themes
- **Accessibility**: AA compliant with proper focus states and touch targets
- **Mobile-First**: 44px minimum touch targets, swipe gestures, thumb-friendly CTAs

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics + PostHog ready
- **Deployment**: Vercel (configured)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (pages)/           # Main website pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with metadata
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── robots.ts          # Robots.txt configuration
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── lib/                  # Utilities and configurations
│   ├── analytics.ts      # Analytics tracking
│   ├── seo.ts           # SEO utilities and schema
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd martich-productions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Analytics (optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=your_ga4_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Clerk Authentication (for client portal)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Database (for future CMS integration)
DATABASE_URL=your_database_url

# Email Service (for form submissions)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 📊 Analytics & Tracking

The website includes comprehensive analytics tracking:

### Events Tracked
- **Page Views**: Automatic tracking on route changes
- **Video Interactions**: Play, pause, complete events
- **Form Submissions**: Consult form, newsletter signup
- **CTA Clicks**: Button clicks with location context
- **Resource Downloads**: Guide and template downloads
- **Social Clicks**: Outbound social media links
- **Case Study Views**: Individual project page visits

### Analytics Providers
- **Vercel Analytics**: Built-in performance and usage metrics
- **PostHog**: Advanced user behavior tracking (optional)
- **Custom API**: Internal analytics endpoint for custom tracking

## 🎨 Design System

### Colors
```css
--mp-gold: #D4AF37        /* Primary brand color */
--mp-gold-light: #E6C659  /* Light gold variant */
--mp-gold-dark: #B8941F   /* Dark gold variant */
--mp-black: #0A0A0A       /* Primary text */
--mp-charcoal: #1A1A1A    /* Secondary backgrounds */
--mp-gray: #6B7280        /* Muted text */
--mp-gray-light: #F3F4F6  /* Light backgrounds */
--mp-white: #FFFFFF       /* Primary background */
```

### Typography
- **Display Font**: Inter (headings, large text)
- **Body Font**: Inter (body text, descriptions)
- **Mono Font**: JetBrains Mono (code, technical content)

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Flexible container with hover effects
- **Input**: Form inputs with validation states
- **Layout**: Header, footer, main layout components

## 🔍 SEO Features

### Meta Tags
- Dynamic title and description generation
- Open Graph tags for social sharing
- Twitter Card optimization
- Canonical URLs
- Viewport and theme color configuration

### Schema Markup
- Organization schema
- Local business schema
- Service schemas
- Video object schemas
- Review schemas
- FAQ schemas
- Breadcrumb navigation

### Performance
- Core Web Vitals optimization
- Image optimization with Next.js
- Font optimization
- Bundle size optimization
- Lazy loading for images and components

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## ♿ Accessibility

- **WCAG AA Compliant**: Color contrast ratios meet standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Alt Text**: Descriptive alt text for all images

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📈 Performance

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **INP**: < 200ms (Interaction to Next Paint)

### Optimization Features
- Image optimization with Next.js
- Font optimization
- Code splitting
- Lazy loading
- Bundle analysis

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting (recommended)
- **TypeScript**: Strict mode enabled
- **Import Sorting**: Organized imports

## 📝 Content Management

Currently using static content with TypeScript interfaces. Future CMS integration planned for:
- Case studies management
- Service page content
- Resource library
- Blog posts
- Team member profiles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to Martich Productions.

## 📞 Support

For technical support or questions:
- Email: hello@martichproductions.com
- Phone: (123) 456-7890

---

Built with ❤️ by Martich Productions