<p align="center">
  <img src="https://github.com/tacticlaunch/mcp-linear/blob/main/docs/linear-app-icon.png?raw=true" alt="Linear App Icon" width="250" height="250">
</p>

# MCP Linear

A Model Context Protocol (MCP) server for the Linear GraphQL API, built for real project-management workflows — not just basic issue CRUD.

![MCP Linear](https://img.shields.io/badge/MCP-Linear-blue)
[![npm version](https://img.shields.io/npm/v/@tacticlaunch/mcp-linear.svg)](https://www.npmjs.com/package/@tacticlaunch/mcp-linear)

<a href="https://glama.ai/mcp/servers/@tacticlaunch/mcp-linear">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@tacticlaunch/mcp-linear/badge" />
</a>

## Features

MCP Linear bridges AI assistants and Linear by implementing the MCP protocol. With it you can:

- Retrieve issues, projects, teams, cycles, milestones, roadmaps, customers, customer needs, and workspace/project/initiative/team/issue/release/cycle documents
- Create and update issues, change status, assign, and comment
- Manage projects, full diff-aware project and initiative update lifecycles, milestones, roadmaps, saved views, and favorites
- Work with templates, custom fields, webhooks, and attachments
- Work with customer records, customer statuses/tiers, and customer needs linked to issues or projects
- Read notifications, subscriptions, sessions, audits, and integrations without leaving MCP
- Inspect rate-limit and server health before running heavy planning sessions

See [`TOOLS.md`](./TOOLS.md) for the full inventory.

### MCP-native resources and prompts

The server exposes MCP resources and prompts in addition to tools, including:

- Resources: `linear://viewer`, `linear://organization`, `linear://teams`, `linear://projects`, `linear://project/{id}`, `linear://project/{id}/issues`, `linear://project/{id}/documents`, `linear://issue/{id}`, `linear://document/{id}`, `linear://roadmap/{id}`, `linear://milestone/{id}`, `linear://rate-limit`
- Prompts: `summarize-project-status`, `draft-project-update`, `triage-issue`, `summarize-document`

## Example prompts

Once connected, you can use prompts like:

- "Show me all my Linear issues"
- "Create a new issue titled 'Fix login bug' in the Frontend team"
- "Change the status of issue FE-123 to 'In Progress'"
- "Assign issue BE-456 to John Smith"
- "Show all open issues in this project grouped by milestone and cycle"
- "Draft a weekly project update from the current Linear state"
- "Find the newest documents related to a project and summarize the key decisions"
- "Show the pinned documents and links on this team's home page"
- "Create a document for ENG-123 with resource ordering metadata"
- "Get the latest project update diff and archive an outdated update"
- "Show customer needs for this project and mark the important ones"
- "Create an initiative update and hide the generated diff from the update body"

## Installation

### Getting your Linear API token

1. Log in to your Linear account at [linear.app](https://linear.app)
2. Click on your organization avatar (top-left corner)
3. Select **Settings**
4. Navigate to **Security & access** in the left sidebar
5. Under **Personal API Keys** click **New API Key**
6. Give your key a name (e.g., `MCP Linear Integration`)
7. Copy the generated API token and store it securely — you won't be able to see it again

### Installing via [add-mcp](https://github.com/neondatabase/add-mcp) (Recommended)

`add-mcp` installs the server into Claude Code, Cursor, Codex, VS Code, Claude Desktop, and many other MCP-aware agents with a single command:

```bash
npx add-mcp @tacticlaunch/mcp-linear --env LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
```

Add `-g` to install globally instead of into the current project. See the [add-mcp docs](https://github.com/neondatabase/add-mcp) for the full agent list and flags.

### Manual configuration

Add the following to your MCP settings file:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@tacticlaunch/mcp-linear"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

#### Client-specific configuration locations

- Cursor: `~/.cursor/mcp.json`
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude VSCode Extension: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- GoMCP: `~/.config/gomcp/config.yaml`

### Manual run

Prerequisites:

- Node.js (v18+)
- NPM or Yarn
- Linear API token

```bash
# Install globally
npm install -g @tacticlaunch/mcp-linear

# Or clone and install locally
git clone https://github.com/tacticlaunch/mcp-linear.git
cd mcp-linear
npm install
npm link  # Makes the package available globally
```

#### Running the server

Run the server with your Linear API token:

```bash
mcp-linear --token YOUR_LINEAR_API_TOKEN
```

Or set the token in your environment and run without arguments:

```bash
export LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
mcp-linear
```

## Validation

The default validation path is:

```bash
npm test
npm run build
```

`npm test` runs Jest unit tests and an official MCP SDK smoke test against the built stdio server, covering tool, resource, and prompt registration plus host-compatible schema emission.

## Development

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for local development details.

## Links

[tacticlaunch/cursor-memory-bank](https://github.com/tacticlaunch/cursor-memory-bank) — If you are a developer seeking to enhance your workflow with Cursor, consider giving it a try.

## License

This project is licensed under the MIT License — see the [`LICENSE`](./LICENSE) file for details.
