import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Layout, Button, Loading } from '@/components/common';
import { productService } from '@/services';
import type { CreateProductRequest, ProductCategory } from '@/types';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CreateProductRequest>({
    name: '',
    category: 'Fish',
    price: 0,
    stock: 0,
    description: '',
    images: [],
  });

  const isEditMode = !!id;
  const productFromState = location.state?.product;

  useEffect(() => {
    if (isEditMode && productFromState) {
      setInitialValues({
        name: productFromState.name,
        category: productFromState.category,
        price: productFromState.price,
        stock: productFromState.stock,
        description: productFromState.description || '',
        images: productFromState.images || [],
      });
    }
  }, [isEditMode, productFromState]);

  const categories: ProductCategory[] = ['Fish', 'Prawn', 'Crab', 'Squid'];

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Product name must be at least 2 characters')
      .max(100, 'Product name cannot exceed 100 characters')
      .required('Product name is required'),
    category: Yup.string()
      .oneOf(categories, 'Invalid category')
      .required('Category is required'),
    price: Yup.number()
      .min(0.01, 'Price must be greater than 0')
      .required('Price is required'),
    stock: Yup.number()
      .min(0, 'Stock cannot be negative')
      .required('Stock quantity is required'),
    description: Yup.string().max(
      500,
      'Description cannot exceed 500 characters'
    ),
    images: Yup.array().of(Yup.string().url('Must be a valid URL')),
  });

  const handleSubmit = async (values: CreateProductRequest) => {
    try {
      setLoading(true);

      if (isEditMode && id) {
        await productService.updateProduct(id, values);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(values);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <button
              onClick={() => navigate('/admin/products')}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back to Products
            </button>
            <h1 className='text-3xl font-bold text-gray-900'>
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className='text-gray-600 mt-2'>
              {isEditMode
                ? 'Update product details'
                : 'Add a new fish product to your inventory'}
            </p>
          </div>

          {/* Form */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className='space-y-6'>
                  {/* Product Name */}
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Product Name *
                    </label>
                    <Field
                      type='text'
                      name='name'
                      id='name'
                      placeholder='e.g., Fresh Pomfret'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <ErrorMessage
                      name='name'
                      component='div'
                      className='mt-1 text-sm text-red-600'
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor='category'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Category *
                    </label>
                    <Field
                      as='select'
                      name='category'
                      id='category'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name='category'
                      component='div'
                      className='mt-1 text-sm text-red-600'
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label
                        htmlFor='price'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Price (₹ per kg) *
                      </label>
                      <Field
                        type='number'
                        name='price'
                        id='price'
                        min='0'
                        step='0.01'
                        placeholder='400'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <ErrorMessage
                        name='price'
                        component='div'
                        className='mt-1 text-sm text-red-600'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='stock'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Stock (kg) *
                      </label>
                      <Field
                        type='number'
                        name='stock'
                        id='stock'
                        min='0'
                        placeholder='25'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <ErrorMessage
                        name='stock'
                        component='div'
                        className='mt-1 text-sm text-red-600'
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor='description'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Description
                    </label>
                    <Field
                      as='textarea'
                      name='description'
                      id='description'
                      rows={4}
                      placeholder='Describe the product...'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    <ErrorMessage
                      name='description'
                      component='div'
                      className='mt-1 text-sm text-red-600'
                    />
                    <p className='mt-1 text-sm text-gray-500'>
                      {values.description?.length || 0}/500 characters
                    </p>
                  </div>

                  {/* Images */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Product Images (URLs)
                    </label>
                    <div className='space-y-3'>
                      {values.images?.map((image, index) => (
                        <div key={index} className='flex gap-2'>
                          <Field
                            type='url'
                            name={`images.${index}`}
                            placeholder='https://example.com/image.jpg'
                            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                          <button
                            type='button'
                            onClick={() => {
                              const newImages =
                                values.images?.filter((_, i) => i !== index) ||
                                [];
                              setFieldValue('images', newImages);
                            }}
                            className='px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700'
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type='button'
                        onClick={() => {
                          const newImages = [...(values.images || []), ''];
                          setFieldValue('images', newImages);
                        }}
                        className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                      >
                        + Add Image URL
                      </button>
                    </div>
                    <p className='mt-2 text-sm text-gray-500'>
                      Add image URLs for the product. You can add multiple
                      images.
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className='flex gap-4 pt-6 border-t'>
                    <Button
                      type='submit'
                      variant='primary'
                      size='lg'
                      loading={isSubmitting || loading}
                      fullWidth
                    >
                      {isEditMode ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={() => navigate('/admin/products')}
                      disabled={isSubmitting || loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductForm;
