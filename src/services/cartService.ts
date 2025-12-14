import apiClient from './api';
import { CartResponse, CartCountResponse, AddToCartRequest, UpdateCartItemRequest } from '@/types';

const CART_BASE_URL = '/api/cart';

/**
 * Add item to cart
 */
export const addToCart = async (data: AddToCartRequest): Promise<CartResponse> => {
  const response = await apiClient.post<CartResponse>(`${CART_BASE_URL}/add`, data);
  return response.data;
};

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>(CART_BASE_URL);
  return response.data;
};

/**
 * Get cart item count
 */
export const getCartCount = async (): Promise<CartCountResponse> => {
  const response = await apiClient.get<CartCountResponse>(`${CART_BASE_URL}/count`);
  return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemRequest,
): Promise<CartResponse> => {
  const response = await apiClient.put<CartResponse>(`${CART_BASE_URL}/update/${itemId}`, data);
  return response.data;
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>(`${CART_BASE_URL}/remove/${itemId}`);
  return response.data;
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>(`${CART_BASE_URL}/clear`);
  return response.data;
};
