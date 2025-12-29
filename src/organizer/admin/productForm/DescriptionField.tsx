import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface DescriptionFieldProps {
  descriptionLength: number;
}

/**
 * DescriptionField Component
 *
 * Product description textarea with character counter
 */
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ descriptionLength }) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
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
      <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
      <p className="mt-1 text-sm text-gray-500">{descriptionLength}/500 characters</p>
    </div>
  );
};
