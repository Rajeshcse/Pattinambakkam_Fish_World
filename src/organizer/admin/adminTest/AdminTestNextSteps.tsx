import React from 'react';
import { Card } from '@/components/common';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
}

interface AdminTestNextStepsProps {
  results: TestResult[];
}

export const AdminTestNextSteps: React.FC<AdminTestNextStepsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-md">
      <h3 className="font-bold text-blue-900 mb-2">Next Steps:</h3>
      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
        {results.some((r) => r.status === 'error' && r.test === 'Authentication') && (
          <li>You need to log in first</li>
        )}
        {results.some((r) => r.status === 'error' && r.test === 'Admin Role') && (
          <li>
            Your account needs admin role. Update in MongoDB:
            <code className="block bg-blue-100 p-2 mt-1 rounded">
              db.users.updateOne({'{email: "your@email.com"}'}, {'{ $set: { role: "admin" } }'})
            </code>
          </li>
        )}
        {results.some(
          (r) => r.status === 'error' && (r.test === 'Dashboard API' || r.test === 'Users API'),
        ) && (
          <>
            <li>Check if backend server is running on port 3001</li>
            <li>Check browser console for detailed error messages</li>
            <li>Verify CORS is enabled in backend for http://localhost:5173</li>
          </>
        )}
      </ul>
    </div>
  );
};
