import React from 'react';
import { Link } from 'react-router-dom';

interface CartButtonProps {
  itemCount: number;
  isActive: boolean;
  isHomePage: boolean;
  isMobile?: boolean;
}

/**
 * CartButton Component
 *
 * Shopping cart button with item count badge
 * Reusable for both desktop and mobile layouts
 * Handles conditional styling based on context
 */
export const CartButton: React.FC<CartButtonProps> = ({
  itemCount,
  isActive,
  isHomePage,
  isMobile = false,
}) => {
  const getButtonStyles = () => {
    if (isMobile) {
      return isHomePage
        ? `rounded-full p-2.5 ${isActive ? 'bg-blue-900/90' : 'bg-blue-900/70 hover:bg-blue-900'}`
        : `p-2 rounded-xl ${isActive ? 'bg-cyan-100' : 'hover:bg-gray-100'}`;
    }

    return `relative p-2 rounded-xl transition-all duration-300 ${
      isActive
        ? isHomePage
          ? 'bg-white/20'
          : 'bg-cyan-100'
        : isHomePage
        ? 'bg-blue-900/70 hover:bg-blue-900'
        : 'hover:bg-gray-100'
    }`;
  };

  const getIconStyles = () => {
    return isHomePage ? 'w-6 h-6 text-white' : 'w-6 h-6 text-gray-700';
  };

  return (
    <Link to="/cart" className={`relative transition-all duration-300 ${getButtonStyles()}`}>
      <svg className={getIconStyles()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};
