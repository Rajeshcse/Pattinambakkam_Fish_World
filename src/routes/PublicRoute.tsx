import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // If still loading, just render children (Clerk will handle the UI)
  if (!isLoaded) {
    return <>{children}</>;
  }

  // If signed in, redirect to profile
  if (isSignedIn) {
    return <Navigate to="/profile" replace />;
  }

  // If not signed in, show the public page
  return <>{children}</>;
};
