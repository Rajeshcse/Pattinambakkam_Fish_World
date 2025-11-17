import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute Component
 * Redirects to profile if already authenticated
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/profile" replace /> : <>{children}</>;
};
