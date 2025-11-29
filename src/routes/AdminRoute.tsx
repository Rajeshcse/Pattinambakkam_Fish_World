import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component
 * Protects routes that require admin role
 * Redirects to home if user is not an admin
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Verifying admin access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
