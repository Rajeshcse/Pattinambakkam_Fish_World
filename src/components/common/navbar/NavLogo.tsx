import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon } from '../icons/LogoIcon';

interface NavLogoProps {
  isHomePage: boolean;
  productCount: number;
  onMobileMenuClose: () => void;
}

/**
 * NavLogo Component
 *
 * Displays the application logo and branding
 * Responsive: Shows different text on mobile/tablet/desktop
 * Contextual: Shows product count on products page for mobile
 */
export const NavLogo: React.FC<NavLogoProps> = ({
  isHomePage,
  productCount,
  onMobileMenuClose,
}) => {
  const location = useLocation();

  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 group" onClick={onMobileMenuClose}>
      <div className="relative group-hover:scale-110 transition-transform duration-300">
        <LogoIcon size={40} className="sm:hidden" />
        <LogoIcon size={48} className="hidden sm:flex" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>

      <div className="hidden xs:block">
        <h1
          className={`text-lg sm:text-xl lg:text-2xl font-bold ${
            isHomePage ? 'text-white' : 'text-black'
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

      {location.pathname === '/products' && (
        <div className="ml-2 flex flex-col md:hidden">
          <p className="text-sm sm:text-base font-bold text-yellow-500">🐟 Fresh Seafood</p>
          <p className="text-xs text-blue-600">{productCount} products</p>
        </div>
      )}
    </Link>
  );
};
