import React from 'react';
import type { User } from '@/types';

interface PersonalInfoCardProps {
  user: User;
  formatMemberSince: (dateString: string | undefined) => string;
}

/**
 * PersonalInfoCard Component
 *
 * Displays personal information: name, email, phone, role, status, member since
 */
export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ user, formatMemberSince }) => {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
        <p className="mt-1 text-lg text-gray-900">{user.name}</p>
      </div>

      {/* Email with Verification Badge */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-lg text-gray-900">{user.email}</p>
          {user.isVerified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
        <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
      </div>

      {/* Role */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Role</h3>
        <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
      </div>

      {/* Account Status */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
        <div className="mt-1 flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {user.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      {/* Member Since */}
      <div className="pb-4">
        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
        <p className="mt-1 text-lg text-gray-900">{formatMemberSince(user.createdAt)}</p>
      </div>
    </div>
  );
};
