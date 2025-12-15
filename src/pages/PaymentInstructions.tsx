import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, Button } from '@/components/common';

const PaymentInstructions: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string>('');
  const RAZORPAY_LINK = 'https://razorpay.me/@paramanandamrajesh';

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
            {}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Complete Your Payment</h1>
              {orderId && (
                <p className="text-gray-600 mt-2">
                  Order ID: <span className="font-semibold">{orderId}</span>
                </p>
              )}
            </div>

            {}
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

            {}
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Click the payment button below</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    You will be redirected to our secure Razorpay payment page
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Choose your payment method</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay using UPI, Card, Net Banking, or Wallet
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Complete the payment</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    After successful payment, return to this page and click "I've Paid"
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Wait for confirmation</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll verify your payment and confirm your order within 30 minutes
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-3">
              <Button onClick={handleOpenPaymentLink} variant="primary" fullWidth size="lg">
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Proceed to Payment
              </Button>

              <button
                onClick={handlePaymentDone}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
                         hover:bg-green-700 transition-colors duration-200"
              >
                I've Completed the Payment
              </button>

              <Button onClick={handleViewOrders} variant="secondary" fullWidth>
                View My Orders
              </Button>
            </div>

            {}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong> Contact us on WhatsApp:{' '}
                <a
                  href="https://wa.me/919994072395"
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
