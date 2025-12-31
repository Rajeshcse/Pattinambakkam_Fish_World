import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Formik, Form } from 'formik';
import { Layout } from '@/components/common';
import { productService } from '@/services';
import { useImageUpload } from '@/hooks/useImageUpload';
import { productValidationSchema } from '@/utils/validation';
import {
  ProductFormHeader,
  BasicInfoFields,
  PricingStockFields,
  DescriptionField,
  ImageUploadSection,
  FormActions,
} from '@/organizer/admin/productForm';
import type { CreateProductRequest } from '@/types';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
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
        stock: productFromState.stock / 4, // Convert units to kg for display
        description: productFromState.description || '',
        images: productFromState.images || [],
      });
      setImagePreviews(productFromState.images || []);
    }
  }, [isEditMode, productFromState]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    currentImages: string[],
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const newImages = await uploadImages(event.target.files, currentImages);
    setFieldValue('images', newImages);
    setImagePreviews(newImages);
    event.target.value = '';
  };

  const removeImage = (
    index: number,
    currentImages: string[],
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setFieldValue('images', newImages);
    setImagePreviews(newImages);
  };

  const handleSubmit = async (values: CreateProductRequest) => {
    try {
      setLoading(true);

      // Convert stock from kg to units (1 kg = 2 units of 500g)
      const productData = {
        ...values,
        stock: values.stock * 4,
      };

      if (isEditMode && id) {
        await productService.updateProduct(id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error saving product:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <ProductFormHeader isEditMode={isEditMode} />

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={productValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Basic Info Fields */}
                  <BasicInfoFields />

                  {/* Pricing & Stock Fields */}
                  <PricingStockFields />

                  {/* Description Field */}
                  <DescriptionField descriptionLength={values.description?.length || 0} />

                  {/* Image Upload Section */}
                  <ImageUploadSection
                    uploading={uploading}
                    imagePreviews={imagePreviews}
                    onImageUpload={(e) => handleImageUpload(e, values.images || [], setFieldValue)}
                    onRemoveImage={(index) =>
                      removeImage(index, values.images || [], setFieldValue)
                    }
                  />

                  {/* Form Actions */}
                  <FormActions
                    isEditMode={isEditMode}
                    isSubmitting={isSubmitting}
                    loading={loading}
                    uploading={uploading}
                  />
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
