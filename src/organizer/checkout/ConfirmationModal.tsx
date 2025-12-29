import React from 'react';
import { Modal, Button } from '@/components/common';
import type { Cart, DeliveryTimeSlot } from '@/types';
import { formatQuantityToWeight } from '@/utils/formatters';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  cart: Cart | null;
  formData: {
    address: string;
    phone: string;
    deliveryDate: string;
    deliveryTime: DeliveryTimeSlot | '';
    orderNotes: string;
  };
  totalAmount: number;
}

/**
 * ConfirmationModal Component
 *
 * Displays order confirmation dialog before submitting WhatsApp order
 * Shows order summary, delivery details, and payment method
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  cart,
  formData,
  totalAmount,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Your Order"
      size="lg"
      closeOnOverlayClick={!submitting}
      closeOnEscape={!submitting}
      showCloseButton={!submitting}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Order Items Summary */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Order Items:</h3>
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 max-h-40 md:max-h-48 overflow-y-auto">
            {cart?.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start gap-2 text-xs md:text-sm"
              >
                <span className="text-gray-700 flex-1">
                  {item.product.name} × {formatQuantityToWeight(item.quantity)}
                </span>
                <span className="font-semibold text-gray-900 whitespace-nowrap">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-sm md:text-base">
              <span className="text-gray-900">Total Amount:</span>
              <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
            Delivery Details:
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2.5 text-xs md:text-sm">
            <div>
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-600 mt-0.5 leading-relaxed">{formData.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-600">{formData.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-600">
                  {new Date(formData.deliveryDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Time:</span>
              <p className="text-gray-600">{formData.deliveryTime}</p>
            </div>
            {formData.orderNotes && (
              <div>
                <span className="font-medium text-gray-700">Special Instructions:</span>
                <p className="text-gray-600 mt-0.5 leading-relaxed">{formData.orderNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
          <div className="flex items-start gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">💬</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm md:text-base">WhatsApp Order</h4>
              <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">
                You'll be redirected to WhatsApp to confirm this order. Pay using UPI/PhonePe/GPay
                after confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            size="lg"
            fullWidth
            className="order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            loading={submitting}
            size="lg"
            fullWidth
            className="order-1 sm:order-2"
          >
            Confirm & Proceed to WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
};
