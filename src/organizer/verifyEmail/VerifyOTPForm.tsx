import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { otpSchema, otpInitialValues } from '@/validation/schemas';

interface VerifyOTPFormProps {
  isSubmitting: boolean;
  isSendingOTP: boolean;
  resendCooldown: number;
  onVerifyOTP: (values: { otp: string }) => void;
  onResendOTP: () => void;
}

/**
 * VerifyOTPForm Component
 *
 * Form to enter and verify OTP with resend functionality
 */
export const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({
  isSubmitting,
  isSendingOTP,
  resendCooldown,
  onVerifyOTP,
  onResendOTP,
}) => {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Phone Verification</h2>
        <p className="mt-2 text-sm text-gray-600">Enter the verification code sent to your phone</p>
      </div>

      <Formik
        initialValues={otpInitialValues}
        validationSchema={otpSchema}
        onSubmit={onVerifyOTP}
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
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
              Verify Phone Number
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onResendOTP}
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
    </>
  );
};
