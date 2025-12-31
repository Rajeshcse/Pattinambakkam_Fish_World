import React from 'react';
import { User } from '@/types';

interface UserAvatarSectionProps {
  user: User;
}

export const UserAvatarSection: React.FC<UserAvatarSectionProps> = ({ user }) => {
  return (
    <div className="flex justify-center">
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center border-4 border-primary-300 leading-none overflow-hidden">
            <span className="text-3xl font-bold text-primary-600 text-center block">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
