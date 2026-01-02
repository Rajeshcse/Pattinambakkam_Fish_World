import React, { useState } from 'react';
import { Layout } from '@/components/common';
import { adminService, storageService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage, handleApiError } from '@/utils/errors';
import { StorageKey } from '@/services/storageService';
import {
  AdminTestHeader,
  AdminTestCurrentUser,
  AdminTestResults,
  AdminTestNextSteps,
} from '@/organizer/admin/adminTest';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

export const AdminTest: React.FC = () => {
  const { user, token } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
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

    addResult(
      'Authentication',
      user ? 'success' : 'error',
      user ? 'User is logged in' : 'User is not logged in',
      { user, token },
    );

    if (user) {
      addResult(
        'Admin Role',
        user.role === 'admin' ? 'success' : 'error',
        user.role === 'admin' ? 'User has admin role' : `User role is '${user.role}', not 'admin'`,
        { role: user.role },
      );
    }

    const storedUser = storageService.get(StorageKey.USER);
    const storedToken = storageService.get(StorageKey.ACCESS_TOKEN);
    addResult(
      'Storage Service',
      storedUser && storedToken ? 'success' : 'error',
      storedUser && storedToken
        ? 'Auth data in storage service'
        : 'Missing auth data in storage service',
      {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
      },
    );

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
          {/* Header */}
          <AdminTestHeader />

          {/* Current User Info */}
          <AdminTestCurrentUser
            user={user}
            hasToken={!!token}
            loading={testing}
            onRunTests={runTests}
          />

          {/* Test Results */}
          <AdminTestResults results={results} />

          {/* Next Steps */}
          {results.length > 0 && <AdminTestNextSteps results={results} />}
        </div>
      </div>
    </Layout>
  );
};
