import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const disallowedTopLevelKeys = ['oneOf', 'anyOf', 'allOf', 'enum', 'not'];
const criticalToolNames = [
  'linear_updateMilestone',
  'linear_updateSavedView',
  'linear_removeFromFavorites',
];

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const repoRoot = path.resolve(scriptDir, '..');
const serverEntryPath = path.join(repoRoot, 'dist/index.js');
const definitionsEntryPath = path.join(repoRoot, 'dist/tools/definitions/index.js');

async function main() {
  const { allToolDefinitions } = await import(pathToFileURL(definitionsEntryPath).href);
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntryPath, '--token', 'mcp-smoke-test-token'],
    cwd: repoRoot,
    env: {
      ...process.env,
      LINEAR_API_TOKEN: 'mcp-smoke-test-token',
    },
    stderr: 'inherit',
  });
  const client = new Client({
    name: 'mcp-linear-smoke-test',
    version: '1.0.0',
  });

  try {
    await client.connect(transport);

    const { tools } = await client.listTools();
    const actualToolNames = tools.map((tool) => tool.name).sort();
    const expectedToolNames = allToolDefinitions.map((tool) => tool.name).sort();

    assert.deepEqual(
      actualToolNames,
      expectedToolNames,
      `MCP server advertised an unexpected tool set. Expected ${expectedToolNames.length} tools, got ${actualToolNames.length}.`,
    );

    for (const tool of tools) {
      assert.equal(
        tool.inputSchema.type,
        'object',
        `Tool ${tool.name} must expose a top-level object input schema.`,
      );

      for (const key of disallowedTopLevelKeys) {
        assert.ok(
          !(key in tool.inputSchema),
          `Tool ${tool.name} exposes disallowed top-level schema key ${key}.`,
        );
      }
    }

    for (const toolName of criticalToolNames) {
      assert.ok(actualToolNames.includes(toolName), `Expected tool ${toolName} to be registered.`);
    }

    const { resources } = await client.listResources();
    const resourceUris = resources.map((resource) => resource.uri);
    assert.ok(resourceUris.includes('linear://viewer'), 'Expected linear://viewer resource to be registered.');
    assert.ok(resourceUris.includes('linear://rate-limit'), 'Expected linear://rate-limit resource to be registered.');

    const guideResource = await client.readResource({ uri: 'linear://resource-guide' });
    assert.ok(guideResource.contents[0].text.includes('linear://project/{id}'));

    const rateLimitResource = await client.readResource({ uri: 'linear://rate-limit' });
    assert.ok(rateLimitResource.contents[0].text.includes('"isBlocked"'));

    const { prompts } = await client.listPrompts();
    const promptNames = prompts.map((prompt) => prompt.name);
    assert.ok(promptNames.includes('summarize-project-status'));

    const prompt = await client.getPrompt({
      name: 'summarize-project-status',
      arguments: { projectId: 'project-1', focus: 'risks' },
    });
    assert.ok(prompt.messages[0].content.text.includes('linear://project/project-1'));

    console.log(
      `MCP smoke test passed for ${actualToolNames.length} tools, ${resources.length} resources, and ${prompts.length} prompts.`,
    );
  } finally {
    await transport.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error('MCP smoke test failed:', error);
  process.exit(1);
});
