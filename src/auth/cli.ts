import { openBrowser as defaultOpenBrowser } from './browser.js';
import { startOAuthCallbackServer } from './callback-server.js';
import {
  deleteStoredCredentials,
  getCredentialsPath,
  readStoredCredentials,
  writeStoredCredentials,
} from './credential-store.js';
import { exchangeAuthorizationCode, revokeToken } from './oauth-http.js';
import { generatePkcePair, generateState } from './pkce.js';

/** Fixed default loopback port; register http://localhost:8734/callback on the OAuth app. */
export const DEFAULT_REDIRECT_PORT = 8734;
const CALLBACK_PATH = '/callback';
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_SCOPES = ['read', 'write'];

export interface AuthCliIo {
  /** Writes a human-facing line. Defaults to stderr to keep stdout MCP-safe. */
  print?: (message: string) => void;
  openBrowser?: (url: string) => Promise<boolean>;
}

function parseFlag(args: string[], flag: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      return args[i + 1];
    }
  }
  return undefined;
}

function maskToken(token: string): string {
  return `****${token.slice(-4)}`;
}

const USAGE = [
  'Usage: mcp-linear auth <login|status|logout>',
  '',
  '  login   Sign in to Linear via OAuth (opens your browser)',
  '          --client-id / --client-secret or LINEAR_OAUTH_CLIENT_ID / LINEAR_OAUTH_CLIENT_SECRET',
  '          --scopes read,write (optional)  --redirect-port 8734 (optional)',
  '  status  Show whether stored credentials exist and when they expire',
  '  logout  Revoke the stored access token (best effort) and delete it locally',
].join('\n');

/**
 * Entry point for `mcp-linear auth <subcommand>`. Returns a process exit code.
 * All human-facing output goes through io.print (stderr by default) and never
 * contains secret values.
 */
export async function runAuthCli(args: string[], io: AuthCliIo = {}): Promise<number> {
  // eslint-disable-next-line no-console
  const print = io.print ?? ((message: string) => console.error(message));
  const [subcommand, ...rest] = args;

  switch (subcommand) {
    case 'login':
      return runLogin(rest, print, io.openBrowser ?? defaultOpenBrowser);
    case 'status':
      return runStatus(print);
    case 'logout':
      return runLogout(print);
    default:
      print(USAGE);
      return 1;
  }
}

async function runLogin(
  args: string[],
  print: (message: string) => void,
  openBrowser: (url: string) => Promise<boolean>,
): Promise<number> {
  const clientId = parseFlag(args, '--client-id') ?? process.env.LINEAR_OAUTH_CLIENT_ID;
  const clientSecret = parseFlag(args, '--client-secret') ?? process.env.LINEAR_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    print(
      'Linear OAuth client credentials are required. Pass --client-id and --client-secret, or set LINEAR_OAUTH_CLIENT_ID and LINEAR_OAUTH_CLIENT_SECRET.',
    );
    print(
      `Create an OAuth application at https://linear.app/settings/api/applications/new with redirect URI http://localhost:${DEFAULT_REDIRECT_PORT}${CALLBACK_PATH}.`,
    );
    return 1;
  }

  const portFlag = parseFlag(args, '--redirect-port');
  const port = portFlag !== undefined ? Number(portFlag) : DEFAULT_REDIRECT_PORT;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    print('Invalid --redirect-port value; expected a port number.');
    return 1;
  }

  const scopesFlag = parseFlag(args, '--scopes');
  const requestedScopes = scopesFlag
    ? scopesFlag.split(/[\s,]+/).filter(Boolean)
    : DEFAULT_SCOPES;
  // Linear always expects the read scope.
  const scopes = Array.from(new Set(['read', ...requestedScopes.filter((s) => s !== 'read')]));

  const { verifier, challenge } = generatePkcePair();
  const state = generateState();

  let pending;
  try {
    pending = await startOAuthCallbackServer({
      port,
      expectedState: state,
      timeoutMs: LOGIN_TIMEOUT_MS,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    print(`Could not start the local callback server on port ${port} (${reason}).`);
    print('Pass --redirect-port to use a different port (it must match a registered redirect URI).');
    return 1;
  }

  const redirectUri = `http://localhost:${pending.port}${CALLBACK_PATH}`;
  const authorizationUrl = new URL('https://linear.app/oauth/authorize');
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('scope', scopes.join(','));
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('code_challenge', challenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');

  print('Opening your browser to authorize MCP Linear with Linear...');
  const opened = await openBrowser(authorizationUrl.toString());
  if (!opened) {
    print('Could not open a browser automatically.');
  }
  print(`If the browser did not open, visit:\n\n  ${authorizationUrl.toString()}\n`);
  print(`Waiting for the authorization callback on ${redirectUri} ...`);

  let code: string;
  try {
    ({ code } = await pending.callback);
  } catch (error) {
    await pending.cancel();
    const reason = error instanceof Error ? error.message : 'unknown error';
    print(`Login failed: ${reason}`);
    return 1;
  }

  print('Authorization received. Exchanging it for tokens...');

  try {
    const tokens = await exchangeAuthorizationCode({
      code,
      redirectUri,
      clientId,
      clientSecret,
      codeVerifier: verifier,
    });

    writeStoredCredentials({
      clientId,
      clientSecret,
      accessToken: tokens.accessToken,
      ...(tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {}),
      ...(typeof tokens.expiresIn === 'number'
        ? { expiresAt: Date.now() + tokens.expiresIn * 1000 }
        : {}),
      scopes: tokens.scopes.length > 0 ? tokens.scopes : scopes,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    print(`Login failed: ${reason}`);
    return 1;
  }

  print(`Login successful. Credentials saved to ${getCredentialsPath()}.`);
  print(
    'The MCP server will use them automatically when no --token flag or LINEAR_API_TOKEN/LINEAR_API_KEY variable is set.',
  );
  return 0;
}

function runStatus(print: (message: string) => void): number {
  const credentials = readStoredCredentials();
  if (!credentials) {
    print('No stored credentials. Run `mcp-linear auth login` to sign in.');
    return 1;
  }

  print('Logged in with stored Linear OAuth credentials.');
  print(`  Credentials file: ${getCredentialsPath()}`);
  print(`  Client ID: ${credentials.clientId}`);
  print(`  Scopes: ${credentials.scopes.join(', ')}`);
  print(`  Access token: ${maskToken(credentials.accessToken)}`);
  if (typeof credentials.expiresAt === 'number') {
    const expired = credentials.expiresAt <= Date.now();
    print(`  Expires: ${new Date(credentials.expiresAt).toISOString()} (${expired ? 'expired' : 'valid'})`);
  } else {
    print('  Expires: unknown');
  }
  print(`  Refresh token: ${credentials.refreshToken ? 'stored' : 'none'}`);
  return 0;
}

async function runLogout(print: (message: string) => void): Promise<number> {
  const credentials = readStoredCredentials();
  if (!credentials) {
    // A corrupt or partial file may still exist; remove it regardless.
    deleteStoredCredentials();
    print('No stored credentials to remove.');
    return 0;
  }

  const revoked = await revokeToken({
    token: credentials.accessToken,
    tokenTypeHint: 'access_token',
  });
  if (!revoked) {
    print('The access token could not be revoked (offline or already invalid); removing local credentials anyway.');
  }

  deleteStoredCredentials();
  print(`Logged out. Removed ${getCredentialsPath()}.`);
  return 0;
}
