import { createHash } from 'node:crypto';

import { generatePkcePair, generateState } from '../auth/pkce.js';

describe('PKCE generation', () => {
  it('generates a verifier using only RFC 7636 unreserved characters at a valid length', () => {
    const { verifier } = generatePkcePair();

    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
    expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });

  it('generates unique verifiers across calls', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++) {
      seen.add(generatePkcePair().verifier);
    }
    expect(seen.size).toBe(20);
  });

  it('derives the challenge as unpadded base64url of the SHA-256 of the verifier', () => {
    const { verifier, challenge } = generatePkcePair();
    const expected = createHash('sha256').update(verifier).digest('base64url');

    expect(challenge).toBe(expected);
    expect(challenge).not.toContain('=');
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('generates random URL-safe state values', () => {
    const first = generateState();
    const second = generateState();

    expect(first).toMatch(/^[A-Za-z0-9_-]{32,}$/);
    expect(first).not.toBe(second);
  });
});
