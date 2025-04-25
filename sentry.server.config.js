import * as Sentry from '@sentry/nextjs';
import { env } from './lib/env';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: env.NEXT_PUBLIC_APP_ENV,
  enabled: env.NEXT_PUBLIC_ENABLE_CRASH_REPORTING,
});