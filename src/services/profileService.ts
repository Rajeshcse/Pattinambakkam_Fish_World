import apiClient from './api';
import { User, ProfileSuccessResponse, ProfileUpdateRequest, ProfileUpdateResponse } from '@/types';

class ProfileService {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ProfileSuccessResponse>('/api/auth/profile');
    return response.data.user;
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await apiClient.put<ProfileUpdateResponse>('/api/auth/profile', data);
    return response.data.user;
  }
}

export default new ProfileService();
