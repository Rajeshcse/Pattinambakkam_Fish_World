import { useState } from 'react';
import { useFormik } from 'formik';
import { useAuth } from './useAuth';
import { profileService } from '@/services';
import { profileUpdateSchema } from '@/validation/schemas';
import { User } from '@/types';

interface ProfileEditFormCallbacks {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
  onNoChanges?: () => void;
}

export const useProfileEditForm = (callbacks?: ProfileEditFormCallbacks) => {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: profileUpdateSchema,
    onSubmit: async (values) => {
      if (!user) {
        setError('User not found');
        callbacks?.onError?.('User not found');
        return;
      }

      setError('');
      setIsSubmitting(true);

      try {
        // Only send fields that were changed
        const changedValues: Partial<User> = {};
        if (values.name !== user.name) changedValues.name = values.name;
        if (values.email !== user.email) changedValues.email = values.email;
        if (values.phone !== user.phone) changedValues.phone = values.phone;
        if (values.avatar !== user.avatar) changedValues.avatar = values.avatar;

        if (Object.keys(changedValues).length === 0) {
          callbacks?.onNoChanges?.();
          return;
        }

        const updatedUser = await profileService.updateProfile(changedValues);
        updateUser(updatedUser);
        callbacks?.onSuccess?.();
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : 'Failed to update profile. Please try again.';
        setError(message);
        callbacks?.onError?.(message);
        console.error('Profile update error:', error);
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