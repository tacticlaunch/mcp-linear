import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  deleteStoredCredentials,
  getCredentialsPath,
  getCredentialsLockPath,
  readStoredCredentials,
  writeStoredCredentials,
  withCredentialsLock,
  type StoredCredentials,
} from '../auth/credential-store.js';

const sampleCredentials: StoredCredentials = {
  clientId: 'client-id-1',
  clientSecret: 'client-secret-1',
  accessToken: 'access-token-1',
  refreshToken: 'refresh-token-1',
  expiresAt: 1893456000000,
  scopes: ['read', 'write'],
};

describe('credential store', () => {
  const originalEnv = process.env;
  let tempDir: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-auth-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
  });

  afterEach(() => {
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('resolves the credentials path from MCP_LINEAR_CONFIG_DIR first', () => {
    expect(getCredentialsPath()).toBe(path.join(tempDir, 'credentials.json'));
  });

  it('falls back to XDG_CONFIG_HOME/mcp-linear when no explicit override is set', () => {
    delete process.env.MCP_LINEAR_CONFIG_DIR;
    process.env.XDG_CONFIG_HOME = '/custom/xdg';

    expect(getCredentialsPath()).toBe(path.join('/custom/xdg', 'mcp-linear', 'credentials.json'));
  });

  it('defaults to ~/.config/mcp-linear', () => {
    delete process.env.MCP_LINEAR_CONFIG_DIR;
    delete process.env.XDG_CONFIG_HOME;

    expect(getCredentialsPath()).toBe(
      path.join(os.homedir(), '.config', 'mcp-linear', 'credentials.json'),
    );
  });

  it('round-trips credentials through write and read', () => {
    writeStoredCredentials(sampleCredentials);

    expect(readStoredCredentials()).toEqual(sampleCredentials);
  });

  it('writes the credentials file with owner-only permissions', () => {
    writeStoredCredentials(sampleCredentials);

    const fileMode = fs.statSync(getCredentialsPath()).mode & 0o777;
    const dirMode = fs.statSync(path.dirname(getCredentialsPath())).mode & 0o777;

    expect(fileMode).toBe(0o600);
    // The temp dir itself pre-exists; verify a freshly created config dir instead.
    const nestedDir = path.join(tempDir, 'nested-config');
    process.env.MCP_LINEAR_CONFIG_DIR = nestedDir;
    writeStoredCredentials(sampleCredentials);
    expect(fs.statSync(nestedDir).mode & 0o777).toBe(0o700);
    expect(dirMode & 0o077).toBeLessThanOrEqual(0o077);
  });

  it('does not leave temporary files behind after a write', () => {
    writeStoredCredentials(sampleCredentials);

    const entries = fs.readdirSync(tempDir);
    expect(entries).toEqual(['credentials.json']);
  });

  it('returns undefined when no credentials file exists', () => {
    expect(readStoredCredentials()).toBeUndefined();
  });

  it('returns undefined for a corrupt credentials file', () => {
    fs.writeFileSync(getCredentialsPath(), 'not-json{', { mode: 0o600 });

    expect(readStoredCredentials()).toBeUndefined();
  });

  it('returns undefined when required fields are missing', () => {
    fs.writeFileSync(
      getCredentialsPath(),
      JSON.stringify({ clientId: 'only-a-client-id' }),
      { mode: 0o600 },
    );

    expect(readStoredCredentials()).toBeUndefined();
  });

  it('tolerates credentials without a refresh token or expiry', () => {
    const minimal: StoredCredentials = {
      clientId: 'client-id-1',
      clientSecret: 'client-secret-1',
      accessToken: 'access-token-1',
      scopes: ['read'],
    };
    writeStoredCredentials(minimal);

    expect(readStoredCredentials()).toEqual(minimal);
  });

  it('deletes stored credentials and reports whether a file was removed', () => {
    writeStoredCredentials(sampleCredentials);

    expect(deleteStoredCredentials()).toBe(true);
    expect(fs.existsSync(getCredentialsPath())).toBe(false);
    expect(deleteStoredCredentials()).toBe(false);
  });
});

describe('credentials lock', () => {
  const originalEnv = process.env;
  let tempDir: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-lock-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
  });

  afterEach(() => {
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('runs the callback while holding the lock file and removes it afterwards', async () => {
    let heldDuringCallback = false;
    await withCredentialsLock(async () => {
      heldDuringCallback = fs.existsSync(getCredentialsLockPath());
    });

    expect(heldDuringCallback).toBe(true);
    expect(fs.existsSync(getCredentialsLockPath())).toBe(false);
  });

  it('leaves a lock alone that another process took over meanwhile', async () => {
    await withCredentialsLock(async () => {
      // Our lock was reclaimed as stale and another process now holds it.
      fs.writeFileSync(getCredentialsLockPath(), 'other-process-owner');
    });

    expect(fs.readFileSync(getCredentialsLockPath(), 'utf8')).toBe('other-process-owner');
  });

  it('times out with a clear message while another process keeps a fresh lock', async () => {
    fs.writeFileSync(getCredentialsLockPath(), 'other-process-owner');
    const callback = jest.fn(async () => undefined);

    await expect(
      withCredentialsLock(callback, { retryMs: 5, timeoutMs: 50 }),
    ).rejects.toThrow(/Timed out waiting for another mcp-linear process/);
    expect(callback).not.toHaveBeenCalled();
    expect(fs.readFileSync(getCredentialsLockPath(), 'utf8')).toBe('other-process-owner');
  });

  it('reclaims a stale lock and cleans up the reclaimed file', async () => {
    fs.writeFileSync(getCredentialsLockPath(), 'dead-process-owner');
    const longAgo = new Date(Date.now() - 10 * 60_000);
    fs.utimesSync(getCredentialsLockPath(), longAgo, longAgo);

    await withCredentialsLock(async () => undefined, { retryMs: 5 });

    expect(fs.readdirSync(tempDir)).toEqual([]);
  });

  it('waits instead of spinning when the lock path is a dangling symlink', async () => {
    fs.symlinkSync(path.join(tempDir, 'missing-target'), getCredentialsLockPath());

    await expect(
      withCredentialsLock(async () => undefined, { retryMs: 5, timeoutMs: 50 }),
    ).rejects.toThrow(/Timed out/);
  });
});
