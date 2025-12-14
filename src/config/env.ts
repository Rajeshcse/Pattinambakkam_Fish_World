/**
 * Environment Configuration & Validation
 *
 * This module validates required environment variables at app initialization
 * and provides a type-safe configuration object.
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
}

/**
 * List of required environment variables
 */
const REQUIRED_ENV_VARS = ['VITE_API_BASE_URL'] as const;

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variables are missing
 */
function validateEnvironment(): void {
  const missing: string[] = [];

  REQUIRED_ENV_VARS.forEach((key) => {
    const value = import.meta.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ENVIRONMENT CONFIGURATION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing required environment variables:
${missing.map((key) => `  • ${key}`).join('\n')}

Please ensure these variables are defined in your .env file.

Example .env file:
VITE_API_BASE_URL=http://localhost:3001

For production deployment, set these in your hosting provider's
environment variable configuration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    throw new Error(errorMessage);
  }
}

/**
 * Validates the API base URL format
 * @param url - The URL to validate
 * @throws {Error} If the URL is invalid
 */
function validateApiBaseUrl(url: string): void {
  try {
    const parsed = new URL(url);

    // Warn if using http in production
    if (import.meta.env.PROD && parsed.protocol === 'http:') {
      console.warn(
        '⚠️  WARNING: Using HTTP (not HTTPS) in production environment. ' +
          'This is insecure and not recommended.',
      );
    }

    // Warn if using localhost/127.0.0.1 in production
    if (
      import.meta.env.PROD &&
      (parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '0.0.0.0')
    ) {
      throw new Error(
        `Invalid API base URL for production: ${url}\n` +
          'Production builds should not use localhost URLs.\n' +
          'Please set VITE_API_BASE_URL to your production API URL.',
      );
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Invalid VITE_API_BASE_URL format: "${url}"\n` +
          'URL must be a valid HTTP/HTTPS URL (e.g., https://api.example.com)',
      );
    }
    throw error;
  }
}

/**
 * Initialize and validate environment configuration
 */
function initializeConfig(): EnvironmentConfig {
  // Validate all required environment variables are present
  validateEnvironment();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL!;

  // Validate API base URL format
  validateApiBaseUrl(apiBaseUrl);

  return {
    apiBaseUrl,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isTest: import.meta.env.MODE === 'test',
  };
}

/**
 * Validated and type-safe environment configuration
 *
 * @example
 * ```typescript
 * import { config } from '@/config/env';
 *
 * const response = await fetch(`${config.apiBaseUrl}/api/users`);
 *
 * if (config.isDev) {
 *   console.log('Running in development mode');
 * }
 * ```
 */
export const config = initializeConfig();

/**
 * Type for environment configuration
 */
export type { EnvironmentConfig };
