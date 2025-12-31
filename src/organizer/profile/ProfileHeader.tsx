import React from 'react';

interface ProfileHeaderProps {
  avatar?: string;
  name: string;
}

/**
 * ProfileHeader Component
 *
 * Displays user avatar (or initial) at top of profile
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatar, name }) => {
  return (
    <div className="flex justify-center">
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center border-4 border-primary-300 leading-none overflow-hidden">
            <span className="text-3xl font-bold text-primary-600 text-center block">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
