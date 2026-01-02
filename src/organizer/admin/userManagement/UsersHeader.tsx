import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';

export const UsersHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">Manage all users in your system</p>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate('/admin/dashboard')}
        className="w-full sm:w-auto"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};
