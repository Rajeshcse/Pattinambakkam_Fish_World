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
          {}
          <div className="text-center mb-8 space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-primary-600 leading-tight">
                <span className="block glow-text">Pattinambakkam</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 glow-text-gold animate-gradient">
                  Fish World
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-light">{subtitle}</p>
          </div>

          {}
          <Card>{children}</Card>
        </div>
      </div>
    </div>
  );
};
