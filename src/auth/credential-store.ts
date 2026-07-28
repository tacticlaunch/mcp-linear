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
