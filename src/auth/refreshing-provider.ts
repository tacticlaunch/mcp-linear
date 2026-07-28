import type { LinearAuthConfig } from '../utils/config.js';

export interface RefreshingProviderOptions<T> {
  /** Resolve the current auth config (may refresh stored tokens). */
  getConfig: () => Promise<LinearAuthConfig>;
  /** Build the client/service bundle for a config. */
  build: (config: LinearAuthConfig) => T;
}

export interface RefreshingProvider<T> {
  get(): Promise<T>;
}

/**
 * Cache a built client for as long as the underlying token is unchanged, and
 * transparently rebuild it when a stored-credential refresh rotates the
 * token mid-session. Explicit credentials never change, so the first build
 * is reused for the lifetime of the process.
 */
export function createRefreshingProvider<T>(
  options: RefreshingProviderOptions<T>,
): RefreshingProvider<T> {
  let cachedToken: string | undefined;
  let cached: T | undefined;

  return {
    async get(): Promise<T> {
      const config = await options.getConfig();
      if (cached === undefined || config.token !== cachedToken) {
        cached = options.build(config);
        cachedToken = config.token;
      }
      return cached;
    },
  };
}
