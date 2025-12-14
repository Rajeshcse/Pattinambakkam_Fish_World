import apiClient from './api';
import { User, ProfileSuccessResponse, ProfileUpdateRequest, ProfileUpdateResponse } from '@/types';

/**
 * Profile Service
 * Handles user profile operations
 */
class ProfileService {
  /**
   * Get authenticated user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ProfileSuccessResponse>('/api/auth/profile');
    return response.data.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await apiClient.put<ProfileUpdateResponse>('/api/auth/profile', data);
    return response.data.user;
  }
}

export default new ProfileService();
