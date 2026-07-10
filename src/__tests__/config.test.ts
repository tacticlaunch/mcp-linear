import { getLinearApiToken, getLinearAuthConfig } from '../utils/config.js';

describe('getLinearApiToken', () => {
  const originalArgv = process.argv;
  const originalEnv = process.env;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.argv = ['node', 'mcp-linear'];
    process.env = { ...originalEnv };
    delete process.env.LINEAR_API_TOKEN;
    delete process.env.LINEAR_API_KEY;
    delete process.env.LINEAR_OAUTH_ACCESS_TOKEN;
    delete process.env.LINEAR_WEBHOOK_SECRET;
    delete process.env.MCP_LINEAR_DEBUG;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.argv = originalArgv;
    process.env = originalEnv;
  });

  it('does not log LINEAR environment variable keys when debug logging is disabled', () => {
    process.env.LINEAR_WEBHOOK_SECRET = 'present-but-not-a-token';

    const token = getLinearApiToken();

    expect(token).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith('API token not found in command line args or environment variables');
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      'Environment variables:',
      expect.arrayContaining(['LINEAR_WEBHOOK_SECRET']),
    );
  });

  it('only logs LINEAR environment variable keys when explicit debug logging is enabled', () => {
    process.env.LINEAR_WEBHOOK_SECRET = 'present-but-not-a-token';
    process.env.MCP_LINEAR_DEBUG = 'true';

    const token = getLinearApiToken();

    expect(token).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Environment variables:',
      expect.arrayContaining(['LINEAR_WEBHOOK_SECRET']),
    );
  });

  it('selects an OAuth access token explicitly so managed OAuth application tools have an OAuth caller identity', () => {
    process.env.LINEAR_API_TOKEN = 'api-token';
    process.env.LINEAR_OAUTH_ACCESS_TOKEN = 'oauth-access-token';

    expect(getLinearAuthConfig()).toEqual({ type: 'oauth', token: 'oauth-access-token' });
  });

  it('supports an explicit OAuth CLI token and otherwise preserves API-key authentication', () => {
    process.argv = ['node', 'mcp-linear', '--oauth-token', 'oauth-cli-token', '--token', 'api-cli-token'];
    expect(getLinearAuthConfig()).toEqual({ type: 'oauth', token: 'oauth-cli-token' });

    process.argv = ['node', 'mcp-linear', '--token', 'api-cli-token'];
    expect(getLinearAuthConfig()).toEqual({ type: 'apiKey', token: 'api-cli-token' });

    process.env.LINEAR_OAUTH_ACCESS_TOKEN = 'oauth-env-token';
    expect(getLinearAuthConfig()).toEqual({ type: 'apiKey', token: 'api-cli-token' });
  });

  it('does not log credential values when no supported credential is configured', () => {
    expect(getLinearAuthConfig()).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('token='));
  });
});
