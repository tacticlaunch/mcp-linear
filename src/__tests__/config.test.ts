import { getExplicitLinearAuthConfig, getLinearApiToken } from '../utils/config.js';

describe('getLinearApiToken', () => {
  const originalArgv = process.argv;
  const originalEnv = process.env;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.argv = ['node', 'mcp-linear'];
    process.env = { ...originalEnv };
    delete process.env.LINEAR_API_TOKEN;
    delete process.env.LINEAR_API_KEY;
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

  describe('getExplicitLinearAuthConfig', () => {
    it('prefers an explicit --token CLI flag over environment variables', () => {
      process.argv = ['node', 'mcp-linear', '--token', 'cli-token'];
      process.env.LINEAR_API_TOKEN = 'env-token';

      expect(getExplicitLinearAuthConfig()).toEqual({ type: 'apiKey', token: 'cli-token' });
    });

    it('accepts LINEAR_API_TOKEN and falls back to LINEAR_API_KEY', () => {
      process.env.LINEAR_API_TOKEN = 'env-token';
      expect(getExplicitLinearAuthConfig()).toEqual({ type: 'apiKey', token: 'env-token' });

      delete process.env.LINEAR_API_TOKEN;
      process.env.LINEAR_API_KEY = 'env-key';
      expect(getExplicitLinearAuthConfig()).toEqual({ type: 'apiKey', token: 'env-key' });
    });

    it('returns undefined without logging when no explicit credential is configured, so callers can fall back to stored credentials', () => {
      expect(getExplicitLinearAuthConfig()).toBeUndefined();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
