import React, { ReactNode } from 'react';
import { Card } from '@/components/common';
import { Navbar } from '@/components/common/navbar';

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
            <div className="space-y-2 flex justify-center">
              <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-black leading-tight flex flex-col md:flex-row md:whitespace-nowrap gap-2 md:gap-2">
                <span className="text-primary-600 glow-text">Pattinambakkam</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 glow-text-gold animate-gradient">
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
