import React from 'react';
import type { DeliveryTimeSlot } from '@/types';

interface DeliverySlotSelectorProps {
  formData: {
    deliveryDate: string;
    deliveryTime: DeliveryTimeSlot | '';
    orderNotes: string;
  };
  availableSlots: { slot: DeliveryTimeSlot; available: boolean; reason: string }[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSlotSelect: (slot: DeliveryTimeSlot) => void;
}

/**
 * DeliverySlotSelector Component
 *
 * Handles delivery date, time slot selection, and order notes
 * Shows available slots based on selected date
 */
export const DeliverySlotSelector: React.FC<DeliverySlotSelectorProps> = ({
  formData,
  availableSlots,
  onInputChange,
  onSlotSelect,
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Delivery Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Delivery Date *
        </label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={onInputChange}
          required
          min={today}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Delivery Time Slot */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Delivery Time Slot *{' '}
          <span className="text-xs text-orange-600">(Minimum 4 hours from now)</span>
        </label>
        {formData.deliveryDate ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {availableSlots.map(({ slot, available, reason }) => (
              <button
                key={slot}
                type="button"
                onClick={() => available && onSlotSelect(slot)}
                disabled={!available}
                className={`p-4 rounded-lg border-2 text-sm font-semibold transition-all ${
                  formData.deliveryTime === slot
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : available
                    ? 'border-gray-200 hover:border-cyan-300 text-gray-700'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div>{slot}</div>
                <div className="text-xs mt-1">{reason}</div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Please select a delivery date first</p>
        )}
      </div>

      {/* Special Instructions */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          name="orderNotes"
          value={formData.orderNotes}
          onChange={onInputChange}
          rows={2}
          maxLength={500}
          placeholder="E.g., Please clean and cut into medium pieces"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.orderNotes.length}/500 characters</p>
      </div>
    </>
  );
};
