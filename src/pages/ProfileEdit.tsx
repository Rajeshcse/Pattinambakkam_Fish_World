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

  // Cache redirect destination immediately on mount
  const [redirectTarget, setRedirectTarget] = React.useState<string>('/profile');

  // Effect to get and cache redirect target on component mount
  React.useEffect(() => {
    const target =
      sessionStorage.getItem('redirectAfterProfileEdit') ||
      location.state?.redirectTo ||
      '/profile';
    console.log('📍 ProfileEdit mounted. Setting redirect target:', target);
    console.log('   From sessionStorage:', sessionStorage.getItem('redirectAfterProfileEdit'));
    console.log('   From location.state:', location.state?.redirectTo);
    setRedirectTarget(target);
  }, [location.state]);

  const { formik, isSubmitting, error, dismissError } = useProfileEditForm({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      console.log('✅ ProfileEdit saved. Redirecting to:', redirectTarget);

      // Clear redirect flags
      sessionStorage.removeItem('intendedDestination');
      sessionStorage.removeItem('redirectAfterProfileEdit');

      // Use the cached redirect target set on mount
      navigate(redirectTarget, { replace: true });
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
    onNoChanges: () => {
      toast.info('No changes made');
      console.log('⚠️ ProfileEdit: No changes made. Redirecting to:', redirectTarget);

      sessionStorage.removeItem('intendedDestination');
      sessionStorage.removeItem('redirectAfterProfileEdit');

      navigate(redirectTarget, { replace: true });
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
