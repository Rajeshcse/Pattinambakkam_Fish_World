import React from 'react';
import { Card, Button } from '@/components/common';
import { PaginationMeta } from '@/types';

interface UsersPaginationProps {
  pagination: PaginationMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
        Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total)
      </div>
      <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex-1 sm:flex-none text-xs sm:text-sm"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex-1 sm:flex-none text-xs sm:text-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
