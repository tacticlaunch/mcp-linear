import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Parse command line arguments to find a specific flag and its value
 * @param flag The flag to search for (e.g., '--token')
 * @returns The value of the flag or undefined if not found
 */
export function getCommandLineArg(flag: string): string | undefined {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      return args[i + 1];
    }
  }

  return undefined;
}

/**
 * Get the Linear API token from command-line arguments or environment variable
 * @returns The API token or undefined if not found
 */
export function getLinearApiToken(): string | undefined {
  // First try to get the token from command-line arguments
  const tokenFromArgs = getCommandLineArg('--token');

  // If not found, try to get it from environment variables
  // Accept either LINEAR_API_TOKEN or LINEAR_API_KEY.
  const tokenFromEnv = process.env.LINEAR_API_TOKEN || process.env.LINEAR_API_KEY;

  // Only emit environment diagnostics in explicit debug mode.
  if (!tokenFromArgs && !tokenFromEnv) {
    logError('API token not found in command line args or environment variables');
    if (isDebugLoggingEnabled()) {
      console.error(
        'Environment variables:',
        Object.keys(process.env).filter((key) => key.includes('LINEAR')),
      );
    }
  }

  return tokenFromArgs || tokenFromEnv;
}

export type LinearAuthConfig =
  | { type: 'oauth'; token: string }
  | { type: 'apiKey'; token: string };

/**
 * Resolve both supported Linear authentication modes.
 *
 * Explicit CLI credentials take precedence over environment variables. Within
 * each source, OAuth is preferred because managed OAuth application operations
 * must be performed by an OAuth application identity. Legacy API-key flags and
 * environment variables retain their existing behavior.
 */
export function getLinearAuthConfig(): LinearAuthConfig | undefined {
  const oauthTokenFromArgs = getCommandLineArg('--oauth-token');
  if (oauthTokenFromArgs) {
    return { type: 'oauth', token: oauthTokenFromArgs };
  }

  const apiKeyFromArgs = getCommandLineArg('--token');
  if (apiKeyFromArgs) {
    return { type: 'apiKey', token: apiKeyFromArgs };
  }

  if (process.env.LINEAR_OAUTH_ACCESS_TOKEN) {
    return { type: 'oauth', token: process.env.LINEAR_OAUTH_ACCESS_TOKEN };
  }

  const apiKeyFromEnv = process.env.LINEAR_API_TOKEN || process.env.LINEAR_API_KEY;
  if (apiKeyFromEnv) {
    return { type: 'apiKey', token: apiKeyFromEnv };
  }

  // Preserve the existing missing-token diagnostics without printing credential values.
  getLinearApiToken();
  return undefined;
}

export function isDebugLoggingEnabled(): boolean {
  return process.env.MCP_LINEAR_DEBUG === '1' || process.env.MCP_LINEAR_DEBUG === 'true';
}

/**
 * Log initialization information
 * @param message The message to log
 */
export function logInfo(message: string): void {
  if (isDebugLoggingEnabled()) {
    console.error(message);
  }
}

/**
 * Log error information
 * @param message The error message
 * @param error The error object (optional)
 */
export function logError(message: string, error?: unknown): void {
  if (error) {
    console.error(message, error);
  } else {
    console.error(message);
  }
}
