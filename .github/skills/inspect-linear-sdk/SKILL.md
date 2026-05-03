---
name: inspect-linear-sdk
description: Inspect the Linear SDK and generated GraphQL types before adding or changing a Linear capability in mcp-linear. Use this when you need to confirm available entities, methods, enums, or input shapes.
---

Use this skill before implementing a new Linear capability.

## Inspect these sources first

- `node_modules/@linear/sdk/dist/_generated_sdk.d.ts`
- `node_modules/@linear/sdk/dist/_generated_documents.d.ts`
- existing related code in `src/services/linear-service.ts`

## What to verify

1. Whether the capability already has an SDK method.
2. The exact mutation or query variable shape.
3. The entity class shape and relation getters.
4. Which fields are nullable, clearable, enum-based, or paginated.
5. Whether the generated SDK query looks stale for the current Linear schema.

## Decision rules

- Prefer the SDK when it is correct and complete.
- If the SDK is stale, use a direct GraphQL query only for the missing path and keep it as narrow as possible.
- When you fall back to direct GraphQL, note the mismatch in code comments or the PR summary so future maintainers know why the fallback exists.
