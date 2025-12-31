import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/common';

interface DashboardErrorStateProps {
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg font-medium mb-4">Error loading dashboard</div>
            <p className="text-gray-600 mb-4">
              Unable to fetch dashboard data. This could be due to:
            </p>
            <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-2">
              <li>• Backend server not running</li>
              <li>• Network connectivity issues</li>
              <li>• Authentication token expired</li>
              <li>• Insufficient admin privileges</li>
            </ul>
            <div className="mt-6">
              <Button onClick={onRetry} variant="primary" className="mr-3">
                Retry
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Go Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
