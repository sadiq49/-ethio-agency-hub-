"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UseApiQueryOptions {
  duration?: number;
  cacheKey?: string;
  enabled?: boolean;
}

export function useApiQuery<T>(
  table: string,
  queryFn: (query: any) => any,
  options: UseApiQueryOptions = {}
) {
  const { duration = 5 * 60 * 1000, cacheKey = table, enabled = true } = options;
  const queryClient = useQueryClient();

  const fetchData = async () => {
    const query = supabase.from(table);
    const result = await queryFn(query);
    
    if (result.error) {
      throw result.error;
    }
    
    return result.data as T;
  };

  const queryKey = [table, cacheKey];
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    staleTime: duration,
    enabled,
  });

  // Prefetch method for this query
  const prefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: fetchData,
    });
  };

  return { data, isLoading, error, refetch, prefetch };
}