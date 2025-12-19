import React, { useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Layout } from '@/components/common';

export const Profile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <p className="text-gray-500">Loading profile...</p>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleVerifyEmail = async () => {
    try {
      setIsVerifyingEmail(true);
      if (user.primaryEmailAddress) {
        await user.primaryEmailAddress.prepareVerification({
          strategy: 'email_link',
          redirectUrl: `${window.location.origin}/verify-email`,
        });
        alert('✅ Verification email sent! Check your inbox.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('❌ Failed to send verification email');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const isEmailVerified = user.emailAddresses?.[0]?.verification?.status === 'verified';
  const userName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'User';
  const userEmail = user.primaryEmailAddress?.emailAddress || 'No email';

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">My Profile</h1>
            <p className="text-gray-600">Your account information</p>
          </div>

          {!isEmailVerified && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
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
                      Your email address has not been verified yet. Verify it to unlock all
                      features.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handleVerifyEmail}
                  loading={isVerifyingEmail}
                >
                  Verify Email Now
                </Button>
              </div>
            </div>
          )}

          <Card>
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={userName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center border-4 border-primary-300">
                      <span className="text-4xl font-bold text-primary-600">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{userName}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-lg text-gray-900">{userEmail}</p>
                    {isEmailVerified && (
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
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isEmailVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {isEmailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button variant="outline" size="lg" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
