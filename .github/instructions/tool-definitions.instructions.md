---
applyTo: "src/tools/definitions/**/*.ts,src/tools/handlers/**/*.ts,src/tools/type-guards.ts"
---

Changes in the MCP surface must keep definitions, handlers, and guards aligned.

- `input_schema`, type guards, and handler expectations must use the same field names and required fields.
- `output_schema` must match the actual normalized service output, including nullable objects, nullable strings, enums, and numeric constraints.
- Prefer explicit enums and positive integer constraints over generic `string` or `number` schemas when the contract is known.
- Handlers in this repo should stay thin: validate, delegate to `LinearService`, and log failures.
- Every new public tool must be registered in both `src/tools/definitions/index.ts` and `src/tools/handlers/index.ts`.
- If the tool is intended for external clients, update `TOOLS.md` in the same change.
- Call out API naming mismatches directly in descriptions when needed, such as Linear saved views being exposed as `CustomView` in the SDK.
