import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { User, PaginationMeta } from '@/types';
import { toast } from 'react-toastify';
import { useConfirm } from '@/hooks/useConfirm';
import { getErrorMessage, logError } from '@/utils/errors';

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
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
      
      // Handle different response structures
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else if (response && response.users) {
        // Handle direct users property
        setUsers(response.users);
        setPagination(response.pagination);
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
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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
      toast.success(`Successfully ${action === 'delete' ? 'deleted' : action === 'verify' ? 'verified' : 'unverified'} ${selectedUsers.length} user(s)`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: unknown) {
      logError(error, `Users.handleBulkAction.${action}`);
      const errorMessage = getErrorMessage(error) || `Failed to ${action} users`;
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading users..." />;
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-primary-600 mb-2">User Management</h1>
              <p className="text-gray-600">Manage all users in your system</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" variant="primary">
                  Search
                </Button>
                {search && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      handleFilterChange('search', null);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </form>

              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mr-2">Role:</label>
                  <select
                    value={roleFilter || ''}
                    onChange={(e) => handleFilterChange('role', e.target.value || null)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                  <select
                    value={verifiedFilter || ''}
                    onChange={(e) => handleFilterChange('isVerified', e.target.value || null)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4 items-center">
                <span className="text-sm font-medium text-gray-700">
                  {selectedUsers.length} user(s) selected
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('verify')}
                >
                  Verify Selected
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('unverify')}
                >
                  Unverify Selected
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete Selected
                </Button>
              </div>
            </Card>
          )}

          {/* Users Table */}
          <Card>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={users.length > 0 && selectedUsers.length === users.length}
                            indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                            onChange={handleSelectAll}
                            className="rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users && users.length > 0 ? users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isVerified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            {loading ? 'Loading users...' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing page {pagination.currentPage} of {pagination.totalPages} (
                      {pagination.totalUsers} total users)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};
