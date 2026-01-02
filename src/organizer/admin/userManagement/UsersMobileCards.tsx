import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

interface UsersMobileCardsProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  loading: boolean;
}

export const UsersMobileCards: React.FC<UsersMobileCardsProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden space-y-3">
      {users && users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className="rounded"
                  />
                  <h3 className="text-sm font-bold text-gray-900 truncate">{user.name}</h3>
                </div>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded hover:bg-primary-700 whitespace-nowrap"
              >
                View
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Phone: </span>
                <span className="font-medium text-gray-900">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Role: </span>
                <span
                  className={`font-semibold ${
                    user.role === 'admin' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">
          {loading ? 'Loading users...' : 'No users found'}
        </p>
      )}
    </div>
  );
};
