import { LinearClient } from '@linear/sdk';
import { logInfo } from './config.js';

type RetryState = {
  blockedUntil: number;
  lastRateLimitedAt?: number;
  lastDelayMs?: number;
  lastOperation?: string;
};

export type LinearRateLimitSnapshot = {
  blockedUntil: number;
  isBlocked: boolean;
  lastRateLimitedAt: number | null;
  lastDelayMs: number | null;
  lastOperation: string | null;
};

type RateLimitDeps = {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  log: (message: string) => void;
};

const DEFAULT_DEPS: RateLimitDeps = {
  now: () => Date.now(),
  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
  log: (message: string) => logInfo(message),
};

const RATE_LIMIT_RESET_HEADERS = [
  'X-RateLimit-Requests-Reset',
  'X-RateLimit-Endpoint-Requests-Reset',
  'X-RateLimit-Complexity-Reset',
];

const MAX_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 60_000;
const BASE_RETRY_DELAY_MS = 1_000;

function getHeaders(source: unknown): Headers | undefined {
  if (!source || typeof source !== 'object') {
    return undefined;
  }

  const candidate = (source as { headers?: unknown }).headers;
  return candidate instanceof Headers ? candidate : undefined;
}

function getErrorResponse(error: unknown): { status?: number; headers?: Headers; errors?: unknown[] } | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const response = (error as { response?: { status?: number; headers?: Headers; errors?: unknown[] } }).response;
  return response && typeof response === 'object' ? response : undefined;
}

function isRateLimitedError(error: unknown): boolean {
  const response = getErrorResponse(error);

  if (response?.status === 429) {
    return true;
  }

  const errors = response?.errors;
  if (Array.isArray(errors)) {
    return errors.some((entry) => {
      const extensions =
        entry && typeof entry === 'object'
          ? (entry as { extensions?: { code?: string; type?: string } }).extensions
          : undefined;
      const code = extensions?.code;
      const type = extensions?.type;
      return code === 'RATELIMITED' || type === 'Ratelimited';
    });
  }

  return false;
}

function getResetDelayMs(headers: Headers | undefined, now: number): number | undefined {
  if (!headers) {
    return undefined;
  }

  const resetAt = RATE_LIMIT_RESET_HEADERS.map((header) => Number(headers.get(header) ?? NaN))
    .filter((value) => Number.isFinite(value) && value > now)
    .sort((a, b) => b - a)[0];

  if (!resetAt) {
    return undefined;
  }

  return Math.min(resetAt - now, MAX_RETRY_DELAY_MS);
}

function getRetryDelayMs(error: unknown, attempt: number, deps: RateLimitDeps): number {
  const now = deps.now();
  const response = getErrorResponse(error);
  const headerDelay = getResetDelayMs(response?.headers, now);

  if (headerDelay !== undefined) {
    return Math.max(headerDelay, 0);
  }

  return Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

async function waitForSharedCooldown(state: RetryState, deps: RateLimitDeps) {
  const now = deps.now();
  if (state.blockedUntil > now) {
    await deps.sleep(state.blockedUntil - now);
  }
}

async function withRateLimitRetry<T>(
  operationName: string,
  operation: () => Promise<T>,
  state: RetryState,
  deps: RateLimitDeps,
): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    await waitForSharedCooldown(state, deps);

    try {
      return await operation();
    } catch (error) {
      if (!isRateLimitedError(error) || attempt === MAX_RETRIES) {
        throw error;
      }

      const delayMs = getRetryDelayMs(error, attempt, deps);
      state.blockedUntil = deps.now() + delayMs;
      state.lastRateLimitedAt = deps.now();
      state.lastDelayMs = delayMs;
      state.lastOperation = operationName;
      deps.log(`Linear API rate limited during ${operationName}; retrying in ${delayMs}ms.`);
      await deps.sleep(delayMs);
    }
  }

  throw new Error(`Unexpected retry flow for ${operationName}`);
}

export function installLinearRateLimitHandling(client: LinearClient, deps: Partial<RateLimitDeps> = {}) {
  const graphClient = client.client as LinearClient['client'] & {
    __mcpLinearRateLimitWrapped?: boolean;
    __mcpLinearRateLimitState?: RetryState;
  };

  if (graphClient.__mcpLinearRateLimitWrapped) {
    return client;
  }

  const resolvedDeps: RateLimitDeps = {
    ...DEFAULT_DEPS,
    ...deps,
  };
  const state: RetryState = { blockedUntil: 0 };
  const originalRequest = graphClient.request.bind(graphClient);
  const originalRawRequest = graphClient.rawRequest.bind(graphClient);

  graphClient.request = ((document: unknown, variables?: Record<string, unknown>, headers?: RequestInit['headers']) => {
    return withRateLimitRetry(
      'request',
      () => originalRequest(document as never, variables, headers),
      state,
      resolvedDeps,
    );
  }) as typeof graphClient.request;

  graphClient.rawRequest = ((query: string, variables?: Record<string, unknown>, headers?: RequestInit['headers']) => {
    return withRateLimitRetry(
      'rawRequest',
      () => originalRawRequest(query, variables, headers),
      state,
      resolvedDeps,
    );
  }) as typeof graphClient.rawRequest;

  graphClient.__mcpLinearRateLimitWrapped = true;
  graphClient.__mcpLinearRateLimitState = state;
  return client;
}

export function getLinearRateLimitSnapshot(client: LinearClient, now = Date.now()): LinearRateLimitSnapshot {
  const graphClient = client.client as LinearClient['client'] & {
    __mcpLinearRateLimitState?: RetryState;
  };
  const state = graphClient.__mcpLinearRateLimitState ?? { blockedUntil: 0 };

  return {
    blockedUntil: state.blockedUntil,
    isBlocked: state.blockedUntil > now,
    lastRateLimitedAt: state.lastRateLimitedAt ?? null,
    lastDelayMs: state.lastDelayMs ?? null,
    lastOperation: state.lastOperation ?? null,
  };
}
