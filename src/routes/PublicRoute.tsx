import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // User is authenticated - check if they're trying to access a public page
  const intendedDestination = sessionStorage.getItem('intendedDestination');

  if (intendedDestination === '/checkout') {
    if (user?.address && Object.keys(user.address).length > 0) {
      return <Navigate to="/checkout" replace />;
    } else {
      return <Navigate to="/profile/edit" state={{ redirectTo: '/checkout' }} replace />;
    }
  }

  // Default: redirect to profile
  return <Navigate to="/profile" replace />;
};
