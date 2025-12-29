import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Layout } from '@/components/common';
import { PaymentHeader, PaymentSteps, PaymentActions } from '@/organizer/paymentInstructions';
import { config } from '@/config/env';

/**
 * PaymentInstructions Page
 *
 * Guides users through Razorpay payment process
 * Shows step-by-step instructions and action buttons
 */
const PaymentInstructions: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [orderId, setOrderId] = useState<string>('');
  const RAZORPAY_LINK = config.razorpayPaymentLink;

  useEffect(() => {
    const pendingOrderId = localStorage.getItem('pendingPaymentOrderId');
    if (pendingOrderId) {
      setOrderId(pendingOrderId);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleOpenPaymentLink = () => {
    window.open(RAZORPAY_LINK, '_blank');
  };

  const handlePaymentDone = () => {
    toast.success('Thank you! We will confirm your order once payment is verified.');
    localStorage.removeItem('pendingPaymentOrderId');
    navigate('/my-orders');
  };

  const handleViewOrders = () => {
    navigate('/my-orders');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <PaymentHeader orderId={orderId} />

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please follow the instructions below to complete your
                  payment.
                </p>
              </div>
            </div>

            {/* Payment Steps */}
            <PaymentSteps />

            {/* Action Buttons */}
            <PaymentActions
              onOpenPaymentLink={handleOpenPaymentLink}
              onPaymentDone={handlePaymentDone}
              onViewOrders={handleViewOrders}
            />

            {/* Help Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong> Contact us on WhatsApp:{' '}
                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline font-semibold"
                >
                  +91 99940 72395
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentInstructions;
