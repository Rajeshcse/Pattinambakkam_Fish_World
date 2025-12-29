import React from 'react';
import { FormField } from '@/components/common/FormField';
import type { FormikProps } from 'formik';

interface AddressFormProps {
  formik: FormikProps<any>;
}

/**
 * AddressForm Component
 *
 * Delivery address fields: street, city, state, pincode, landmark
 * City and State are read-only (Chennai, Tamil Nadu)
 */
export const AddressForm: React.FC<AddressFormProps> = ({ formik }) => {
  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>

      {/* Street Address */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
        <textarea
          name="street"
          value={formik.values.street || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your complete street address"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
        />
        {formik.errors.street && formik.touched.street && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.street as string}</p>
        )}
      </div>

      {/* City and State (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
          <input
            type="text"
            value="Chennai"
            readOnly
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Service area: Chennai only</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
          <input
            type="text"
            value="Tamil Nadu"
            readOnly
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">We deliver in Tamil Nadu</p>
        </div>
      </div>

      {/* Pincode and Landmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          name="pincode"
          label="Pincode"
          placeholder="6-digit pincode"
          formik={formik}
        />

        <FormField
          name="landmark"
          label="Landmark (Optional)"
          placeholder="Nearby landmark"
          formik={formik}
        />
      </div>
    </div>
  );
};
