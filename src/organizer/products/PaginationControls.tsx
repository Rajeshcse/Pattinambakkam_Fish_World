import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * PaginationControls Component
 *
 * Pagination UI with previous/next buttons and page numbers
 * Shows ellipsis for large page ranges
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 py-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
          currentPage === 1
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
            : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first page, last page, and pages around current page
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
                }`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            // Show ellipsis
            return (
              <span key={page} className="px-2 py-2 text-slate-400">
                •••
              </span>
            );
          }
          return null;
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
          currentPage === totalPages
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
            : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
