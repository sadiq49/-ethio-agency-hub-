"use client";

import React, { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { errorReporting } from '@/lib/error-reporting';
import { trackPagePerformance } from '@/lib/performance';
import { usePathname } from 'next/navigation';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const pathname = usePathname();

  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      // Initialize error reporting first to catch any errors during initialization
      errorReporting.initialize();
      
      try {
        // Initialize analytics
        await analytics.initialize();
        
        // Track performance metrics
        trackPagePerformance();
      } catch (error) {
        errorReporting.captureError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    initServices();

    // Cleanup on unmount
    return () => {
      errorReporting.cleanup();
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}