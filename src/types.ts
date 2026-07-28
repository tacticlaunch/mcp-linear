/**
 * MCP tool behavior hints, advertised to clients so they can auto-allow safe
 * reads and gate destructive calls. All four hints are required internally so
 * every tool ships an explicit, reviewed classification.
 */
export interface ToolAnnotations {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
  openWorldHint: boolean;
}

/**
 * Interface for MCP Tool Definition in our format
 */
export interface MCPToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    anyOf?: Array<{ required: string[] }>;
  };
  output_schema: {
    type: string;
    properties?: Record<string, any>;
    items?: any;
  };
  annotations: ToolAnnotations;
}
