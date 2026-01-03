import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';
import { formatQuantityToWeight } from '@/utils/formatters';

interface AddToCartSectionProps {
  isAvailable: boolean;
  isAuthenticated: boolean;
  quantity: number;
  maxStock: number;
  price: number;
  cartLoading: boolean;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
}

/**
 * AddToCartSection Component
 *
 * Quantity selector, subtotal display, and add to cart button
 * Includes validation and login prompt
 */
export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  isAvailable,
  isAuthenticated,
  quantity,
  maxStock,
  price,
  cartLoading,
  onQuantityChange,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Quantity Selector */}
      {isAvailable && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg font-bold text-lg transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={maxStock}
              className="w-16 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg py-1 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= maxStock}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg font-bold text-lg transition-colors"
            >
              +
            </button>
            <span className="text-xs text-gray-500 ml-2">
              {quantity} × 500g = {formatQuantityToWeight(quantity)}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              (Max: {formatQuantityToWeight(maxStock)})
            </span>
          </div>
        </div>
      )}

      {/* Subtotal */}
      {isAvailable && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium text-sm">Subtotal:</span>
            <span className="text-xl font-bold text-gray-900">
              ₹{(price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <Button
          onClick={onAddToCart}
          disabled={!isAvailable || cartLoading}
          loading={cartLoading}
          variant="primary"
          fullWidth
          size="md"
        >
          🛒 Add to Cart
        </Button>
        <Button onClick={() => navigate('/products')} variant="outline" size="md" className="px-4">
          ← Back
        </Button>
      </div>
    </>
  );
};
