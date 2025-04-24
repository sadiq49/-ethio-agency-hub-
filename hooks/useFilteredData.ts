import { useMemo } from 'react';

type FilterFunction<T> = (item: T, filters: any) => boolean;

export function useFilteredData<T>(
  data: T[] | undefined,
  filters: any,
  filterFunction: FilterFunction<T>
) {
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => filterFunction(item, filters));
  }, [data, filters, filterFunction]);

  return filteredData;
}