import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartContextType } from '@/types';
import { cartService } from '@/services';
import { toast } from 'react-toastify';
import { getErrorMessage, logError } from '@/utils/errors';
import { useAuth } from '@/hooks/useAuth';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const itemCount = cart?.items.length || 0;

  const totalAmount =
    cart?.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0) || 0;

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

      console.error('Failed to refresh cart:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
    [isAuthenticated],
  );

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
    [isAuthenticated],
  );

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
    [isAuthenticated],
  );

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
