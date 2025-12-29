import React from 'react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'whatsapp' | 'razorpay-link';
  totalAmount: number;
  onMethodChange: (method: 'whatsapp' | 'razorpay-link') => void;
}

/**
 * PaymentMethodSelector Component
 *
 * Allows user to select payment method (WhatsApp/Razorpay)
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  totalAmount,
  onMethodChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WhatsApp Payment Option */}
        <div
          onClick={() => onMethodChange('whatsapp')}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            paymentMethod === 'whatsapp'
              ? 'border-cyan-500 bg-cyan-50'
              : 'border-gray-300 hover:border-cyan-400'
          }`}
        >
          <div className="flex items-start">
            <input
              type="radio"
              checked={paymentMethod === 'whatsapp'}
              onChange={() => onMethodChange('whatsapp')}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">💬 WhatsApp Order</h4>
              <p className="text-sm text-gray-600 mt-1">
                Order via WhatsApp & pay using UPI/PhonePe/GPay
              </p>
              <div className="mt-2 text-sm text-gray-700">
                Amount: <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-xs text-green-600">✓ Quick & convenient</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
