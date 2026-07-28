import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCPToolDefinition } from './types.js';

const DISALLOWED_TOP_LEVEL_KEYS = ['oneOf', 'anyOf', 'allOf', 'enum', 'not'] as const;

/**
 * Convert an internal output_schema to the MCP outputSchema wire format.
 *
 * MCP requires outputSchema (and structuredContent) to be a JSON object at the
 * top level, but many tools return arrays. Array schemas are wrapped in a
 * required `items` envelope; buildStructuredContent applies the matching
 * wrapping to results so structuredContent always validates against the
 * advertised schema.
 */
function convertOutputSchema(
  outputSchema: MCPToolDefinition['output_schema'],
): Tool['outputSchema'] {
  if (outputSchema.type === 'array') {
    return {
      type: 'object',
      properties: {
        items: outputSchema as Record<string, unknown>,
      },
      required: ['items'],
    };
  }

  const { type: _type, ...schemaWithoutType } = outputSchema;
  return {
    type: 'object',
    ...schemaWithoutType,
  };
}

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
    outputSchema: convertOutputSchema(toolDef.output_schema),
    annotations: toolDef.annotations,
  };
}

/**
 * Build the structuredContent payload for a successful tool result so it
 * matches the outputSchema advertised by convertToolDefinition: object results
 * pass through as-is, array results are wrapped in the `items` envelope.
 * Returns undefined when the result does not match the advertised shape.
 */
export function buildStructuredContent(
  toolDef: MCPToolDefinition,
  result: unknown,
): Record<string, unknown> | undefined {
  if (toolDef.output_schema.type === 'array') {
    return Array.isArray(result) ? { items: result } : undefined;
  }

  if (result !== null && typeof result === 'object' && !Array.isArray(result)) {
    return result as Record<string, unknown>;
  }

  return undefined;
}
