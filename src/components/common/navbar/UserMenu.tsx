import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/types';

interface UserMenuProps {
  user: User;
  isHomePage: boolean;
  onLogout: () => void;
}

/**
 * UserMenu Component
 *
 * Desktop user menu with profile link and logout button
 * Shows admin badge for admin users
 * Displays user avatar and info
 */
export const UserMenu: React.FC<UserMenuProps> = ({ user, isHomePage, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Admin Badge */}
      {user.role === 'admin' && (
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          ⚡ Admin
        </Link>
      )}

      {/* Profile Link */}
      <Link
        to="/profile"
        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
          isHomePage ? 'bg-blue-900/70 hover:bg-blue-900' : 'hover:bg-gray-100'
        }`}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="hidden lg:block">
          <p className={`text-sm font-semibold ${isHomePage ? 'text-white' : 'text-gray-800'}`}>
            {user.name}
          </p>
          <p className={`text-xs ${isHomePage ? 'text-white/70' : 'text-gray-500'}`}>
            View Profile
          </p>
        </div>
      </Link>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
          isHomePage
            ? 'bg-blue-900/70 text-white hover:bg-blue-900 border border-blue-800'
            : 'bg-gray-200 text-gray-900 hover:bg-red-200 border border-gray-400'
        }`}
      >
        Logout
      </button>
    </div>
  );
};
