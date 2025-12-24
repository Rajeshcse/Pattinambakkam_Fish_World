interface EnvironmentConfig {
  apiBaseUrl: string;
  whatsappNumber: string;
  razorpayPaymentLink: string;
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
}

const REQUIRED_ENV_VARS = [
  'VITE_API_BASE_URL',
  'VITE_WHATSAPP_NUMBER',
  'VITE_RAZORPAY_PAYMENT_LINK',
] as const;

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
VITE_WHATSAPP_NUMBER=919994072395
VITE_RAZORPAY_PAYMENT_LINK=https://razorpay.me/@yourusername

For production deployment, set these in your hosting provider's
environment variable configuration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    throw new Error(errorMessage);
  }
}

function validateApiBaseUrl(url: string): void {
  try {
    const parsed = new URL(url);

    if (import.meta.env.PROD && parsed.protocol === 'http:') {
      console.warn(
        '⚠️  WARNING: Using HTTP (not HTTPS) in production environment. ' +
          'This is insecure and not recommended.',
      );
    }

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

function initializeConfig(): EnvironmentConfig {
  validateEnvironment();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL!;

  validateApiBaseUrl(apiBaseUrl);

  return {
    apiBaseUrl,
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER!,
    razorpayPaymentLink: import.meta.env.VITE_RAZORPAY_PAYMENT_LINK!,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isTest: import.meta.env.MODE === 'test',
  };
}

export const config = initializeConfig();

export type { EnvironmentConfig };
