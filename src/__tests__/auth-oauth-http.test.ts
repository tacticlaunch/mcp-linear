import {
  exchangeAuthorizationCode,
  refreshAccessToken,
  revokeToken,
} from '../auth/oauth-http.js';

function jsonResponse(status: number, payload: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as unknown as Response;
}

describe('OAuth token endpoint client', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('exchangeAuthorizationCode', () => {
    it('posts the authorization code with PKCE verifier and returns normalized tokens', async () => {
      fetchSpy.mockResolvedValueOnce(
        jsonResponse(200, {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'read,write',
        }),
      );

      const result = await exchangeAuthorizationCode({
        code: 'auth-code-1',
        redirectUri: 'http://localhost:8734/callback',
        clientId: 'client-id-1',
        clientSecret: 'client-secret-1',
        codeVerifier: 'verifier-1',
      });

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
        scopes: ['read', 'write'],
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.linear.app/oauth/token',
        expect.objectContaining({
          method: 'POST',
          redirect: 'error',
          signal: expect.any(AbortSignal),
        }),
      );
      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.get('grant_type')).toBe('authorization_code');
      expect(body.get('code')).toBe('auth-code-1');
      expect(body.get('redirect_uri')).toBe('http://localhost:8734/callback');
      expect(body.get('client_id')).toBe('client-id-1');
      expect(body.get('client_secret')).toBe('client-secret-1');
      expect(body.get('code_verifier')).toBe('verifier-1');
    });

    it('uses PKCE without sending or requiring a client secret', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(200, { access_token: 'new-access-token', scope: 'read' }));

      await expect(exchangeAuthorizationCode({
        code: 'auth-code-1',
        redirectUri: 'http://localhost:8734/callback',
        clientId: 'client-id-1',
        codeVerifier: 'verifier-1',
      })).resolves.toMatchObject({ accessToken: 'new-access-token' });

      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.has('client_secret')).toBe(false);
    });

    it('does not embed the client secret or code in error messages', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(400, { error: 'invalid_grant' }));

      await expect(
        exchangeAuthorizationCode({
          code: 'super-secret-code',
          redirectUri: 'http://localhost:8734/callback',
          clientId: 'client-id-1',
          clientSecret: 'super-secret-value',
          codeVerifier: 'verifier-1',
        }),
      ).rejects.toThrow(/HTTP 400/);

      await expect(
        exchangeAuthorizationCode({
          code: 'super-secret-code',
          redirectUri: 'http://localhost:8734/callback',
          clientId: 'client-id-1',
          clientSecret: 'super-secret-value',
          codeVerifier: 'verifier-1',
        }).catch((error: Error) => {
          expect(error.message).not.toContain('super-secret-value');
          expect(error.message).not.toContain('super-secret-code');
          throw error;
        }),
      ).rejects.toThrow();
    });

    it('rejects responses with invalid JSON', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('bad json');
        },
      } as unknown as Response);

      await expect(
        exchangeAuthorizationCode({
          code: 'auth-code-1',
          redirectUri: 'http://localhost:8734/callback',
          clientId: 'client-id-1',
          clientSecret: 'client-secret-1',
          codeVerifier: 'verifier-1',
        }),
      ).rejects.toThrow(/invalid JSON/);
    });

    it('rejects responses missing an access token', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(200, { token_type: 'Bearer' }));

      await expect(
        exchangeAuthorizationCode({
          code: 'auth-code-1',
          redirectUri: 'http://localhost:8734/callback',
          clientId: 'client-id-1',
          clientSecret: 'client-secret-1',
          codeVerifier: 'verifier-1',
        }),
      ).rejects.toThrow(/incomplete/);
    });
  });

  describe('refreshAccessToken', () => {
    it('posts the refresh token and returns the rotated credentials', async () => {
      fetchSpy.mockResolvedValueOnce(
        jsonResponse(200, {
          access_token: 'rotated-access-token',
          refresh_token: 'rotated-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'read write',
        }),
      );

      const result = await refreshAccessToken({
        refreshToken: 'old-refresh-token',
        clientId: 'client-id-1',
        clientSecret: 'client-secret-1',
      });

      expect(result).toEqual({
        accessToken: 'rotated-access-token',
        refreshToken: 'rotated-refresh-token',
        expiresIn: 3600,
        scopes: ['read', 'write'],
      });

      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.get('grant_type')).toBe('refresh_token');
      expect(body.get('refresh_token')).toBe('old-refresh-token');
      expect(body.get('client_id')).toBe('client-id-1');
      expect(body.get('client_secret')).toBe('client-secret-1');
    });

    it('fails with a sanitized error when the refresh is rejected', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(401, { error: 'invalid_grant' }));

      await expect(
        refreshAccessToken({
          refreshToken: 'secret-refresh-token',
          clientId: 'client-id-1',
          clientSecret: 'secret-client-secret',
        }).catch((error: Error) => {
          expect(error.message).not.toContain('secret-refresh-token');
          expect(error.message).not.toContain('secret-client-secret');
          throw error;
        }),
      ).rejects.toThrow(/HTTP 401/);
    });
  });

  describe('revokeToken', () => {
    it('posts the token with a token_type_hint and reports success', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(200, {}));

      await expect(
        revokeToken({ token: 'access-token-1', tokenTypeHint: 'access_token' }),
      ).resolves.toBe(true);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.linear.app/oauth/revoke',
        expect.objectContaining({ method: 'POST', redirect: 'error' }),
      );
      const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
      expect(body.get('token')).toBe('access-token-1');
      expect(body.get('token_type_hint')).toBe('access_token');
    });

    it('reports failure without throwing when revocation is rejected or offline', async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(400, {}));
      await expect(revokeToken({ token: 'access-token-1' })).resolves.toBe(false);

      fetchSpy.mockRejectedValueOnce(new TypeError('fetch failed'));
      await expect(revokeToken({ token: 'access-token-1' })).resolves.toBe(false);
    });
  });
});
