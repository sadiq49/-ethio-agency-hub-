/**
 * useApiMutation Hook
 * 
 * A React hook for performing data mutations with automatic cache invalidation.
 */

import { useState } from "react";
import apiClient from "@/lib/api-client";

export function useApiMutation(
  table: string,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    maxRetries?: number;
    retryDelay?: number;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const apiClient = useApiClient();
  const { onSuccess, onError, maxRetries = 3, retryDelay = 1000 } = options;

  const mutate = async (
    operation: (supabase: any) => Promise<any>
  ) => {
    setIsLoading(true);
    setError(null);
    
    let retries = 0;
    let lastError: Error | null = null;
    
    const executeWithRetry = async (): Promise<any> => {
      try {
        const result = await apiClient.writeAndInvalidate(table, async () => {
          const supabase = apiClient.getClient();
          return operation(supabase);
        });
        
        setIsLoading(false);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err as Error;
        lastError = error;
        
        // Check if we should retry
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying operation (${retries}/${maxRetries})...`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          // Try again
          return executeWithRetry();
        }
        
        // Max retries reached, propagate the error
        setError(error);
        setIsLoading(false);
        
        if (onError) {
          onError(error);
        }
        
        throw error;
      }
    };
    
    return executeWithRetry();
  };

  return {
    mutate,
    isLoading,
    error,
  };
}