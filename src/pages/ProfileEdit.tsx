import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { useAuth } from '@/hooks/useAuth';
import { Button, Loading, Layout } from '@/components/common';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useProfileEditForm } from '@/hooks/useProfileEditForm';
import { PersonalInfoForm, AddressForm } from '@/organizer/profileEdit';

/**
 * Location state shape for ProfileEdit navigation
 */
interface ProfileEditLocationState {
  redirectTo?: string;
}

/**
 * ProfileEdit Page
 *
 * Edit user profile information and delivery address
 * Uses custom hook for form management
 */
export const ProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state: ProfileEditLocationState | null };
  const toast = useResponsiveToast();

  // Get redirect destination from sessionStorage (set by Register or Login)
  const redirectTo =
    sessionStorage.getItem('redirectAfterProfileEdit') || location.state?.redirectTo;

  const { formik, isSubmitting, error, dismissError } = useProfileEditForm({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      console.log('✅ ProfileEdit saved. redirectTo:', redirectTo);
      // Clear redirect flags
      sessionStorage.removeItem('intendedDestination');
      sessionStorage.removeItem('redirectAfterProfileEdit');
      // Redirect to checkout if coming from there, otherwise profile
      navigate(redirectTo || '/profile');
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
    onNoChanges: () => {
      toast.info('No changes made');
      sessionStorage.removeItem('intendedDestination');
      sessionStorage.removeItem('redirectAfterProfileEdit');
      navigate(redirectTo || '/profile');
    },
  });

  const handleCancel = () => {
    navigate('/profile');
  };

  if (!user) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your account information</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {error && <ErrorAlert message={error} onDismiss={dismissError} />}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <PersonalInfoForm formik={formik} />

              {/* Delivery Address */}
              <AddressForm formik={formik} />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
