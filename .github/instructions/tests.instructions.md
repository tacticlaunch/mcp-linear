---
applyTo: "src/__tests__/**/*.ts"
---

Tests in this repository should be focused and MCP-specific.

- Add narrow tests around the behavior introduced by the change instead of broad snapshots.
- Cover at least one positive path and one negative or validation path for new tool surfaces.
- When a service method uses a direct GraphQL fallback, test the expected normalized shape and any filtering logic.
- When update inputs support `null` clearing, add a test that preserves explicit `null` values.
- When schemas or guards add constraints like enums or positive integers, add tests that reject invalid values.
- Prefer mocking the smallest possible surface of the Linear client or `LinearService` dependency needed for the scenario.
