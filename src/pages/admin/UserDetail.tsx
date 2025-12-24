import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { User } from '@/types';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirm';
import { getErrorMessage, logError, isNotFoundError, isAuthorizationError } from '@/utils/errors';

export const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { user: currentUser } = useAuth();
  const { confirm } = useConfirm();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    } else {
      console.error('No user ID provided in URL parameters');
      toast.error('Invalid user ID');
      navigate('/admin/users');
    }
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await adminService.getUserById(id);

      if (response && response.data) {
        setUser(response.data);
        setEditForm({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        });
      } else if (response && typeof response === 'object' && 'user' in response) {
        const typedResponse = response as { user: User };
        setUser(typedResponse.user);
        setEditForm({
          name: typedResponse.user.name,
          email: typedResponse.user.email,
          phone: typedResponse.user.phone,
        });
      } else {
        console.error('Unexpected user detail response structure:', response);
        toast.error('Received invalid user data');
        navigate('/admin/users');
      }
    } catch (error: unknown) {
      logError(error, 'UserDetail.fetchUser');

      if (isNotFoundError(error)) {
        toast.error('User not found');
      } else if (isAuthorizationError(error)) {
        toast.error('Access denied');
      } else {
        const errorMessage = getErrorMessage(error) || 'Failed to load user';
        toast.error(errorMessage);
      }
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      const response = await adminService.updateUser(id, editForm);

      if (response && response.data) {
        setUser(response.data);
      } else if (response && typeof response === 'object' && 'user' in response) {
        const typedResponse = response as { user: User };
        setUser(typedResponse.user);
      } else {
        console.warn('Unexpected update response structure:', response);

        await fetchUser();
      }

      setIsEditing(false);
      toast.success('User updated successfully');
    } catch (error: unknown) {
      logError(error, 'UserDetail.handleUpdateUser');
      const errorMessage = getErrorMessage(error) || 'Failed to update user';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async () => {
    if (!id || !user) return;

    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    const confirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await adminService.deleteUser(id);
      toast.success('User deleted successfully');
      navigate('/admin/users');
    } catch (error: unknown) {
      logError(error, 'UserDetail.handleDeleteUser');
      const errorMessage = getErrorMessage(error) || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const handleChangeRole = async () => {
    if (!id || !user) return;

    if (user.id === currentUser?.id) {
      toast.error('You cannot change your own role');
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'promote' : 'demote';

    const confirmed = await confirm({
      title: `${action === 'promote' ? 'Promote' : 'Demote'} User`,
      message: `Are you sure you want to ${action} ${user.name} to ${newRole}?`,
      confirmText: action === 'promote' ? 'Promote' : 'Demote',
      variant: action === 'promote' ? 'warning' : 'primary',
    });

    if (!confirmed) return;

    try {
      await adminService.changeUserRole(id, newRole);
      toast.success(`User ${action}d to ${newRole} successfully`);
      fetchUser();
    } catch (error: unknown) {
      logError(error, 'UserDetail.handleChangeRole');
      const errorMessage = getErrorMessage(error) || 'Failed to change user role';
      toast.error(errorMessage);
    }
  };

  const handleToggleVerification = async () => {
    if (!id || !user) return;

    const newStatus = !user.isVerified;
    const action = newStatus ? 'verify' : 'unverify';

    const confirmed = await confirm({
      title: `${newStatus ? 'Verify' : 'Unverify'} User`,
      message: `Are you sure you want to ${action} ${user.name}?`,
      confirmText: newStatus ? 'Verify' : 'Unverify',
      variant: 'primary',
    });

    if (!confirmed) return;

    try {
      await adminService.toggleUserVerification(id, newStatus);
      toast.success(`User ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
      fetchUser();
    } catch (error: unknown) {
      logError(error, 'UserDetail.handleToggleVerification');
      const errorMessage = getErrorMessage(error) || 'Failed to toggle verification';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading user details..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <p className="text-red-500">User not found</p>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-primary-600 mb-2">User Details</h1>
              <p className="text-gray-600">View and manage user information</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/users')}>
              Back to Users
            </Button>
          </div>

          <Card>
            {isEditing ? (
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="primary" fullWidth>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {}
                <div className="flex justify-center">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center border-4 border-primary-300">
                        <span className="text-4xl font-bold text-primary-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p className="mt-1 text-lg text-gray-900 font-mono">{user.id}</p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="pb-4">
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {}
                <div className="space-y-4 pt-4">
                  <div className="flex gap-4">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => setIsEditing(true)}
                    >
                      Edit User
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      onClick={handleChangeRole}
                      disabled={user.id === currentUser?.id}
                    >
                      {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={handleToggleVerification}
                    >
                      {user.isVerified ? 'Unverify Email' : 'Verify Email'}
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      fullWidth
                      onClick={handleDeleteUser}
                      disabled={user.id === currentUser?.id}
                    >
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};
