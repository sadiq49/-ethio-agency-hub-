import { useState, useCallback } from 'react';

interface FilterState {
  [key: string]: any;
}

export function useFilters<T extends FilterState>(initialState: T) {
  const [filters, setFilters] = useState<T>(initialState);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialState);
  }, [initialState]);

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  };
}