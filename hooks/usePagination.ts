import { useState, useMemo } from 'react';

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination<T>(
  data: T[] | undefined,
  { initialPage = 1, pageSize = 10 }: PaginationOptions = {}
) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (!data) return 0;
    return Math.ceil(data.length / pageSize);
  }, [data, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    pageSize
  };
}