import axios, { AxiosError } from 'axios';

export interface AppError {
  message: string;

  code?: string;

  statusCode?: number;

  details?: Record<string, unknown>;

  originalError?: unknown;
}

export interface ValidationError {
  type?: string;
  value?: string;
  msg: string;
  path: string;
  location?: string;
}

export enum ErrorCategory {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export interface CategorizedError extends AppError {
  category: ErrorCategory;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === 'string') {
      return responseMessage;
    }

    const responseError = error.response?.data?.error;
    if (typeof responseError === 'string') {
      return responseError;
    }

    if (error.response?.statusText) {
      return error.response.statusText;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    return error.message || 'An unexpected error occurred';
  }

  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function handleApiError(error: unknown, fallbackMessage?: string): AppError {
  if (isAxiosError(error)) {
    const message = getErrorMessage(error);
    const statusCode = error.response?.status;
    const code = error.response?.data?.code || error.code;

    return {
      message: message || fallbackMessage || 'Request failed',
      code,
      statusCode,
      details: error.response?.data,
      originalError: error,
    };
  }

  if (isError(error)) {
    return {
      message: error.message || fallbackMessage || 'An error occurred',
      originalError: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error || fallbackMessage || 'An error occurred',
      originalError: error,
    };
  }

  return {
    message: fallbackMessage || 'An unexpected error occurred',
    originalError: error,
  };
}

export function categorizeError(error: unknown): CategorizedError {
  const appError = handleApiError(error);
  let category = ErrorCategory.UNKNOWN;

  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (error.code === 'ECONNABORTED') {
      category = ErrorCategory.TIMEOUT;
    } else if (error.code === 'ERR_NETWORK' || !status) {
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

export function getValidationErrors(error: unknown): ValidationError[] | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const errors = error.response?.data?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors as ValidationError[];
  }

  return null;
}

export function isAuthError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 401;
}

export function isAuthorizationError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 403;
}

export function isNotFoundError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404;
}

export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : '[Error]';

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
