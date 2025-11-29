import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Loading, Layout } from '@/components/common';
import { adminService } from '@/services';
import { DashboardStats } from '@/types';
import { toast } from 'react-toastify';
import { getErrorMessage, logError, categorizeError, ErrorCategory } from '@/utils/errors';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      
      // Check if response has the expected structure
      if (response && response.data) {
        setStats(response.data);
      } else {
        toast.error('Received invalid dashboard data');
        setStats(null);
      }
    } catch (error: unknown) {
      logError(error, 'Dashboard.fetchDashboardStats');

      const { category } = categorizeError(error);
      const errorMessage = getErrorMessage(error) || 'Failed to load dashboard';

      if (category === ErrorCategory.AUTHORIZATION) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      } else if (category === ErrorCategory.AUTHENTICATION) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
      } else if (category === ErrorCategory.NETWORK) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        toast.error(errorMessage);
      }
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <div className="text-center py-8">
                <div className="text-red-500 text-lg font-medium mb-4">
                  Error loading dashboard
                </div>
                <p className="text-gray-600 mb-4">
                  Unable to fetch dashboard data. This could be due to:
                </p>
                <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-2">
                  <li>• Backend server not running</li>
                  <li>• Network connectivity issues</li>
                  <li>• Authentication token expired</li>
                  <li>• Insufficient admin privileges</li>
                </ul>
                <div className="mt-6">
                  <Button 
                    onClick={fetchDashboardStats}
                    variant="primary"
                    className="mr-3"
                  >
                    Retry
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of your application</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Verified Users</p>
                <p className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</p>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Unverified Users</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.unverifiedUsers}</p>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Admins</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate('/admin/users?role=admin')}
              >
                View Admins
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/admin/users?isVerified=false')}
              >
                Unverified Users
              </Button>
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Users</h2>
            {stats.recentUsers.length === 0 ? (
              <Card>
                <p className="text-gray-500">No recent users</p>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isVerified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
