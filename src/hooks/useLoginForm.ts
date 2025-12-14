import { useState } from 'react';
import { useFormik } from 'formik';
import { useAuth } from './useAuth';
import { LoginRequest } from '@/types';
import { loginSchema, loginInitialValues } from '@/validation/schemas';

interface LoginFormCallbacks {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

export const useLoginForm = (callbacks?: LoginFormCallbacks) => {
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError('');
      setIsSubmitting(true);

      try {
        // Determine if identifier is email or phone
        const isEmail = values.identifier.includes('@');
        const credentials: LoginRequest = {
          password: values.password,
          ...(isEmail ? { email: values.identifier } : { phone: values.identifier }),
        };

        await login(credentials);
        callbacks?.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
        setError(message);
        callbacks?.onError?.(message);
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const dismissError = () => setError('');

  return {
    formik,
    error,
    isSubmitting,
    dismissError,
  };
};
