import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useProductCount } from '@/hooks/useProductCount';
import { NavLogo } from './NavLogo';
import { NavLink } from './NavLink';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { AuthButtons } from './AuthButtons';
import { MobileMenu } from './MobileMenu';
import { MobileMenuButton } from './MobileMenuButton';

interface NavbarProps {
  className?: string;
}

/**
 * Navbar Component (Refactored)
 *
 * Main navigation component with improved architecture:
 * - Decomposed into smaller, focused sub-components
 * - Custom hooks for data fetching (useProductCount)
 * - Separation of concerns (desktop vs mobile layouts)
 * - Reduced file size from 519 to ~120 lines
 *
 * Benefits:
 * - Easier to test individual components
 * - Better code reusability
 * - Clearer responsibilities
 * - Improved maintainability
 */
export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { productCount } = useProductCount();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <NavLogo
            isHomePage={isHomePage}
            productCount={productCount}
            onMobileMenuClose={closeMobileMenu}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              <NavLink to="/" isActive={location.pathname === '/'} isHomePage={isHomePage}>
                Home
              </NavLink>
              <NavLink
                to="/products"
                isActive={location.pathname === '/products'}
                isHomePage={isHomePage}
              >
                Products
              </NavLink>
              {user && (
                <NavLink
                  to="/my-orders"
                  isActive={location.pathname === '/my-orders'}
                  isHomePage={isHomePage}
                >
                  My Orders
                </NavLink>
              )}
            </div>

            {/* Cart Button (Desktop) */}
            {user && (
              <CartButton
                itemCount={itemCount}
                isActive={location.pathname === '/cart'}
                isHomePage={isHomePage}
              />
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <UserMenu user={user} isHomePage={isHomePage} onLogout={logout} />
            ) : (
              <AuthButtons isHomePage={isHomePage} />
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Cart Button (Mobile) */}
            {user && (
              <CartButton
                itemCount={itemCount}
                isActive={location.pathname === '/cart'}
                isHomePage={isHomePage}
                isMobile
              />
            )}

            {/* Mobile Menu Button */}
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              isHomePage={isHomePage}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        user={user}
        itemCount={itemCount}
        onClose={closeMobileMenu}
        onLogout={logout}
      />

      {/* Spacer for fixed navbar */}
      <div className={isHomePage ? '' : 'h-20'}></div>
    </>
  );
};
