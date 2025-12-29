import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { productCategories } from '@/utils/validation';

/**
 * BasicInfoFields Component
 *
 * Product name and category form fields
 */
export const BasicInfoFields: React.FC = () => {
  return (
    <>
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Product Name *
        </label>
        <Field
          type="text"
          name="name"
          id="name"
          placeholder="e.g., Fresh Pomfret"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
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
        <ErrorMessage name="category" component="div" className="mt-1 text-sm text-red-600" />
      </div>
    </>
  );
};
