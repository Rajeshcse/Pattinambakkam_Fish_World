import React, { useState } from 'react';
import { Layout } from '@/components/common';
import apiClient from '@/services/api';
import { config } from '@/config/env';
import { handleApiError } from '@/utils/errors';
import { ApiTestHeader, ApiTestActions, ApiTestResults } from '@/organizer/admin/apiTest';

interface TestResult {
  test: string;
  success: boolean;
  data: any;
  timestamp: string;
}

export const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any) => {
    const result: TestResult = {
      test,
      success,
      data,
      timestamp: new Date().toISOString(),
    };
    setTestResults((prev) => [result, ...prev]);
  };

  const testConnection = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/health`);
      if (response.ok) {
        const data = await response.json();
        addResult('Backend Health Check', true, data);
      } else {
        addResult('Backend Health Check', false, `HTTP ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult('Backend Health Check', false, `Connection failed: ${errorMessage}`);
    }

    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    addResult('Auth Token Check', !!token, {
      hasToken: !!token,
      user: user ? JSON.parse(user) : null,
      tokenLength: token?.length,
    });

    if (token) {
      try {
        const response = await apiClient.get('/api/admin/dashboard');
        addResult('Dashboard API Call', true, response.data);
      } catch (error: unknown) {
        const appError = handleApiError(error);
        addResult('Dashboard API Call', false, {
          message: appError.message,
          statusCode: appError.statusCode,
          code: appError.code,
          details: appError.details,
        });
      }
    }

    addResult('Environment Check', true, {
      apiBaseUrl: config.apiBaseUrl,
      isDev: config.isDev,
      isProd: config.isProd,
      currentOrigin: window.location.origin,
    });

    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ApiTestHeader />

          {/* Test Actions */}
          <ApiTestActions
            loading={loading}
            onRunTests={testConnection}
            onClearResults={clearResults}
          />

          {/* Test Results */}
          <ApiTestResults results={testResults} />
        </div>
      </div>
    </Layout>
  );
};
