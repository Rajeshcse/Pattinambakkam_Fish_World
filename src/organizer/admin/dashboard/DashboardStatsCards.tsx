import React from 'react';
import { Card } from '@/components/common';
import { DashboardStats } from '@/types';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Verified Users</p>
          <p className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Unverified Users</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.unverifiedUsers}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Total Admins</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</p>
        </div>
      </Card>
    </div>
  );
};
