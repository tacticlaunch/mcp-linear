import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { writeStoredCredentials } from '../auth/credential-store.js';
import { resolveLinearAuth } from '../auth/resolve.js';

function seedStore() {
  writeStoredCredentials({
    clientId: 'client-id-1',
    clientSecret: 'client-secret-1',
    accessToken: 'stored-access-token',
    refreshToken: 'stored-refresh-token',
    expiresAt: Date.now() + 3_600_000,
    scopes: ['read', 'write'],
  });
}

describe('resolveLinearAuth', () => {
  const originalArgv = process.argv;
  const originalEnv = process.env;
  let tempDir: string;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.argv = ['node', 'mcp-linear'];
    process.env = { ...originalEnv };
    delete process.env.LINEAR_API_TOKEN;
    delete process.env.LINEAR_API_KEY;
    delete process.env.MCP_LINEAR_DEBUG;
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-auth-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.argv = originalArgv;
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('prefers an explicit environment credential over stored credentials', async () => {
    seedStore();
    process.env.LINEAR_API_TOKEN = 'explicit-api-token';

    const resolved = resolveLinearAuth();

    expect(resolved?.source).toBe('explicit');
    await expect(resolved!.getConfig()).resolves.toEqual({
      type: 'apiKey',
      token: 'explicit-api-token',
    });
  });

  it('prefers an explicit CLI credential over stored credentials', async () => {
    seedStore();
    process.argv = ['node', 'mcp-linear', '--token', 'explicit-cli-token'];

    const resolved = resolveLinearAuth();

    expect(resolved?.source).toBe('explicit');
    await expect(resolved!.getConfig()).resolves.toEqual({
      type: 'apiKey',
      token: 'explicit-cli-token',
    });
  });

  it('falls back to stored credentials when no explicit credential exists', async () => {
    seedStore();

    const resolved = resolveLinearAuth();

    expect(resolved?.source).toBe('store');
    await expect(resolved!.getConfig()).resolves.toEqual({
      type: 'oauth',
      token: 'stored-access-token',
    });
    // The missing-credential diagnostic must not fire when the store succeeds.
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      'API token not found in command line args or environment variables',
    );
  });

  it('returns undefined with the existing diagnostics when nothing is configured', () => {
    expect(resolveLinearAuth()).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'API token not found in command line args or environment variables',
    );
  });
});
