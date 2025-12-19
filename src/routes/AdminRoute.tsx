import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loading } from '@/components/common';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useAuth();

  if (!isLoaded) {
    return <Loading fullScreen text="Verifying admin access..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role (you'll need to set this in Clerk metadata or backend)
  const userRole = (user?.publicMetadata as any)?.role;
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
