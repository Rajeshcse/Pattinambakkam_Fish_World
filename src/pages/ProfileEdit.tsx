import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Button, Loading, Layout } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useProfileEditForm } from '@/hooks/useProfileEditForm';

export const ProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formik, isSubmitting, error, dismissError } = useProfileEditForm({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      navigate('/profile');
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
    onNoChanges: () => {
      toast.info('No changes made');
      navigate('/profile');
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your account information</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {error && <ErrorAlert message={error} onDismiss={dismissError} />}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                formik={formik}
              />

              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                formik={formik}
              />

              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                formik={formik}
              />

              <FormField
                name="avatar"
                label="Profile Picture URL"
                type="url"
                placeholder="Enter image URL (optional)"
                formik={formik}
              />

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>

                <FormField
                  name="street"
                  label="Street Address"
                  placeholder="Enter your complete street address"
                  formik={formik}
                  textarea
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value="Chennai"
                      readOnly
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Service area: Chennai only</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value="Tamil Nadu"
                      readOnly
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">We deliver in Tamil Nadu</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    name="pincode"
                    label="Pincode"
                    placeholder="6-digit pincode"
                    formik={formik}
                  />

                  <FormField
                    name="landmark"
                    label="Landmark (Optional)"
                    placeholder="Nearby landmark"
                    formik={formik}
                  />
                </div>
              </div>

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
