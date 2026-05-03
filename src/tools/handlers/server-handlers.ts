type StatusProvider<T> = (() => T | Promise<T>) | undefined;

export function handleGetRateLimitStatus(provider: StatusProvider<unknown>) {
  return async () => {
    if (!provider) {
      throw new Error('Rate limit status provider is not configured');
    }

    return await provider();
  };
}

export function handleGetServerStatus(provider: StatusProvider<unknown>) {
  return async () => {
    if (!provider) {
      throw new Error('Server status provider is not configured');
    }

    return await provider();
  };
}
