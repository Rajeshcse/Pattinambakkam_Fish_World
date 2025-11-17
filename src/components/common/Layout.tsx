import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {showNavbar && <Navbar />}
      <div className={className}>
        {children}
      </div>
    </div>
  );
};