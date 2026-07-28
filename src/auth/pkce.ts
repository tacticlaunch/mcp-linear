import { createHash, randomBytes } from 'node:crypto';

/**
 * RFC 7636 unreserved characters allowed in a PKCE code verifier.
 */
const VERIFIER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const VERIFIER_LENGTH = 64;

export interface PkcePair {
  verifier: string;
  challenge: string;
}

/**
 * Generate a cryptographically random PKCE code verifier and its S256 challenge.
 */
export function generatePkcePair(): PkcePair {
  const bytes = randomBytes(VERIFIER_LENGTH);
  let verifier = '';
  for (let i = 0; i < VERIFIER_LENGTH; i++) {
    verifier += VERIFIER_CHARSET[bytes[i] % VERIFIER_CHARSET.length];
  }

  const challenge = createHash('sha256').update(verifier).digest('base64url');

  return { verifier, challenge };
}

/**
 * Generate a cryptographically random, URL-safe OAuth state value.
 */
export function generateState(): string {
  return randomBytes(24).toString('base64url');
}
