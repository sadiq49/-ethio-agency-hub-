// lib/analytics/providers/google-analytics.ts
import Analytics from 'analytics';
import googleAnalyticsPlugin from '@analytics/google-analytics';
import { env } from '../../env';

export const initializeGoogleAnalytics = () => {
  return Analytics({
    app: 'project-bolt',
    plugins: [
      googleAnalyticsPlugin({
        measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID
      })
    ]
  });
};{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' https://analytics.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://storage.googleapis.com;
    font-src 'self';
    connect-src 'self' https://*.supabase.co https://www.google-analytics.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
  `.replace(/\s+/g, ' ').trim()
}// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) throw error;
    
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
}// lib/performance.ts
export function trackPagePerformance() {
  if (typeof window === 'undefined') return;
  
  // Use Web Vitals API
  import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
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
  });
}/**
 * Environment configuration utility
 * Provides type-safe access to environment variables with validation
 */

// Define the shape of our environment variables
export interface EnvVariables {
  // API endpoints
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Google Cloud Vision API
  GOOGLE_CLOUD_VISION_API_KEY: string;
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: boolean;
  NEXT_PUBLIC_ENABLE_CRASH_REPORTING: boolean;
  
  // Other configuration
  NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
  NEXT_PUBLIC_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

// Default values for local development
const defaultEnv: EnvVariables = {
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_SUPABASE_URL: '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
  GOOGLE_CLOUD_VISION_API_KEY: '',
  NEXT_PUBLIC_ENABLE_ANALYTICS: false,
  NEXT_PUBLIC_ENABLE_CRASH_REPORTING: false,
  NEXT_PUBLIC_APP_ENV: 'development',
  NEXT_PUBLIC_LOG_LEVEL: 'debug',
};

// Helper to get environment variables with type safety
export function getEnv<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
  const value = process.env[key];
  
  // For boolean values, convert string to boolean
  if (typeof defaultEnv[key] === 'boolean') {
    return (value === 'true') as any;
  }
  
  // Return the environment variable or the default
  return (value || defaultEnv[key]) as EnvVariables[K];
}

// Export a configured env object for easy access
export const env = Object.keys(defaultEnv).reduce((acc, key) => {
  const typedKey = key as keyof EnvVariables;
  acc[typedKey] = getEnv(typedKey);
  return acc;
}, {} as EnvVariables);