/**
 * API Cache Utility
 * 
 * A utility for caching API responses to improve application performance.
 * Supports configurable cache duration, forced refreshes, and cache invalidation.
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type CacheOptions = {
  duration?: number; // Cache duration in milliseconds (default: 5 minutes)
  forceRefresh?: boolean; // Force a refresh regardless of cache status
};

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Fetch data with caching support
   * @param key Unique cache key
   * @param fetchFn Function that returns a promise with the data to cache
   * @param options Cache options
   * @returns Promise with the cached or freshly fetched data
   */
  async fetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { duration = this.defaultDuration, forceRefresh = false } = options;
    const now = Date.now();

    // Check if we have a valid cache entry
    if (!forceRefresh && this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      
      // Return cached data if it's still valid
      if (now - entry.timestamp < duration) {
        return entry.data;
      }
    }

    // Fetch fresh data
    try {
      const data = await fetchFn();
      
      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: now,
      });
      
      return data;
    } catch (error) {
      // If we have stale data, return it on error
      if (this.cache.has(key)) {
        console.warn(`Error fetching fresh data for ${key}, using stale cache:`, error);
        return this.cache.get(key)!.data;
      }
      
      // Otherwise, propagate the error
      throw error;
    }
  }

  /**
   * Invalidate a specific cache entry
   * @param key Cache key to invalidate
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate multiple cache entries by prefix
   * @param prefix Cache key prefix to match
   */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if a key exists in the cache
   * @param key Cache key to check
   * @returns Boolean indicating if the key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [_, entry] of this.cache.entries()) {
      if (now - entry.timestamp < this.defaultDuration) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }
}

// Create a singleton instance
const apiCache = new ApiCache();

export default apiCache;