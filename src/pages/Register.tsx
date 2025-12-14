import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import { FormField } from '@/components/common/FormField';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export const Register: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formik, isSubmitting, error, dismissError } = useRegisterForm({
    onSuccess: () => {
      // Redirect to email verification instead of home
      navigate('/verify-email');
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  // Redirect if already logged in and verified
  if (user && user.isVerified) {
    return <Navigate to="/profile" replace />;
  }

  // Redirect to verify email if logged in but not verified
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return (
    <AuthLayout
      title="Pattinambakkam_Fish_World"
      subtitle="Create your account to start your creative journey"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={dismissError} />}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormField
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            formik={formik}
            required
          />

          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            formik={formik}
            required
          />

          <FormField
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            formik={formik}
            required
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            formik={formik}
            required
          />

          <FormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            formik={formik}
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
