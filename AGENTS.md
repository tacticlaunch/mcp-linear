# MCP Linear Agent Notes

This repository is optimized for MCP tool work.

## Primary Workflow

- Inspect the existing domain files before adding a new tool.
- Implement or update the service method in `src/services/linear-service.ts`.
- Add or update tool definitions in `src/tools/definitions/*.ts`.
- Add or update handlers in `src/tools/handlers/*.ts`.
- Add or update runtime validation in `src/tools/type-guards.ts`.
- Register definitions and handlers in their index files.
- Update `package.json` and `TOOLS.md` when the public MCP surface changes.
- Add focused Jest coverage in `src/__tests__`.

## Repository Expectations

- Prefer `@linear/sdk` methods over raw GraphQL.
- If a direct GraphQL query is necessary, keep it minimal and document the SDK mismatch in code comments or the PR summary.
- Normalize SDK entities into plain objects before returning them from `LinearService`.
- Be exact about nullability, enum values, and positive integer constraints.

## Validation

- Always run `npm test`.
- Always run `npm run build`.
- If live Linear testing is requested, use temporary names and clean up created entities before finishing.
