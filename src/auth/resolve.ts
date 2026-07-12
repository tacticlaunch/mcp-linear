import {
  getExplicitLinearAuthConfig,
  getLinearApiToken,
  type LinearAuthConfig,
} from '../utils/config.js';
import { createStoredCredentialAuth } from './managed-auth.js';

export interface ResolvedLinearAuth {
  source: 'explicit' | 'store';
  /** Current auth config; store-backed auth refreshes transparently. */
  getConfig(): Promise<LinearAuthConfig>;
}

/**
 * Resolve the server's Linear credential.
 *
 * Precedence: explicit CLI flags, then explicit environment variables (the
 * existing rules in getExplicitLinearAuthConfig), then credentials stored by
 * `mcp-linear auth login`.
 */
export function resolveLinearAuth(): ResolvedLinearAuth | undefined {
  const explicit = getExplicitLinearAuthConfig();
  if (explicit) {
    return {
      source: 'explicit',
      getConfig: async () => explicit,
    };
  }

  const stored = createStoredCredentialAuth();
  if (stored) {
    return {
      source: 'store',
      getConfig: () => stored.getConfig(),
    };
  }

  // Preserve the existing missing-credential diagnostics (no values logged).
  getLinearApiToken();
  return undefined;
}
