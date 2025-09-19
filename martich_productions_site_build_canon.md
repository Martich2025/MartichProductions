# Martich Productions — Site Build Canon (Master)

**Prepared for:** Martich Productions  
**Prepared by:** Social Media Manager (operator, full‑auto; no client approvals)  
**Scope:** Website redesign + Client portal + FB/IG social engine (Phase 1), scalable to all clients

---

## Executive Summary
We are building a single AI‑powered content OS that plans, creates, schedules, posts, and learns—across your website and Facebook/Instagram. The site converts, the portal scales to clients, and the engine runs in full‑auto with strong brand safety and rights controls.

---

## Locked Decisions
- **Platforms (Phase 1):** Facebook + Instagram
- **Quiet hours:** CST (TX) weekdays 10pm–6am; weekends 9pm–8am; US holidays blackout
- **Assets:** Live on MP server; auto‑ingest/sync to cloud pipeline
- **Website:** Full redesign + "Book a Consult" flow
- **Safety:** Banned words/phrases + LoRA‑guided style/voice checks
- **Operator model:** You manage everything; clients do not approve posts

---

## Configuration (JSON)
```json
{
  "project": {
    "name": "Martich Productions Website & Client Portal",
    "owner": "Martich Productions",
    "operator": "Social Media Manager",
    "mode": "full_auto_no_client_approvals"
  },
  "goals_kpis": {
    "goals": ["Book consults", "Showcase results", "Streamline delivery & reporting"],
    "kpis": ["consult_submits", "booking_clicks", "dm_initiations", "case_study_views", "lead_to_call_rate"]
  },
  "stack": {
    "frontend": "Next.js 14 (App Router), TypeScript, Tailwind, Vercel",
    "auth": "Clerk Organizations (roles: admin, editor, viewer, client)",
    "db": "Vercel Postgres (RLS by org; Phase 2)",
    "jobs": "Upstash Redis + Vercel Cron (scheduling, retries, DLQ)",
    "storage": { "video": "Mux", "files": "S3/R2 with signed URLs & versioning" },
    "analytics": "Vercel Analytics + PostHog",
    "integrations_phase1": ["Meta Graph (IG/FB)", "Calendly or built-in booking"],
    "quiet_hours": { "tz": "America/Chicago", "wd": "22:00-06:00", "we": "21:00-08:00", "holidays": "US_blackout" },
    "safety": { "banned_terms": true, "humor_dial": true, "rights_checks": true, "lora_style_guard": true }
  },
  "sitemap": [
    { "path": "/", "name": "Home" },
    { "path": "/work", "name": "Work (grid)" },
    { "path": "/work/[slug]", "name": "Case Study" },
    { "path": "/services", "name": "Services" },
    { "path": "/services/resorts", "name": "Luxury Resorts" },
    { "path": "/services/realtors", "name": "Realtors" },
    { "path": "/services/hospitality", "name": "Hospitality" },
    { "path": "/about", "name": "About" },
    { "path": "/resources", "name": "Resources" },
    { "path": "/book", "name": "Book a Consult" },
    { "path": "/client", "name": "Client Login" },
    { "path": "/legal/privacy", "name": "Privacy" },
    { "path": "/legal/terms", "name": "Terms" }
  ],
  "content_model": {
    "CaseStudy": ["title","client","vertical","slug","problem","approach","execution","results_metrics[]","reel_mux_id","images[]","quote","seo"],
    "Service": ["title","category","inclusions[]","price_range","faqs[]","assets[]","seo"],
    "Testimonial": ["client","quote","role","project_slug"],
    "ClientLogo": ["name","logo_url","link"],
    "Resource": ["title","content_mdx","assets[]","seo"],
    "Global": ["nav","footer","social_links","proof_metrics","ctas"],
    "SEO": ["meta_title","meta_description","og_image","schema_jsonld"]
  },
  "events": ["page_view","video_play","cta_click","consult_submit","resource_download","outbound_social_click"],
  "seo": {
    "schema": ["Organization","Service","Review","VideoObject","FAQPage"],
    "video_sitemap": true,
    "internal_linking": "services<->case_studies<->resources"
  },
  "acceptance_v1": [
    "All routes responsive, AA accessible, fast CWV",
    "Home + Work + Case Study template + 3 Services + About + Resources + Book + Client Login",
    "Consult form + calendar + tracked events",
    "SEO meta + schema + video sitemap",
    "3 seeded case studies, resources seeded",
    "Client Login stub for Phase 2 portal"
  ],
  "acceptance_v2_fb_ig": [
    "OAuth connectors + token refresh",
    "Scheduling with quiet hours + retries",
    "Feed video/photo + reels (where supported) publishing",
    "Banned terms + rights preflight + humor dial",
    "Insights ingestion + dashboards + best-time optimizer",
    "Alerts for failures/tokens/anomalies"
  ]
}
```

