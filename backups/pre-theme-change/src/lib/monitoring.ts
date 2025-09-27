/* Optional error monitoring scaffold (Sentry). Safe, DSN‑gated, no hard dep. */

type SentryModule = { init: (options: Record<string, unknown>) => void }
type DynamicImporter = (m: string) => Promise<SentryModule>
type NodeRequire = (id: string) => SentryModule

export async function initMonitoringClient() {
  try {
    if (typeof window === 'undefined') return
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    if (!dsn) return
    // Avoid static resolution by bundler
    const dynamicImport = (new Function('m', 'return import(m)')) as unknown as DynamicImporter
    const Sentry: SentryModule | null = await dynamicImport('@sentry/nextjs').catch(() => null)
    if (!Sentry) return
    Sentry.init({ dsn, tracesSampleRate: 0.1, replaysSessionSampleRate: 0.0, enabled: true })
  } catch (e) {
    console.warn('Monitoring(client) not initialized:', e)
  }
}

export async function initMonitoringServer() {
  try {
    if (typeof window !== 'undefined') return
    const dsn = process.env.SENTRY_DSN
    if (!dsn) return
    // Avoid static resolution by bundler
    const req = (0, eval)('require') as unknown as NodeRequire
    const Sentry: SentryModule | null = req ? req('@sentry/nextjs') : null
    if (!Sentry) return
    Sentry.init({ dsn, tracesSampleRate: 0.1, enabled: true })
  } catch (e) {
    console.warn('Monitoring(server) not initialized:', e)
  }
}


