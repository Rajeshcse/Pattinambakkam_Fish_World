import React from 'react';
import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  isHomePage: boolean;
}

/**
 * AuthButtons Component
 *
 * Login and Register buttons for unauthenticated users
 * Desktop layout only
 */
export const AuthButtons: React.FC<AuthButtonsProps> = ({ isHomePage }) => {
  return (
    <div className="flex items-center gap-3">
      <Link to="/login">
        <button
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
            isHomePage
              ? 'bg-blue-900/70 text-white hover:bg-blue-900'
              : 'text-primary-600 border-2 border-primary-500 hover:bg-primary-50'
          }`}
        >
          Login
        </button>
      </Link>
      <Link to="/register">
        <button className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
};
