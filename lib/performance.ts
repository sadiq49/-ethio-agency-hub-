import { analytics } from './analytics';

export function trackPagePerformance() {
  if (typeof window === 'undefined') return;
  
  // Use Web Vitals API
  import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
    getCLS(metric => {
      // Report Cumulative Layout Shift
      analytics.trackEvent('performance_metric', {
        name: 'CLS',
        value: metric.value,
        path: window.location.pathname,
      });
    });
    
    getFID(metric => {
      // Report First Input Delay
      analytics.trackEvent('performance_metric', {
        name: 'FID',
        value: metric.value,
        path: window.location.pathname,
      });
    });
    
    getLCP(metric => {
      // Report Largest Contentful Paint
      analytics.trackEvent('performance_metric', {
        name: 'LCP',
        value: metric.value,
        path: window.location.pathname,
      });
    });
    
    getFCP(metric => {
      // Report First Contentful Paint
      analytics.trackEvent('performance_metric', {
        name: 'FCP',
        value: metric.value,
        path: window.location.pathname,
      });
    });
    
    getTTFB(metric => {
      // Report Time to First Byte
      analytics.trackEvent('performance_metric', {
        name: 'TTFB',
        value: metric.value,
        path: window.location.pathname,
      });
    });
  });
}