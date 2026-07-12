import http from 'node:http';
import type { AddressInfo } from 'node:net';

export interface CallbackServerOptions {
  port: number;
  expectedState: string;
  timeoutMs: number;
}

export interface PendingCallback {
  /** The actual bound port (useful when options.port is 0). */
  port: number;
  /** Resolves with the authorization code, or rejects on mismatch/timeout. */
  callback: Promise<{ code: string }>;
  /** Stop waiting; resolves once the port is released. */
  cancel: () => Promise<void>;
}

const SUCCESS_HTML = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>MCP Linear</title></head>
  <body style="font-family: system-ui, sans-serif; text-align: center; padding-top: 4rem;">
    <h1>Login complete</h1>
    <p>MCP Linear received the authorization response. You can close this tab.</p>
  </body>
</html>
`;

const FAILURE_HTML = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>MCP Linear</title></head>
  <body style="font-family: system-ui, sans-serif; text-align: center; padding-top: 4rem;">
    <h1>Login failed</h1>
    <p>MCP Linear could not accept this authorization response. Return to the terminal for details.</p>
  </body>
</html>
`;

/**
 * Start a loopback HTTP server that waits for a single OAuth redirect at
 * /callback, validates the state parameter, and hands back the authorization
 * code. The server always shuts down after the first callback, a timeout, or
 * cancellation.
 */
export function startOAuthCallbackServer(options: CallbackServerOptions): Promise<PendingCallback> {
  return new Promise((resolveStart, rejectStart) => {
    let settled = false;
    let resolveCallback: (value: { code: string }) => void;
    let rejectCallback: (reason: Error) => void;

    const callback = new Promise<{ code: string }>((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
    });

    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');

      if (url.pathname !== '/callback') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      const finish = (statusCode: number, html: string, outcome: () => void) => {
        res.writeHead(statusCode, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        res.end(html);
        settle(outcome);
      };

      const errorParam = url.searchParams.get('error');
      if (errorParam) {
        // The error code comes from Linear's redirect and contains no secrets.
        finish(400, FAILURE_HTML, () =>
          rejectCallback(new Error(`Linear authorization was not granted (${errorParam})`)),
        );
        return;
      }

      const state = url.searchParams.get('state');
      if (state !== options.expectedState) {
        finish(400, FAILURE_HTML, () =>
          rejectCallback(new Error('OAuth callback state did not match; rejecting the response')),
        );
        return;
      }

      const code = url.searchParams.get('code');
      if (!code) {
        finish(400, FAILURE_HTML, () =>
          rejectCallback(new Error('OAuth callback did not include an authorization code')),
        );
        return;
      }

      finish(200, SUCCESS_HTML, () => resolveCallback({ code }));
    });

    const timeout = setTimeout(() => {
      settle(() =>
        rejectCallback(
          new Error(`Login timed out after ${Math.round(options.timeoutMs / 1000)}s waiting for the browser callback`),
        ),
      );
    }, options.timeoutMs);
    timeout.unref();

    let closePromise: Promise<void> | undefined;

    function settle(outcome: () => void): Promise<void> {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        // Stop accepting connections immediately. The in-flight response (if
        // any) has already been flushed by res.end, so only idle keep-alive
        // sockets remain to be torn down.
        closePromise = new Promise((resolveClose) => {
          server.close(() => resolveClose());
        });
        server.closeIdleConnections();
        outcome();
      }
      return closePromise ?? Promise.resolve();
    }

    server.on('error', (error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        rejectStart(error);
      }
    });

    server.listen(options.port, '127.0.0.1', () => {
      const address = server.address() as AddressInfo;
      resolveStart({
        port: address.port,
        callback,
        cancel: () => settle(() => rejectCallback(new Error('Login was cancelled'))),
      });
    });
  });
}
