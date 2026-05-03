---
name: live-linear-smoke
description: Run safe live smoke tests for mcp-linear against a real Linear workspace. Use this when a change needs validation beyond local unit tests and build checks.
---

Use this skill for live validation of MCP tool changes.

## Preconditions

- Local build and unit tests should already pass.
- Linear credentials or an existing local MCP client setup must be available.

## Workflow

1. Run `npm test`.
2. Run `npm run build`.
3. Choose the smallest live scenario that exercises the changed capability.
4. Use temporary resource names such as `Smoke Test ...` with a timestamp.
5. Validate both the Linear side effect and the returned normalized payload shape.
6. Delete or revert all temporary Linear resources before finishing.

## Reporting

- State which live tool calls succeeded.
- State which temporary entities were created and confirm cleanup.
- If a live failure occurs, identify whether it is caused by repo code, SDK drift, or workspace/schema behavior.
