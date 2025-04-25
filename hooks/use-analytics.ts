import { useEffect } from 'react';
import { Analytics, ErrorReporting } from '../lib/services/analytics';

export function useAnalytics() {
  return {
    /**
     * Track screen view
     */
    trackScreen: (screenName: string, screenClass?: string) => {
      Analytics.trackScreen(screenName, screenClass);
    },
    
    /**
     * Track user event
     */
    trackEvent: (eventName: string, params?: Record<string, any>) => {
      Analytics.trackEvent(eventName, params);
    },
    
    /**
     * Set user properties
     */
    setUserProperties: (properties: Record<string, string>) => {
      Analytics.setUserProperties(properties);
    },
    
    /**
     * Report error
     */
    reportError: (error: Error, context?: Record<string, any>) => {
      ErrorReporting.captureException(error, context);
    },
    
    /**
     * Add breadcrumb for error context
     */
    addBreadcrumb: (category: string, message: string, data?: Record<string, any>) => {
      ErrorReporting.addBreadcrumb({
        category,
        message,
        data,
      });
    }
  };
}

/**
 * Hook to automatically track screen views
 */
export function useScreenTracking(screenName: string) {
  useEffect(() => {
    Analytics.trackScreen(screenName);
  }, [screenName]);
}