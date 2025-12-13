import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { authService } from '@/services';

const phoneOtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers'),
});

export const PhoneVerification: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [phoneDisplay, setPhoneDisplay] = useState('');

  // Redirect if not logged in or phone already verified
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.isPhoneVerified) {
      toast.info('Your phone number is already verified');
      navigate('/profile');
      return;
    }

    // Mask phone number for display (show last 4 digits)
    if (user.phone) {
      const masked =
        user.phone.slice(0, -4).replace(/\d/g, '*') + user.phone.slice(-4);
      setPhoneDisplay(masked);
    }

    // Send OTP automatically on component mount
    sendOTPToPhone();
  }, [user, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendOTPToPhone = async () => {
    if (!user?.phone) return;

    setIsSendingOTP(true);
    setError(null);

    try {
      const response = await authService.sendPhoneVerificationOTP({
        phone: user.phone,
      });

      if (response.success) {
        setResendCooldown(60); // 60 second cooldown
        toast.success(response.message || 'OTP sent to your mobile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    if (!user?.phone) return;

    setIsSendingOTP(true);
    setError(null);

    try {
      const response = await authService.resendPhoneVerificationOTP({
        phone: user.phone,
      });

      if (response.success) {
        setResendCooldown(60);
        toast.success(response.message || 'New OTP sent to your mobile');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (values: { otp: string }) => {
    if (!user?.phone) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.verifyPhoneOTP({
        phone: user.phone,
        otp: values.otp,
      });

      if (response.success) {
        // Update user with phone verified status
        const updatedUser = { ...user, isPhoneVerified: true };
        updateUser(updatedUser);
        toast.success(response.message || 'Phone number verified successfully');
        navigate('/verify-email');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to verify phone number';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title='Verify Phone Number'
      subtitle='Secure your account with phone number verification'
    >
      <div className='space-y-6'>
        <div className='text-center'>
          <div className='mb-4 text-4xl'>📱</div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Phone Verification
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter the 6-digit OTP sent to <strong>{phoneDisplay}</strong>
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-gray-700'>
            ✓ Phone verification is required to secure your account
          </p>
          <p className='text-sm text-gray-600 mt-2'>
            The 6-digit code will expire in 10 minutes.
          </p>
        </div>

        <Formik
          initialValues={{ otp: '' }}
          validationSchema={phoneOtpSchema}
          onSubmit={handleVerifyOTP}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
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
              <p className='text-xs text-gray-500'>
                Enter the 6-digit code sent to {phoneDisplay}
              </p>

              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={isSubmitting}
              >
                Verify Phone Number
              </Button>

              <div className='text-center'>
                <button
                  type='button'
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isSendingOTP}
                  className={`text-sm font-medium ${
                    resendCooldown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-primary-600 hover:text-primary-500'
                  }`}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive the code? Resend"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};
