import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { LogoIcon } from './icons/LogoIcon';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current page is home for transparent navbar
  const isHomePage = location.pathname === '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHomePage ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-lg'
        } ${className}`}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group" onClick={closeMobileMenu}>
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <LogoIcon size={40} className="sm:hidden" />
              <LogoIcon size={48} className="hidden sm:flex" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden xs:block">
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                  isHomePage ? 'text-white' : 'text-gray-800'
                } group-hover:text-primary-500 transition-colors`}
              >
                <span className="hidden sm:inline">Pattinambakkam</span>
                <span className="sm:hidden">PFW</span>
                <span className={`${isHomePage ? 'text-amber-300' : 'text-primary-600'}`}>
                  {' '}
                  Fish World
                </span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === '/'
                    ? isHomePage
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : isHomePage
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === '/products'
                    ? isHomePage
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : isHomePage
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                Products
              </Link>
            </div>

            {/* Cart Icon */}
            {user && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-xl transition-all duration-300 ${
                  location.pathname === '/cart'
                    ? isHomePage
                      ? 'bg-white/20'
                      : 'bg-cyan-100'
                    : isHomePage
                      ? 'hover:bg-white/10'
                      : 'hover:bg-gray-100'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isHomePage ? 'text-white' : 'text-gray-700'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
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

                {/* User Profile Dropdown */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                    isHomePage ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block">
                    <p
                      className={`text-sm font-semibold ${isHomePage ? 'text-white' : 'text-gray-800'}`}
                    >
                      {user.name}
                    </p>
                    <p className={`text-xs ${isHomePage ? 'text-white/70' : 'text-gray-500'}`}>
                      View Profile
                    </p>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isHomePage
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-white/30'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      isHomePage
                        ? 'text-white border-2 border-white/50 hover:bg-white hover:text-primary-600'
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
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
              isHomePage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <LogoIcon size={40} />
            <span className="font-bold text-gray-800">Fish World</span>
          </div>
          <button
            onClick={closeMobileMenu}
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

        {/* Mobile Menu Content */}
        <div className="p-4 space-y-2">
          {/* User Profile Card (if logged in) */}
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
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🏠</span>
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              location.pathname === '/products'
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
                to="/profile"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  location.pathname === '/profile'
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
                  onClick={closeMobileMenu}
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
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
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
            <div className="space-y-3">
              <Link to="/login" onClick={closeMobileMenu}>
                <button className="w-full px-4 py-3 rounded-xl font-semibold text-primary-600 border-2 border-primary-500 hover:bg-primary-50 transition-all">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={closeMobileMenu}>
                <button className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg transition-all">
                  🎉 Get Started Free
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500">🌊 Fresh Fish, Daily Catch</p>
            <p className="text-xs text-gray-400 mt-1">Pattinambakkam Fish World</p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className={isHomePage ? '' : 'h-20'}></div>
    </>
  );
};
