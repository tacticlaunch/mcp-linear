import { installLinearRateLimitHandling } from '../utils/linear-rate-limit.js';

describe('installLinearRateLimitHandling', () => {
  it('retries request calls when Linear returns a rate-limited error', async () => {
    const sleep = jest.fn().mockResolvedValue(undefined);
    const log = jest.fn();
    const rateLimitedError = {
      response: {
        status: 400,
        headers: new Headers({ 'X-RateLimit-Requests-Reset': '1025' }),
        errors: [{ extensions: { code: 'RATELIMITED' } }],
      },
    };
    const request = jest
      .fn()
      .mockRejectedValueOnce(rateLimitedError)
      .mockResolvedValueOnce({ ok: true });
    const rawRequest = jest.fn();
    const client: any = { client: { request, rawRequest } };

    installLinearRateLimitHandling(client, {
      now: () => 1000,
      sleep,
      log,
    });

    await expect(client.client.request('query Test { viewer { id } }')).resolves.toEqual({ ok: true });
    expect(request).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(25);
    expect(log).toHaveBeenCalledWith(
      'Linear API rate limited during request; retrying in 25ms.',
    );
  });

  it('retries rawRequest calls when Linear returns a rate-limited error', async () => {
    const sleep = jest.fn().mockResolvedValue(undefined);
    const rawRequest = jest
      .fn()
      .mockRejectedValueOnce({
        response: {
          status: 429,
          headers: new Headers({ 'X-RateLimit-Endpoint-Requests-Reset': '2030' }),
        },
      })
      .mockResolvedValueOnce({ data: { ok: true } });
    const request = jest.fn();
    const client: any = { client: { request, rawRequest } };

    installLinearRateLimitHandling(client, {
      now: () => 2000,
      sleep,
      log: jest.fn(),
    });

    await expect(client.client.rawRequest('query Test { viewer { id } }')).resolves.toEqual({
      data: { ok: true },
    });
    expect(rawRequest).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(30);
  });
});
