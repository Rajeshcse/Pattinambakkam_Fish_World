import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
