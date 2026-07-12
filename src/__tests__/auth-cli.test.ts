import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

import { runAuthCli } from '../auth/cli.js';
import {
  getCredentialsPath,
  readStoredCredentials,
  writeStoredCredentials,
  type StoredCredentials,
} from '../auth/credential-store.js';

const storedCredentials: StoredCredentials = {
  clientId: 'client-id-1',
  clientSecret: 'stored-client-secret',
  accessToken: 'stored-access-token-abcd',
  refreshToken: 'stored-refresh-token',
  expiresAt: Date.now() + 3_600_000,
  scopes: ['read', 'write'],
};

function jsonResponse(status: number, payload: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as unknown as Response;
}

function httpGet(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    http
      // agent: false avoids a lingering keep-alive socket (Jest open handle).
      .get(url, { agent: false }, (res) => {
        res.resume();
        res.on('end', () => resolve(res.statusCode ?? 0));
      })
      .on('error', reject);
  });
}

describe('auth CLI', () => {
  const originalEnv = process.env;
  let tempDir: string;
  let printed: string[];
  let print: (message: string) => void;
  let fetchSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.LINEAR_OAUTH_CLIENT_ID;
    delete process.env.LINEAR_OAUTH_CLIENT_SECRET;
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-auth-'));
    process.env.MCP_LINEAR_CONFIG_DIR = tempDir;
    printed = [];
    print = (message: string) => printed.push(message);
    fetchSpy = jest.spyOn(global, 'fetch');
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  function expectNoSecretsPrinted(secrets: string[]) {
    const allOutput = [
      ...printed,
      ...consoleErrorSpy.mock.calls.map((call) => call.map(String).join(' ')),
    ].join('\n');
    for (const secret of secrets) {
      expect(allOutput).not.toContain(secret);
    }
  }

  it('rejects unknown subcommands with usage guidance', async () => {
    const exitCode = await runAuthCli(['frobnicate'], { print });

    expect(exitCode).toBe(1);
    expect(printed.join('\n')).toMatch(/login|status|logout/);
  });

  describe('login', () => {
    it('requires client credentials and explains how to supply them', async () => {
      const exitCode = await runAuthCli(['login'], { print });

      expect(exitCode).toBe(1);
      expect(printed.join('\n')).toContain('--client-id');
      expect(printed.join('\n')).toContain('LINEAR_OAUTH_CLIENT_ID');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('runs the full PKCE flow and stores the resulting tokens', async () => {
      fetchSpy.mockResolvedValueOnce(
        jsonResponse(200, {
          access_token: 'fresh-access-token',
          refresh_token: 'fresh-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'read,write',
        }),
      );

      const openBrowser = jest.fn(async (url: string) => {
        const authorizeUrl = new URL(url);
        expect(authorizeUrl.origin).toBe('https://linear.app');
        expect(authorizeUrl.pathname).toBe('/oauth/authorize');
        expect(authorizeUrl.searchParams.get('response_type')).toBe('code');
        expect(authorizeUrl.searchParams.get('client_id')).toBe('client-id-1');
        expect(authorizeUrl.searchParams.get('scope')).toBe('read,write');
        expect(authorizeUrl.searchParams.get('code_challenge_method')).toBe('S256');
        expect(authorizeUrl.searchParams.get('code_challenge')).toBeTruthy();

        const state = authorizeUrl.searchParams.get('state');
        expect(state).toBeTruthy();
        const redirectUri = new URL(authorizeUrl.searchParams.get('redirect_uri')!);
        expect(redirectUri.pathname).toBe('/callback');

        // Simulate the browser redirect back to the loopback server.
        void httpGet(
          `http://127.0.0.1:${redirectUri.port}/callback?code=auth-code-1&state=${state}`,
        );
        return true;
      });

      const exitCode = await runAuthCli(
        [
          'login',
          '--client-id',
          'client-id-1',
          '--client-secret',
          'login-client-secret',
          '--redirect-port',
          '0',
        ],
        { print, openBrowser },
      );

      expect(exitCode).toBe(0);
      expect(openBrowser).toHaveBeenCalledTimes(1);

      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.get('grant_type')).toBe('authorization_code');
      expect(body.get('code')).toBe('auth-code-1');
      expect(body.get('code_verifier')).toBeTruthy();

      const stored = readStoredCredentials();
      expect(stored).toMatchObject({
        clientId: 'client-id-1',
        clientSecret: 'login-client-secret',
        accessToken: 'fresh-access-token',
        refreshToken: 'fresh-refresh-token',
        scopes: ['read', 'write'],
      });
      expect(stored?.expiresAt).toBeGreaterThan(Date.now());

      expectNoSecretsPrinted([
        'login-client-secret',
        'fresh-access-token',
        'fresh-refresh-token',
        'auth-code-1',
      ]);
    });

    it('accepts client credentials from the environment', async () => {
      process.env.LINEAR_OAUTH_CLIENT_ID = 'env-client-id';
      process.env.LINEAR_OAUTH_CLIENT_SECRET = 'env-client-secret';
      fetchSpy.mockResolvedValueOnce(
        jsonResponse(200, {
          access_token: 'fresh-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'read',
        }),
      );

      const openBrowser = jest.fn(async (url: string) => {
        const authorizeUrl = new URL(url);
        expect(authorizeUrl.searchParams.get('client_id')).toBe('env-client-id');
        const state = authorizeUrl.searchParams.get('state');
        const redirectUri = new URL(authorizeUrl.searchParams.get('redirect_uri')!);
        void httpGet(
          `http://127.0.0.1:${redirectUri.port}/callback?code=auth-code-2&state=${state}`,
        );
        return true;
      });

      const exitCode = await runAuthCli(['login', '--redirect-port', '0'], {
        print,
        openBrowser,
      });

      expect(exitCode).toBe(0);
      expect(readStoredCredentials()?.clientId).toBe('env-client-id');
    });
  });

  describe('status', () => {
    it('reports when no credentials are stored', async () => {
      const exitCode = await runAuthCli(['status'], { print });

      expect(exitCode).toBe(1);
      expect(printed.join('\n')).toMatch(/no stored credentials/i);
    });

    it('prints scopes, expiry, and only the token suffix', async () => {
      writeStoredCredentials(storedCredentials);

      const exitCode = await runAuthCli(['status'], { print });

      expect(exitCode).toBe(0);
      const output = printed.join('\n');
      expect(output).toContain('read, write');
      expect(output).toContain(new Date(storedCredentials.expiresAt!).toISOString());
      expect(output).toContain('abcd');
      expectNoSecretsPrinted([
        storedCredentials.accessToken,
        storedCredentials.clientSecret,
        storedCredentials.refreshToken!,
      ]);
    });
  });

  describe('logout', () => {
    it('succeeds quietly when no credentials are stored', async () => {
      const exitCode = await runAuthCli(['logout'], { print });

      expect(exitCode).toBe(0);
      expect(printed.join('\n')).toMatch(/no stored credentials/i);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('revokes the access token and deletes the credentials file', async () => {
      writeStoredCredentials(storedCredentials);
      fetchSpy.mockResolvedValueOnce(jsonResponse(200, {}));

      const exitCode = await runAuthCli(['logout'], { print });

      expect(exitCode).toBe(0);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.linear.app/oauth/revoke',
        expect.objectContaining({ method: 'POST' }),
      );
      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.get('token')).toBe(storedCredentials.accessToken);
      expect(body.get('token_type_hint')).toBe('access_token');
      expect(fs.existsSync(getCredentialsPath())).toBe(false);
    });

    it('still deletes local credentials when revocation fails offline', async () => {
      writeStoredCredentials(storedCredentials);
      fetchSpy.mockRejectedValueOnce(new TypeError('fetch failed'));

      const exitCode = await runAuthCli(['logout'], { print });

      expect(exitCode).toBe(0);
      expect(fs.existsSync(getCredentialsPath())).toBe(false);
      expect(printed.join('\n')).toMatch(/could not be revoked|revocation failed/i);
    });
  });
});
