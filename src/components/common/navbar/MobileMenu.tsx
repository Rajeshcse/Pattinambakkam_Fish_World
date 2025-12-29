import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/types';
import { LogoIcon } from '../icons/LogoIcon';

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  itemCount: number;
  onClose: () => void;
  onLogout: () => void;
}

/**
 * MobileMenu Component
 *
 * Slide-in mobile navigation drawer
 * Displays user profile, navigation links, and auth actions
 * Responsive design with backdrop overlay
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  user,
  itemCount,
  onClose,
  onLogout,
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <LogoIcon size={40} />
            <span className="font-bold text-gray-800">Fish World</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-2">
          {/* User Profile Card */}
          {user && (
            <div className="p-4 mb-4 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-2xl border border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive('/') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🏠</span>
            Home
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive('/products')
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🐟</span>
            Products
          </Link>

          {user && (
            <>
              <Link
                to="/cart"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive('/cart')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">🛒</span>
                My Cart
                {itemCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/my-orders"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive('/my-orders')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📦</span>
                My Orders
              </Link>

              <Link
                to="/profile"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive('/profile')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">👤</span>
                My Profile
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                >
                  <span className="text-xl">⚡</span>
                  Admin Dashboard
                </Link>
              )}
            </>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-gray-100"></div>

          {/* Auth Actions */}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          ) : (
            <div className="mb-32 flex flex-col gap-8">
              <Link to="/login" onClick={onClose}>
                <button className="w-full px-4 py-3 rounded-xl font-semibold text-primary-600 border-2 border-primary-500 hover:bg-primary-50 transition-all">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <button className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg transition-all">
                  🎉 Get Started Free
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500">🌊 Fresh Fish, Daily Catch</p>
            <p className="text-xs text-gray-400 mt-1">Pattinambakkam Fish World</p>
          </div>
        </div>
      </div>
    </>
  );
};
