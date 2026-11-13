import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Credentials persisted by `mcp-linear auth login`.
 *
 * `expiresAt` is an absolute epoch-millisecond timestamp derived from the
 * token endpoint's `expires_in`. The values in this file are secrets and must
 * never be logged.
 */
export interface StoredCredentials {
  clientId: string;
  clientSecret?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes: string[];
}

const CREDENTIALS_FILE_NAME = 'credentials.json';

/**
 * Resolve the configuration directory for stored credentials.
 *
 * Precedence: MCP_LINEAR_CONFIG_DIR, then $XDG_CONFIG_HOME/mcp-linear, then
 * ~/.config/mcp-linear.
 */
export function getConfigDir(): string {
  const explicit = process.env.MCP_LINEAR_CONFIG_DIR;
  if (explicit) {
    return explicit;
  }

  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  if (xdgConfigHome) {
    return path.join(xdgConfigHome, 'mcp-linear');
  }

  return path.join(os.homedir(), '.config', 'mcp-linear');
}

export function getCredentialsPath(): string {
  return path.join(getConfigDir(), CREDENTIALS_FILE_NAME);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Read stored credentials. Returns undefined when the file is missing,
 * unreadable, corrupt, or missing required fields — callers treat all of
 * those cases as "not logged in".
 */
export function readStoredCredentials(): StoredCredentials | undefined {
  let raw: string;
  try {
    raw = fs.readFileSync(getCredentialsPath(), 'utf8');
  } catch {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const record = parsed as Record<string, unknown>;
  if (
    !isNonEmptyString(record.clientId) ||
    !isNonEmptyString(record.accessToken) ||
    !isStringArray(record.scopes)
  ) {
    return undefined;
  }

  const credentials: StoredCredentials = {
    clientId: record.clientId,
    accessToken: record.accessToken,
    scopes: record.scopes,
  };

  if (isNonEmptyString(record.clientSecret)) {
    credentials.clientSecret = record.clientSecret;
  }

  if (isNonEmptyString(record.refreshToken)) {
    credentials.refreshToken = record.refreshToken;
  }
  if (typeof record.expiresAt === 'number' && Number.isFinite(record.expiresAt)) {
    credentials.expiresAt = record.expiresAt;
  }

  return credentials;
}

/**
 * Persist credentials atomically: write a 0600 temp file in the (0700)
 * config directory, then rename it over the destination. The rename keeps a
 * concurrent reader from ever observing a partially written file — important
 * because Linear rotates refresh tokens and a torn write would lose the only
 * valid one.
 */
export function writeStoredCredentials(credentials: StoredCredentials): void {
  const configDir = getConfigDir();
  fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });

  const destination = getCredentialsPath();
  const tempPath = path.join(configDir, `.${CREDENTIALS_FILE_NAME}.${randomBytes(6).toString('hex')}.tmp`);

  fs.writeFileSync(tempPath, `${JSON.stringify(credentials, null, 2)}\n`, { mode: 0o600 });
  try {
    fs.renameSync(tempPath, destination);
  } catch (error) {
    try {
      fs.unlinkSync(tempPath);
    } catch {
      // Best effort cleanup; surface the original failure.
    }
    throw error;
  }
}

const LOCK_FILE_NAME = `${CREDENTIALS_FILE_NAME}.lock`;

/** A lock older than this is treated as left behind by a dead process. */
export const CREDENTIALS_LOCK_STALE_MS = 60_000;
/** Give up waiting after this long; longer than the stale window so a dead holder is reclaimed first. */
export const CREDENTIALS_LOCK_TIMEOUT_MS = 75_000;
const CREDENTIALS_LOCK_RETRY_MS = 100;

export interface CredentialsLockOptions {
  retryMs?: number;
  staleMs?: number;
  timeoutMs?: number;
}

export function getCredentialsLockPath(): string {
  return path.join(getConfigDir(), LOCK_FILE_NAME);
}

function errorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Remove a lock whose holder is presumed dead. Returns true when the caller
 * should try to create the lock again right away.
 *
 * Renaming first means only one waiter wins the removal. A narrow race remains
 * (a waiter can rename away a lock that another waiter created a moment
 * earlier). The refresh path mostly absorbs it by re-reading the file and
 * retrying once when Linear rejects a refresh token that was rotated
 * meanwhile; if the rejection arrives before the winner has written the file,
 * that one request fails and the next request picks up the winner's tokens.
 */
function reclaimIfStale(lockPath: string, staleMs: number): boolean {
  let mtimeMs: number;
  try {
    // lstat: a dangling symlink makes O_EXCL report EEXIST while stat reports
    // ENOENT, which would spin this loop forever.
    mtimeMs = fs.lstatSync(lockPath).mtimeMs;
  } catch (error) {
    if (errorCode(error) === 'ENOENT') return true;
    throw error;
  }
  if (Date.now() - mtimeMs < staleMs) {
    return false;
  }

  const reclaimedPath = `${lockPath}.${randomBytes(6).toString('hex')}.stale`;
  try {
    fs.renameSync(lockPath, reclaimedPath);
  } catch (error) {
    if (errorCode(error) === 'ENOENT') return true;
    throw error;
  }
  try {
    fs.unlinkSync(reclaimedPath);
  } catch {
    // Best effort; the lock path itself is already free.
  }
  return true;
}

/** Create the lock file exclusively. Returns false when it already exists. */
function tryCreateLock(lockPath: string, owner: string): boolean {
  let fd: number;
  try {
    fd = fs.openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    if (errorCode(error) === 'EEXIST') return false;
    throw error;
  }
  try {
    fs.writeSync(fd, owner);
  } catch (error) {
    // Do not leave an empty lock that blocks every refresh for the stale window.
    fs.closeSync(fd);
    fs.unlinkSync(lockPath);
    throw error;
  }
  fs.closeSync(fd);
  return true;
}

function releaseLock(lockPath: string, owner: string): void {
  try {
    // Only remove our own lock: if ours was reclaimed as stale, another
    // process may hold the lock now.
    if (fs.readFileSync(lockPath, 'utf8') === owner) {
      fs.unlinkSync(lockPath);
    }
  } catch {
    // Already gone or unreadable; nothing to release.
  }
}

/**
 * Run `fn` while holding an exclusive lock shared by every process that uses
 * this config directory. The lock is a file created with O_EXCL; a lock older
 * than the stale window is reclaimed so a crashed process cannot block
 * refreshes forever.
 */
export async function withCredentialsLock<T>(
  fn: () => Promise<T>,
  options: CredentialsLockOptions = {},
): Promise<T> {
  const retryMs = options.retryMs ?? CREDENTIALS_LOCK_RETRY_MS;
  const staleMs = options.staleMs ?? CREDENTIALS_LOCK_STALE_MS;
  const timeoutMs = options.timeoutMs ?? CREDENTIALS_LOCK_TIMEOUT_MS;

  fs.mkdirSync(getConfigDir(), { recursive: true, mode: 0o700 });
  const lockPath = getCredentialsLockPath();
  const owner = `${process.pid}.${randomBytes(8).toString('hex')}`;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    if (tryCreateLock(lockPath, owner)) {
      break;
    }
    const reclaimed = reclaimIfStale(lockPath, staleMs);
    if (reclaimed && Date.now() < deadline) {
      continue;
    }
    if (Date.now() >= deadline) {
      throw new Error(
        'Timed out waiting for another mcp-linear process to finish refreshing the stored Linear access token.',
      );
    }
    await sleep(retryMs);
  }

  try {
    return await fn();
  } finally {
    releaseLock(lockPath, owner);
  }
}

/**
 * Delete stored credentials. Returns true when a file was removed.
 */
export function deleteStoredCredentials(): boolean {
  try {
    fs.unlinkSync(getCredentialsPath());
    return true;
  } catch {
    return false;
  }
}
