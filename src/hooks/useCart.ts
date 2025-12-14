import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { CartContextType } from '@/types';

/**
 * Custom hook to access Cart Context
 * @throws Error if used outside CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
