import http from 'node:http';
import { withCredentialsLock } from '../../auth/credential-store.ts';
import { createStoredCredentialAuth } from '../../auth/managed-auth.ts';
import { runAuthCli } from '../../auth/cli.ts';

const waitForContinue = () => new Promise((resolve) => process.once('message', resolve));
const send = (message) => process.send(message);
try {
  const action = process.argv[2];
  if (action === 'hold') {
    await withCredentialsLock(async () => {
      send({ event: 'held' });
      await waitForContinue();
    });
  } else if (action === 'refresh') {
    globalThis.fetch = async () => {
      send({ event: 'request' });
      await waitForContinue();
      return new Response(JSON.stringify({ access_token: 'rotated-access', refresh_token: 'rotated-refresh', expires_in: 3600 }), { status: 200 });
    };
    const auth = createStoredCredentialAuth({ lockRetryMs: 10 });
    send({ event: 'started' });
    const result = await auth.getConfig();
    send({ event: 'result', token: result.token });
  } else if (action === 'logout') {
    globalThis.fetch = async () => new Response('{}', { status: 200 });
    send({ event: 'started' });
    const code = await runAuthCli(['logout'], { print: () => {} });
    send({ event: 'result', code });
  } else if (action === 'login') {
    globalThis.fetch = async () => {
      send({ event: 'started' });
      return new Response(JSON.stringify({ access_token: 'new-access', refresh_token: 'new-refresh', expires_in: 3600, scope: 'read' }), { status: 200 });
    };
    const code = await runAuthCli(['login', '--client-id', 'new-client', '--redirect-port', '0'], {
      print: () => {},
      openBrowser: async (url) => {
        const authorization = new URL(url);
        const callback = new URL(authorization.searchParams.get('redirect_uri'));
        callback.hostname = '127.0.0.1';
        callback.searchParams.set('code', 'test-authorization-code');
        callback.searchParams.set('state', authorization.searchParams.get('state'));
        await new Promise((resolve, reject) => {
          http.get(callback, { agent: false }, (response) => {
            response.resume();
            response.on('end', resolve);
          }).on('error', reject);
        });
        return true;
      },
    });
    send({ event: 'result', code });
  } else if (action === 'acquire') {
    send({ event: 'started' });
    await withCredentialsLock(async () => send({ event: 'result' }), { retryMs: 10, timeoutMs: 3000 });
  }
  process.disconnect();
} catch (error) {
  send({ event: 'error', message: error.message });
  process.exitCode = 1;
  process.disconnect();
}
