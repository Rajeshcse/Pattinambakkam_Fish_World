import React, { useState } from 'react';
import { Layout, Button, Card } from '@/components/common';
import apiClient from '@/services/api';
import { config } from '@/config/env';
import { handleApiError } from '@/utils/errors';

export const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any) => {
    const result = {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Test</h1>
            <p className="text-gray-600">Debug API connectivity and authentication issues</p>
          </div>

          <Card className="mb-6">
            <div className="flex gap-4">
              <Button onClick={testConnection} disabled={loading} variant="primary">
                {loading ? 'Testing...' : 'Run Tests'}
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${result.success ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{result.test}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}
                    >
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

          {testResults.length === 0 && (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No test results yet. Click "Run Tests" to start debugging.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};
