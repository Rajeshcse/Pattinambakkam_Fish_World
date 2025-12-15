import * as Yup from 'yup';
import type { ProductCategory } from '@/types';

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  INDIAN_PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  NAME: /^[a-zA-Z\s]+$/,
  OTP: /^\d{6}$/,
  URL: /^https?:\/\/.+/,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: {
    name: 'Name is required',
    email: 'Email is required',
    phone: 'Phone number is required',
    password: 'Password is required',
    confirmPassword: 'Please confirm your password',
    currentPassword: 'Current password is required',
    newPassword: 'New password is required',
    otp: 'OTP is required',
    category: 'Category is required',
    price: 'Price is required',
    stock: 'Stock quantity is required',
  },
  INVALID: {
    email: 'Please provide a valid email',
    phone: 'Phone must be a 10-digit Indian mobile number starting with 6-9',
    name: 'Name can only contain letters and spaces',
    url: 'Please provide a valid URL',
    otp: 'OTP must be exactly 6 digits',
    category: 'Invalid category',
  },
  LENGTH: {
    nameMin: 'Name must be at least 2 characters',
    nameMax: 'Name must not exceed 50 characters',
    passwordMin: 'Password must be at least 6 characters',
    productNameMax: 'Product name cannot exceed 100 characters',
    descriptionMax: 'Description cannot exceed 500 characters',
  },
  PASSWORD: {
    requirements:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    mustMatch: 'Passwords must match',
    mustDiffer: 'New password must be different from current password',
  },
  PRICE: {
    min: 'Price must be greater than 0',
  },
  STOCK: {
    min: 'Stock cannot be negative',
  },
} as const;

export const validationFields = {
  name: () =>
    Yup.string()
      .min(2, VALIDATION_MESSAGES.LENGTH.nameMin)
      .max(50, VALIDATION_MESSAGES.LENGTH.nameMax)
      .matches(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.INVALID.name)
      .required(VALIDATION_MESSAGES.REQUIRED.name),

  email: () =>
    Yup.string()
      .email(VALIDATION_MESSAGES.INVALID.email)
      .required(VALIDATION_MESSAGES.REQUIRED.email),

  phone: () =>
    Yup.string()
      .matches(VALIDATION_PATTERNS.INDIAN_PHONE, VALIDATION_MESSAGES.INVALID.phone)
      .required(VALIDATION_MESSAGES.REQUIRED.phone),

  password: () =>
    Yup.string()
      .min(6, VALIDATION_MESSAGES.LENGTH.passwordMin)
      .matches(VALIDATION_PATTERNS.PASSWORD, VALIDATION_MESSAGES.PASSWORD.requirements)
      .required(VALIDATION_MESSAGES.REQUIRED.password),

  confirmPassword: (passwordRef: string = 'password') =>
    Yup.string()
      .oneOf([Yup.ref(passwordRef)], VALIDATION_MESSAGES.PASSWORD.mustMatch)
      .required(VALIDATION_MESSAGES.REQUIRED.confirmPassword),

  otp: () =>
    Yup.string()
      .matches(VALIDATION_PATTERNS.OTP, VALIDATION_MESSAGES.INVALID.otp)
      .required(VALIDATION_MESSAGES.REQUIRED.otp),

  url: () => Yup.string().url(VALIDATION_MESSAGES.INVALID.url),

  optionalName: () =>
    Yup.string()
      .min(2, VALIDATION_MESSAGES.LENGTH.nameMin)
      .max(50, VALIDATION_MESSAGES.LENGTH.nameMax)
      .matches(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.INVALID.name),

  optionalEmail: () => Yup.string().email(VALIDATION_MESSAGES.INVALID.email),

  optionalPhone: () =>
    Yup.string().matches(VALIDATION_PATTERNS.INDIAN_PHONE, VALIDATION_MESSAGES.INVALID.phone),

  productName: () =>
    Yup.string()
      .min(2, VALIDATION_MESSAGES.LENGTH.nameMin)
      .max(100, VALIDATION_MESSAGES.LENGTH.productNameMax)
      .required(VALIDATION_MESSAGES.REQUIRED.name),

  productCategory: (categories: readonly ProductCategory[]) =>
    Yup.string()
      .oneOf([...categories], VALIDATION_MESSAGES.INVALID.category)
      .required(VALIDATION_MESSAGES.REQUIRED.category),

  price: () =>
    Yup.number().min(0.01, VALIDATION_MESSAGES.PRICE.min).required(VALIDATION_MESSAGES.REQUIRED.price),

  stock: () =>
    Yup.number().min(0, VALIDATION_MESSAGES.STOCK.min).required(VALIDATION_MESSAGES.REQUIRED.stock),

  description: () => Yup.string().max(500, VALIDATION_MESSAGES.LENGTH.descriptionMax),

  images: () => Yup.array().of(Yup.string()),
} as const;

export const productCategories: readonly ProductCategory[] = ['Fish', 'Prawn', 'Crab', 'Squid'] as const;

export const productValidationSchema = Yup.object({
  name: validationFields.productName(),
  category: validationFields.productCategory(productCategories),
  price: validationFields.price(),
  stock: validationFields.stock(),
  description: validationFields.description(),
  images: validationFields.images(),
});

export const identifierValidator = () =>
  Yup.string()
    .required('Email or phone number is required')
    .test(
      'email-or-phone',
      'Please provide a valid email or 10-digit phone number',
      function (value) {
        if (!value) return false;

        if (VALIDATION_PATTERNS.EMAIL.test(value)) return true;

        if (VALIDATION_PATTERNS.INDIAN_PHONE.test(value)) return true;

        return false;
      },
    );

export const isValidEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return VALIDATION_PATTERNS.INDIAN_PHONE.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && VALIDATION_PATTERNS.PASSWORD.test(password);
};

export const formatValidationError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const getPasswordStrength = (
  password: string,
): { strength: 'weak' | 'medium' | 'strong'; label: string; color: string } => {
  if (password.length === 0) {
    return { strength: 'weak', label: '', color: 'gray' };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 2) {
    return { strength: 'weak', label: 'Weak', color: 'red' };
  } else if (score <= 4) {
    return { strength: 'medium', label: 'Medium', color: 'yellow' };
  } else {
    return { strength: 'strong', label: 'Strong', color: 'green' };
  }
};
