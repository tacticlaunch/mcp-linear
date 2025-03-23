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
  };
  output_schema: {
    type: string;
    properties?: Record<string, any>;
    items?: any;
  };
}
