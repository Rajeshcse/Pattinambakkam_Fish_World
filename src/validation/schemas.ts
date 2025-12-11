import * as Yup from "yup";

/**
 * Validation schema for user registration
 */
export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),

  email: Yup.string()
    .email("Please provide a valid email")
    .required("Email is required"),

  phone: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone must be a 10-digit Indian mobile number starting with 6-9"
    )
    .required("Phone number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Validation schema for user login
 */
export const loginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Email or phone number is required")
    .test(
      "email-or-phone",
      "Please provide a valid email or 10-digit phone number",
      function (value) {
        if (!value) return false;

        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;

        // Check if it's a valid Indian phone number
        const phoneRegex = /^[6-9]\d{9}$/;
        if (phoneRegex.test(value)) return true;

        return false;
      }
    ),

  password: Yup.string().required("Password is required"),
});

/**
 * Validation schema for profile update
 */
export const profileUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: Yup.string().email("Please provide a valid email"),

  phone: Yup.string().matches(
    /^[6-9]\d{9}$/,
    "Phone must be a 10-digit Indian mobile number starting with 6-9"
  ),

  avatar: Yup.string().url("Please provide a valid URL"),
});

/**
 * Initial values for registration form
 */
export const registerInitialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

/**
 * Initial values for login form
 */
export const loginInitialValues = {
  identifier: "",
  password: "",
};

/**
 * Initial values for profile update form
 */
export const profileUpdateInitialValues = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
};

/**
 * Validation schema for OTP verification
 */
export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

/**
 * Initial values for OTP form
 */
export const otpInitialValues = {
  otp: "",
};

/**
 * Validation schema for forgot password
 */
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email")
    .required("Email is required"),
});

/**
 * Initial values for forgot password form
 */
export const forgotPasswordInitialValues = {
  email: "",
};

/**
 * Validation schema for reset password
 */
export const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email")
    .required("Email is required"),

  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),

  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Validation schema for password reset (password fields only)
 */
export const resetPasswordFormSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Initial values for reset password form
 */
export const resetPasswordInitialValues = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Initial values for password reset form (password fields only)
 */
export const resetPasswordFormInitialValues = {
  newPassword: "",
  confirmPassword: "",
};

/**
 * Validation schema for change password
 */
export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password must be different from current password"
    )
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Initial values for change password form
 */
export const changePasswordInitialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
