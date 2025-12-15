import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Layout, Button } from '@/components/common';
import { productService } from '@/services';
import { useImageUpload } from '@/hooks/useImageUpload';
import { productValidationSchema, productCategories } from '@/utils/validation';
import type { CreateProductRequest } from '@/types';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { uploading, uploadImages } = useImageUpload();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      setImagePreviews(productFromState.images || []);
    }
  }, [isEditMode, productFromState]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    currentImages: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    const newImages = await uploadImages(event.target.files, currentImages);
    setFieldValue('images', newImages);
    setImagePreviews(newImages);
    event.target.value = '';
  };

  const removeImage = (index: number, currentImages: string[], setFieldValue: (field: string, value: any) => void) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setFieldValue('images', newImages);
    setImagePreviews(newImages);
  };

  const handleSubmit = async (values: CreateProductRequest) => {
    try {
      setLoading(true);
      console.log('Submitting product with values:', values);

      if (isEditMode && id) {
        const response = await productService.updateProduct(id, values);
        console.log('Update response:', response);
        toast.success('Product updated successfully!');
      } else {
        const response = await productService.createProduct(values);
        console.log('Create response:', response);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditMode ? 'Update product details' : 'Add a new fish product to your inventory'}
            </p>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={productValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Product Name *
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="e.g., Fresh Pomfret"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <Field
                      as="select"
                      name="category"
                      id="category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Price (₹ per kg) *
                      </label>
                      <Field
                        type="number"
                        name="price"
                        id="price"
                        min="0"
                        step="0.01"
                        placeholder="400"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Stock (kg) *
                      </label>
                      <Field
                        type="number"
                        name="stock"
                        id="stock"
                        min="0"
                        placeholder="25"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="stock"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  {}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      placeholder="Describe the product..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {values.description?.length || 0}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Images
                    </label>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, values.images || [], setFieldValue)}
                            disabled={uploading}
                            className="hidden"
                          />
                          <div className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                            {uploading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                <span>Upload Images</span>
                              </>
                            )}
                          </div>
                        </label>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, GIF or WEBP (Max 5MB each)
                        </p>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviews.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Product ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, values.images || [], setFieldValue)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {imagePreviews.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">No images uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isSubmitting || loading || uploading}
                      disabled={uploading}
                      fullWidth
                    >
                      {uploading
                        ? 'Uploading images...'
                        : isEditMode
                        ? 'Update Product'
                        : 'Create Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/admin/products')}
                      disabled={isSubmitting || loading || uploading}
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
