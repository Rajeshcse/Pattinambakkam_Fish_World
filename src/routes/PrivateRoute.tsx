import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // Store the intended destination for redirect after login
    sessionStorage.setItem('intendedDestination', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
