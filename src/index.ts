#!/usr/bin/env node

import { LinearClient } from '@linear/sdk';
import { runMCPServer } from './mcp-server.js';

import { CachedLinearService } from './services/cached-linear-service.js';
import { allToolDefinitions } from './tools/definitions/index.js';
import { cacheToolDefinitions } from './tools/definitions/cache-tools.js';
import { registerToolHandlers } from './tools/handlers/index.js';
import { registerCacheHandlers } from './tools/handlers/cache-handlers.js';
import { getLinearApiToken, logInfo, logError } from './utils/config.js';
import pkg from '../package.json' with { type: 'json' }; // Import package.json to access version

/**
 * Main function to run the MCP Linear
 */
async function runServer() {
  try {
    // Log package version
    logInfo(`MCP Linear version: ${pkg.version}`);

    // Get Linear API token
    const linearApiToken = getLinearApiToken();

    if (!linearApiToken) {
      throw new Error(
        'Linear API token not found. Please provide it via --token command line argument or LINEAR_API_TOKEN environment variable.',
      );
    }

    // Cache config from env (opt-out: enabled by default)
    const cacheEnabled = process.env.LINEAR_CACHE_ENABLED !== 'false';
    const cacheMaxSize = parseInt(process.env.LINEAR_CACHE_MAX_SIZE || '500', 10);

    logInfo(`Starting MCP Linear... (cache: ${cacheEnabled ? 'on' : 'off'}, max: ${cacheMaxSize})`);

    // Initialize Linear client and cached service
    const linearClient = new LinearClient({ apiKey: linearApiToken });
    const linearService = new CachedLinearService(linearClient, cacheEnabled, cacheMaxSize);

    // Merge tool definitions: original + cache management tools
    const allTools = [...allToolDefinitions, ...cacheToolDefinitions];

    // Start the MCP server
    const server = await runMCPServer({
      tools: allTools,
      handleInitialize: async () => {
        logInfo('MCP Linear initialized successfully.');
        return {
          tools: allTools,
        };
      },
      handleRequest: async (req: { name: string; args: unknown }) => {
        // Check cache handlers first
        const cacheHandlers = registerCacheHandlers(linearService);
        if (req.name in cacheHandlers) {
          const handler = cacheHandlers[req.name as keyof typeof cacheHandlers];
          return await handler(req.args);
        }

        // Then check regular handlers
        const handlers = registerToolHandlers(linearService);
        const toolName = req.name;

        if (toolName in handlers) {
          // Use a type assertion here since we know the tool name is valid
          const handler = handlers[toolName as keyof typeof handlers];
          return await handler(req.args);
        } else {
          throw new Error(`Unknown tool: ${toolName}`);
        }
      },
    });

    // Set up heartbeat to keep server alive
    setInterval(() => {
      logInfo('MCP Linear is running...');
    }, 60000);

    return server;
  } catch (error) {
    logError('Error starting MCP Linear', error);
    process.exit(1);
  }
}

// Start the server
runServer().catch((error) => {
  logError('Fatal error in MCP Linear', error);
  process.exit(1);
});
