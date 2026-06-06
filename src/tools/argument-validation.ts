import { MCPToolDefinition } from '../types.js';

export function validateToolArguments(
  toolDefinitions: MCPToolDefinition[],
  toolName: string,
  args: unknown,
) {
  if (args === null || args === undefined) {
    return;
  }

  if (typeof args !== 'object' || Array.isArray(args)) {
    return;
  }

  const toolDefinition = toolDefinitions.find((tool) => tool.name === toolName);
  if (!toolDefinition) {
    return;
  }

  const allowedKeys = new Set(Object.keys(toolDefinition.input_schema.properties ?? {}));
  const unknownKeys = Object.keys(args).filter((key) => !allowedKeys.has(key));

  if (unknownKeys.length > 0) {
    throw new Error(`Unknown argument(s) for ${toolName}: ${unknownKeys.join(', ')}`);
  }
}
