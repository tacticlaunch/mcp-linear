const TOKEN_ENDPOINT = 'https://api.linear.app/oauth/token';
const REVOKE_ENDPOINT = 'https://api.linear.app/oauth/revoke';
const REQUEST_TIMEOUT_MS = 15_000;

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scopes: string[];
}

export interface AuthorizationCodeExchangeArgs {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  codeVerifier: string;
}

export interface RefreshTokenArgs {
  refreshToken: string;
  clientId: string;
  clientSecret?: string;
}

export interface RevokeTokenArgs {
  token: string;
  tokenTypeHint?: 'access_token' | 'refresh_token';
}

async function postTokenRequest(body: URLSearchParams): Promise<OAuthTokens> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Linear OAuth token request returned invalid JSON (HTTP ${response.status})`);
  }

  if (!response.ok) {
    // Never echo request parameters; they contain the client secret and code.
    throw new Error(`Linear OAuth token request failed (HTTP ${response.status})`);
  }
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('Linear OAuth token response was incomplete');
  }

  const record = payload as Record<string, unknown>;
  const accessToken = record.access_token;
  if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
    throw new Error('Linear OAuth token response was incomplete');
  }

  const tokens: OAuthTokens = {
    accessToken,
    scopes: parseScopes(record.scope),
  };

  if (typeof record.refresh_token === 'string' && record.refresh_token.trim().length > 0) {
    tokens.refreshToken = record.refresh_token;
  }
  if (
    typeof record.expires_in === 'number' &&
    Number.isFinite(record.expires_in) &&
    record.expires_in > 0
  ) {
    tokens.expiresIn = record.expires_in;
  }

  return tokens;
}

function parseScopes(scope: unknown): string[] {
  if (Array.isArray(scope)) {
    return scope.filter((entry): entry is string => typeof entry === 'string');
  }
  if (typeof scope === 'string') {
    return scope.split(/[\s,]+/).filter(Boolean);
  }
  return [];
}

/**
 * Exchange an authorization code (with its PKCE verifier) for tokens.
 */
export function exchangeAuthorizationCode(args: AuthorizationCodeExchangeArgs): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: args.code,
    redirect_uri: args.redirectUri,
    client_id: args.clientId,
    code_verifier: args.codeVerifier,
  });
  if (args.clientSecret) body.set('client_secret', args.clientSecret);
  return postTokenRequest(
    body,
  );
}

/**
 * Refresh an access token. Linear rotates refresh tokens, so the returned
 * refresh token replaces the one that was sent and must be persisted.
 */
export function refreshAccessToken(args: RefreshTokenArgs): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: args.refreshToken,
    client_id: args.clientId,
  });
  if (args.clientSecret) body.set('client_secret', args.clientSecret);
  return postTokenRequest(
    body,
  );
}

/**
 * Best-effort token revocation. Never throws — logout must succeed locally
 * even when the network or the revoke endpoint is unavailable.
 */
export async function revokeToken(args: RevokeTokenArgs): Promise<boolean> {
  const body = new URLSearchParams({ token: args.token });
  if (args.tokenTypeHint) {
    body.set('token_type_hint', args.tokenTypeHint);
  }

  try {
    const response = await fetch(REVOKE_ENDPOINT, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    return response.ok;
  } catch {
    return false;
  }
}
