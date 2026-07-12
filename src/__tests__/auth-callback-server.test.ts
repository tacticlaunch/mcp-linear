import { startOAuthCallbackServer } from '../auth/callback-server.js';

describe('OAuth loopback callback server', () => {
  it('resolves with the authorization code when state matches', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 5_000,
    });

    const response = await fetch(
      `http://127.0.0.1:${pending.port}/callback?code=auth-code-1&state=expected-state`,
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('close this tab');
    await expect(pending.callback).resolves.toEqual({ code: 'auth-code-1' });
  });

  it('rejects and returns HTTP 400 on a state mismatch', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 5_000,
    });
    const rejection = expect(pending.callback).rejects.toThrow(/state/i);

    const response = await fetch(
      `http://127.0.0.1:${pending.port}/callback?code=auth-code-1&state=attacker-state`,
    );

    expect(response.status).toBe(400);
    await rejection;
  });

  it('rejects when the provider redirects back with an error', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 5_000,
    });
    const rejection = expect(pending.callback).rejects.toThrow(/access_denied/);

    const response = await fetch(
      `http://127.0.0.1:${pending.port}/callback?error=access_denied&state=expected-state`,
    );

    expect(response.status).toBe(400);
    await rejection;
  });

  it('ignores unrelated paths while continuing to wait', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 5_000,
    });

    const stray = await fetch(`http://127.0.0.1:${pending.port}/favicon.ico`);
    expect(stray.status).toBe(404);

    const response = await fetch(
      `http://127.0.0.1:${pending.port}/callback?code=auth-code-2&state=expected-state`,
    );
    expect(response.status).toBe(200);
    await expect(pending.callback).resolves.toEqual({ code: 'auth-code-2' });
  });

  it('times out with a clean error when no callback arrives', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 50,
    });

    await expect(pending.callback).rejects.toThrow(/timed out/i);
  });

  it('can be cancelled, releasing the port', async () => {
    const pending = await startOAuthCallbackServer({
      port: 0,
      expectedState: 'expected-state',
      timeoutMs: 5_000,
    });

    const cancelled = pending.cancel();
    await expect(pending.callback).rejects.toThrow(/cancelled/i);
    await cancelled;

    await expect(
      fetch(`http://127.0.0.1:${pending.port}/callback?code=x&state=expected-state`),
    ).rejects.toThrow();
  });
});
