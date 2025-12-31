import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { DashboardStats } from '@/types';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { getErrorMessage, logError, categorizeError, ErrorCategory } from '@/utils/errors';
import {
  DashboardHeader,
  DashboardStatsCards,
  DashboardQuickActions,
  DashboardRecentUsers,
  DashboardErrorState,
} from '@/organizer/admin/dashboard';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();

      if (response && response.data) {
        setStats(response.data);
      } else {
        toast.error('Received invalid dashboard data');
        setStats(null);
      }
    } catch (error: unknown) {
      logError(error, 'Dashboard.fetchDashboardStats');

      const { category } = categorizeError(error);
      const errorMessage = getErrorMessage(error) || 'Failed to load dashboard';

      if (category === ErrorCategory.AUTHORIZATION) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      } else if (category === ErrorCategory.AUTHENTICATION) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
      } else if (category === ErrorCategory.NETWORK) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        toast.error(errorMessage);
      }
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <Layout>
        <DashboardErrorState onRetry={fetchDashboardStats} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <DashboardHeader />

          {/* Stats Cards */}
          <DashboardStatsCards stats={stats} />

          {/* Quick Actions */}
          <DashboardQuickActions />

          {/* Recent Users */}
          <DashboardRecentUsers recentUsers={stats.recentUsers} />
        </div>
      </div>
    </Layout>
  );
};
