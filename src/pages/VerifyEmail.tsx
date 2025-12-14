import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { otpSchema, otpInitialValues } from '@/validation/schemas';
import { authService } from '@/services';

export const VerifyEmail: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.isVerified) {
      toast.info('Your email is already verified');
      navigate('/profile');
    }
  }, [user, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOTP = async () => {
    console.log('🚀 Starting OTP send process...');
    setIsSendingOTP(true);
    setError(null);

    try {
      console.log('📤 Calling authService.sendVerificationEmail()...');
      const response = await authService.sendVerificationEmail();
      console.log('✅ OTP Send Response:', response);
      
      if (response.success) {
        setOtpSent(true);
        setResendCooldown(60); // 60 second cooldown
        toast.success(response.message || 'Verification OTP sent to your email');
        console.log('🎉 OTP sent successfully!');
      }
    } catch (err: any) {
      console.error('❌ Error sending OTP:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send verification email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    console.log('🔄 Starting OTP resend process...');
    setIsSendingOTP(true);
    setError(null);

    try {
      console.log('📤 Calling authService.resendVerificationEmail()...');
      const response = await authService.resendVerificationEmail();
      console.log('✅ Resend OTP Response:', response);
      
      if (response.success) {
        setResendCooldown(60);
        toast.success(response.message || 'New verification OTP sent to your email');
        console.log('🎉 OTP resent successfully!');
      }
    } catch (err: any) {
      console.error('❌ Error resending OTP:', err);
      const errorMessage = err.response?.data?.message || 'Failed to resend verification email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (values: { otp: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.verifyEmail({ otp: values.otp });
      if (response.success) {
        // Update user in context with verified status
        if (user) {
          updateUser({ ...user, isVerified: true });
        }
        toast.success(response.message || 'Email verified successfully!');
        navigate('/profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
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
    <AuthLayout
      title="Verify Email"
      subtitle="Secure your account with email verification"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Email Verification</h2>
          <p className="mt-2 text-sm text-gray-600">
            We'll send a 6-digit OTP to <strong>{user.email}</strong>
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        {!otpSent ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the button below to receive a verification code in your email.
              The code will expire in 10 minutes.
            </p>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSendingOTP}
              onClick={handleSendOTP}
            >
              Send Verification Code
            </Button>
          </div>
        ) : (
          <Formik
            initialValues={otpInitialValues}
            validationSchema={otpSchema}
            onSubmit={handleVerifyOTP}
          >
            {(formik) => (
              <Form className="space-y-4">
                <div>
                  <FormField
                    name="otp"
                    label="Verification Code"
                    placeholder="Enter 6-digit OTP"
                    formik={formik}
                    maxLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                >
                  Verify Email
                </Button>

                <div className="text-center">
                  <button
                    type="button"
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
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            Skip for now
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
