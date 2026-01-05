import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useLoginForm } from '@/hooks/useLoginForm';

export const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Redirect will be handled by PublicRoute after login
  useEffect(() => {
    if (!loginSuccess) return;
    if (!user) return;

    setLoginSuccess(false);
  }, [loginSuccess, user]);

  const { formik, isSubmitting, error, dismissError } = useLoginForm({
    onSuccess: () => {
      setLoginSuccess(true);
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  return (
    <AuthLayout title="Pattinambakkam_Fish_World" subtitle="Welcome back to your creative journey">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={dismissError} />}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormField
            name="identifier"
            label="Email or Phone Number"
            placeholder="Enter your email or phone number"
            formik={formik}
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            formik={formik}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
            Sign In
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
