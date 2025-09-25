'use client'

import { AnalyticsEvent } from '@/lib/types'

// Analytics tracking utility
export class Analytics {
  private static instance: Analytics
  private sessionId: string
  private userId?: string

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.userId = this.getUserId()
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  private generateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined
    return localStorage.getItem('analytics_user_id') || undefined
  }

  public setUserId(userId: string): void {
    this.userId = userId
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_user_id', userId)
    }
  }

  private track(event: AnalyticsEvent): void {
    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va.track(event.event, event.properties)
    }

    // Send to PostHog (if configured)
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event.event, event.properties)
    }

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(event)
  }

  private async sendToCustomEndpoint(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  // Page tracking
  public pageView(page: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'page_view',
      properties: {
        page,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Video tracking
  public videoPlay(videoId: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'video_play',
      properties: {
        video_id: videoId,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  public videoComplete(videoId: string, duration: number, properties?: Record<string, unknown>): void {
    this.track({
      event: 'video_complete',
      properties: {
        video_id: videoId,
        duration,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // CTA tracking
  public ctaClick(ctaText: string, ctaLocation: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'cta_click',
      properties: {
        cta_text: ctaText,
        cta_location: ctaLocation,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Form tracking
  public formSubmit(formName: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'form_submit',
      properties: {
        form_name: formName,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  public consultSubmit(properties?: Record<string, unknown>): void {
    this.track({
      event: 'consult_submit',
      properties: {
        form_name: 'consult_form',
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Resource tracking
  public resourceDownload(resourceName: string, resourceType: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'resource_download',
      properties: {
        resource_name: resourceName,
        resource_type: resourceType,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Social tracking
  public outboundSocialClick(platform: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'outbound_social_click',
      properties: {
        platform,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Case study tracking
  public caseStudyView(caseStudyId: string, caseStudyTitle: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'case_study_view',
      properties: {
        case_study_id: caseStudyId,
        case_study_title: caseStudyTitle,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Service tracking
  public serviceView(serviceName: string, serviceCategory: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'service_view',
      properties: {
        service_name: serviceName,
        service_category: serviceCategory,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Lead tracking
  public leadGenerated(source: string, properties?: Record<string, unknown>): void {
    this.track({
      event: 'lead_generated',
      properties: {
        lead_source: source,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  // Custom event tracking
  public customEvent(eventName: string, properties?: Record<string, unknown>): void {
    this.track({
      event: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance()

// Hook for React components
export function useAnalytics() {
  return analytics
}

// Utility functions for common tracking patterns
export const trackPageView = (page: string, properties?: Record<string, unknown>) => {
  analytics.pageView(page, properties)
}

export const trackVideoPlay = (videoId: string, properties?: Record<string, unknown>) => {
  analytics.videoPlay(videoId, properties)
}

export const trackCTAClick = (ctaText: string, ctaLocation: string, properties?: Record<string, unknown>) => {
  analytics.ctaClick(ctaText, ctaLocation, properties)
}

export const trackFormSubmit = (formName: string, properties?: Record<string, unknown>) => {
  analytics.formSubmit(formName, properties)
}

export const trackConsultSubmit = (properties?: Record<string, unknown>) => {
  analytics.consultSubmit(properties)
}

export const trackResourceDownload = (resourceName: string, resourceType: string, properties?: Record<string, unknown>) => {
  analytics.resourceDownload(resourceName, resourceType, properties)
}

export const trackOutboundSocialClick = (platform: string, properties?: Record<string, unknown>) => {
  analytics.outboundSocialClick(platform, properties)
}

export const trackCaseStudyView = (caseStudyId: string, caseStudyTitle: string, properties?: Record<string, unknown>) => {
  analytics.caseStudyView(caseStudyId, caseStudyTitle, properties)
}

export const trackServiceView = (serviceName: string, serviceCategory: string, properties?: Record<string, unknown>) => {
  analytics.serviceView(serviceName, serviceCategory, properties)
}

export const trackLeadGenerated = (source: string, properties?: Record<string, unknown>) => {
  analytics.leadGenerated(source, properties)
}

// Declare global types for analytics libraries
declare global {
  interface Window {
    va?: {
      track: (event: string, properties?: Record<string, unknown>) => void
    }
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}
