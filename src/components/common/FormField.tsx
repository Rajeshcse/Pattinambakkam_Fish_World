import React from 'react';
import { FormikProps } from 'formik';
import { Input } from './Input';

interface FormFieldProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  formik: FormikProps<any>;
  maxLength?: number;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  formik,
  maxLength,
  disabled,
}) => {
  return (
    <Input
      name={name}
      value={formik.values[name] || ''}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      type={type}
      label={label}
      placeholder={placeholder}
      required={required}
      error={formik.errors[name] as string}
      touched={formik.touched[name] as boolean}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
};