// Simple analytics implementation
// Replace with your preferred analytics provider (GA4, Plausible, etc.)

type EventOptions = {
  [key: string]: string | number | boolean;
};

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    if (typeof window !== 'undefined') {
      console.log('Analytics initialized');
    }
  }

  // Track page views
  trackPageView(url: string) {
    if (!this.isProduction) {
      console.log(`[Analytics] Page view: ${url}`);
      return;
    }

    // Implement your actual analytics tracking here
    // Example for Google Analytics:
    // window.gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: url,
    // });
  }

  // Track custom events
  trackEvent(eventName: string, options?: EventOptions) {
    if (!this.isProduction) {
      console.log(`[Analytics] Event: ${eventName}`, options || {});
      return;
    }

    // Implement your actual event tracking here
    // Example for Google Analytics:
    // window.gtag('event', eventName, options);
  }

  // Track user identification (when logged in)
  identifyUser(userId: string, traits?: { [key: string]: any }) {
    if (!this.isProduction) {
      console.log(`[Analytics] User identified: ${userId}`, traits || {});
      return;
    }

    // Implement your actual user identification here
    // This depends on your analytics provider
  }
}

export const analytics = new Analytics();

// For use in React components
export function useAnalytics() {
  return analytics;
}