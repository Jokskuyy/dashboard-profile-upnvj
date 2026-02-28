import { useState, useMemo } from "react";

interface PaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  pageNumbers: (number | string)[];
  paginate: (data: T[]) => T[];
  goToNext: () => void;
  goToPrev: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * Reusable pagination hook for admin table components.
 * Replaces repeated pagination logic across ProfessorsTable, AccreditationsTable, etc.
 */
export function usePagination<T = unknown>({
  totalItems,
  itemsPerPage = 10,
  maxVisiblePages = 5,
}: PaginationOptions): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const paginate = (data: T[]): T[] => data.slice(startIndex, endIndex);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    paginate,
    goToNext: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
    goToPrev: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}
