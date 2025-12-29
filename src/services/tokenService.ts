/**
 * Token Service
 *
 * Centralized token management service following Single Responsibility Principle
 * Handles:
 * - Token validation and expiration checking
 * - Token refresh with request queuing
 * - JWT decoding
 *
 * This eliminates duplication between api.ts interceptor and AuthContext
 */

import axios, { AxiosError } from 'axios';
import { config } from '@/config/env';
import { storageService } from './storageService';
import { RefreshTokenResponse, DecodedToken } from '@/types';

interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

class TokenService {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];
  private readonly API_BASE_URL = config.apiBaseUrl;

  /**
   * Decode JWT token payload
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as DecodedToken;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Token decode error:', error);
      }
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    // Add 30 second buffer to refresh before actual expiry
    return decoded.exp - 30 < currentTime;
  }

  /**
   * Check if token is valid (exists and not expired)
   */
  isTokenValid(token: string | null): boolean {
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  /**
   * Get current access token from storage
   */
  getAccessToken(): string | null {
    return storageService.getAccessToken();
  }

  /**
   * Get current refresh token from storage
   */
  getRefreshToken(): string | null {
    return storageService.getRefreshToken();
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: AxiosError | null, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      } else {
        promise.reject(new Error('No token available'));
      }
    });
    this.failedQueue = [];
  }

  /**
   * Refresh access token using refresh token
   * Implements request queuing to prevent multiple simultaneous refresh calls
   *
   * @returns Promise<string> - New access token
   * @throws Error if refresh fails
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      // Call refresh endpoint directly (not through apiClient to avoid circular dependency)
      const response = await axios.post<RefreshTokenResponse>(
        `${this.API_BASE_URL}/api/auth/refresh-token`,
        { refreshToken },
      );

      if (response.data.success && response.data.accessToken) {
        const newAccessToken = response.data.accessToken;

        // Store new token
        storageService.setAccessToken(newAccessToken);

        // Process queued requests
        this.processQueue(null, newAccessToken);

        return newAccessToken;
      } else {
        throw new Error('Token refresh failed - invalid response');
      }
    } catch (error) {
      // Process queued requests with error
      this.processQueue(error as AxiosError, null);

      // Clear auth data on refresh failure
      storageService.clearAuthData();

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Clear tokens and force logout
   * Redirects to login page
   */
  clearTokensAndRedirect(): void {
    storageService.clearAuthData();
    window.location.href = '/login';
  }

  /**
   * Check if current access token needs refresh
   * Returns true if token exists but is expired
   */
  shouldRefreshToken(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return false;

    return this.isTokenExpired(accessToken);
  }

  /**
   * Get valid access token
   * Refreshes automatically if expired
   *
   * @returns Promise<string | null> - Valid access token or null
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();

    if (!accessToken) return null;

    // If token is valid, return it
    if (this.isTokenValid(accessToken)) {
      return accessToken;
    }

    // Token expired, try to refresh
    try {
      return await this.refreshAccessToken();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to get valid access token:', error);
      }
      return null;
    }
  }
}

// Export singleton instance
export const tokenService = new TokenService();

// Export class for testing
export default TokenService;
