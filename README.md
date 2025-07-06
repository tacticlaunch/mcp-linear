[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/tacticlaunch-mcp-linear-badge.png)](https://mseep.ai/app/tacticlaunch-mcp-linear)

<p align="center">
  <img src="https://github.com/tacticlaunch/mcp-linear/blob/main/docs/linear-app-icon.png?raw=true" alt="Linear App Icon" width="250" height="250">
</p>

# MCP Linear

A Model Context Protocol (MCP) server implementation for the Linear GraphQL API that enables AI assistants to interact with Linear project management systems.

![MCP Linear](https://img.shields.io/badge/MCP-Linear-blue)
[![npm version](https://img.shields.io/npm/v/@tacticlaunch/mcp-linear.svg)](https://www.npmjs.com/package/@tacticlaunch/mcp-linear)
[![smithery badge](https://smithery.ai/badge/@tacticlaunch/mcp-linear)](https://smithery.ai/server/@tacticlaunch/mcp-linear)

<a href="https://glama.ai/mcp/servers/@tacticlaunch/mcp-linear">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@tacticlaunch/mcp-linear/badge" />
</a>

## Features

MCP Linear bridges the gap between AI assistant and Linear (project management tool) by implementing the MCP protocol. This allows to:

- Retrieve issues, projects, teams, and other data from Linear
- Create and update issues
- Change issue status
- Assign issues to team members
- Add comments
- Create projects and teams

## Example prompts

Once connected, you can use prompts like:

- "Show me all my Linear issues"
- "Create a new issue titled 'Fix login bug' in the Frontend team"
- "Change the status of issue FE-123 to 'In Progress'"
- "Assign issue BE-456 to John Smith"
- "Add a comment to issue UI-789: 'This needs to be fixed by Friday'"

## Installation

### Getting Your Linear API Token

To use MCP Linear, you'll need a Linear API token. Here's how to get one:

1. Log in to your Linear account at [linear.app](https://linear.app)
2. Click on organization avatar (in the top-left corner)
3. Select **Settings**
4. Navigate to **Security & access** in the left sidebar
5. Under **Personal API Keys** click **New API Key**
6. Give your key a name (e.g., `MCP Linear Integration`)
7. Copy the generated API token and store it securely - you won't be able to see it again!

### Installing via [Smithery](https://smithery.ai/server/@tacticlaunch/mcp-linear) (Recommended)

- To install MCP Linear for Cursor:

```bash
npx -y @smithery/cli install @tacticlaunch/mcp-linear --client cursor
```

- To install MCP Linear for Claude Desktop:

```bash
npx -y @smithery/cli install @tacticlaunch/mcp-linear --client claude
```

### Manual Configuration

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

#### Client-Specific Configuration Locations

- Cursor: `~/.cursor/mcp.json`
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude VSCode Extension: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- GoMCP: `~/.config/gomcp/config.yaml`

### Manual run

Prerequisites

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

#### Running the Server

Run the server with your Linear API token:

```bash
mcp-linear --token YOUR_LINEAR_API_TOKEN
```

Or set the token in your environment and run without arguments:

```bash
export LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
mcp-linear
```

## Available Tools

See [TOOLS.md](https://github.com/tacticlaunch/mcp-linear/blob/main/TOOLS.md) for a complete list of available tools and planned features.

## Development

See [DEVELOPMENT.md](https://github.com/tacticlaunch/mcp-linear/blob/main/DEVELOPMENT.md) for more information on how to develop locally.

## Links

[tacticlaunch/cursor-memory-bank](https://github.com/tacticlaunch/cursor-memory-bank) - If you are a developer seeking to enhance your workflow with Cursor, consider giving it a try.


## License

This project is licensed under the MIT License - see the LICENSE file for details.
