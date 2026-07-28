import { createRefreshingProvider } from '../auth/refreshing-provider.js';
import type { LinearAuthConfig } from '../utils/config.js';

describe('refreshing client provider', () => {
  it('builds the client once while the token is unchanged', async () => {
    const config: LinearAuthConfig = { type: 'oauth', token: 'token-1' };
    const build = jest.fn((c: LinearAuthConfig) => ({ client: c.token }));

    const provider = createRefreshingProvider({ getConfig: async () => config, build });

    const first = await provider.get();
    const second = await provider.get();

    expect(build).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
    expect(first).toEqual({ client: 'token-1' });
  });

  it('rebuilds the client when the token rotates', async () => {
    let config: LinearAuthConfig = { type: 'oauth', token: 'token-1' };
    const build = jest.fn((c: LinearAuthConfig) => ({ client: c.token }));

    const provider = createRefreshingProvider({ getConfig: async () => config, build });

    const first = await provider.get();
    config = { type: 'oauth', token: 'token-2' };
    const second = await provider.get();

    expect(build).toHaveBeenCalledTimes(2);
    expect(first).toEqual({ client: 'token-1' });
    expect(second).toEqual({ client: 'token-2' });
    expect(second).not.toBe(first);
  });

  it('propagates refresh failures without caching them', async () => {
    let fail = true;
    const build = jest.fn((c: LinearAuthConfig) => ({ client: c.token }));
    const provider = createRefreshingProvider({
      getConfig: async () => {
        if (fail) {
          throw new Error('refresh failed');
        }
        return { type: 'oauth', token: 'token-1' } as LinearAuthConfig;
      },
      build,
    });

    await expect(provider.get()).rejects.toThrow('refresh failed');

    fail = false;
    await expect(provider.get()).resolves.toEqual({ client: 'token-1' });
  });
});
