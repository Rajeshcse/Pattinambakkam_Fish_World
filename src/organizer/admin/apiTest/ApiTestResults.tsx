import React from 'react';
import { Card } from '@/components/common';

interface ApiTestResult {
  test: string;
  success: boolean;
  data: any;
  timestamp: string;
}

interface ApiTestResultsProps {
  results: ApiTestResult[];
}

export const ApiTestResults: React.FC<ApiTestResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">
            No test results yet. Click "Run Tests" to start debugging.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={index}>
          <div className="flex items-start gap-4">
            <div
              className={`w-3 h-3 rounded-full mt-1 ${
                result.success ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{result.test}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                Status: {result.success ? 'SUCCESS' : 'FAILED'}
              </div>
              <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
