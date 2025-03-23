# MCP Linear

A Model Context Protocol (MCP) server implementation for the Linear GraphQL API that enables AI assistants to interact with Linear project management systems.

![MCP Linear](https://img.shields.io/badge/MCP-Linear-blue)
[![npm version](https://img.shields.io/npm/v/@tacticlaunch/mcp-linear.svg)](https://www.npmjs.com/package/@tacticlaunch/mcp-linear)
[![Smithery](https://img.shields.io/badge/Smithery-Compatible-brightgreen)](https://smithery.ai/server/@emmett-deen/mcp-linear)

## Features

- Access to Linear's GraphQL API through MCP tools
- Authentication via Linear API key
- Retrieve and modify data related to users, teams, projects, and issues
- Create, update and comment on issues
- Add and remove labels
- Create projects
- Comprehensive documentation of available tools

## Example prompts

Once connected, you can use prompts like:

- "Show me all my Linear issues"
- "Create a new issue titled 'Fix login bug' in the Frontend team"
- "Change the status of issue FE-123 to 'In Progress'"
- "Assign issue BE-456 to John Smith"
- "Add a comment to issue UI-789: 'This needs to be fixed by Friday'"

## Installation

### Installing via Smithery (Recommended)

- To install MCP Linear for Cursor:

```bash
npx -y @smithery/cli install @tacticlaunch/mcp-linear --client cursor
```

- To install MCP Linear for Claude Desktop:

```bash
npx -y @smithery/cli install @tacticlaunch/mcp-linear --client claude
```

### Manual Configuration

After installation, add the following to your MCP settings file:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@tacticlaunch/mcp-linear"],
      "env": {
        "LINEAR_API_KEY": "your_linear_api_key_here"
      }
    }
  }
}
```

### Client-Specific Configuration Locations

- Cursor: `~/.cursor/mcp.json`
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude VSCode Extension: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- GoMCP: `~/.config/gomcp/config.yaml`

### Manual Installation

1. Clone the repository

```bash
git clone https://github.com/tacticlaunch/mcp-linear.git
cd mcp-linear
```

2. Install dependencies

```bash
npm install
```

3. Build the project

```bash
npm run build
```

4. Create a `.env` file with your Linear API token

```
LINEAR_API_KEY=your_linear_api_key_here
```

5. Start the server

```bash
npm start
```

## Available Tools

See [TOOLS.md](TOOLS.md) for a complete list of available tools and planned features.

## Overview

MCP Linear bridges the gap between Claude (AI assistant) and Linear (project management tool) by implementing the MCP protocol. This allows Claude to:

- Retrieve issues, projects, teams, and other data from Linear
- Create and update issues
- Change issue status
- Assign issues to team members
- Add comments
- Create projects and teams

The server uses Linear's GraphQL API and authenticates via user tokens (not OAuth) for simplicity.

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- Linear API token

### Installation

```bash
# Install globally
npm install -g @tacticlaunch/mcp-linear

# Or clone and install locally
git clone https://github.com/tacticlaunch/mcp-linear.git
cd mcp-linear
npm install
npm link  # Makes the package available globally
```

### Running the Server

Run the server with your Linear API token:

```bash
mcp-linear --token YOUR_LINEAR_API_TOKEN
```

Or set the token in your environment and run without arguments:

```bash
export LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
mcp-linear
```

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for more information on how to develop locally.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
