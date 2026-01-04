import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartContextType, FishProduct } from '@/types';
import { cartService } from '@/services';
import { getErrorMessage, logError } from '@/utils/errors';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// Constants for localStorage
const GUEST_CART_KEY = 'guest_cart';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const toast = useResponsiveToast();

  // On mount, check and clean up potentially corrupted localStorage data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate cart structure - if items exist and first item has no product data, clear it
        if (parsed.items && parsed.items.length > 0) {
          const firstItem = parsed.items[0];
          if (
            !firstItem.product ||
            (typeof firstItem.product === 'object' && !firstItem.product.name)
          ) {
            console.warn('Corrupted cart data detected, clearing localStorage');
            localStorage.removeItem(GUEST_CART_KEY);
          }
        }
      }
    } catch (error) {
      console.warn('Error validating cart data, clearing localStorage:', error);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, []);

  // Helper function to get guest cart from localStorage
  const getGuestCart = useCallback((): Cart | null => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return null;
    }
  }, []);

  // Helper function to save guest cart to localStorage
  const saveGuestCart = useCallback((guestCart: Cart) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, []);

  // Helper function to clear guest cart from localStorage
  const clearGuestCart = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error clearing guest cart:', error);
    }
  }, []);

  const itemCount = cart?.items.length || 0;

  const totalAmount =
    cart?.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0) || 0;

  const refreshCart = useCallback(async () => {
    // Handle guest cart - just read from localStorage, no backend calls needed
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      setCart(guestCart);
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

      if (import.meta.env.DEV) {
        console.error('Failed to refresh cart:', getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getGuestCart]);

  const addItem = useCallback(
    async (product: FishProduct, quantity: number) => {
      // Allow guest users to add to cart (stored in localStorage)
      if (!isAuthenticated) {
        try {
          // Validate product has required fields
          if (!product || !product._id || !product.name || !product.price) {
            console.error('Invalid product object:', product);
            toast.error('Invalid product. Please refresh and try again.');
            return;
          }

          // Get current guest cart or create new one
          let guestCart = getGuestCart() || {
            _id: undefined,
            user: 'guest',
            items: [],
            updatedAt: new Date().toISOString(),
          };

          // Check if product already exists in cart
          const existingItemIndex = guestCart.items.findIndex((item) => {
            // Handle both string and object product types
            const itemProductId =
              typeof item.product === 'string' ? item.product : item.product?._id;
            return itemProductId === product._id;
          });

          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            guestCart.items[existingItemIndex].quantity += quantity;
          } else {
            // Add new item to guest cart with FULL product details (no backend call needed)
            // Ensure product object is stored, not just ID
            guestCart.items.push({
              _id: `guest_${product._id}_${Date.now()}`,
              product: product, // Store entire product object
              quantity,
              addedAt: new Date().toISOString(),
            });
          }

          guestCart.updatedAt = new Date().toISOString();
          saveGuestCart(guestCart);
          setCart(guestCart);

          // Debug log to verify product is stored correctly
          console.log('Guest cart item added:', {
            productId: product._id,
            productName: product.name,
            hasImages: Array.isArray(product.images),
            storedItemProduct: guestCart.items[guestCart.items.length - 1]?.product,
          });

          toast.success('Item added to cart');
        } catch (error: unknown) {
          logError(error, 'CartContext.addItem (guest)');
          console.error('Error adding item to guest cart:', error);
          toast.error('Failed to add item to cart');
        }
        return;
      }

      // Original authenticated add to cart flow
      try {
        setLoading(true);
        const response = await cartService.addToCart({ productId: product._id, quantity });
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
    [isAuthenticated, getGuestCart, saveGuestCart, toast],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      // Handle guest cart
      if (!isAuthenticated) {
        try {
          let guestCart = getGuestCart();
          if (guestCart) {
            const item = guestCart.items.find((i) => i._id === itemId);
            if (item) {
              item.quantity = quantity;
              guestCart.updatedAt = new Date().toISOString();
              saveGuestCart(guestCart);
              setCart(guestCart);
              toast.success('Cart updated');
            }
          }
        } catch (error: unknown) {
          logError(error, 'CartContext.updateQuantity (guest)');
          toast.error('Failed to update cart');
        }
        return;
      }

      // Original authenticated update flow
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
    [isAuthenticated, getGuestCart, saveGuestCart, toast],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      // Handle guest cart
      if (!isAuthenticated) {
        try {
          let guestCart = getGuestCart();
          if (guestCart) {
            guestCart.items = guestCart.items.filter((item) => item._id !== itemId);
            guestCart.updatedAt = new Date().toISOString();

            if (guestCart.items.length === 0) {
              clearGuestCart();
              setCart(null);
              toast.success('Item removed from cart');
            } else {
              saveGuestCart(guestCart);
              setCart(guestCart);
              toast.success('Item removed from cart');
            }
          }
        } catch (error: unknown) {
          logError(error, 'CartContext.removeItem (guest)');
          toast.error('Failed to remove item');
        }
        return;
      }

      // Original authenticated remove flow
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
    [isAuthenticated, getGuestCart, saveGuestCart, clearGuestCart, toast],
  );

  const clearCart = useCallback(async () => {
    // Handle guest cart
    if (!isAuthenticated) {
      try {
        clearGuestCart();
        setCart(null);
        toast.success('Cart cleared');
      } catch (error: unknown) {
        logError(error, 'CartContext.clearCart (guest)');
        toast.error('Failed to clear cart');
      }
      return;
    }

    // Original authenticated clear flow
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
  }, [isAuthenticated, clearGuestCart, toast]);

  // Function to sync guest cart to authenticated user's cart
  const syncGuestCartToUser = useCallback(async () => {
    const guestCart = getGuestCart();
    if (!guestCart || guestCart.items.length === 0) {
      return;
    }

    try {
      // Add each guest cart item to the authenticated user's cart
      for (const item of guestCart.items) {
        await cartService.addToCart({
          productId: item.product._id,
          quantity: item.quantity,
        });
      }

      // Clear guest cart after syncing
      clearGuestCart();

      // Refresh authenticated cart
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error: unknown) {
      logError(error, 'CartContext.syncGuestCartToUser');
      console.error('Failed to sync guest cart:', error);
      // Don't show error to user as this is background sync
    }
  }, [getGuestCart, clearGuestCart]);

  useEffect(() => {
    if (isAuthenticated) {
      // Sync guest cart to user's cart on login, then refresh
      (async () => {
        await syncGuestCartToUser();
        await refreshCart();
      })();
    } else {
      // Load guest cart when not authenticated
      const guestCart = getGuestCart();
      console.log('Loading guest cart on mount/auth change:', {
        hasCart: !!guestCart,
        itemCount: guestCart?.items.length || 0,
        firstItemProduct: guestCart?.items[0]?.product,
      });
      setCart(guestCart);
    }
  }, [isAuthenticated, syncGuestCartToUser, refreshCart, getGuestCart]);

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
