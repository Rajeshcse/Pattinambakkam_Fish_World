/**
 * Error Handling Utilities
 *
 * Provides type-safe error handling for API errors, network errors,
 * and general application errors.
 */

import axios, { AxiosError } from "axios";

/**
 * Standard application error interface
 */
export interface AppError {
  /** Human-readable error message */
  message: string;
  /** Error code from backend (e.g., 'VALIDATION_ERROR') */
  code?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Original error for debugging */
  originalError?: unknown;
}

/**
 * Validation error from backend
 */
export interface ValidationError {
  type?: string;
  value?: string;
  msg: string;
  path: string;
  location?: string;
}

/**
 * Error categories for different handling strategies
 */
export enum ErrorCategory {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

/**
 * Extended AppError with category
 */
export interface CategorizedError extends AppError {
  category: ErrorCategory;
}

/**
 * Type guard to check if error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

/**
 * Type guard to check if error is a standard Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Extract error message from various error types
 *
 * @param error - Unknown error from catch block
 * @returns Human-readable error message
 *
 * @example
 * ```typescript
 * try {
 *   await api.call();
 * } catch (error: unknown) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  // Handle AxiosError
  if (isAxiosError(error)) {
    // Try to get message from response data
    const responseData = error.response?.data as any;
    const responseMessage = responseData?.message;
    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    // Try to get error from response data
    const responseError = responseData?.error;
    if (typeof responseError === "string") {
      return responseError;
    }

    // Fallback to status text or generic message
    if (error.response?.statusText) {
      return error.response.statusText;
    }

    // Handle specific error codes
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    return error.message || "An unexpected error occurred";
  }

  // Handle standard Error
  if (isError(error)) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle object with message property
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  // Fallback
  return "An unexpected error occurred";
}

/**
 * Convert unknown error to AppError interface
 *
 * @param error - Unknown error from catch block
 * @param fallbackMessage - Optional fallback message if error has no message
 * @returns Structured AppError object
 *
 * @example
 * ```typescript
 * try {
 *   await api.deleteUser(id);
 * } catch (error: unknown) {
 *   const appError = handleApiError(error, 'Failed to delete user');
 *   console.error(appError.message, appError.statusCode);
 *   throw appError;
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  fallbackMessage?: string
): AppError {
  // Handle AxiosError
  if (isAxiosError(error)) {
    const message = getErrorMessage(error);
    const statusCode = error.response?.status;
    const responseData = error.response?.data as any;
    const code = responseData?.code || error.code;

    return {
      message: message || fallbackMessage || "Request failed",
      code,
      statusCode,
      details: responseData as Record<string, unknown>,
      originalError: error,
    };
  }

  // Handle standard Error
  if (isError(error)) {
    return {
      message: error.message || fallbackMessage || "An error occurred",
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error || fallbackMessage || "An error occurred",
      originalError: error,
    };
  }

  // Fallback for unknown error types
  return {
    message: fallbackMessage || "An unexpected error occurred",
    originalError: error,
  };
}

/**
 * Categorize error for specific handling strategies
 *
 * @param error - Unknown error from catch block
 * @returns CategorizedError with error category
 *
 * @example
 * ```typescript
 * try {
 *   await api.call();
 * } catch (error: unknown) {
 *   const categorized = categorizeError(error);
 *
 *   if (categorized.category === ErrorCategory.AUTHENTICATION) {
 *     // Redirect to login
 *     navigate('/login');
 *   }
 * }
 * ```
 */
export function categorizeError(error: unknown): CategorizedError {
  const appError = handleApiError(error);
  let category = ErrorCategory.UNKNOWN;

  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (error.code === "ECONNABORTED") {
      category = ErrorCategory.TIMEOUT;
    } else if (error.code === "ERR_NETWORK" || !status) {
      category = ErrorCategory.NETWORK;
    } else if (status === 401) {
      category = ErrorCategory.AUTHENTICATION;
    } else if (status === 403) {
      category = ErrorCategory.AUTHORIZATION;
    } else if (status === 404) {
      category = ErrorCategory.NOT_FOUND;
    } else if (status === 400 || status === 422) {
      category = ErrorCategory.VALIDATION;
    } else if (status >= 500) {
      category = ErrorCategory.SERVER;
    }
  }

  return {
    ...appError,
    category,
  };
}

/**
 * Extract validation errors from API response
 *
 * @param error - Unknown error from catch block
 * @returns Array of validation errors or null if not a validation error
 *
 * @example
 * ```typescript
 * try {
 *   await api.register(data);
 * } catch (error: unknown) {
 *   const validationErrors = getValidationErrors(error);
 *   if (validationErrors) {
 *     validationErrors.forEach(err => {
 *       formik.setFieldError(err.path, err.msg);
 *     });
 *   }
 * }
 * ```
 */
export function getValidationErrors(error: unknown): ValidationError[] | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const responseData = error.response?.data as any;
  const errors = responseData?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors as ValidationError[];
  }

  return null;
}

/**
 * Check if error requires user authentication
 *
 * @param error - Unknown error from catch block
 * @returns True if error is authentication-related
 */
export function isAuthError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 401;
}

/**
 * Check if error is a permission/authorization error
 *
 * @param error - Unknown error from catch block
 * @returns True if error is authorization-related
 */
export function isAuthorizationError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 403;
}

/**
 * Check if error is a not found error
 *
 * @param error - Unknown error from catch block
 * @returns True if resource was not found
 */
export function isNotFoundError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404;
}

/**
 * Log error to console in development with useful context
 * Only logs in development mode
 *
 * @param error - Error to log
 * @param context - Additional context (e.g., 'UserService.deleteUser')
 *
 * @example
 * ```typescript
 * try {
 *   await api.deleteUser(id);
 * } catch (error: unknown) {
 *   logError(error, 'AdminUsers.handleDelete');
 *   throw error;
 * }
 * ```
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : "[Error]";

    if (isAxiosError(error)) {
      console.error(`${prefix} API Error:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (isError(error)) {
      console.error(`${prefix} Error:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error(`${prefix} Unknown Error:`, error);
    }
  }
}
