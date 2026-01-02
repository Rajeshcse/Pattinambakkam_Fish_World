import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';

export const DashboardQuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/admin/users')}>
          Manage Users
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/admin/products')}
          className="bg-green-600 hover:bg-green-700"
        >
          Manage Products
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/admin/orders')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          📦 Manage Orders
        </Button>
      </div>
    </div>
  );
};
