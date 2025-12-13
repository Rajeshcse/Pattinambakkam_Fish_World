import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button } from '@/components/common';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { authService } from '@/services';

const resetPasswordSchema = Yup.object().shape({
  resetCode: Yup.string()
    .required('Reset code is required')
    .length(6, 'Reset code must be exactly 6 digits')
    .matches(/^\d+$/, 'Reset code must contain only numbers'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  // Get identifier and type from navigation state
  const identifier =
    (location.state as { identifier?: string; identifierType?: string })
      ?.identifier || '';
  const identifierType =
    (location.state as { identifier?: string; identifierType?: string })
      ?.identifierType || 'email';

  console.log('ResetPassword received state:', {
    identifier,
    identifierType,
    fullState: location.state,
  });

  // Redirect if missing required state
  if (!identifier) {
    return (
      <AuthLayout title='Error' subtitle='Invalid access'>
        <div className='text-center space-y-4'>
          <p className='text-red-600'>
            Invalid access. Please start password reset.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className='block text-primary-600 hover:text-primary-500 font-medium'
          >
            Back to Forgot Password
          </button>
        </div>
      </AuthLayout>
    );
  }

  const initialValues = {
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: {
    resetCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setError(null);

    try {
      // Build payload based on identifier type
      const payload =
        identifierType === 'phone'
          ? {
              phone: identifier,
              resetCode: values.resetCode,
              newPassword: values.newPassword,
            }
          : {
              email: identifier,
              resetCode: values.resetCode,
              newPassword: values.newPassword,
            };

      console.log('Resetting password with payload:', payload);

      const response = await authService.resetPassword(payload as any);

      console.log('Reset password response:', response);

      if (response.success || response.message) {
        console.log('Password reset successful, navigating to login...');

        toast.success(
          response.message ||
            'Password reset successful! Please login with your new password.'
        );

        // Delay navigation slightly to allow toast to display
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      } else {
        console.log('Reset password failed - no success flag');
        setError('Failed to reset password');
        toast.error('Failed to reset password');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to reset password';
      console.error('Error resetting password:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Mask identifier for display
  const maskedIdentifier =
    identifierType === 'phone' ? `****${identifier.slice(-4)}` : identifier;

  return (
    <AuthLayout
      title='Reset Password'
      subtitle='Enter the reset code sent to your phone and create a new password'
    >
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Reset Password</h2>
          <p className='mt-2 text-sm text-gray-600'>
            We sent a reset code to <strong>{maskedIdentifier}</strong>
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className='space-y-4'>
              {/* Reset Code Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Reset Code
                </label>
                <input
                  type='text'
                  name='resetCode'
                  placeholder='Enter 6-digit code'
                  value={formik.values.resetCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition ${
                    formik.touched.resetCode && formik.errors.resetCode
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.resetCode && formik.errors.resetCode && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formik.errors.resetCode}
                  </p>
                )}
              </div>

              {/* New Password Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  name='newPassword'
                  placeholder='Enter new password'
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm your password'
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Password Requirements */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-xs font-medium text-blue-900 mb-2'>
                  Password requirements:
                </p>
                <ul className='text-xs text-blue-700 space-y-1'>
                  <li>✓ At least 6 characters long</li>
                  <li>✓ Contains at least one uppercase letter (A-Z)</li>
                  <li>✓ Contains at least one lowercase letter (a-z)</li>
                  <li>✓ Contains at least one number (0-9)</li>
                </ul>
              </div>

              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={formik.isSubmitting}
              >
                Reset Password
              </Button>

              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => navigate('/forgot-password')}
                  className='text-sm font-medium text-gray-600 hover:text-gray-500'
                >
                  Back to Forgot Password
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};
