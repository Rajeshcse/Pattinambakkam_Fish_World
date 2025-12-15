import apiClient from './api';
import {
  DashboardResponse,
  UserListResponse,
  UserListQueryParams,
  UserResponse,
  MessageResponse,
  ChangeUserRoleRequest,
  ToggleVerificationRequest,
  BulkActionRequest,
  ProfileUpdateRequest,
} from '@/types';

class AdminService {
  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await apiClient.get('/api/admin/dashboard');

    const data = response.data;

    if (data.dashboard && data.dashboard.overview) {
      const overview = data.dashboard.overview;

      const transformedRecentUsers = (data.dashboard.recentUsers || []).map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      const transformedStats = {
        totalUsers: overview.totalUsers || 0,
        verifiedUsers: overview.verifiedUsers || 0,
        unverifiedUsers: (overview.totalUsers || 0) - (overview.verifiedUsers || 0),
        totalAdmins: overview.adminUsers || 0,
        recentUsers: transformedRecentUsers,
      };

      return {
        success: data.success || true,
        data: transformedStats,
      };
    } else if (data.dashboard) {
      return {
        success: data.success || true,
        data: data.dashboard,
      };
    } else if (data.data) {
      return {
        success: data.success || true,
        data: data.data,
      };
    } else if (data.totalUsers !== undefined) {
      return {
        success: true,
        data: data,
      };
    } else {
      return data;
    }
  }

  async getAllUsers(params?: UserListQueryParams): Promise<UserListResponse> {
    const response = await apiClient.get('/api/admin/users', { params });

    const data = response.data;

    if (Array.isArray(data.data) && data.pagination) {
      const transformedUsers = data.data.map((user: any) => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: data.success || true,
        data: {
          users: transformedUsers,
          pagination: data.pagination,
        },
      };
    }
    else if (data.users && data.pagination) {
      const transformedUsers = data.users.map((user: any) => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: true,
        data: {
          users: transformedUsers,
          pagination: data.pagination,
        },
      };
    }
    else if (data.data && data.data.users) {
      const transformedUsers = data.data.users.map((user: any) => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: data.success || true,
        data: {
          users: transformedUsers,
          pagination: data.data.pagination,
        },
      };
    } else {
      return data;
    }
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const response = await apiClient.get(`/api/admin/users/${userId}`);

    const data = response.data;

    if (data.user) {
      return {
        success: data.success || true,
        data: data.user,
      };
    } else if (data.data) {
      return {
        success: data.success || true,
        data: data.data,
      };
    } else {
      return data;
    }
  }

  async updateUser(userId: string, data: ProfileUpdateRequest): Promise<UserResponse> {
    const response = await apiClient.put(`/api/admin/users/${userId}`, data);

    const responseData = response.data;

    if (responseData.user) {
      return {
        success: responseData.success || true,
        data: responseData.user,
      };
    } else if (responseData.data) {
      return {
        success: responseData.success || true,
        data: responseData.data,
      };
    } else {
      return responseData;
    }
  }

  async deleteUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>(`/api/admin/users/${userId}`);
    return response.data;
  }

  async changeUserRole(userId: string, role: 'user' | 'admin'): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>(`/api/admin/users/${userId}/role`, {
      role,
    } as ChangeUserRoleRequest);
    return response.data;
  }

  async toggleUserVerification(userId: string, isVerified: boolean): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>(
      `/api/admin/users/${userId}/verification`,
      { isVerified } as ToggleVerificationRequest,
    );
    return response.data;
  }

  async bulkUserAction(
    action: 'delete' | 'verify' | 'unverify',
    userIds: string[],
  ): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/api/admin/users/bulk-action', {
      action,
      userIds,
    } as BulkActionRequest);
    return response.data;
  }
}

export default new AdminService();
