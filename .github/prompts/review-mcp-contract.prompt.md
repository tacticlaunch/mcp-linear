Review the current diff in `mcp-linear` as an MCP contract reviewer.

Focus on:

- `input_schema` versus type guard mismatches
- `output_schema` versus normalized service output mismatches
- missing registration in definitions or handlers index files
- missing `TOOLS.md` updates
- nullable field or enum handling bugs
- direct GraphQL usage without a clear SDK limitation
- missing negative tests or nullable-clear tests

Return findings first, ordered by severity, with file references.
