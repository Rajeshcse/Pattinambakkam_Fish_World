import React from 'react';
import { Button } from '@/components/common';

interface SendOTPViewProps {
  phoneNumber: string;
  isSendingOTP: boolean;
  onSendOTP: () => void;
}

/**
 * SendOTPView Component
 *
 * Initial view prompting user to request OTP
 */
export const SendOTPView: React.FC<SendOTPViewProps> = ({
  phoneNumber,
  isSendingOTP,
  onSendOTP,
}) => {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Phone Verification</h2>
        <p className="mt-2 text-sm text-gray-600">
          We'll send a 6-digit OTP to <strong>{phoneNumber}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the button below to receive a verification code via SMS. The code will expire in 10
          minutes.
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSendingOTP}
          onClick={onSendOTP}
        >
          Send Verification Code
        </Button>
      </div>
    </>
  );
};
