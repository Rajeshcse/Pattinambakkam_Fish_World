import apiClient from './api';
import {
  OrderResponse,
  OrderListResponse,
  OrderStatsResponse,
  CreateOrderRequest,
  DeliveryTimeSlot,
} from '@/types';

const ORDER_BASE_URL = '/api/orders';

export const createOrder = async (data: CreateOrderRequest): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>(`${ORDER_BASE_URL}/create`, data);
  return response.data;
};

export const getUserOrders = async (filters?: {
  status?: string;
  limit?: number;
  skip?: number;
}): Promise<OrderListResponse> => {
  const response = await apiClient.get<OrderListResponse>(ORDER_BASE_URL, {
    params: filters,
  });
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.get<OrderResponse>(`${ORDER_BASE_URL}/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.put<OrderResponse>(`${ORDER_BASE_URL}/${orderId}/cancel`);
  return response.data;
};

export const getUserOrderStats = async (): Promise<OrderStatsResponse> => {
  const response = await apiClient.get<OrderStatsResponse>(`${ORDER_BASE_URL}/stats`);
  return response.data;
};

export const validateDeliveryTime = (
  deliveryDate: string,
  deliveryTime: string,
): { valid: boolean; message: string } => {
  const now = new Date();
  const minimumTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const selectedDate = new Date(deliveryDate);
  const [startTimePart] = deliveryTime.split('-');
  const timeMatch = startTimePart.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (!timeMatch) {
    return {
      valid: false,
      message: 'Invalid time format',
    };
  }

  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3].toUpperCase();

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  const selectedDeliveryTime = new Date(selectedDate);
  selectedDeliveryTime.setHours(hours, minutes, 0, 0);

  if (selectedDeliveryTime < minimumTime) {
    return {
      valid: false,
      message: `Delivery time must be at least 4 hours from now. Minimum: ${minimumTime.toLocaleString()}`,
    };
  }

  if (selectedDate < new Date(now.setHours(0, 0, 0, 0))) {
    return {
      valid: false,
      message: 'Delivery date cannot be in the past',
    };
  }

  return {
    valid: true,
    message: 'Delivery time is valid',
  };
};

export const getAvailableTimeSlots = (
  date: string,
): { slot: DeliveryTimeSlot; available: boolean; reason: string }[] => {
  const now = new Date();
  const minimumTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const selectedDate = new Date(date);

  const timeSlots: { slot: DeliveryTimeSlot; start: number }[] = [
    { slot: '8:00 AM - 12:00 PM', start: 8 },
    { slot: '12:00 PM - 4:00 PM', start: 12 },
    { slot: '4:00 PM - 8:00 PM', start: 16 },
  ];

  return timeSlots.map(({ slot, start }) => {
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(start, 0, 0, 0);

    const available = slotDateTime >= minimumTime;
    const reason = available ? 'Available' : 'Requires at least 4 hours advance notice';

    return { slot, available, reason };
  });
};
