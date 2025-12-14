import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartContextType } from '@/types';
import { cartService } from '@/services';
import { toast } from 'react-toastify';
import { getErrorMessage, logError } from '@/utils/errors';
import { useAuth } from '@/hooks/useAuth';

// Create Cart Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider Component
 * Manages shopping cart state and provides cart methods
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  /**
   * Calculate total item count
   */
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  /**
   * Calculate total amount
   */
  const totalAmount =
    cart?.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0) || 0;

  /**
   * Refresh cart from server
   */
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error: unknown) {
      logError(error, 'CartContext.refreshCart');
      // Don't show error toast for cart refresh failures
      console.error('Failed to refresh cart:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add item to cart
   */
  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        return;
      }

      try {
        setLoading(true);
        const response = await cartService.addToCart({ productId, quantity });
        if (response.success) {
          setCart(response.data);
          toast.success('Item added to cart');
        }
      } catch (error: unknown) {
        logError(error, 'CartContext.addItem');
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticated) {
        toast.error('Please login to update cart');
        return;
      }

      try {
        setLoading(true);
        const response = await cartService.updateCartItem(itemId, { quantity });
        if (response.success) {
          setCart(response.data);
          toast.success('Cart updated');
        }
      } catch (error: unknown) {
        logError(error, 'CartContext.updateQuantity');
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (itemId: string) => {
      if (!isAuthenticated) {
        toast.error('Please login to remove items');
        return;
      }

      try {
        setLoading(true);
        const response = await cartService.removeCartItem(itemId);
        if (response.success) {
          setCart(response.data);
          toast.success('Item removed from cart');
        }
      } catch (error: unknown) {
        logError(error, 'CartContext.removeItem');
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * Clear cart
   */
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(response.data);
        toast.success('Cart cleared');
      }
    } catch (error: unknown) {
      logError(error, 'CartContext.clearCart');
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Load cart on mount and when auth status changes
   */
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  const value: CartContextType = {
    cart,
    itemCount,
    totalAmount,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
