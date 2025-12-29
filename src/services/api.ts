import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@/config/env';
import { tokenService } from './tokenService';

const API_BASE_URL = config.apiBaseUrl;

/**
 * API Client with automatic token management
 *
 * Features:
 * - Automatic token injection in request headers
 * - Automatic token refresh on 401 errors
 * - Request queuing during token refresh
 * - Centralized error handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor - Add Authorization header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor - Handle 401 errors and token refresh
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const requestUrl = originalRequest.url ?? '';

      // Don't retry auth endpoints to avoid infinite loops
      const isAuthEndpoint = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/refresh-token',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
      ].some((endpoint) => requestUrl.includes(endpoint));

      if (!isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          // Use centralized token service for refresh
          const newAccessToken = await tokenService.refreshAccessToken();

          // Update request header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Retry original request with new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Token refresh failed - clear data and redirect to login
          tokenService.clearTokensAndRedirect();
          return Promise.reject(refreshError);
        }
      }
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`API Response Error: ${error.response?.status || 'Network Error'}`);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
