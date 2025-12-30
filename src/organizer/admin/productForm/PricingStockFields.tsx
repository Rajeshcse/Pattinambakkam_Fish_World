import React from 'react';
import { Field, ErrorMessage } from 'formik';

/**
 * PricingStockFields Component
 *
 * Price and stock input fields in a grid layout
 */
export const PricingStockFields: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Price Field */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
          Price (₹ per 500g) *
        </label>
        <Field
          type="number"
          name="price"
          id="price"
          min="0"
          step="0.01"
          placeholder="100"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter price for 500 grams (e.g., ₹100 for 500g = ₹200 per kg)
        </p>
        <ErrorMessage name="price" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      {/* Stock Field */}
      <div>
        <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
          Stock (kg) *
        </label>
        <Field
          type="number"
          name="stock"
          id="stock"
          min="0"
          step="0.25"
          placeholder="25"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter stock in kilograms (e.g., 25 kg available)
        </p>
        <ErrorMessage name="stock" component="div" className="mt-1 text-sm text-red-600" />
      </div>
    </div>
  );
};
