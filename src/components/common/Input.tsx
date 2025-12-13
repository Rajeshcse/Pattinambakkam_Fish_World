import React, { InputHTMLAttributes } from 'react';
import { FieldInputProps } from 'formik';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  field?: FieldInputProps<any>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  touched,
  field,
  className = '',
  ...props
}) => {
  const hasError = touched && error;

  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
          {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <input
        {...field}
        {...props}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
          ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'
          }
          ${className}
        `}
      />
      {hasError && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
};
