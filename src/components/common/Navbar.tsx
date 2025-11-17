import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();

  return (
    <div className={`flex justify-between items-center px-6 py-6 max-w-7xl mx-auto ${className}`}>
      <Link to="/" className="flex items-center gap-2">
        <span className="text-3xl">📚</span>
        <h1 className="text-2xl font-bold text-gray-800">Kidzo</h1>
      </Link>
      
      {/* Dynamic Navigation based on auth state */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden sm:inline">Welcome, {user.name}!</span>
          <div className="flex items-center gap-2">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              title={`${user.name}'s Profile`}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 hidden sm:inline">Profile</span>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="ml-2"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" size="md">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="md">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
};