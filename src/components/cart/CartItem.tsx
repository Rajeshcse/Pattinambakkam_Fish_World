import React, { useState } from 'react';
import type { CartItem as CartItemType } from '@/types';
import { formatQuantityToWeight } from '@/utils/formatters';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  disabled?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false,
}) => {
  const [updating, setUpdating] = useState(false);
  const toast = useResponsiveToast();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      const weight = formatQuantityToWeight(item.product.stock);
      toast.warning(`Only ${weight} available`);
      return;
    }

    try {
      setUpdating(true);
      await onUpdateQuantity(item._id, newQuantity);
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUpdating(true);
      await onRemove(item._id);
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 transition-opacity ${
        updating || disabled ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        {}
        <div className="flex-shrink-0 w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
          {item.product.images && item.product.images[0] ? (
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {item.product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">{item.product.category}</p>
            </div>
            <button
              onClick={handleRemove}
              disabled={updating || disabled}
              className="flex-shrink-0 text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
              title="Remove item"
            >
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {}
          <div className="mb-3">
            <span className="text-base sm:text-lg font-bold text-green-600">
              ₹{item.product.price}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">/250g</span>
          </div>

          {}
          <div className="space-y-2">
            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating || disabled}
                  className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-md text-sm sm:font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={item.product.stock}
                  disabled={updating || disabled}
                  className="w-12 sm:w-16 text-center text-sm sm:text-base font-semibold border border-gray-200 rounded-md py-1 focus:outline-none focus:border-cyan-500 disabled:bg-gray-50"
                />
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock || updating || disabled}
                  className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-md text-sm sm:font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {}
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-500">Subtotal</div>
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </div>
              </div>
            </div>

            {}
            <div className="text-xs text-gray-500 truncate">
              {formatQuantityToWeight(item.quantity)} / {formatQuantityToWeight(item.product.stock)}{' '}
              max
            </div>

            {}
            {item.product.stock < 10 && (
              <div className="text-xs text-orange-600">
                ⚠️ Only {formatQuantityToWeight(item.product.stock)} left
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
