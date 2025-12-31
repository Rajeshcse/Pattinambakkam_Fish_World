import React from 'react';
import { Card, Button } from '@/components/common';

interface SelectedUsersActionBarProps {
  selectedCount: number;
  onVerify: () => void;
  onUnverify: () => void;
  onDelete: () => void;
}

export const SelectedUsersActionBar: React.FC<SelectedUsersActionBarProps> = ({
  selectedCount,
  onVerify,
  onUnverify,
  onDelete,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {selectedCount} user(s) selected
        </span>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={onVerify}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Verify Selected
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onUnverify}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Unverify Selected
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Delete Selected
          </Button>
        </div>
      </div>
    </Card>
  );
};
