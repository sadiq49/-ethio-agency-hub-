type ErrorLogLevel = 'info' | 'warning' | 'error' | 'fatal';

interface ErrorLogOptions {
  level?: ErrorLogLevel;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
}

// Add Sentry integration for production error tracking
import * as Sentry from '@sentry/nextjs';

export function logError(
  error: Error | string,
  options: ErrorLogOptions = { level: 'error' }
) {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const timestamp = new Date().toISOString();
  
  // In development, log to console
  if (process.env.NODE_ENV !== 'production') {
    console.group(`[${options.level?.toUpperCase()}] ${timestamp}`);
    console.error(errorObj);
    if (options.context) console.log('Context:', options.context);
    if (options.user) console.log('User:', options.user);
    console.groupEnd();
    return;
  }

  // In production, send to Sentry
  Sentry.captureException(errorObj, {
    level: options.level as Sentry.SeverityLevel,
    extra: options.context,
    user: options.user,
  });
  
  // Also log to your backend API for custom handling
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: errorObj.message,
      stack: errorObj.stack,
      level: options.level,
      context: options.context,
      user: options.user,
      timestamp,
    }),
  }).catch(console.error);
}

// Add environment validation function
export function validateEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`, {
      level: 'fatal',
      context: { missingVars }
    });
    return false;
  }
  
  return true;
}