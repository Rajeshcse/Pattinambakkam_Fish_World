import React from 'react';
import { Button } from '@/components/common';

interface PaymentActionsProps {
  onOpenPaymentLink: () => void;
  onPaymentDone: () => void;
  onViewOrders: () => void;
}

/**
 * PaymentActions Component
 *
 * Action buttons: Proceed to Payment, I've Paid, View Orders
 */
export const PaymentActions: React.FC<PaymentActionsProps> = ({
  onOpenPaymentLink,
  onPaymentDone,
  onViewOrders,
}) => {
  return (
    <div className="space-y-3">
      <Button onClick={onOpenPaymentLink} variant="primary" fullWidth size="lg">
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
        onClick={onPaymentDone}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
                   hover:bg-green-700 transition-colors duration-200"
      >
        I've Completed the Payment
      </button>

      <Button onClick={onViewOrders} variant="secondary" fullWidth>
        View My Orders
      </Button>
    </div>
  );
};
