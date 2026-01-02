import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';

export const UserDetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-primary-600 mb-2">User Details</h1>
        <p className="text-gray-600">View and manage user information</p>
      </div>
      <Button variant="outline" onClick={() => navigate('/admin/users')}>
        Back to Users
      </Button>
    </div>
  );
};
