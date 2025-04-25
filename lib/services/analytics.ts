import analytics from '@react-native-firebase/analytics';
import * as Sentry from 'sentry-expo';

// Initialize Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1.0,
});

export const Analytics = {
  /**
   * Track a screen view
   */
  trackScreen: async (screenName: string, screenClass?: string) => {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      Sentry.Native.captureException(error);
      console.error('Failed to track screen view:', error);
    }
  },

  /**
   * Track a custom event
   */
  trackEvent: async (eventName: string, params?: Record<string, any>) => {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      Sentry.Native.captureException(error);
      console.error('Failed to track event:', error);
    }
  },

  /**
   * Track user properties
   */
  setUserProperties: async (properties: Record<string, string>) => {
    try {
      Object.entries(properties).forEach(([key, value]) => {
        analytics().setUserProperty(key, value);
      });
    } catch (error) {
      Sentry.Native.captureException(error);
      console.error('Failed to set user properties:', error);
    }
  },

  /**
   * Set user ID for analytics
   */
  setUserId: async (userId: string | null) => {
    try {
      await analytics().setUserId(userId);
    } catch (error) {
      Sentry.Native.captureException(error);
      console.error('Failed to set user ID:', error);
    }
  },
};

/**
 * Error reporting utility
 */
export const ErrorReporting = {
  /**
   * Capture and report an exception
   */
  captureException: (error: Error, context?: Record<string, any>) => {
    try {
      if (context) {
        Sentry.Native.setContext('additional', context);
      }
      Sentry.Native.captureException(error);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  },

  /**
   * Set user information for error reporting
   */
  setUser: (user: { id: string; email?: string; username?: string } | null) => {
    Sentry.Native.setUser(user);
  },

  /**
   * Add breadcrumb for error context
   */
  addBreadcrumb: (breadcrumb: {
    category: string;
    message: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }) => {
    Sentry.Native.addBreadcrumb(breadcrumb);
  },
};