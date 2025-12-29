import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SendOTPView, VerifyOTPForm } from '@/organizer/verifyEmail';
import { authService } from '@/services';

/**
 * VerifyEmail Page
 *
 * Phone number verification via SMS OTP
 * Two-step process: Send OTP → Verify OTP
 */
export const VerifyEmail: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already verified
  useEffect(() => {
    if (user?.isVerified) {
      toast.info('Your phone number is already verified');
      navigate('/profile');
    }
  }, [user, navigate, toast]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOTP = async () => {
    setIsSendingOTP(true);
    setError(null);

    try {
      const response = await authService.sendVerificationSMS();
      if (response.success) {
        setOtpSent(true);
        setResendCooldown(60);
        toast.success(response.message || 'Verification OTP sent to your phone');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send verification SMS';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsSendingOTP(true);
    setError(null);

    try {
      const response = await authService.resendVerificationSMS();
      if (response.success) {
        setResendCooldown(60);
        toast.success(response.message || 'New verification OTP sent to your phone');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend verification SMS';
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
      const response = await authService.verifyPhone({ otp: values.otp });
      if (response.success) {
        if (user) {
          updateUser({ ...user, isVerified: true });
        }
        toast.success(response.message || 'Phone number verified successfully!');
        navigate('/profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify phone number';
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
    <AuthLayout title="Verify Phone" subtitle="Secure your account with phone verification">
      <div className="space-y-6">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {!otpSent ? (
          <SendOTPView
            phoneNumber={user.phone}
            isSendingOTP={isSendingOTP}
            onSendOTP={handleSendOTP}
          />
        ) : (
          <VerifyOTPForm
            isSubmitting={isSubmitting}
            isSendingOTP={isSendingOTP}
            resendCooldown={resendCooldown}
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleResendOTP}
          />
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
