import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextType } from '@/types';

/**
 * Custom hook to access Auth Context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
