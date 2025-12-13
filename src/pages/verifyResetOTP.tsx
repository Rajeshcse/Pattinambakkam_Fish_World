import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { authService } from '@/services';
import { toast } from 'react-toastify';
import { Button } from '@/components/common';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';

const verifyOTPSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers'),
});

export default function VerifyResetOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const identifier = state?.identifier;
  const identifierType = state?.identifierType || 'email';
  const [error, setError] = useState<string | null>(null);

  // Redirect if no identifier provided
  if (!identifier) {
    return (
      <AuthLayout title='Error' subtitle='Invalid access'>
        <div className='text-center space-y-4'>
          <p className='text-red-600'>Invalid access. Please try again.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className='text-primary-600 hover:text-primary-500 font-medium'
          >
            Back to Forgot Password
          </button>
        </div>
      </AuthLayout>
    );
  }

  const handleVerify = async (values: { otp: string }) => {
    setError(null);

    try {
      // Build payload based on identifier type
      const payload =
        identifierType === 'phone'
          ? { phone: identifier, otp: values.otp }
          : { email: identifier, otp: values.otp };

      const res = await authService.verifyPasswordResetOTP(payload as any);

      if (res.success) {
        toast.success('OTP verified successfully');
        // Navigate to reset password with verification token from response
        navigate('/reset-password', {
          replace: true,
          state: {
            email: identifier,
            verificationToken: (res as any).verificationToken,
            verified: true,
          },
        });
      } else {
        setError(res.message || 'OTP verification failed');
        toast.error(res.message || 'OTP verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout
      title='Verify Password Reset OTP'
      subtitle='Enter the 6-digit code sent to your phone'
    >
      <div className='space-y-6'>
        <div className='text-center'>
          <div className='mb-4 text-4xl'>🔐</div>
          <h2 className='text-2xl font-bold text-gray-900'>Verify OTP</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-blue-700'>
            📱 We sent a 6-digit code to your registered phone number
          </p>
          <p className='text-xs text-blue-600 mt-2'>
            The code will expire in 10 minutes.
          </p>
        </div>

        <Formik
          initialValues={{ otp: '' }}
          validationSchema={verifyOTPSchema}
          onSubmit={handleVerify}
        >
          {(formik) => (
            <Form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Verification Code
                </label>
                <input
                  type='text'
                  name='otp'
                  placeholder='Enter 6-digit OTP'
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={6}
                  autoComplete='off'
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-center text-2xl tracking-widest ${
                    formik.touched.otp && formik.errors.otp
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.otp && formik.errors.otp && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formik.errors.otp}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={formik.isSubmitting}
              >
                Verify OTP
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
}
