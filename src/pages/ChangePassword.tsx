import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, Navbar } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { changePasswordSchema, changePasswordInitialValues } from '@/validation/schemas';
import { authService } from '@/services';

export const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        toast.success(response.message || 'Password changed successfully! Other sessions have been logged out.');
        navigate('/profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </button>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure. This will log you out from all other devices.
              </p>
            </div>

            {error && (
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            )}

            <Formik
              initialValues={changePasswordInitialValues}
              validationSchema={changePasswordSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form className="space-y-4">
                  <FormField
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    formik={formik}
                  />

                  <FormField
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    formik={formik}
                  />

                  <FormField
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    formik={formik}
                  />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
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
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Security Notice
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          Changing your password will log you out from all other devices for security reasons.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>At least 6 characters long</li>
                      <li>Contains at least one uppercase letter</li>
                      <li>Contains at least one lowercase letter</li>
                      <li>Contains at least one number</li>
                      <li>Must be different from current password</li>
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/profile')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                    >
                      Change Password
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </div>
    </div>
  );
};
