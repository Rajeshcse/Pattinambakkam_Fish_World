import React from 'react';
import { Button } from '@/components/common';
import type { User } from '@/types';

interface AddressCardProps {
  user: User;
  onEditProfile: () => void;
}

/**
 * AddressCard Component
 *
 * Displays delivery address or prompts to add one
 */
export const AddressCard: React.FC<AddressCardProps> = ({ user, onEditProfile }) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
      {user.address && user.address.street ? (
        <div className="mt-1 text-lg text-gray-900">
          <p>{user.address.street}</p>
          {user.address.landmark && (
            <p className="text-sm text-gray-600">Landmark: {user.address.landmark}</p>
          )}
          <p className="text-sm">
            {user.address.city && `${user.address.city}, `}
            {user.address.state && user.address.state}
            {user.address.pincode && ` - ${user.address.pincode}`}
          </p>
        </div>
      ) : (
        <div className="mt-1">
          <p className="text-gray-500 italic mb-2">No address saved</p>
          <Button variant="secondary" size="sm" onClick={onEditProfile}>
            Add Address
          </Button>
        </div>
      )}
    </div>
  );
};
