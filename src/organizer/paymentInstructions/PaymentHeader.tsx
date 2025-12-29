import React from 'react';

interface PaymentHeaderProps {
  orderId: string;
}

/**
 * PaymentHeader Component
 *
 * Header with payment icon, title, and order ID
 */
export const PaymentHeader: React.FC<PaymentHeaderProps> = ({ orderId }) => {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};
