import { ToolAnnotations } from './types.js';

type ToolAnnotationOverrides = Partial<ToolAnnotations>;

/**
 * Pure reads (get, list, and search tools) and local generators that never
 * mutate the Linear workspace. Safe to repeat and safe for clients to
 * auto-allow.
 */
export function readOnlyToolAnnotations(overrides: ToolAnnotationOverrides = {}): ToolAnnotations {
  return {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    ...overrides,
  };
}

/**
 * Creators: every call adds a new entity (issue, comment, webhook, ...), so
 * repeating the same call is not idempotent, but nothing is destroyed.
 */
export function additiveToolAnnotations(overrides: ToolAnnotationOverrides = {}): ToolAnnotations {
  return {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
    ...overrides,
  };
}

/**
 * Absolute setters and reversible membership changes (update*, assign, add/
 * remove label or member, mark-as-read, unarchive, ...): repeating the same
 * call with the same arguments has no additional effect.
 */
export function idempotentMutationToolAnnotations(
  overrides: ToolAnnotationOverrides = {},
): ToolAnnotations {
  return {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    ...overrides,
  };
}

/**
 * Deletes, archives, session logouts, and secret rotations: destroys or
 * invalidates existing state. Defaults to idempotent (deleting the same
 * entity twice has no further effect); rotations override idempotentHint to
 * false because each call mints a new secret and invalidates the previous one.
 */
export function destructiveToolAnnotations(
  overrides: ToolAnnotationOverrides = {},
): ToolAnnotations {
  return {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
    ...overrides,
  };
}
