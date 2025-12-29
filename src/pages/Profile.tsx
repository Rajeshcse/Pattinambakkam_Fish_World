import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services';
import { Card, Loading, Layout } from '@/components/common';
import {
  ProfileHeader,
  PersonalInfoCard,
  AddressCard,
  AccountActionsCard,
  EmailVerificationBanner,
} from '@/organizer/profile';
import { User } from '@/types';

/**
 * Profile Page
 *
 * Displays user profile information and account management options
 */
export const Profile: React.FC = () => {
  const { user: authUser, logout, logoutAll, updateUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(authUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const formatMemberSince = (dateString: string | undefined): string => {
    if (!dateString) return 'Not available';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not available';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
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
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {/* Email Verification Banner */}
          {!user.isVerified && <EmailVerificationBanner onVerifyEmail={handleVerifyEmail} />}

          {/* Profile Card */}
          <Card>
            <div className="space-y-6">
              {/* Avatar */}
              <ProfileHeader avatar={user.avatar} name={user.name} />

              {/* Personal Information */}
              <PersonalInfoCard user={user} formatMemberSince={formatMemberSince} />

              {/* Delivery Address */}
              <AddressCard user={user} onEditProfile={handleEditProfile} />

              {/* Account Actions */}
              <AccountActionsCard
                isLoggingOut={isLoggingOut}
                onEditProfile={handleEditProfile}
                onChangePassword={handleChangePassword}
                onLogout={handleLogout}
                onLogoutAll={handleLogoutAll}
              />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
