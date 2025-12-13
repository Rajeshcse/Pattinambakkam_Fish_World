import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button } from '@/components/common';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { authService } from '@/services';

const forgotPasswordSchema = Yup.object().shape({
  identifier: Yup.string()
    .required('Email or phone number is required')
    .test(
      'email-or-phone',
      'Enter valid email or 10-digit phone number',
      function (value) {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
});

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: { identifier: string },
    { setSubmitting }: any
  ) => {
    setError(null);

    try {
      // Determine if it's email or phone
      const isPhone = /^[6-9]\d{9}$/.test(values.identifier);
      const payload = isPhone
        ? { phone: values.identifier }
        : { email: values.identifier };

      console.log('Sending payload:', payload);

      const response = await authService.forgotPassword(payload as any);

      console.log('Response:', response);
      console.log('Response.success:', response.success);
      console.log('Response.message:', response.message);

      if (response.success || response.message) {
        console.log('Response is successful, navigating...');

        const stateData = {
          identifier: values.identifier,
          identifierType: isPhone ? 'phone' : 'email',
        };

        console.log('State data to pass:', stateData);

        toast.success(
          response.message || 'Reset code sent to your phone number'
        );

        // Navigate immediately without setTimeout
        navigate('/reset-password', {
          state: stateData,
        });
      } else {
        console.log('Response is not successful');
        setError('Failed to send reset code');
        toast.error('Failed to send reset code');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to send reset code';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title='Pattinambakkam Fish World'
      subtitle='Reset your password'
    >
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Forgot Password?</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter your email or phone number and we'll send you a reset code
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <Formik
          initialValues={{ identifier: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {(formik) => (
            <Form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email or Phone Number
                </label>
                <input
                  type='text'
                  name='identifier'
                  placeholder='Enter your email or 10-digit phone number'
                  value={formik.values.identifier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition ${
                    formik.touched.identifier && formik.errors.identifier
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.identifier && formik.errors.identifier && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formik.errors.identifier}
                  </p>
                )}
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-xs text-blue-700'>
                  💡 We'll send a 6-digit reset code to your registered phone
                  number
                </p>
              </div>

              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={formik.isSubmitting}
              >
                Send Reset Code
              </Button>

              <div className='text-center'>
                <Link
                  to='/login'
                  className='text-sm font-medium text-gray-600 hover:text-gray-500'
                >
                  Back to Sign In
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};
