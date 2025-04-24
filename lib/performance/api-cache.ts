// SWR configuration for API caching
import { SWRConfig } from 'swr';

export function ApiCacheProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 60000, // 1 minute
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}

type CachedData<T> = {
  data: T;
  expiry: number;
};

// Usage example with Supabase
export async function fetchWithCache<T>(
  key: string, 
  fetcher: () => Promise<T>,
  expiryMinutes: number = 5
): Promise<T> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering, no localStorage available
    return await fetcher();
  }

  try {
    // Check if data exists in localStorage cache and is not expired
    const cachedItem = localStorage.getItem(key);
    
    if (cachedItem) {
      try {
        const { data, expiry } = JSON.parse(cachedItem) as CachedData<T>;
        if (expiry > Date.now()) {
          return data;
        }
        // Clear expired cache
        localStorage.removeItem(key);
      } catch (error) {
        // Invalid JSON in cache, remove it
        console.error(`Invalid cache data for key ${key}:`, error);
        localStorage.removeItem(key);
      }
    }

    // Fetch fresh data
    const freshData = await fetcher();
    
    try {
      // Cache the data with configurable expiry
      localStorage.setItem(
        key,
        JSON.stringify({
          data: freshData,
          expiry: Date.now() + expiryMinutes * 60 * 1000,
        })
      );
    } catch (error) {
      // Handle localStorage errors (e.g., quota exceeded)
      console.warn('Failed to cache data:', error);
    }
    
    return freshData;
  } catch (error) {
    console.error('Error in fetchWithCache:', error);
    // If anything goes wrong with caching, fall back to direct fetching
    return await fetcher();
  }
}