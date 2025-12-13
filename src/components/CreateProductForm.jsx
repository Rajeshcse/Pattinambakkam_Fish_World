import React, { useState } from 'react';
import axios from 'axios';

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fish',
    price: '',
    stock: '',
    type: '',
    description: '',
    sku: '',
    images: [],
    wholeFishCount: '',
    cutPiecesCount: '',
    beforeCleanImage: '',
    afterCleanImage: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    'Fish',
    'Shrimp',
    'Crab',
    'Lobster',
    'Shellfish',
    'Accessories',
    'Food',
    'Other',
  ];
  const types = ['Uncleaned', 'Cleaned'];
  const typeSpecificCategories = [
    'Fish',
    'Shrimp',
    'Crab',
    'Lobster',
    'Shellfish',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.name ||
      formData.name.length < 3 ||
      formData.name.length > 100
    ) {
      newErrors.name = 'Name must be 3-100 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Stock must be a valid positive number';
    }

    if (typeSpecificCategories.includes(formData.category) && !formData.type) {
      newErrors.type = 'Type is required for this category';
    }

    if (
      formData.description &&
      (formData.description.length < 10 || formData.description.length > 1000)
    ) {
      newErrors.description = 'Description must be 10-1000 characters';
    }

    if (formData.type === 'Uncleaned' && formData.wholeFishCount < 0) {
      newErrors.wholeFishCount = 'Must be a positive number';
    }
    if (formData.type === 'Cleaned' && formData.cutPiecesCount < 0) {
      newErrors.cutPiecesCount = 'Must be a positive number';
    }

    const tagArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    if (tagArray.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageUrls = e.target.value.split(',').map((url) => url.trim());
    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseFloat(formData.stock),
        images: formData.images.filter((img) => img),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (formData.wholeFishCount) {
        submitData.wholeFishCount = parseInt(formData.wholeFishCount);
      }
      if (formData.cutPiecesCount) {
        submitData.cutPiecesCount = parseInt(formData.cutPiecesCount);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/products', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Product created successfully!');
      setFormData({
        name: '',
        category: 'Fish',
        price: '',
        stock: '',
        type: '',
        description: '',
        sku: '',
        images: [],
        wholeFishCount: '',
        cutPiecesCount: '',
        beforeCleanImage: '',
        afterCleanImage: '',
        tags: '',
      });
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create product',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create-product-form'>
      <h2>Create New Product</h2>

      {successMessage && (
        <div className='alert alert-success'>{successMessage}</div>
      )}
      {errors.submit && (
        <div className='alert alert-error'>{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className='form-group'>
          <label htmlFor='name'>
            Product Name <span className='required'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Fresh Mackerel Fish'
            maxLength='100'
          />
          {errors.name && <span className='error'>{errors.name}</span>}
        </div>

        {/* Category Field */}
        <div className='form-group'>
          <label htmlFor='category'>
            Category <span className='required'>*</span>
          </label>
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className='error'>{errors.category}</span>}
        </div>

        {/* Type Field (Conditional) */}
        {typeSpecificCategories.includes(formData.category) && (
          <div className='form-group'>
            <label htmlFor='type'>
              Type <span className='required'>*</span>
            </label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value=''>Select type</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && <span className='error'>{errors.type}</span>}
          </div>
        )}

        {/* Price Field */}
        <div className='form-group'>
          <label htmlFor='price'>
            Price (in rupees) <span className='required'>*</span>
          </label>
          <input
            type='number'
            id='price'
            name='price'
            value={formData.price}
            onChange={handleInputChange}
            placeholder='350'
            min='0'
            step='0.01'
          />
          {errors.price && <span className='error'>{errors.price}</span>}
        </div>

        {/* Stock Field */}
        <div className='form-group'>
          <label htmlFor='stock'>
            Stock Quantity <span className='required'>*</span>
          </label>
          <input
            type='number'
            id='stock'
            name='stock'
            value={formData.stock}
            onChange={handleInputChange}
            placeholder='100'
            min='0'
          />
          {errors.stock && <span className='error'>{errors.stock}</span>}
        </div>

        {/* Description Field */}
        <div className='form-group'>
          <label htmlFor='description'>
            Description (optional - auto-generated if not provided)
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Fresh fish selected daily for great taste'
            maxLength='1000'
            rows='4'
          />
          <small>{formData.description.length}/1000 characters</small>
          {errors.description && (
            <span className='error'>{errors.description}</span>
          )}
        </div>

        {/* SKU Field */}
        <div className='form-group'>
          <label htmlFor='sku'>
            SKU (optional - auto-generated if not provided)
          </label>
          <input
            type='text'
            id='sku'
            name='sku'
            value={formData.sku}
            onChange={handleInputChange}
            placeholder='FISH001'
          />
          <small>Format: CATEGORYCODE + timestamp</small>
        </div>

        {/* Images Field */}
        <div className='form-group'>
          <label htmlFor='images'>Product Images (optional)</label>
          <input
            type='text'
            id='images'
            name='images'
            value={formData.images.join(', ')}
            onChange={handleImageChange}
            placeholder='https://example.com/product.jpg, https://example.com/product2.jpg'
          />
          <small>Separate multiple URLs with commas</small>
        </div>

        {/* Type-Specific Fields */}
        {formData.type === 'Uncleaned' && (
          <div className='form-group'>
            <label htmlFor='wholeFishCount'>Number of Whole Fish</label>
            <input
              type='number'
              id='wholeFishCount'
              name='wholeFishCount'
              value={formData.wholeFishCount}
              onChange={handleInputChange}
              placeholder='5'
              min='0'
            />
            {errors.wholeFishCount && (
              <span className='error'>{errors.wholeFishCount}</span>
            )}
          </div>
        )}

        {formData.type === 'Cleaned' && (
          <>
            <div className='form-group'>
              <label htmlFor='cutPiecesCount'>Number of Cut Pieces</label>
              <input
                type='number'
                id='cutPiecesCount'
                name='cutPiecesCount'
                value={formData.cutPiecesCount}
                onChange={handleInputChange}
                placeholder='8'
                min='0'
              />
              {errors.cutPiecesCount && (
                <span className='error'>{errors.cutPiecesCount}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='beforeCleanImage'>
                Image Before Cleaning (optional)
              </label>
              <input
                type='text'
                id='beforeCleanImage'
                name='beforeCleanImage'
                value={formData.beforeCleanImage}
                onChange={handleInputChange}
                placeholder='https://example.com/before-clean.jpg'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='afterCleanImage'>
                Image After Cleaning (optional)
              </label>
              <input
                type='text'
                id='afterCleanImage'
                name='afterCleanImage'
                value={formData.afterCleanImage}
                onChange={handleInputChange}
                placeholder='https://example.com/after-clean.jpg'
              />
            </div>
          </>
        )}

        {/* Tags Field */}
        <div className='form-group'>
          <label htmlFor='tags'>Product Tags (optional)</label>
          <input
            type='text'
            id='tags'
            name='tags'
            value={formData.tags}
            onChange={handleInputChange}
            placeholder='fresh, uncleaned, local'
          />
          <small>Separate tags with commas (max 10 tags)</small>
        </div>

        {/* Submit Button */}
        <button type='submit' disabled={loading} className='btn-submit'>
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
