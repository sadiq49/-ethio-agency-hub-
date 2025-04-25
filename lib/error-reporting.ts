import * as Sentry from '@sentry/nextjs';
import { env } from './env';
import { analytics } from './analytics';

interface ErrorInfo {
  componentStack?: string;
  digest?: string;
}

class ErrorReporting {
  private enabled: boolean;
  private initialized = false;

  constructor() {
    this.enabled = env.NEXT_PUBLIC_ENABLE_CRASH_REPORTING;
  }

  initialize(): void {
    if (this.initialized) return;
    
    if (!this.enabled) {
      console.info('Error reporting disabled');
      return;
    }

    // Sentry is already initialized in sentry.*.config.js files
    
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleWindowError);
      window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    this.initialized = true;
    console.info('Error reporting initialized');
  }

  private handleWindowError = (event: ErrorEvent): void => {
    this.captureError(event.error || new Error(event.message), {
      componentStack: `at ${event.filename}:${event.lineno}:${event.colno}`,
    });
  };

  private handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    this.captureError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { componentStack: 'Unhandled Promise Rejection' }
    );
  };

  captureError(error: Error, errorInfo?: ErrorInfo): void {
    if (!this.enabled) return;
    
    // Log to console in development
    console.error('Captured error:', error, errorInfo);
    
    // Track in analytics
    analytics.trackEvent('error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...errorInfo
    });
    
    // Send to Sentry
    Sentry.captureException(error, {
      extra: errorInfo
    });
  }

  cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleWindowError);
      window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    }
    this.initialized = false;
  }
}

export const errorReporting = new ErrorReporting();