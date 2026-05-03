---
name: add-mcp-tool
description: Add or update an MCP tool in the mcp-linear repository. Use this when implementing new Linear capabilities or exposing an existing service method through the MCP surface.
---

Use this workflow when adding a tool to `mcp-linear`.

## Goal

Implement a Linear capability end-to-end so the MCP surface, runtime behavior, and docs stay aligned.

## Workflow

1. Inspect the existing domain files under `src/tools/definitions`, `src/tools/handlers`, and `src/services/linear-service.ts` to find the closest pattern.
2. Check whether the capability already exists in `LinearService`.
3. Inspect `@linear/sdk` before writing new GraphQL.
4. Implement or update the service method so it returns normalized plain objects.
5. Add or update the tool definition with explicit required fields, enums, nullability, and numeric constraints.
6. Add or update the handler so it validates, delegates, and logs failures.
7. Add or update the type guard in `src/tools/type-guards.ts`.
8. Register the tool in both index files.
9. Update `TOOLS.md`.
10. Add focused tests in `src/__tests__`.
11. Run `npm test` and `npm run build`.

## Project-specific reminders

- Prefer SDK methods first.
- If you use direct GraphQL because the SDK is stale or missing support, document why.
- Keep handlers thin.
- Be exact about nullable update semantics and output schema fidelity.
