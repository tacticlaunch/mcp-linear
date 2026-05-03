import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCPToolDefinition } from './types.js';

const DISALLOWED_TOP_LEVEL_KEYS = ['oneOf', 'anyOf', 'allOf', 'enum', 'not'] as const;

/**
 * Convert MCPToolDefinition to the MCP SDK Tool format
 */
export function convertToolDefinition(toolDef: MCPToolDefinition): Tool {
  const { type: _type, ...schemaPropertiesWithoutType } = toolDef.input_schema;
  const sanitizedSchema = { ...schemaPropertiesWithoutType } as Record<string, unknown>;

  // Some MCP hosts reject top-level schema composition keywords even though
  // they are valid JSON Schema. Keep tool registration host-compatible and let
  // runtime type guards enforce the more precise cross-field requirements.
  for (const key of DISALLOWED_TOP_LEVEL_KEYS) {
    delete sanitizedSchema[key];
  }

  return {
    name: toolDef.name,
    description: toolDef.description,
    inputSchema: {
      type: 'object',
      ...sanitizedSchema,
    },
  };
}
