'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/analytics/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
        
      analytics.trackPageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}