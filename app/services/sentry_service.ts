import Env from '#start/env'
import * as Sentry from '@sentry/node'

// This function is used to initialize Sentry
export async function getSentry() {
  return Sentry.init({
    dsn: Env.get('SENTRY_DSN'),
    environment: Env.get('NODE_ENV'),
    tracesSampleRate: 1.0,
    integrations: [...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()],
  })
}
