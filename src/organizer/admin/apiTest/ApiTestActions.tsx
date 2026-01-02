import React from 'react';
import { Button, Card } from '@/components/common';

interface ApiTestActionsProps {
  loading: boolean;
  onRunTests: () => void;
  onClearResults: () => void;
}

export const ApiTestActions: React.FC<ApiTestActionsProps> = ({
  loading,
  onRunTests,
  onClearResults,
}) => {
  return (
    <Card className="mb-6">
      <div className="flex gap-4">
        <Button onClick={onRunTests} disabled={loading} variant="primary">
          {loading ? 'Testing...' : 'Run Tests'}
        </Button>
        <Button onClick={onClearResults} variant="outline">
          Clear Results
        </Button>
      </div>
    </Card>
  );
};
