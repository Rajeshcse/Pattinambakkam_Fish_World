import React from 'react';
import { useCreateProductForm } from '@/hooks/useCreateProductForm';
import { FormField } from './common/FormField';
import { Button } from './common/Button';
import { ErrorAlert } from './common/ErrorAlert';
import '../styles/CreateProductForm.css';

const CATEGORIES = [
  'Fish',
  'Prawn',
  'Crab',
  'Squid',
  'Lobsters',
  'Seafood Combo',
  'Dry Fish',
];

export const CreateProductForm: React.FC = () => {
  const { formik, error, isSubmitting, successMessage, setSuccessMessage } =
    useCreateProductForm({
      onSuccess: () => {
        setTimeout(() => setSuccessMessage(''), 5000);
      },
    });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = e.target.value
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url);
    formik.setFieldValue('images', urls);
  };

  return (
    <div className='create-product-container'>
      <div className='create-product-wrapper'>
        <h1 className='create-product-title'>Create New Product</h1>
        <p className='create-product-subtitle'>
          Add a new seafood product to your catalog
        </p>

        {successMessage && (
          <div className='alert alert-success'>
            <span>{successMessage}</span>
          </div>
        )}

        {error && <ErrorAlert message={error} />}

        <form onSubmit={formik.handleSubmit} className='product-form'>
          {/* Product Name */}
          <FormField
            name='name'
            type='text'
            label='Product Name'
            placeholder='e.g., Fresh Mackerel Fish'
            required
            formik={formik}
            maxLength={100}
          />

          {/* Category */}
          <div className='form-group'>
            <label htmlFor='category' className='form-label'>
              Category <span className='required-indicator'>*</span>
            </label>
            <select
              id='category'
              name='category'
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select ${
                formik.touched.category && formik.errors.category ? 'error' : ''
              }`}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <span className='error-text'>{formik.errors.category}</span>
            )}
          </div>

          {/* Price */}
          <FormField
            name='price'
            type='number'
            label='Price (in rupees)'
            placeholder='e.g., 350'
            required
            formik={formik}
          />

          {/* Stock */}
          <FormField
            name='stock'
            type='number'
            label='Stock Quantity'
            placeholder='e.g., 100'
            required
            formik={formik}
          />

          {/* Description */}
          <div className='form-group'>
            <label htmlFor='description' className='form-label'>
              Description <span className='optional-text'>(Optional)</span>
            </label>
            <textarea
              id='description'
              name='description'
              value={formik.values.description || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='Provide details about your product (min 10 characters)'
              maxLength={1000}
              rows={4}
              className={`form-textarea ${
                formik.touched.description && formik.errors.description
                  ? 'error'
                  : ''
              }`}
            />
            <div className='char-count'>
              {(formik.values.description || '').length}/1000 characters
            </div>
            {formik.touched.description && formik.errors.description && (
              <span className='error-text'>{formik.errors.description}</span>
            )}
          </div>

          {/* Product Images */}
          <div className='form-group'>
            <label htmlFor='images' className='form-label'>
              Product Images <span className='optional-text'>(Optional)</span>
            </label>
            <input
              type='text'
              id='images'
              name='images'
              value={(formik.values.images || []).join(', ')}
              onChange={handleImageUrlChange}
              onBlur={formik.handleBlur}
              placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
              className={`form-input ${
                formik.touched.images && formik.errors.images ? 'error' : ''
              }`}
            />
            <span className='help-text'>
              Separate multiple image URLs with commas
            </span>
            {formik.touched.images && formik.errors.images && (
              <span className='error-text'>{formik.errors.images}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className='form-actions'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='btn-primary'
            >
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
