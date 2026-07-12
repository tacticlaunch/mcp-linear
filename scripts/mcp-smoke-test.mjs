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

    const serverVersion = client.getServerVersion();
    assert.equal(serverVersion?.name, 'linear', 'Server must identify itself as "linear".');
    assert.match(
      serverVersion?.version ?? '',
      /^\d+\.\d+\.\d+/,
      'Server must report a semver version during initialization.',
    );

    const serverCapabilities = client.getServerCapabilities();
    assert.ok(serverCapabilities?.tools, 'Server must declare the tools capability.');
    assert.ok(serverCapabilities?.resources, 'Server must declare the resources capability.');
    assert.ok(serverCapabilities?.prompts, 'Server must declare the prompts capability.');

    const { tools } = await client.listTools();
    const actualToolNames = tools.map((tool) => tool.name).sort();
    const expectedToolNames = allToolDefinitions.map((tool) => tool.name).sort();

    assert.deepEqual(
      actualToolNames,
      expectedToolNames,
      `MCP server advertised an unexpected tool set. Expected ${expectedToolNames.length} tools, got ${actualToolNames.length}.`,
    );
    assert.equal(
      new Set(actualToolNames).size,
      actualToolNames.length,
      'MCP server advertised duplicate tool names.',
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

      assert.ok(tool.annotations, `Tool ${tool.name} must advertise annotations.`);
      for (const hint of ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint']) {
        assert.equal(
          typeof tool.annotations[hint],
          'boolean',
          `Tool ${tool.name} must advertise an explicit boolean ${hint}.`,
        );
      }

      assert.ok(tool.outputSchema, `Tool ${tool.name} must advertise an outputSchema.`);
      assert.equal(
        tool.outputSchema.type,
        'object',
        `Tool ${tool.name} must expose a top-level object output schema.`,
      );
    }

    const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));
    const expectedAnnotations = [
      [
        'linear_getIssues',
        { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      ],
      [
        'linear_createIssue',
        {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: false,
        },
      ],
      [
        'linear_deleteWebhook',
        { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      ],
      [
        'linear_logoutAllSessions',
        { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      ],
      [
        'linear_updateIssue',
        { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      ],
    ];
    for (const [toolName, annotations] of expectedAnnotations) {
      assert.deepEqual(
        toolsByName.get(toolName)?.annotations,
        annotations,
        `Tool ${toolName} advertised unexpected annotations.`,
      );
    }

    const openWorldToolNames = tools
      .filter((tool) => tool.annotations.openWorldHint)
      .map((tool) => tool.name);
    assert.deepEqual(
      openWorldToolNames,
      [],
      'Every tool talks only to the configured Linear workspace, so none may advertise openWorldHint.',
    );

    const arrayOutputTool = toolsByName.get('linear_getIssues');
    assert.equal(
      arrayOutputTool.outputSchema.properties.items.type,
      'array',
      'Array-producing tools must advertise their array schema wrapped under an items envelope.',
    );
    assert.deepEqual(
      arrayOutputTool.outputSchema.required,
      ['items'],
      'The items envelope must be required for array-producing tools.',
    );

    for (const toolName of criticalToolNames) {
      assert.ok(actualToolNames.includes(toolName), `Expected tool ${toolName} to be registered.`);
    }

    const statusResult = await client.callTool({
      name: 'linear_getServerStatus',
      arguments: {},
    });
    assert.equal(statusResult.isError, false, 'Server status tool should run without Linear I/O.');
    assert.ok(Array.isArray(statusResult.content), 'Tool results must carry a content array.');
    assert.equal(statusResult.content[0].type, 'text', 'Tool results must be text content items.');
    const statusPayload = JSON.parse(statusResult.content[0].text);
    assert.equal(statusPayload.toolCount, actualToolNames.length);
    assert.match(
      statusPayload.version ?? '',
      /^\d+\.\d+\.\d+/,
      'Server status must report a semver version.',
    );
    // The SDK client has already validated structuredContent against the advertised
    // outputSchema during callTool; here we pin that it mirrors the text payload.
    assert.deepEqual(
      statusResult.structuredContent,
      statusPayload,
      'structuredContent must mirror the JSON text payload for object-producing tools.',
    );

    const rateLimitResult = await client.callTool({
      name: 'linear_getRateLimitStatus',
      arguments: {},
    });
    assert.equal(
      rateLimitResult.isError,
      false,
      'Rate-limit status should run without Linear I/O.',
    );
    assert.deepEqual(
      rateLimitResult.structuredContent,
      JSON.parse(rateLimitResult.content[0].text),
      'structuredContent must mirror the JSON text payload for linear_getRateLimitStatus.',
    );

    const rejectedArguments = await client.callTool({
      name: 'linear_getServerStatus',
      arguments: { unexpectedArgument: true },
    });
    assert.equal(
      rejectedArguments.isError,
      true,
      'Unknown arguments must surface an in-band error result rather than a protocol error.',
    );
    assert.equal(
      rejectedArguments.content[0].type,
      'text',
      'Error results must be text content items, not protocol-level errors.',
    );
    assert.ok(
      rejectedArguments.content[0].text.includes(
        'Unknown argument(s) for linear_getServerStatus: unexpectedArgument',
      ),
    );
    assert.equal(
      rejectedArguments.structuredContent,
      undefined,
      'Error results must stay text-only without structuredContent.',
    );

    const unknownToolResult = await client.callTool({
      name: 'linear_toolThatDoesNotExist',
      arguments: {},
    });
    assert.equal(
      unknownToolResult.isError,
      true,
      'Unknown tools must surface an in-band error result rather than a protocol error.',
    );
    assert.ok(
      unknownToolResult.content[0].text.includes('Unknown tool: linear_toolThatDoesNotExist'),
    );

    const { resources } = await client.listResources();
    const resourceUris = resources.map((resource) => resource.uri);
    assert.ok(
      resourceUris.includes('linear://viewer'),
      'Expected linear://viewer resource to be registered.',
    );
    assert.ok(
      resourceUris.includes('linear://rate-limit'),
      'Expected linear://rate-limit resource to be registered.',
    );

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

// Hard timeout so a stuck child process can never hang CI for hours.
const SMOKE_TEST_TIMEOUT_MS = 60_000;
const watchdog = setTimeout(() => {
  console.error(`MCP smoke test timed out after ${SMOKE_TEST_TIMEOUT_MS}ms`);
  process.exit(2);
}, SMOKE_TEST_TIMEOUT_MS);
watchdog.unref();

main()
  .then(() => {
    clearTimeout(watchdog);
    process.exit(0);
  })
  .catch((error) => {
    clearTimeout(watchdog);
    console.error('MCP smoke test failed:', error);
    process.exit(1);
  });
