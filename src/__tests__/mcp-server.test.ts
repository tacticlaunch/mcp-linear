import { convertToolDefinition } from '../tool-schema.js';
import { getLinearPromptDefinitions } from '../mcp-prompts.js';
import { getLinearResourceDefinitions } from '../mcp-resources.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { removeFromFavoritesToolDefinition } from '../tools/definitions/view-tools.js';

describe('convertToolDefinition', () => {
  it('drops top-level schema composition keywords that break some MCP hosts', () => {
    const toolDefinition = {
      ...removeFromFavoritesToolDefinition,
      input_schema: {
        ...removeFromFavoritesToolDefinition.input_schema,
        anyOf: [{ required: ['favoriteId'] }, { required: ['entityId'] }],
      },
    };

    const converted = convertToolDefinition(toolDefinition);

    expect(converted.inputSchema).toEqual(
      expect.objectContaining({
        type: 'object',
        properties: toolDefinition.input_schema.properties,
      }),
    );
    expect(converted.inputSchema).not.toHaveProperty('anyOf');
  });

  it('emits host-compatible top-level input schemas for every tool', () => {
    const disallowedTopLevelKeys = ['oneOf', 'anyOf', 'allOf', 'enum', 'not'];

    for (const toolDefinition of allToolDefinitions) {
      const converted = convertToolDefinition(toolDefinition);

      expect(converted.inputSchema).toEqual(
        expect.objectContaining({
          type: 'object',
        }),
      );

      for (const key of disallowedTopLevelKeys) {
        expect(converted.inputSchema).not.toHaveProperty(key);
      }
    }
  });

  it('exposes MCP-native resources and prompts', () => {
    const resources = getLinearResourceDefinitions();
    const prompts = getLinearPromptDefinitions();

    expect(resources.length).toBeGreaterThan(0);
    expect(prompts.length).toBeGreaterThan(0);
  });
});
