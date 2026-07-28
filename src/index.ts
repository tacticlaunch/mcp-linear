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
import { logInfo, logError, isDebugLoggingEnabled, type LinearAuthConfig } from './utils/config.js';
import { runAuthCli } from './auth/cli.js';
import { createRefreshingProvider } from './auth/refreshing-provider.js';
import { resolveLinearAuth } from './auth/resolve.js';
import pkg from '../package.json' with { type: 'json' }; // Import package.json to access version

/**
 * Main function to run the MCP Linear
 */
async function runServer() {
  try {
    // Log package version
    logInfo(`MCP Linear version: ${pkg.version}`);

    // Resolve the configured Linear authentication mode. Explicit CLI/env
    // credentials win; otherwise credentials stored by `mcp-linear auth login`
    // are used (and refreshed automatically when they expire).
    const resolvedAuth = resolveLinearAuth();

    if (!resolvedAuth) {
      throw new Error(
        'Linear credentials not found. Provide an API token via --token, LINEAR_API_TOKEN, or LINEAR_API_KEY, or sign in with `mcp-linear auth login`.',
      );
    }

    logInfo(`Starting MCP Linear...`);

    // Build the Linear client/service pair, rebuilding transparently when a
    // stored-credential refresh rotates the access token mid-session.
    const buildServices = (auth: LinearAuthConfig) => {
      const linearClient = new LinearClient(
        auth.type === 'oauth' ? { accessToken: auth.token } : { apiKey: auth.token },
      );
      installLinearRateLimitHandling(linearClient);
      return { linearClient, linearService: new LinearService(linearClient) };
    };
    const serviceProvider = createRefreshingProvider({
      getConfig: () => resolvedAuth.getConfig(),
      build: buildServices,
    });

    // Resolve at startup so an expired stored token is refreshed (or fails
    // with a clear re-login hint) before the server accepts requests.
    let current = await serviceProvider.get();
    const ensureFreshServices = async () => {
      current = await serviceProvider.get();
      return current;
    };
    const getRateLimitStatus = () => getLinearRateLimitSnapshot(current.linearClient);
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
      readResource: async (uri: string) => {
        const { linearService } = await ensureFreshServices();
        return readLinearResource(uri, {
          linearService,
          getRateLimitSnapshot: getRateLimitStatus,
        });
      },
      listPrompts: async () => getLinearPromptDefinitions(),
      getPrompt: async (name: string, args?: Record<string, string>) => getLinearPrompt(name, args),
      handleRequest: async (req: { name: string; args: unknown }) => {
        const { linearService } = await ensureFreshServices();
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

const cliArgs = process.argv.slice(2);

if (cliArgs[0] === 'auth') {
  // `mcp-linear auth <login|status|logout>` runs the auth CLI and exits
  // without starting the MCP server.
  runAuthCli(cliArgs.slice(1))
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
      logError('Auth command failed', error);
      process.exit(1);
    });
} else {
  // Start the server
  installRuntimeDiagnostics();
  runServer().catch((error) => {
    logError('Fatal error in MCP Linear', error);
    process.exit(1);
  });
}
