import * as Yup from 'yup';
import { validationFields, identifierValidator } from '@/utils/validation';

export const registerSchema = Yup.object().shape({
  name: validationFields.name(),
  email: validationFields.email(),
  phone: validationFields.phone(),
  password: validationFields.password(),
  confirmPassword: validationFields.confirmPassword(),
});

export const loginSchema = Yup.object().shape({
  identifier: identifierValidator(),
  password: Yup.string().required('Password is required'),
});

export const profileUpdateSchema = Yup.object().shape({
  name: validationFields.optionalName(),
  email: validationFields.optionalEmail(),
  phone: validationFields.optionalPhone(),
  avatar: validationFields.url(),
  street: Yup.string()
    .min(10, 'Street address must be at least 10 characters')
    .max(300, 'Street address cannot exceed 300 characters'),
  city: Yup.string()
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name cannot exceed 50 characters'),
  state: Yup.string().max(50, 'State name cannot exceed 50 characters'),
  pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be a valid 6-digit number'),
  landmark: Yup.string().max(100, 'Landmark cannot exceed 100 characters'),
});

export const registerInitialValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export const loginInitialValues = {
  identifier: '',
  password: '',
};

export const profileUpdateInitialValues = {
  name: '',
  email: '',
  phone: '',
  avatar: '',
};

export const otpSchema = Yup.object().shape({
  otp: validationFields.otp(),
});

export const otpInitialValues = {
  otp: '',
};

export const forgotPasswordSchema = Yup.object().shape({
  identifier: identifierValidator(),
});

export const forgotPasswordInitialValues = {
  identifier: '',
};

export const resetPasswordSchema = Yup.object().shape({
  identifier: identifierValidator(),
  otp: validationFields.otp(),
  newPassword: validationFields.password(),
  confirmPassword: validationFields.confirmPassword('newPassword'),
});

export const resetPasswordInitialValues = {
  identifier: '',
  otp: '',
  newPassword: '',
  confirmPassword: '',
};

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: validationFields
    .password()
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
  confirmPassword: validationFields.confirmPassword('newPassword'),
});

export const changePasswordInitialValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
