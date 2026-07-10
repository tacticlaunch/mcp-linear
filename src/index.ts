#!/usr/bin/env node

import { LinearClient } from '@linear/sdk';
import { runMCPServer } from './mcp-server.js';

import { getLinearPrompt, getLinearPromptDefinitions } from './mcp-prompts.js';
import { getLinearResourceDefinitions, readLinearResource } from './mcp-resources.js';
import { installRuntimeDiagnostics } from './runtime-diagnostics.js';
import { createServerStatusProvider } from './server-status.js';
import { LinearService } from './services/linear-service.js';
import { allToolDefinitions } from './tools/definitions/index.js';
import { registerToolHandlers } from './tools/handlers/index.js';
import { getLinearRateLimitSnapshot, installLinearRateLimitHandling } from './utils/linear-rate-limit.js';
import { getLinearAuthConfig, logInfo, logError, isDebugLoggingEnabled } from './utils/config.js';
import pkg from '../package.json' with { type: 'json' }; // Import package.json to access version

/**
 * Main function to run the MCP Linear
 */
async function runServer() {
  try {
    // Log package version
    logInfo(`MCP Linear version: ${pkg.version}`);

    // Resolve the configured Linear authentication mode.
    const linearAuth = getLinearAuthConfig();

    if (!linearAuth) {
      throw new Error(
        'Linear credentials not found. Provide an OAuth access token via --oauth-token or LINEAR_OAUTH_ACCESS_TOKEN, or an API key via --token, LINEAR_API_TOKEN, or LINEAR_API_KEY.',
      );
    }

    logInfo(`Starting MCP Linear...`);

    // Initialize Linear client and service
    const linearClient = new LinearClient(
      linearAuth.type === 'oauth'
        ? { accessToken: linearAuth.token }
        : { apiKey: linearAuth.token },
    );
    installLinearRateLimitHandling(linearClient);
    const linearService = new LinearService(linearClient);
    const getRateLimitStatus = () => getLinearRateLimitSnapshot(linearClient);
    const getServerStatus = createServerStatusProvider({
      version: pkg.version,
      toolCount: allToolDefinitions.length,
      resourceCount: getLinearResourceDefinitions().length,
      promptCount: getLinearPromptDefinitions().length,
      getRateLimitStatus,
    });

    // Start the MCP server
    const server = await runMCPServer({
      tools: allToolDefinitions,
      handleInitialize: async () => {
        logInfo('MCP Linear initialized successfully.');
        return {
          tools: allToolDefinitions,
        };
      },
      listResources: async () => getLinearResourceDefinitions(),
      readResource: async (uri: string) =>
        readLinearResource(uri, {
          linearService,
          getRateLimitSnapshot: getRateLimitStatus,
        }),
      listPrompts: async () => getLinearPromptDefinitions(),
      getPrompt: async (name: string, args?: Record<string, string>) => getLinearPrompt(name, args),
      handleRequest: async (req: { name: string; args: unknown }) => {
        const handlers = registerToolHandlers(linearService, {
          getRateLimitStatus,
          getServerStatus,
        });
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

    if (isDebugLoggingEnabled()) {
      setInterval(() => {
        logInfo('MCP Linear is running...');
      }, 60000);
    }

    return server;
  } catch (error) {
    logError('Error starting MCP Linear', error);
    process.exit(1);
  }
}

// Start the server
installRuntimeDiagnostics();
runServer().catch((error) => {
  logError('Fatal error in MCP Linear', error);
  process.exit(1);
});
