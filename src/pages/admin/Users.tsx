import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { User, PaginationMeta } from '@/types';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { useConfirm } from '@/hooks/useConfirm';
import { getErrorMessage, logError } from '@/utils/errors';
import {
  UsersHeader,
  UsersSearchFilters,
  SelectedUsersActionBar,
  UsersList,
  UsersPagination,
} from '@/organizer/admin/userManagement';

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { confirm } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');

  const currentPage = parseInt(searchParams.get('page') || '1');
  const roleFilter = searchParams.get('role') as 'user' | 'admin' | null;
  const verifiedFilter = searchParams.get('isVerified');

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (roleFilter) params.role = roleFilter;
      if (verifiedFilter !== null) params.isVerified = verifiedFilter === 'true';
      if (search) params.search = search;

      const response = await adminService.getAllUsers(params);

      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else if (response && typeof response === 'object' && 'users' in response) {
        const typedResponse = response as { users: User[]; pagination?: PaginationMeta };
        setUsers(typedResponse.users);
        setPagination(typedResponse.pagination || null);
      } else {
        toast.error('Received invalid users data');
        setUsers([]);
        setPagination(null);
      }
    } catch (error: unknown) {
      logError(error, 'Users.fetchUsers');
      const errorMessage = getErrorMessage(error) || 'Failed to load users';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleRoleFilterChange = (role: string) => {
    handleFilterChange('role', role || null);
  };

  const handleVerifiedFilterChange = (verified: string) => {
    handleFilterChange('isVerified', verified || null);
  };

  const handleClearSearch = () => {
    setSearch('');
    handleFilterChange('search', null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (!users || users.length === 0) return;

    if (selectedUsers.length === users.length && selectedUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'verify' | 'unverify') => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users first');
      return;
    }

    const actionTitles = {
      delete: 'Delete Users',
      verify: 'Verify Users',
      unverify: 'Unverify Users',
    };

    const actionMessages = {
      delete: `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
      verify: `Are you sure you want to verify ${selectedUsers.length} user(s)?`,
      unverify: `Are you sure you want to unverify ${selectedUsers.length} user(s)?`,
    };

    const confirmed = await confirm({
      title: actionTitles[action],
      message: actionMessages[action],
      confirmText: action === 'delete' ? 'Delete' : action === 'verify' ? 'Verify' : 'Unverify',
      variant: action === 'delete' ? 'danger' : 'primary',
    });

    if (!confirmed) return;

    try {
      await adminService.bulkUserAction(action, selectedUsers);
      toast.success(
        `Successfully ${
          action === 'delete' ? 'deleted' : action === 'verify' ? 'verified' : 'unverified'
        } ${selectedUsers.length} user(s)`,
      );
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: unknown) {
      logError(error, `Users.handleBulkAction.${action}`);
      const errorMessage = getErrorMessage(error) || `Failed to ${action} users`;
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <UsersHeader />

          {/* Search and Filters */}
          <UsersSearchFilters
            search={search}
            onSearchChange={setSearch}
            onSearch={handleSearch}
            roleFilter={roleFilter}
            onRoleFilterChange={handleRoleFilterChange}
            verifiedFilter={verifiedFilter}
            onVerifiedFilterChange={handleVerifiedFilterChange}
            onClearSearch={handleClearSearch}
          />

          {/* Selected Users Action Bar */}
          <SelectedUsersActionBar
            selectedCount={selectedUsers.length}
            onVerify={() => handleBulkAction('verify')}
            onUnverify={() => handleBulkAction('unverify')}
            onDelete={() => handleBulkAction('delete')}
          />

          {/* Loading State */}
          {loading ? (
            <Loading fullScreen={false} text="Loading users..." />
          ) : (
            <>
              {/* Users List */}
              <UsersList
                users={users}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                loading={loading}
              />

              {/* Pagination */}
              <UsersPagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
