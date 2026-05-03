---
applyTo: "**"
excludeAgent: "cloud-agent"
---

When reviewing pull requests in this repository, focus on MCP contract correctness first.

- Prioritize findings about schema drift, runtime validation mismatches, missing registration, broken normalization, and missing tests.
- Compare `output_schema` to the actual service output, especially around nullable fields.
- Compare `input_schema` to the corresponding type guard and handler assumptions.
- Check that new public tools are registered in both index files and listed in `package.json` and `TOOLS.md` when appropriate.
- Flag direct GraphQL usage that does not clearly justify why the SDK path was insufficient.
- Present findings first, with file references and severity ordering.
