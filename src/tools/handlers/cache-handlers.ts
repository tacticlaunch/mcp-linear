import { CachedLinearService } from '../../services/cached-linear-service.js';

export function registerCacheHandlers(service: CachedLinearService) {
  return {
    linear_cacheStats: async (_args: unknown) => {
      return service.getCacheStats();
    },

    linear_clearCache: async (_args: unknown) => {
      return service.clearCache();
    },
  };
}
