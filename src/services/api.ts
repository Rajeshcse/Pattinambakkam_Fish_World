import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@/config/env';

// Get validated API base URL from environment configuration
const API_BASE_URL = config.apiBaseUrl;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error(`API Response Error: ${error.response?.status || 'Network Error'}`);
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally and auto-refresh tokens
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const requestUrl = originalRequest.url ?? '';

      // Don't retry for auth endpoints or refresh token endpoint
      const isAuthEndpoint = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/refresh-token',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
      ].some((endpoint) => requestUrl.includes(endpoint));

      if (!isAuthEndpoint) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token - clear storage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Attempt to refresh the token
          const response = await axios.post<{ success: boolean; accessToken: string }>(
            `${API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );

          if (response.data.success && response.data.accessToken) {
            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            // Update the authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            processQueue(null, newAccessToken);

            return apiClient(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);

          // Refresh failed - clear storage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
