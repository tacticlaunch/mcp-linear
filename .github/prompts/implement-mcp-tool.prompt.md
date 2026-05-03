Add or update an MCP tool in the `mcp-linear` repository.

Requirements:

- Inspect existing patterns before editing.
- Check `@linear/sdk` before writing direct GraphQL.
- Implement or update the service method in `#file:../../src/services/linear-service.ts`.
- Wire the full MCP surface:
  - tool definitions in `#file:../../src/tools/definitions/index.ts`
  - handlers in `#file:../../src/tools/handlers/index.ts`
  - runtime validation in `#file:../../src/tools/type-guards.ts`
- Update `#file:../../TOOLS.md`.
- Add focused tests under `#file:../../src/__tests__/linear-service.test.ts` or a new adjacent test file.
- Run `npm test` and `npm run build`.

Quality bar:

- Keep output normalization honest about nullability.
- Keep handlers thin.
- Explain any SDK fallback to direct GraphQL.
