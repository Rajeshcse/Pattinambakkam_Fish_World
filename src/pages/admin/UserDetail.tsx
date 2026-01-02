import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { User } from '@/types';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirm';
import { getErrorMessage, logError, isNotFoundError, isAuthorizationError } from '@/utils/errors';
import {
  UserDetailHeader,
  UserAvatarSection,
  UserInfoDisplay,
  UserEditForm,
  UserActionButtons,
} from '@/organizer/admin/userDetail';

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
          {/* Header */}
          <UserDetailHeader />

          {/* User Details Card */}
          <Card>
            {isEditing ? (
              <UserEditForm
                editForm={editForm}
                onFormChange={setEditForm}
                onSubmit={handleUpdateUser}
                onCancel={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                  });
                }}
                originalUser={{
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Avatar Section */}
                <UserAvatarSection user={user} />

                {/* User Info Display */}
                <UserInfoDisplay user={user} />

                {/* Action Buttons */}
                <UserActionButtons
                  isCurrentUser={user.id === currentUser?.id}
                  userRole={user.role}
                  isVerified={user.isVerified}
                  onEditClick={() => setIsEditing(true)}
                  onChangeRole={handleChangeRole}
                  onToggleVerification={handleToggleVerification}
                  onDelete={handleDeleteUser}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};
