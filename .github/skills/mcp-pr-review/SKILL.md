---
name: mcp-pr-review
description: Review pull requests in mcp-linear for MCP-specific risks. Use this when a branch changes LinearService behavior, tool contracts, registrations, or tests.
---

Use this review workflow for `mcp-linear` pull requests.

## Review focus

1. Input schema and type guard alignment.
2. Output schema and normalized service output alignment.
3. Nullable field handling, especially for update and clear operations.
4. Missing handler or index registration.
5. Missing `TOOLS.md` updates.
6. Direct GraphQL added without a clear SDK rationale.
7. Missing tests for negative validation paths, nullable updates, or SDK fallback behavior.

## Expected output

- Findings first.
- Order findings by severity.
- Include exact file references.
- If no issues are found, say so explicitly and call out any remaining live-test risk.
