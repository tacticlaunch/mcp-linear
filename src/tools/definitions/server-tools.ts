import { MCPToolDefinition } from '../../types.js';

export const getRateLimitStatusToolDefinition: MCPToolDefinition = {
  name: 'linear_getRateLimitStatus',
  description: 'Get the shared MCP-side Linear rate-limit cooldown and retry snapshot',
  input_schema: {
    type: 'object',
    properties: {},
  },
  output_schema: {
    type: 'object',
    properties: {
      blockedUntil: { type: 'number' },
      isBlocked: { type: 'boolean' },
      lastRateLimitedAt: { type: ['number', 'null'] },
      lastDelayMs: { type: ['number', 'null'] },
      lastOperation: { type: ['string', 'null'] },
    },
  },
};

export const getServerStatusToolDefinition: MCPToolDefinition = {
  name: 'linear_getServerStatus',
  description: 'Get MCP Linear server runtime status, counts, and current rate-limit snapshot',
  input_schema: {
    type: 'object',
    properties: {},
  },
  output_schema: {
    type: 'object',
    properties: {
      version: { type: 'string' },
      pid: { type: 'number' },
      uptimeSeconds: { type: 'number' },
      toolCount: { type: 'number' },
      resourceCount: { type: 'number' },
      promptCount: { type: 'number' },
      rateLimit: {
        type: 'object',
        properties: {
          blockedUntil: { type: 'number' },
          isBlocked: { type: 'boolean' },
          lastRateLimitedAt: { type: ['number', 'null'] },
          lastDelayMs: { type: ['number', 'null'] },
          lastOperation: { type: ['string', 'null'] },
        },
      },
    },
  },
};
