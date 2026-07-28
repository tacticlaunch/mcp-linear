import type { LinearAuthConfig } from '../utils/config.js';
import {
  readStoredCredentials,
  writeStoredCredentials,
  type StoredCredentials,
} from './credential-store.js';
import { refreshAccessToken } from './oauth-http.js';

/** Refresh tokens this close to expiry (or past it) before use. */
export const EXPIRY_SKEW_MS = 60_000;

export interface StoredCredentialAuth {
  /**
   * Return a Linear auth config backed by the credential store, refreshing
   * (and persisting the rotated refresh token) when the access token is
   * expired or within the skew window.
   */
  getConfig(): Promise<LinearAuthConfig>;
}

export interface StoredCredentialAuthOptions {
  now?: () => number;
}

function needsRefresh(credentials: StoredCredentials, nowMs: number): boolean {
  if (typeof credentials.expiresAt !== 'number') {
    return false;
  }
  return credentials.expiresAt - EXPIRY_SKEW_MS <= nowMs;
}

/**
 * Create an auth provider over credentials saved by `mcp-linear auth login`.
 * Returns undefined when no usable credentials are stored.
 */
export function createStoredCredentialAuth(
  options: StoredCredentialAuthOptions = {},
): StoredCredentialAuth | undefined {
  const initial = readStoredCredentials();
  if (!initial) {
    return undefined;
  }

  const now = options.now ?? Date.now;
  let credentials = initial;
  // Serialize refreshes so concurrent requests never race a token rotation.
  let pendingRefresh: Promise<void> | undefined;

  async function refresh(): Promise<void> {
    if (!credentials.refreshToken) {
      throw new Error(
        'Stored Linear access token has expired and no refresh token is available. Run `mcp-linear auth login` again.',
      );
    }

    let tokens;
    try {
      tokens = await refreshAccessToken({
        refreshToken: credentials.refreshToken,
        clientId: credentials.clientId,
        ...(credentials.clientSecret ? { clientSecret: credentials.clientSecret } : {}),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      throw new Error(
        `Failed to refresh the stored Linear access token (${reason}). Run \`mcp-linear auth login\` again.`,
      );
    }

    const updated: StoredCredentials = {
      clientId: credentials.clientId,
      ...(credentials.clientSecret ? { clientSecret: credentials.clientSecret } : {}),
      accessToken: tokens.accessToken,
      // Linear rotates refresh tokens; fall back to the previous one only if
      // the response omitted a replacement.
      refreshToken: tokens.refreshToken ?? credentials.refreshToken,
      scopes: tokens.scopes.length > 0 ? tokens.scopes : credentials.scopes,
    };
    if (typeof tokens.expiresIn === 'number') {
      updated.expiresAt = now() + tokens.expiresIn * 1000;
    }

    writeStoredCredentials(updated);
    credentials = updated;
  }

  return {
    async getConfig(): Promise<LinearAuthConfig> {
      if (needsRefresh(credentials, now())) {
        pendingRefresh ??= refresh().finally(() => {
          pendingRefresh = undefined;
        });
        await pendingRefresh;
      }
      return { type: 'oauth', token: credentials.accessToken };
    },
  };
}
