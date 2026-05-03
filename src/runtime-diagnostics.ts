import { logError, logInfo } from './utils/config.js';

export function installRuntimeDiagnostics() {
  process.on('uncaughtException', (error) => {
    logError('Uncaught exception in MCP Linear', error);
  });

  process.on('unhandledRejection', (reason) => {
    logError('Unhandled rejection in MCP Linear', reason);
  });

  process.on('warning', (warning) => {
    logInfo(`Node warning: ${warning.name}: ${warning.message}`);
  });

  process.on('beforeExit', (code) => {
    logInfo(`MCP Linear beforeExit with code ${code}`);
  });

  process.on('exit', (code) => {
    logInfo(`MCP Linear exit with code ${code}`);
  });

  // Log the signal then exit. Without the explicit exit Node treats the
  // registered handler as overriding default termination behavior, which
  // makes the server ignore SIGTERM/SIGINT/SIGHUP and hang in CI when
  // the smoke test or a parent process tries to shut it down.
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
    process.on(signal, () => {
      logInfo(`MCP Linear received ${signal}`);
      process.exit(0);
    });
  }
}
