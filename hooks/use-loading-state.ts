import { useState, useCallback } from 'react';

interface UseLoadingStateOptions {
  onError?: (error: Error) => void;
}

export function useLoadingState<T>(options?: UseLoadingStateOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <R>(
    asyncFunction: () => Promise<R>
  ): Promise<R | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isLoading,
    error,
    execute
  };
}