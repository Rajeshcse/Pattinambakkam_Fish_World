import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  isHomePage: boolean;
  className?: string;
}

/**
 * NavLink Component
 *
 * Reusable navigation link with consistent styling
 * Handles active state, home page vs other pages styling
 * Reduces duplication of conditional className logic
 */
export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  isActive,
  isHomePage,
  className = '',
}) => {
  const baseStyles = 'px-4 py-2 rounded-xl font-medium transition-all duration-300';

  const activeStyles = isActive
    ? isHomePage
      ? 'bg-white/20 text-white'
      : 'bg-primary-100 text-primary-700'
    : isHomePage
    ? 'bg-blue-900/70 text-white hover:bg-blue-900'
    : 'bg-gray-200 text-gray-900 hover:bg-gray-300';

  return (
    <Link to={to} className={`${baseStyles} ${activeStyles} ${className}`}>
      {children}
    </Link>
  );
};
