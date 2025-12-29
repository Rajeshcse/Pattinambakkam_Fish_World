import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DeliveryAddressFormProps {
  formData: {
    address: string;
    phone: string;
  };
  addressLocked: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * DeliveryAddressForm Component
 *
 * Handles delivery address and phone number input
 * Shows locked state when address is from user profile
 */
export const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  addressLocked,
  onInputChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>

      {/* Address Field */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Delivery Address *
          </label>
          {addressLocked && (
            <button
              type="button"
              onClick={() => navigate('/profile/edit')}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Edit in Profile →
            </button>
          )}
        </div>
        <textarea
          name="address"
          value={formData.address}
          onChange={onInputChange}
          required
          rows={3}
          placeholder="Enter your complete delivery address"
          readOnly={addressLocked}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 ${
            addressLocked ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
        />
        {addressLocked && (
          <p className="text-xs text-gray-500 mt-1">
            This address is from your profile. Click "Edit in Profile" to update it.
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          required
          placeholder="10-digit phone number"
          pattern="[6-9][0-9]{9}"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>
  );
};
