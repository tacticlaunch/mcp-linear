import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  readStoredCredentials,
  writeStoredCredentials,
  withCredentialsLock,
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

/**
 * Several MCP server processes (one per client session) share one credentials
 * file. Each `createStoredCredentialAuth` instance below stands in for one
 * process: it holds its own in-memory copy, exactly like a separate process.
 */
describe('stored credential auth shared across processes', () => {
  const originalEnv = process.env;
  let tempDir: string;
  let fetchSpy: jest.SpyInstance;
  let clock: number;
  const now = () => clock;

  /**
   * Fake Linear token endpoint with refresh token rotation: every successful
   * refresh issues a new refresh token and invalidates the one that was sent.
   */
  function fakeTokenEndpoint(initialRefreshToken: string) {
    const server = { validRefreshToken: initialRefreshToken, issued: 0, sent: [] as string[] };
    fetchSpy.mockImplementation(async (_url: unknown, init?: RequestInit) => {
      const sent = new URLSearchParams(String(init?.body)).get('refresh_token') ?? '';
      server.sent.push(sent);
      if (sent !== server.validRefreshToken) {
        return jsonResponse(400, { error: 'invalid_grant' });
      }
      server.issued += 1;
      server.validRefreshToken = `rotated-refresh-token-${server.issued}`;
      return jsonResponse(200, {
        access_token: `refreshed-access-token-${server.issued}`,
        refresh_token: server.validRefreshToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read,write',
      });
    });
    return server;
  }

  /** What another process (old or new code) leaves in the file after rotating. */
  function writeRotatedByOtherProcess(
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
  ): void {
    writeStoredCredentials({
      clientId: 'client-id-1',
      clientSecret: 'client-secret-1',
      accessToken,
      refreshToken,
      expiresAt,
      scopes: ['read', 'write'],
    });
  }


  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-auth-shared-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
    fetchSpy = jest.spyOn(global, 'fetch');
    clock = NOW;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('reuses the token another process already refreshed instead of sending a revoked refresh token', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    const server = fakeTokenEndpoint('stored-refresh-token');

    const processA = createStoredCredentialAuth({ now });
    const processB = createStoredCredentialAuth({ now });

    await expect(processA!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token-1',
    });
    await expect(processB!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token-1',
    });

    expect(server.sent).toEqual(['stored-refresh-token']);
    expect(readStoredCredentials()?.refreshToken).toBe('rotated-refresh-token-1');
  });

  it('sends one refresh request when two processes refresh at the same moment', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    const server = fakeTokenEndpoint('stored-refresh-token');

    const processA = createStoredCredentialAuth({ now, lockRetryMs: 5 });
    const processB = createStoredCredentialAuth({ now, lockRetryMs: 5 });

    const [configA, configB] = await Promise.all([processA!.getConfig(), processB!.getConfig()]);

    expect(configA.token).toBe('refreshed-access-token-1');
    expect(configB.token).toBe('refreshed-access-token-1');
    expect(server.sent).toEqual(['stored-refresh-token']);
  });

  it('refreshes with the newest refresh token from the file when that token has expired too', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    const server = fakeTokenEndpoint('stored-refresh-token');

    const processA = createStoredCredentialAuth({ now });
    const processB = createStoredCredentialAuth({ now });

    await processA!.getConfig();
    // Two hours later both processes see an expired access token; B's memory
    // still holds the refresh token that A's rotation revoked.
    clock = NOW + 2 * 3_600_000;

    await expect(processB!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token-2',
    });
    expect(server.sent).toEqual(['stored-refresh-token', 'rotated-refresh-token-1']);
    expect(readStoredCredentials()?.refreshToken).toBe('rotated-refresh-token-2');

    // A now picks up B's rotation from the file without another request.
    await expect(processA!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'refreshed-access-token-2',
    });
    expect(server.sent).toHaveLength(2);
  });

  it('retries once with the rotated refresh token when a process that ignores the lock rotated it mid-request', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    const server = { sent: [] as string[] };
    fetchSpy.mockImplementation(async (_url: unknown, init?: RequestInit) => {
      const sent = new URLSearchParams(String(init?.body)).get('refresh_token') ?? '';
      server.sent.push(sent);
      if (server.sent.length === 1) {
        // An older server build (no lock) rotated the token while our request
        // was in flight and wrote an already-expiring access token.
        writeRotatedByOtherProcess('other-access-token', 'other-refresh-token', NOW - 500);
        return jsonResponse(400, { error: 'invalid_grant' });
      }
      if (sent !== 'other-refresh-token') {
        return jsonResponse(400, { error: 'invalid_grant' });
      }
      return jsonResponse(200, {
        access_token: 'retried-access-token',
        refresh_token: 'retried-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read,write',
      });
    });

    const auth = createStoredCredentialAuth({ now });
    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'retried-access-token',
    });
    expect(server.sent).toEqual(['stored-refresh-token', 'other-refresh-token']);
    expect(readStoredCredentials()?.refreshToken).toBe('retried-refresh-token');
  });

  it('adopts a fresh token written by another process during a rejected refresh without retrying', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fetchSpy.mockImplementation(async () => {
      writeRotatedByOtherProcess('other-access-token', 'other-refresh-token', NOW + 3_600_000);
      return jsonResponse(400, { error: 'invalid_grant' });
    });

    const auth = createStoredCredentialAuth({ now });
    await expect(auth!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'other-access-token',
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('gives up after one retry when the rotated refresh token is rejected as well', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    let calls = 0;
    fetchSpy.mockImplementation(async () => {
      calls += 1;
      writeRotatedByOtherProcess('other-access-token', `other-refresh-token-${calls}`, NOW - 500);
      return jsonResponse(400, { error: 'invalid_grant' });
    });

    const auth = createStoredCredentialAuth({ now });
    await expect(auth!.getConfig()).rejects.toThrow(/mcp-linear auth login/);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('does not resurrect credentials that were logged out before the refresh', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fakeTokenEndpoint('stored-refresh-token');

    const auth = createStoredCredentialAuth({ now });
    fs.unlinkSync(path.join(tempDir, 'credentials.json'));

    await expect(auth!.getConfig()).rejects.toThrow(/mcp-linear auth login/);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(readStoredCredentials()).toBeUndefined();
  });

  it('refreshes with the client of the newest login in the file', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    const auth = createStoredCredentialAuth({ now });
    // The user logged in again with another OAuth app; that token expired too.
    writeStoredCredentials({
      clientId: 'client-id-2',
      accessToken: 'second-login-access-token',
      refreshToken: 'stored-refresh-token',
      expiresAt: NOW - 500,
      scopes: ['read'],
    });
    const server = fakeTokenEndpoint('stored-refresh-token');

    await auth!.getConfig();

    const body = new URLSearchParams(String((fetchSpy.mock.calls[0][1] as RequestInit).body));
    expect(server.sent).toHaveLength(1);
    expect(body.get('client_id')).toBe('client-id-2');
    expect(body.has('client_secret')).toBe(false);
    expect(readStoredCredentials()?.clientId).toBe('client-id-2');
  });

  it('releases the refresh lock when the refresh fails', async () => {
    seedCredentials({ expiresAt: NOW - 1_000 });
    fetchSpy.mockResolvedValue(jsonResponse(400, { error: 'invalid_grant' }));
    const auth = createStoredCredentialAuth({ now });
    await expect(auth!.getConfig()).rejects.toThrow(/mcp-linear auth login/);
    fetchSpy.mockRestore();
    await expect(withCredentialsLock(async () => 'acquired', { timeoutMs: 100 })).resolves.toBe('acquired');
  });
});
