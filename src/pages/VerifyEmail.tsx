import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, Button, Layout } from '@/components/common';

export const VerifyEmail: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const isEmailVerified = user.emailAddresses?.[0]?.verification?.status === 'verified';
      if (isEmailVerified) {
        navigate('/profile');
      }
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <p className="text-gray-500">Loading...</p>
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

  const isEmailVerified = user.emailAddresses?.[0]?.verification?.status === 'verified';

  if (isEmailVerified) {
    return null;
  }

  const handleSkip = () => {
    navigate('/profile');
  };

  const handleResendVerification = async () => {
    try {
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
    }
  };

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="mt-2 text-sm text-gray-600">
                  A verification email has been sent to{' '}
                  <strong>{user.primaryEmailAddress?.emailAddress}</strong>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Please check your email and click the verification link to complete your
                      registration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>

                <Button type="button" variant="outline" size="lg" fullWidth onClick={handleSkip}>
                  Skip for Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
