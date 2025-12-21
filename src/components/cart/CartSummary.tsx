import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';

interface CartSummaryProps {
  itemCount: number;
  totalAmount: number;
  onCheckout: () => void;
  loading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  totalAmount,
  onCheckout,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Items ({itemCount})</span>
          <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
            <span>Total</span>
            <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={itemCount === 0 || loading}
        loading={loading}
        variant="primary"
        fullWidth
        size="lg"
      >
        Proceed to Checkout
      </Button>

      <button
        onClick={() => navigate('/products')}
        className="w-full mt-3 text-cyan-600 hover:text-cyan-700 text-xs sm:text-sm font-medium"
      >
        ← Continue Shopping
      </button>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Fresh seafood delivered</p>
          <p>✓ Minimum 4 hours delivery</p>
          <p>✓ UPI/WhatsApp payment</p>
        </div>
      </div>
    </div>
  );
};