---

## Experience Principles
- **Brand-first outcomes:** show results (metrics, wins), not just visuals
- **One upload → everywhere:** platform‑specific posts + auto‑updated site
- **Operator-in-control:** full‑auto with safety rails; instant pause; fast rollback
- **Learn‑everywhere:** hooks/timing/formats improve from performance data

---

## Information Architecture

### Home
- Cinematic hero + 1‑line value + proof bar + primary CTA ("Book a Consult")
- Signature process (Discovery → Creative → Production → Delivery)
- Reel showcase + BTS feed + rotating testimonials
- Secondary CTA to resources/contact

### Work → Case Studies
- **Problem** → **Creative** → **Execution** → **Results** (metrics)
- Short reel (Mux-optimized)
- Client quote + testimonial
- CTA to consult/book

### Services
- Per-vertical pages (Resorts, Realtors, Hospitality)
- What's included + process + price ranges
- FAQs + CTA to consult
- Case study cross-links

### About
- Mark + Krystal story + credibility
- Behind-the-scenes vibe + values
- Team photos + process insights

### Resources
- Planning guides + checklists + rate insights
- BTS content + skits (auto-updating from Content OS)
- Download gated with email capture

### Book a Consult
- Short form + calendar integration
- Tracked CTAs + DM keyword prompts
- Thank-you page with next steps

### Client Login
- Secure portal entry (Phase 2 expansion)
- Forgot/reset flows
- Role-based access

---

## Design System

### Visual Tokens
- **Colors:** Warm, cinematic palette (dark-ready)
- **Typography:** Bold headlines, readable body, elegant hierarchy
- **Spacing:** Generous whitespace, consistent rhythm
- **Motion:** Subtle, purposeful animations

### Components Library
- **Layout:** Header/Nav, Footer, Hero sections
- **Content:** Reel/Video cards, Gallery grids, Testimonial carousels
- **Interactive:** CTA blocks, Forms, Pricing bands, FAQ accordions
- **Social:** Feed embeds, Newsletter opt-ins
- **Utility:** Toast/Alert, Pagination/Filters, Loading states

### Performance Standards
- **Core Web Vitals:** LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Images:** WebP/AVIF, lazy loading, responsive sizing
- **Video:** Mux streaming, poster frames, adaptive bitrate
- **Accessibility:** AA compliant, semantic landmarks, focus states

---

## Content Strategy

### Storytelling Framework
1. **Problem:** What challenge did the client face?
2. **Creative:** How did we approach it uniquely?
3. **Execution:** What was our process?
4. **Results:** Measurable outcomes + client quote

### Content Types
- **Case Studies:** Problem → Creative → Execution → Results
- **BTS Content:** Process insights, team moments, equipment
- **Educational:** Planning guides, rate insights, industry tips
- **Social Proof:** Testimonials, logos, metrics, reviews

### SEO Strategy
- **Schema Markup:** Organization, Service, Review, VideoObject, FAQ
- **Internal Linking:** Services ↔ Case Studies ↔ Resources
- **Video Sitemap:** All reels and case study videos
- **Local SEO:** Texas-based, hospitality industry focus

---

## Technical Architecture

### Phase 1: Website Foundation
- Next.js 14 with App Router
- TypeScript + Tailwind CSS
- Vercel deployment + analytics
- File-based CMS (Markdown/MDX)
- Basic auth setup (Clerk)

### Phase 2: Database + Admin
- Vercel Postgres with RLS
- Content management interface
- Asset upload + Mux integration
- User roles + permissions

### Phase 3: Social Engine
- Meta Graph API integration
- Content scheduling + publishing
- Analytics ingestion + dashboards
- AI content generation + safety

### Phase 4: Client Portal
- Multi-tenant architecture
- Asset delivery + reporting
- White-label capabilities
- Client-specific branding

