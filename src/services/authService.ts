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

class AuthService {
  async testConnection(): Promise<boolean> {
    try {
      await apiClient.get('/api/auth/test', { timeout: 5000 });
      return true;
    } catch (error: unknown) {
      logError(error, 'AuthService.testConnection');
      return false;
    }
  }

  async register(data: RegisterRequest): Promise<AuthSuccessResponse> {
    const { name, email, phone, password } = data;

    if (!name || !email || !phone || !password) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!phone) missingFields.push('phone');
      if (!password) missingFields.push('password');
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const response = await apiClient.post<AuthSuccessResponse>('/api/auth/register', data);

      return response.data;
    } catch (error: unknown) {
      logError(error, 'AuthService.register');

      const appError = handleApiError(error);

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

  async login(credentials: LoginRequest): Promise<AuthSuccessResponse> {
    const response = await apiClient.post<AuthSuccessResponse>('/api/auth/login', credentials);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  }

  async logout(refreshToken: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/logout', { refreshToken });
    return response.data;
  }

  async logoutAll(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/logout-all');
    return response.data;
  }

  async sendVerificationEmail(): Promise<MessageResponse> {
    console.log('📧 Sending verification email...');
    const response = await apiClient.post<MessageResponse>('/api/auth/send-verification-email');
    console.log('📧 OTP Response:', response.data);
    return response.data;
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/verify-email', data);
    return response.data;
  }

  async resendVerificationEmail(): Promise<MessageResponse> {
    console.log('🔄 Resending verification email...');
    const response = await apiClient.post<MessageResponse>('/api/auth/resend-verification-email');
    console.log('🔄 Resend OTP Response:', response.data);
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/reset-password', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/auth/change-password', data);
    return response.data;
  }

  setAuthData(accessToken: string, refreshToken: string, user: any): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService();
