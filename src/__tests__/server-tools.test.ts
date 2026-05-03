import { createServerStatusProvider } from '../server-status.js';
import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('server MCP tools', () => {
  it('registers server status and rate-limit tools', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining(['linear_getRateLimitStatus', 'linear_getServerStatus']),
    );
  });

  it('routes status handlers to the provided runtime status callbacks', async () => {
    const getRateLimitStatus = jest.fn().mockReturnValue({
      blockedUntil: 0,
      isBlocked: false,
      lastRateLimitedAt: null,
      lastDelayMs: null,
      lastOperation: null,
    });
    const getServerStatus = jest.fn().mockReturnValue({
      version: '1.0.13',
      pid: 123,
      uptimeSeconds: 5,
      toolCount: 10,
      resourceCount: 6,
      promptCount: 4,
      rateLimit: getRateLimitStatus(),
    });
    const handlers = registerToolHandlers({} as unknown as LinearService, {
      getRateLimitStatus,
      getServerStatus,
    });

    await expect(handlers.linear_getRateLimitStatus()).resolves.toEqual({
      blockedUntil: 0,
      isBlocked: false,
      lastRateLimitedAt: null,
      lastDelayMs: null,
      lastOperation: null,
    });
    await expect(handlers.linear_getServerStatus()).resolves.toEqual(
      expect.objectContaining({
        version: '1.0.13',
        toolCount: 10,
      }),
    );
  });

  it('creates a runtime snapshot with counts and rate-limit state', () => {
    const getServerStatus = createServerStatusProvider({
      version: '1.0.13',
      toolCount: 80,
      resourceCount: 6,
      promptCount: 4,
      getRateLimitStatus: () => ({
        blockedUntil: 0,
        isBlocked: false,
        lastRateLimitedAt: null,
        lastDelayMs: null,
        lastOperation: null,
      }),
    });

    expect(getServerStatus()).toEqual(
      expect.objectContaining({
        version: '1.0.13',
        toolCount: 80,
        resourceCount: 6,
        promptCount: 4,
        rateLimit: expect.objectContaining({
          isBlocked: false,
        }),
      }),
    );
  });
});
