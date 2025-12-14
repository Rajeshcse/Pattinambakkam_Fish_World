import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { forgotPasswordSchema, forgotPasswordInitialValues } from '@/validation/schemas';
import { authService } from '@/services';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (values: { email: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.forgotPassword({ email: values.email });
      if (response.success) {
        setEmailSent(true);
        setSubmittedEmail(values.email);
        toast.success(response.message || 'Password reset instructions sent to your email');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send password reset email';
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
            {emailSent
              ? 'Check your email for the reset code'
              : "Enter your email and we'll send you a reset code"}
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {!emailSent ? (
          <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="space-y-4">
                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your registered email"
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
                    If an account exists with <strong>{submittedEmail}</strong>, you will receive a
                    6-digit reset code. The code expires in 10 minutes.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/reset-password', { state: { email: submittedEmail } })}
            >
              Enter Reset Code
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setSubmittedEmail('');
                }}
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Try a different email
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
