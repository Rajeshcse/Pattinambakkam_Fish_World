import apiClient from './api';
import {
  RegisterRequest,
  LoginRequest,
  AuthSuccessResponse,
  RefreshTokenResponse,
  MessageResponse,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types';
import { handleApiError, logError, isAxiosError } from '@/utils/errors';

/**
 * Authentication Service
 * Handles user registration, login, token management, and password operations
 */
class AuthService {
  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try a simple GET request to test connectivity
      await apiClient.get('/api/auth/test', { timeout: 5000 });
      return true;
    } catch (error: unknown) {
      logError(error, 'AuthService.testConnection');
      return false;
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthSuccessResponse> {
    // Validate data before sending
    const { name, email, phone, password } = data;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!phone) missingFields.push('phone');
      if (!password) missingFields.push('password');
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    try {
      const response = await apiClient.post<AuthSuccessResponse>(
        '/api/auth/register',
        data
      );

      return response.data;
    } catch (error: unknown) {
      logError(error, 'AuthService.register');

      const appError = handleApiError(error);

      // Provide more specific error messages based on error type
      if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - API server may be slow or unreachable');
        }
        if (error.response?.status === 400) {
          const apiMessage = error.response.data?.message || 'Invalid registration data';
          throw new Error(apiMessage);
        }
        if (error.response?.status && error.response.status >= 500) {
          throw new Error('Server error - please try again later');
        }
      }

      throw new Error(appError.message);
    }
  }

  /**
   * Login user with email/phone and password
   */
  async login(credentials: LoginRequest): Promise<AuthSuccessResponse> {
    const response = await apiClient.post<AuthSuccessResponse>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/api/auth/refresh-token',
      { refreshToken }
    );
    return response.data;
  }

  /**
   * Logout user from current device
   */
  async logout(refreshToken: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/logout',
      { refreshToken }
    );
    return response.data;
  }

  /**
   * Logout user from all devices
   */
  async logoutAll(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/logout-all'
    );
    return response.data;
  }

  // Email Verification Methods

  /**
   * Send email verification OTP
   */
  async sendVerificationEmail(): Promise<MessageResponse> {
    console.log('📧 Sending verification email...');
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/send-verification-email'
    );
    console.log('📧 OTP Response:', response.data);
    return response.data;
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/verify-email',
      data
    );
    return response.data;
  }

  /**
   * Resend email verification OTP
   */
  async resendVerificationEmail(): Promise<MessageResponse> {
    console.log('🔄 Resending verification email...');
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/resend-verification-email'
    );
    console.log('🔄 Resend OTP Response:', response.data);
    return response.data;
  }

  // Password Management Methods

  /**
   * Request password reset OTP
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/forgot-password',
      data
    );
    return response.data;
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/reset-password',
      data
    );
    return response.data;
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/api/auth/change-password',
      data
    );
    return response.data;
  }

  // Local Storage Management

  /**
   * Store authentication tokens and user data
   */
  setAuthData(accessToken: string, refreshToken: string, user: any): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Update only the access token
   */
  setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Get stored authentication token (alias for backward compatibility)
   */
  getToken(): string | null {
    return this.getAccessToken();
  }

  /**
   * Get stored user data
   */
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Update stored user data
   */
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Also remove old token key for backward compatibility
    localStorage.removeItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService();
