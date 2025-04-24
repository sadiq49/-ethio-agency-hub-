/**
 * useApiMutation Hook
 * 
 * A React hook for performing data mutations with automatic cache invalidation.
 */

import { useState } from "react";
import apiClient from "@/lib/api-client";

type UseApiMutationOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export function useApiMutation(
  table: string,
  options: UseApiMutationOptions = {}
) {
  const { onSuccess, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    operation: (supabase: any) => Promise<any>
  ) => {
    setIsLoading(true);
    setError(null);
    
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
      setError(error);
      setIsLoading(false);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  };

  return { mutate, isLoading, error };
}