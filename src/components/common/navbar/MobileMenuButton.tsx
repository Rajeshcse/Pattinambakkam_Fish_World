import React from 'react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  isHomePage: boolean;
  onClick: () => void;
}

/**
 * MobileMenuButton Component
 *
 * Hamburger menu button for mobile navigation
 * Toggles between hamburger and close icon
 */
export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  isHomePage,
  onClick,
}) => {
  const iconStyles = isHomePage ? 'w-7 h-7 text-white' : 'w-7 h-7 text-black';

  return (
    <button
      onClick={onClick}
      className={`transition-all duration-300 ${
        isHomePage
          ? 'rounded-full p-2.5 bg-blue-900/70 hover:bg-blue-900'
          : 'p-2 rounded-xl text-gray-700 hover:bg-gray-100'
      }`}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  );
};
