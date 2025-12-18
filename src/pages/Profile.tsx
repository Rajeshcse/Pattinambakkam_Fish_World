import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services';
import { Card, Button, Loading, Layout } from '@/components/common';
import { User } from '@/types';

export const Profile: React.FC = () => {
  const { user: authUser, logout, logoutAll, updateUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(authUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const formatMemberSince = (dateString: string | undefined): string => {
    if (!dateString) return 'Not available';

    console.log('Date string from backend:', dateString, typeof dateString);

    try {
      const date = new Date(dateString);
      console.log('Parsed date:', date, 'isValid:', !isNaN(date.getTime()));

      if (isNaN(date.getTime())) {
        return 'Not available';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.log('Date parsing error:', error);
      return 'Not available';
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await profileService.getProfile();
        setUser(profileData);
        updateUser(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authUser) {
      fetchProfile();
    }
  }, [authUser, updateUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAll();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleVerifyEmail = () => {
    navigate('/verify-email');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  if (loading) {
    return <Loading fullScreen text="Loading profile..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <p className="text-red-500">Error loading profile</p>
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {}
          {!user.isVerified && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">Email Not Verified</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please verify your email address to secure your account and access all features.
                  </p>
                  <div className="mt-3">
                    <Button variant="warning" size="sm" onClick={handleVerifyEmail}>
                      Verify Email Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card>
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
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-lg text-gray-900">{user.email}</p>
                    {user.isVerified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                  {user.address && user.address.street ? (
                    <div className="mt-1 text-lg text-gray-900">
                      <p>{user.address.street}</p>
                      {user.address.landmark && <p className="text-sm text-gray-600">Landmark: {user.address.landmark}</p>}
                      <p className="text-sm">
                        {user.address.city && `${user.address.city}, `}
                        {user.address.state && user.address.state}
                        {user.address.pincode && ` - ${user.address.pincode}`}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="text-gray-500 italic mb-2">No address saved</p>
                      <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                        Add Address
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                  <div className="mt-1 flex items-center">
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
                  <p className="mt-1 text-lg text-gray-900">{formatMemberSince(user.createdAt)}</p>
                </div>
              </div>

              {}
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <Button variant="primary" size="md" fullWidth onClick={handleEditProfile}>
                    Edit Profile
                  </Button>
                  <Button variant="secondary" size="md" fullWidth onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={handleLogout}
                    loading={isLoggingOut}
                  >
                    Logout
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    fullWidth
                    onClick={handleLogoutAll}
                    loading={isLoggingOut}
                  >
                    Logout All Devices
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
