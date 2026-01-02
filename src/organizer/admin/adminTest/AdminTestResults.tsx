import React from 'react';
import { Card } from '@/components/common';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

interface AdminTestResultsProps {
  results: TestResult[];
}

export const AdminTestResults: React.FC<AdminTestResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Test Results</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-md border-l-4 ${
              result.status === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  result.status === 'success'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {result.status.toUpperCase()}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{result.test}</h3>
                <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      Show details
                    </summary>
                    <div className="bg-gray-100 p-2 rounded-md mt-2 overflow-x-auto">
                      <pre className="text-xs">{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
