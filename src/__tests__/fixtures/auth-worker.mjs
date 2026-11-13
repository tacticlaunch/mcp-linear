import { withCredentialsLock, writeStoredCredentials } from '../../auth/credential-store.ts';
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
    send({ event: 'started' });
    await withCredentialsLock(async () => writeStoredCredentials({ clientId: 'new-client', accessToken: 'new-access', refreshToken: 'new-refresh', expiresAt: Date.now() + 3600000, scopes: [] }), { retryMs: 10 });
    send({ event: 'result' });
  } else if (action === 'acquire') {
    await withCredentialsLock(async () => send({ event: 'result' }), { retryMs: 10, timeoutMs: 3000 });
  }
  process.disconnect();
} catch (error) {
  send({ event: 'error', message: error.message });
  process.exitCode = 1;
  process.disconnect();
}