---

## Conversion Funnel

### Primary Path
1. **Discovery:** Social post → Landing page
2. **Interest:** Case study → Work page
3. **Consideration:** Services → Resources
4. **Intent:** Book Consult → Form submit
5. **Conversion:** Calendar booking → Call

### Secondary Paths
- **Direct:** Home → Book Consult
- **Research:** Resources → Email capture → Follow-up
- **Social:** DM keywords → Consult booking

### Tracking Events
- `page_view`, `video_play`, `cta_click`
- `consult_submit`, `resource_download`
- `outbound_social_click`, `dm_initiation`

---

## Social Media Integration

### Content Pipeline
1. **Ingest:** MP server → Cloud storage → Transcription
2. **Create:** AI hooks + captions + platform variants
3. **Schedule:** Best-time posting + quiet hours
4. **Publish:** Auto-posting + retry logic
5. **Learn:** Analytics → Optimization

### Platform Strategy
- **Instagram:** Reels-heavy, Stories daily, carousel summaries
- **Facebook:** Community building, client success stories
- **Cross-platform:** Consistent voice, platform-specific formatting

### Safety & Rights
- Banned terms filtering
- Humor dial adjustment
- Rights preflight checks
- Crisis controls (pause/delete)

---

## Analytics & Reporting

### Key Metrics
- **Conversion:** Consult submits, booking rate, lead quality
- **Content:** Reach, engagement, watch time, saves
- **Funnel:** Source attribution, time-to-conversion
- **Operations:** Posting reliability, content throughput

### Dashboards
- **Global:** Top posts, best times, content mix
- **Client-specific:** Performance, deliverables, reports
- **Operational:** Queue health, error rates, capacity

---

## Rollout Plan

### Weeks 0-2: Website Foundation
- [ ] Next.js setup + routing
- [ ] Component library + design system
- [ ] Home, Work, Services, About pages
- [ ] Consult form + basic tracking
- [ ] Content seeding (3 case studies)

### Weeks 3-4: Database + Admin
- [ ] Postgres setup + content models
- [ ] Admin interface for content management
- [ ] Asset upload + Mux integration
- [ ] User authentication + roles

### Weeks 5-6: Social Engine
- [ ] Meta Graph API integration
- [ ] Content scheduling + publishing
- [ ] Analytics ingestion + dashboards
- [ ] Safety controls + banned terms

### Weeks 7-8: Client Portal
- [ ] Multi-tenant architecture
- [ ] Asset delivery + reporting
- [ ] White-label capabilities
- [ ] Client onboarding flows

---

## Success Criteria

### Phase 1 (Website)
- All pages live, responsive, accessible
- Consult form converting at >5%
- Case studies driving engagement
- SEO optimized, fast loading

### Phase 2 (Social Engine)
- FB/IG posting automated
- Content performing above benchmarks
- Safety controls preventing issues
- Analytics providing actionable insights

### Phase 3 (Client Portal)
- Clients can access deliverables
- Reports generated automatically
- System scales to multiple clients
- Revenue attribution clear

---

## Risk Mitigation

### Technical Risks
- **API limits:** Queue-based calls, error handling
- **Performance:** Caching, CDN, optimization
- **Security:** Auth, RLS, input validation

### Brand Risks
- **Voice drift:** Canon-locked prompts, regular review
- **Over-automation:** Human oversight, quality checks
- **Rights issues:** Preflight checks, usage tracking

### Business Risks
- **Client expectations:** Clear scope, regular updates
- **Competition:** Unique positioning, continuous improvement
- **Scaling:** Robust architecture, monitoring

---

## Next Steps

1. **Approve this canon** as the master blueprint
2. **Set up development environment** (Next.js + Vercel)
3. **Create component library** and design system
4. **Build core pages** (Home, Work, Services, About)
5. **Implement consult form** with tracking
6. **Seed initial content** (3 case studies, 1 service)
7. **Verify Resend email domain** after DNS/hosting transfer (martichproductions.com), then switch FROM to branded address; use onboarding@resend.dev fallback until verified

**Ready to begin development?** This canon will guide every decision and ensure we build exactly what Martich Productions needs to dominate their market.

---

*This document is the single source of truth for the Martich Productions website and social media automation system. All development decisions should reference and align with this canon.*
