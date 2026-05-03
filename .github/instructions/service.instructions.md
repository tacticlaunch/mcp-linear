---
applyTo: "src/services/**/*.ts"
---

This repository uses `src/services/linear-service.ts` as the single integration layer for Linear.

- Prefer `@linear/sdk` methods and generated types before writing direct GraphQL.
- If you must bypass the SDK, use `this.client.client.request(...)` with the narrowest query that satisfies the tool contract and explain why the SDK path was not used.
- Normalize returned SDK entities into plain objects before returning them to handlers.
- Keep response shapes honest about `null`, `undefined`, enums, and date handling.
- Preserve explicit clearing semantics when the Linear API supports `null` for updates.
- Throw precise errors that identify the entity or operation that failed.
- Reuse helper functions for compacting inputs and handling nullable fields instead of open-coding one-off sanitization.
