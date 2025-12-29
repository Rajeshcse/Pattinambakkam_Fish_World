import React from 'react';
import type { Cart } from '@/types';
import { formatQuantityToWeight } from '@/utils/formatters';

interface OrderSummaryBlockProps {
  cart: Cart;
  totalAmount: number;
  itemCount: number;
}

/**
 * OrderSummaryBlock Component
 *
 * Displays order summary with cart items and total amount
 * Sticky sidebar component for checkout page
 */
export const OrderSummaryBlock: React.FC<OrderSummaryBlockProps> = ({
  cart,
  totalAmount,
  itemCount,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      {/* Cart Items List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} × {formatQuantityToWeight(item.quantity)}
            </span>
            <span className="font-semibold">
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Benefits List */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>✓ Fresh seafood delivered</p>
        <p>✓ WhatsApp/UPI payment accepted</p>
        <p>
          ✓ {itemCount} item{itemCount !== 1 ? 's' : ''} in order
        </p>
      </div>
    </div>
  );
};
