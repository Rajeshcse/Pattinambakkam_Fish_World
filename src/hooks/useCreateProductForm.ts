import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateProductRequest, ProductCategory } from '@/types';
import { createProduct } from '@/services/productService';

interface CreateProductFormCallbacks {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

// Validation schema for product creation
const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .required('Product name is required'),

  category: Yup.string()
    .oneOf(
      [
        'Fish',
        'Prawn',
        'Crab',
        'Squid',
        'Lobsters',
        'Seafood Combo',
        'Dry Fish',
      ],
      'Please select a valid category'
    )
    .required('Category is required'),

  price: Yup.number()
    .positive('Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a valid number'),

  stock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .required('Stock quantity is required')
    .typeError('Stock must be a valid number'),

  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),

  images: Yup.array().of(Yup.string().url('Each image must be a valid URL')),
});

// Initial form values
const productInitialValues: CreateProductRequest = {
  name: '',
  category: 'Fish' as ProductCategory,
  price: 0,
  stock: 0,
  description: '',
  images: [],
};

export const useCreateProductForm = (
  callbacks?: CreateProductFormCallbacks
) => {
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const formik = useFormik({
    initialValues: productInitialValues,
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccessMessage('');
      setIsSubmitting(true);

      try {
        await createProduct(values);
        setSuccessMessage('Product created successfully!');
        formik.resetForm();
        callbacks?.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create product. Please try again.';
        setError(message);
        callbacks?.onError?.(message);
        console.error('Product creation error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return {
    formik,
    error,
    isSubmitting,
    successMessage,
    setError,
    setSuccessMessage,
  };
};
