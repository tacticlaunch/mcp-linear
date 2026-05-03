import type { LinearRateLimitSnapshot } from './utils/linear-rate-limit.js';

type ServerStatusDeps = {
  version: string;
  toolCount: number;
  resourceCount: number;
  promptCount: number;
  getRateLimitStatus: () => LinearRateLimitSnapshot;
};

export function createServerStatusProvider(deps: ServerStatusDeps) {
  const startedAt = Date.now();

  return () => ({
    version: deps.version,
    pid: process.pid,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    toolCount: deps.toolCount,
    resourceCount: deps.resourceCount,
    promptCount: deps.promptCount,
    rateLimit: deps.getRateLimitStatus(),
  });
}
