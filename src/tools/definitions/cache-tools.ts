import { MCPToolDefinition } from '../../types.js';

export const cacheToolDefinitions: MCPToolDefinition[] = [
  {
    name: 'linear_cacheStats',
    description:
      'Get cache statistics including hit rate, size, and entries. Use this to monitor cache effectiveness and debug rate limiting issues.',
    input_schema: {
      type: 'object',
      properties: {},
    },
    output_schema: {
      type: 'object',
      properties: {
        hits: { type: 'number' },
        misses: { type: 'number' },
        size: { type: 'number' },
        maxSize: { type: 'number' },
        hitRate: { type: 'string' },
        entries: { type: 'array' },
      },
    },
  },
  {
    name: 'linear_clearCache',
    description:
      'Clear the entire Linear API cache. Use this when you need fresh data immediately or suspect stale cache entries.',
    input_schema: {
      type: 'object',
      properties: {},
    },
    output_schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  },
];
