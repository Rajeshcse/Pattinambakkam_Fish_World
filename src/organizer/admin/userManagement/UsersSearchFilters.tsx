import React from 'react';
import { Card, Button } from '@/components/common';

interface UsersSearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  roleFilter: 'user' | 'admin' | null;
  onRoleFilterChange: (role: string) => void;
  verifiedFilter: string | null;
  onVerifiedFilterChange: (verified: string) => void;
  onClearSearch: () => void;
}

export const UsersSearchFilters: React.FC<UsersSearchFiltersProps> = ({
  search,
  onSearchChange,
  onSearch,
  roleFilter,
  onRoleFilterChange,
  verifiedFilter,
  onVerifiedFilterChange,
  onClearSearch,
}) => {
  return (
    <Card className="mb-6">
      <div className="space-y-3 sm:space-y-4">
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Search
          </Button>
          {search && (
            <Button
              type="button"
              variant="outline"
              onClick={onClearSearch}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1 sm:flex-none">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mr-2">Role:</label>
            <select
              value={roleFilter || ''}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mr-2">Status:</label>
            <select
              value={verifiedFilter || ''}
              onChange={(e) => onVerifiedFilterChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};
