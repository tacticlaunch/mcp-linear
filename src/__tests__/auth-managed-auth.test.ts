import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  readStoredCredentials,
  writeStoredCredentials,
  type StoredCredentials,
} from '../auth/credential-store.js';
import { createStoredCredentialAuth } from '../auth/managed-auth.js';

const NOW = 1_752_300_000_000;

function seedCredentials(overrides: Partial<StoredCredentials> = {}): StoredCredentials {
  const credentials: StoredCredentials = {
    clientId: 'client-id-1',
    clientSecret: 'client-secret-1',
    accessToken: 'stored-access-token',
    refreshToken: 'stored-refresh-token',
    expiresAt: NOW + 3_600_000,
    scopes: ['read', 'write'],
    ...overrides,
  };
  writeStoredCredentials(credentials);
  return credentials;
}

function jsonResponse(status: number, payload: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as unknown as Response;
}

describe('stored credential auth', () => {
  const originalEnv = process.env;
  let tempDir: string;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-auth-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns undefined when no credentials are stored', () => {
    expect(createStoredCredentialAuth({ now: () => NOW })).toBeUndefined();
  });

  it('returns the stored token without any network call when it is still fresh', async () => {
    seedCredentials();
    const auth = createStoredCredentialAuth({ now: () => NOW });

    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'stored-access-token',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('refreshes an expired token and persists the rotated refresh token', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fetchSpy.mockResolvedValueOnce(
      jsonResponse(200, {
        access_token: 'refreshed-access-token',
        refresh_token: 'rotated-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read,write',
      }),
    );

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token',
    });

    const persisted = readStoredCredentials();
    expect(persisted?.accessToken).toBe('refreshed-access-token');
    expect(persisted?.refreshToken).toBe('rotated-refresh-token');
    expect(persisted?.expiresAt).toBe(NOW + 3_600_000);
  });

  it('refreshes when the token is within the expiry skew window', async () => {
    seedCredentials({ expiresAt: NOW + 30_000 });
    fetchSpy.mockResolvedValueOnce(
      jsonResponse(200, {
        access_token: 'refreshed-access-token',
        refresh_token: 'rotated-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read,write',
      }),
    );

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token',
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('does not refresh again once the rotated token is fresh', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fetchSpy.mockResolvedValueOnce(
      jsonResponse(200, {
        access_token: 'refreshed-access-token',
        refresh_token: 'rotated-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read,write',
      }),
    );

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await auth!.getConfig();
    await auth!.getConfig();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('fails with a sanitized re-login hint when the refresh is rejected', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fetchSpy.mockResolvedValueOnce(jsonResponse(401, { error: 'invalid_grant' }));

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await expect(auth!.getConfig()).rejects.toThrow(/mcp-linear auth login/);
    await expect(
      auth!.getConfig().catch((error: Error) => {
        expect(error.message).not.toContain('stored-refresh-token');
        expect(error.message).not.toContain('client-secret-1');
        throw error;
      }),
    ).rejects.toThrow();
  });

  it('asks for a re-login when the token is expired and no refresh token exists', async () => {
    seedCredentials({ expiresAt: NOW - 1_000, refreshToken: undefined });

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await expect(auth!.getConfig()).rejects.toThrow(/mcp-linear auth login/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('treats a token without expiry metadata as non-expiring', async () => {
    seedCredentials({ expiresAt: undefined, refreshToken: undefined });

    const auth = createStoredCredentialAuth({ now: () => NOW });
    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'stored-access-token',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
