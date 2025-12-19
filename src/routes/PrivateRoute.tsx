import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loading } from '@/components/common';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  return isSignedIn ? <>{children}</> : <Navigate to="/login" replace />;
};
