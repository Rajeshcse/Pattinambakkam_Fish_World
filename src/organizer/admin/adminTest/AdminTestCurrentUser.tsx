import React from 'react';
import { Card, Button } from '@/components/common';

interface AdminTestCurrentUserProps {
  user: any;
  hasToken: boolean;
  loading: boolean;
  onRunTests: () => void;
}

export const AdminTestCurrentUser: React.FC<AdminTestCurrentUserProps> = ({
  user,
  hasToken,
  loading,
  onRunTests,
}) => {
  return (
    <Card className="mb-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Current User Info</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify({ user, hasToken }, null, 2)}
            </pre>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onRunTests}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </Button>
      </div>
    </Card>
  );
};
