# MCP Linear Repository Instructions

This repository is an MCP server for Linear, not an application. Most work in this repo adds, updates, or reviews Linear-facing MCP tools.

## Repository Map

- `src/services/linear-service.ts`: main integration layer for `@linear/sdk` and the place where MCP-facing response normalization should happen.
- `src/tools/definitions/*.ts`: MCP tool definitions and input/output schemas, grouped by domain.
- `src/tools/handlers/*.ts`: thin handlers that validate arguments, delegate to `LinearService`, and log errors.
- `src/tools/type-guards.ts`: runtime validation for tool arguments.
- `src/tools/definitions/index.ts` and `src/tools/handlers/index.ts`: central registration.
- `src/__tests__/*.ts`: focused Jest coverage for service behavior and tool wiring.
- `TOOLS.md`: user-facing tool inventory and planned work.
- `package.json`: package metadata.

## How To Add Or Change A Tool

- Start by checking whether the capability already exists in `src/services/linear-service.ts`.
- Prefer `@linear/sdk` methods and generated types first.
- Use direct GraphQL only when the SDK is missing support or ships a stale query. If you do this, keep the query narrow and document why.
- Keep service methods responsible for returning normalized plain objects, not raw SDK entities.
- Keep handlers thin.
- Keep `input_schema`, `output_schema`, type guards, and normalized service output aligned exactly, especially around nullable fields and enums.
- Register every new tool in both index files.
- Update `TOOLS.md` when the public tool surface changes.

## Validation

- Always run `npm test` and `npm run build` before considering work complete.
- Use `npm run dev -- --token YOUR_LINEAR_API_TOKEN` for local server development.
- Use `npm run inspect -- -e LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN` when validating the local MCP server with the inspector.

## Project-Specific Pitfalls

- This repo frequently needs careful SDK contract inspection. Check `node_modules/@linear/sdk/dist/_generated_sdk.d.ts` and `_generated_documents.d.ts` before guessing field names or mutation inputs.
- Some Linear product naming does not match SDK naming. For example, saved views are `CustomView` in the API and SDK.
- Review changes carefully for schema drift between service output, tool definitions, and type guards.
- Keep changes minimal and domain-local. Prefer extending an existing domain file over introducing new structure unless the domain is clearly separate.
