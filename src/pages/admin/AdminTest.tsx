import React, { useState } from 'react';
import { Layout, Card, Button } from '@/components/common';
import { adminService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage, handleApiError } from '@/utils/errors';

/**
 * Admin Test Component
 * Use this to diagnose admin API connection issues
 * Access at: /admin/test
 */
export const AdminTest: React.FC = () => {
  const { user, token } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
    setResults((prev) => [
      ...prev,
      { test, status, message, data, timestamp: new Date().toISOString() },
    ]);
  };

  const runTests = async () => {
    setResults([]);
    setTesting(true);

    // Test 1: Check user authentication
    addResult(
      'Authentication',
      user ? 'success' : 'error',
      user ? 'User is logged in' : 'User is not logged in',
      { user, token },
    );

    // Test 2: Check admin role
    if (user) {
      addResult(
        'Admin Role',
        user.role === 'admin' ? 'success' : 'error',
        user.role === 'admin' ? 'User has admin role' : `User role is '${user.role}', not 'admin'`,
        { role: user.role },
      );
    }

    // Test 3: Check localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    addResult(
      'LocalStorage',
      storedUser && storedToken ? 'success' : 'error',
      storedUser && storedToken ? 'Auth data in localStorage' : 'Missing auth data in localStorage',
      {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
      },
    );

    // Test 4: Test dashboard API
    try {
      const response = await adminService.getDashboardStats();
      addResult('Dashboard API', 'success', 'Dashboard endpoint responded', response);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || 'API call failed';
      const appError = handleApiError(error);
      addResult('Dashboard API', 'error', errorMessage, {
        statusCode: appError.statusCode,
        details: appError.details,
      });
    }

    // Test 5: Test users API
    try {
      const response = await adminService.getAllUsers({ page: 1, limit: 1 });
      addResult('Users API', 'success', 'Users endpoint responded', response);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || 'API call failed';
      const appError = handleApiError(error);
      addResult('Users API', 'error', errorMessage, {
        statusCode: appError.statusCode,
        details: appError.details,
      });
    }

    setTesting(false);
  };

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Admin API Test</h1>
            <p className="text-gray-600">Diagnose admin API connection issues</p>
          </div>

          <Card className="mb-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Current User Info</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify({ user, hasToken: !!token }, null, 2)}
                  </pre>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={runTests}
                loading={testing}
                disabled={testing}
              >
                {testing ? 'Running Tests...' : 'Run Diagnostic Tests'}
              </Button>
            </div>
          </Card>

          {results.length > 0 && (
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
                        db.users.updateOne({'{email: "your@email.com"}'},{' '}
                        {'{ $set: { role: "admin" } }'})
                      </code>
                    </li>
                  )}
                  {results.some(
                    (r) =>
                      r.status === 'error' &&
                      (r.test === 'Dashboard API' || r.test === 'Users API'),
                  ) && (
                    <>
                      <li>Check if backend server is running on port 3001</li>
                      <li>Check browser console for detailed error messages</li>
                      <li>Verify CORS is enabled in backend for http://localhost:5173</li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};
