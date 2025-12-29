import React from 'react';
import { FormField } from '@/components/common/FormField';
import type { FormikProps } from 'formik';

interface PersonalInfoFormProps {
  formik: FormikProps<any>;
}

/**
 * PersonalInfoForm Component
 *
 * Personal information fields: name, email, phone, avatar
 */
export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formik }) => {
  return (
    <>
      <FormField
        name="name"
        label="Full Name"
        placeholder="Enter your full name"
        formik={formik}
      />

      <FormField
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        formik={formik}
      />

      <FormField
        name="phone"
        label="Phone Number"
        type="tel"
        placeholder="Enter 10-digit mobile number"
        formik={formik}
      />

      <FormField
        name="avatar"
        label="Profile Picture URL"
        type="url"
        placeholder="Enter image URL (optional)"
        formik={formik}
      />
    </>
  );
};
