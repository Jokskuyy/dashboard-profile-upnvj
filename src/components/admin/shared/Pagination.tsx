import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  pageNumbers: (number | string)[];
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  itemLabel?: string;
}

/**
 * Reusable pagination component for admin tables.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  pageNumbers,
  onPageChange,
  onNext,
  onPrev,
  isFirstPage,
  isLastPage,
  itemLabel = "item",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-slate-500">
        Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)} dari{" "}
        {totalItems} {itemLabel}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={isFirstPage}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Previous
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-4 py-2 text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={onNext}
          disabled={isLastPage}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
