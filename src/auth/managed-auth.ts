import type { LinearAuthConfig } from '../utils/config.js';
import {
  readStoredCredentials,
  withCredentialsLock,
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
  /** Poll interval while another process holds the refresh lock. */
  lockRetryMs?: number;
}

function needsRefresh(credentials: StoredCredentials, nowMs: number): boolean {
  if (typeof credentials.expiresAt !== 'number') {
    return false;
  }
  return credentials.expiresAt - EXPIRY_SKEW_MS <= nowMs;
}

function refreshFailure(error: unknown): Error {
  const reason = error instanceof Error ? error.message : 'unknown error';
  return new Error(
    `Failed to refresh the stored Linear access token (${reason}). Run \`mcp-linear auth login\` again.`,
  );
}

/**
 * Create an auth provider over credentials saved by `mcp-linear auth login`.
 * Returns undefined when no usable credentials are stored.
 *
 * Several server processes (one per MCP client session) may share one
 * credentials file. Linear rotates the refresh token on every refresh, so a
 * refresh by one process revokes the refresh token the others hold in memory.
 * Refreshes therefore run under a cross-process lock and always start from the
 * file, not from memory.
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
  // Serialize refreshes within this process; the file lock serializes them
  // across processes.
  let pendingRefresh: Promise<void> | undefined;

  async function requestRefresh(from: StoredCredentials): Promise<StoredCredentials> {
    const tokens = await refreshAccessToken({
      refreshToken: from.refreshToken!,
      clientId: from.clientId,
      ...(from.clientSecret ? { clientSecret: from.clientSecret } : {}),
    });

    const updated: StoredCredentials = {
      clientId: from.clientId,
      ...(from.clientSecret ? { clientSecret: from.clientSecret } : {}),
      accessToken: tokens.accessToken,
      // Linear rotates refresh tokens; fall back to the previous one only if
      // the response omitted a replacement.
      refreshToken: tokens.refreshToken ?? from.refreshToken,
      scopes: tokens.scopes.length > 0 ? tokens.scopes : from.scopes,
    };
    if (typeof tokens.expiresIn === 'number') {
      updated.expiresAt = now() + tokens.expiresIn * 1000;
    }
    return updated;
  }

  async function refreshUnderLock(): Promise<void> {
    // Another process may have refreshed while we waited for the lock (or
    // since we started); its rotation revoked the refresh token in memory.
    const latest = readStoredCredentials();
    if (!latest) {
      // `auth logout` removed the file; refreshing from memory would bring
      // the credentials back.
      throw new Error(
        'Stored Linear credentials were removed (logged out). Run `mcp-linear auth login` again.',
      );
    }
    if (!needsRefresh(latest, now())) {
      credentials = latest;
      return;
    }
    if (!latest.refreshToken) {
      throw new Error(
        'Stored Linear access token has expired and no refresh token is available. Run `mcp-linear auth login` again.',
      );
    }

    let updated: StoredCredentials;
    try {
      updated = await requestRefresh(latest);
    } catch (error) {
      // A process that does not take the lock (an older build still running)
      // may have rotated the token while our request was in flight. Pick up
      // its result, retrying at most once.
      const reread = readStoredCredentials();
      if (!reread?.refreshToken || reread.refreshToken === latest.refreshToken) {
        throw refreshFailure(error);
      }
      if (!needsRefresh(reread, now())) {
        credentials = reread;
        return;
      }
      try {
        updated = await requestRefresh(reread);
      } catch (retryError) {
        throw refreshFailure(retryError);
      }
    }

    writeStoredCredentials(updated);
    credentials = updated;
  }

  function refresh(): Promise<void> {
    return withCredentialsLock(
      refreshUnderLock,
      options.lockRetryMs === undefined ? {} : { retryMs: options.lockRetryMs },
    );
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
