import React, { ReactNode } from 'react';
import { Card } from '@/components/common';
import { Navbar } from '@/components/common/Navbar';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showNavbar?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showNavbar = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {showNavbar && <Navbar />}

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Card Content */}
          <Card>{children}</Card>
        </div>
      </div>
    </div>
  );
};
