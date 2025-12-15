import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { resetPasswordSchema, resetPasswordInitialValues } from '@/validation/schemas';
import { authService } from '@/services';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const emailFromState = (location.state as { email?: string })?.email || '';

  const initialValues = {
    ...resetPasswordInitialValues,
    email: emailFromState,
  };

  const handleSubmit = async (values: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      if (response.success) {
        toast.success(
          response.message || 'Password reset successful! Please login with your new password.',
        );
        navigate('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Pattinambakkam_Fish_World" subtitle="Create your new password">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the code sent to your email and create a new password
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form className="space-y-4">
              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                formik={formik}
              />

              <FormField
                name="otp"
                label="Reset Code"
                placeholder="Enter 6-digit code"
                formik={formik}
                maxLength={6}
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

              <div className="text-xs text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>At least 6 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one lowercase letter</li>
                  <li>Contains at least one number</li>
                </ul>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                Reset Password
              </Button>

              <div className="text-center space-y-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-gray-600 hover:text-gray-500 block"
                >
                  Didn't receive the code? Request again
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 block"
                >
                  Back to Sign In
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};
