## Development

To develop locally:

```bash
# Clone the repository
git clone https://github.com/itz4blitz/mcp-linear.git
cd mcp-linear

# Install dependencies
npm install

# Run in development mode
npm run dev -- --token YOUR_LINEAR_API_TOKEN
```

### Validation

Use the following checks before merging or publishing:

```bash
# Full validation: Jest plus black-box MCP registration smoke test
npm test

# TypeScript build
npm run build

# Jest only
npm run test:unit

# MCP SDK smoke test against the built stdio server
npm run test:mcp-smoke
```

The smoke test verifies that the built server successfully exposes its registered tools, resources, and prompts over stdio.

### Inspecting the server

To inspect the server by @modelcontextprotocol/inspector:

```bash
npm run inspect -- -e LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
```

### Extending the Server

To add new tools to the server:

1. Follow the implementation guide in the [TOOLS.md](./TOOLS.md) document
2. Make sure to follow the established code structure in the `src/` directory
3. Update the documentation to reflect your changes

### Publishing to npm

To publish this package to npm:

1. Update the version in package.json

```bash
npm version patch  # or minor, or major
```

2. Build the project

```bash
npm run build
```

3. Make sure you've already logged in to npm

```bash
npm login
```

4. Publish to npm

```bash
npm publish --access public
```
