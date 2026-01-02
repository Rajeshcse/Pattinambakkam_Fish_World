import React from 'react';
import { User } from '@/types';

interface UserInfoDisplayProps {
  user: User;
}

export const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">User ID</h3>
        <p className="mt-1 text-lg text-gray-900 font-mono">{user.id}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
        <p className="mt-1 text-lg text-gray-900">{user.name}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
        <p className="mt-1 text-lg text-gray-900">{user.email}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
        <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Role</h3>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {user.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      <div className="pb-4">
        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
        <p className="mt-1 text-lg text-gray-900">
          {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};
