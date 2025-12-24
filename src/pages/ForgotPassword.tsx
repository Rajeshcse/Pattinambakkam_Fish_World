import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { forgotPasswordSchema, forgotPasswordInitialValues } from '@/validation/schemas';
import { authService } from '@/services';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [submittedIdentifier, setSubmittedIdentifier] = useState('');
  const [sendMethod, setSendMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = async (values: { identifier: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.forgotPassword({ identifier: values.identifier });
      if (response.success) {
        setOtpSent(true);
        setSubmittedIdentifier(values.identifier);
        setSendMethod('phone'); // Always phone for password reset
        toast.success(response.message || 'Password reset OTP sent to your phone');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send password reset OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Pattinambakkam_Fish_World" subtitle="Reset your password securely">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {otpSent
              ? 'Check your phone for the reset code'
              : 'Enter your email or phone number to receive a reset code via SMS'}
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {!otpSent ? (
          <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="space-y-4">
                <FormField
                  name="identifier"
                  label="Email or Phone Number"
                  type="text"
                  placeholder="Enter your email or 10-digit phone"
                  formik={formik}
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                  Send Reset Code
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Reset code sent!</p>
                  <p className="mt-1 text-sm text-green-700">
                    If an account exists with <strong>{submittedIdentifier}</strong>, you will
                    receive a 6-digit reset code via SMS to your registered phone number. The code
                    expires in 10 minutes.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() =>
                navigate('/reset-password', { state: { identifier: submittedIdentifier } })
              }
            >
              Enter Reset Code
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setSubmittedIdentifier('');
                }}
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Try a different email or phone
              </button>
              <br />
              <Link
                to="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
