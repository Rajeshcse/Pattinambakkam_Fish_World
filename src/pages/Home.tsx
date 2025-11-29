import React from 'react';
import { Card, Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="mb-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Welcome to Pattinambakkam_Fish_World</p>
            <h1 className="text-3xl font-bold text-gray-900">Simple Auth Boilerplate</h1>
            <p className="text-gray-600">
              Use the navigation to access login or registration screens when needed.
            </p>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Auth Status</p>
            <p className="text-lg font-semibold text-gray-900">
              {isAuthenticated ? 'Authenticated' : 'Guest'}
            </p>
          </div>
          {user && (
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>
          )}
          {!isAuthenticated && (
            <p className="text-sm text-gray-500">
              Sign up or log in from the main navigation to view your profile and dashboard.
            </p>
          )}
        </Card>
      </div>
    </Layout>
  );
};
