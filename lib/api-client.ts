/**
 * API Client with Caching
 * 
 * A wrapper around Supabase client that provides caching capabilities
 * for improved performance and reduced API calls.
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import apiCache from "./api-cache";

// Type for cache options
type ApiCacheOptions = {
  duration?: number;
  forceRefresh?: boolean;
  cacheKey?: string;
};

class ApiClient {
  private supabase = createClientComponentClient();

  /**
   * Fetch data from a table with caching
   * @param table Table name
   * @param query Query function that takes a supabase query builder and returns a modified query
   * @param options Cache options
   * @returns Promise with the query results
   */
  async fetchWithCache<T>(
    table: string,
    query: (queryBuilder: any) => any,
    options: ApiCacheOptions = {}
  ) {
    const { duration, forceRefresh, cacheKey } = options;
    
    // Generate a cache key if not provided
    const key = cacheKey || `table:${table}:${query.toString()}`;
    
    return apiCache.fetch<T>(
      key,
      async () => {
        const queryBuilder = this.supabase.from(table);
        const { data, error } = await query(queryBuilder);
        
        if (error) {
          throw error;
        }
        
        return data;
      },
      { duration, forceRefresh }
    );
  }

  /**
   * Invalidate cache for a specific table
   * @param table Table name to invalidate
   */
  invalidateTable(table: string) {
    apiCache.invalidateByPrefix(`table:${table}`);
  }

  /**
   * Get the raw Supabase client
   * @returns Supabase client
   */
  getClient() {
    return this.supabase;
  }

  /**
   * Perform a write operation and invalidate related cache
   * @param table Table name
   * @param operation Function that performs the write operation
   * @returns Result of the operation
   */
  async writeAndInvalidate(table: string, operation: () => Promise<any>) {
    const result = await operation();
    this.invalidateTable(table);
    return result;
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;