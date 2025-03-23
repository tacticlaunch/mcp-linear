import { MCPToolDefinition } from '../../types.js';

/**
 * Tool definition for getting teams
 */
export const getTeamsToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeams',
  description: 'Get a list of teams from Linear',
  input_schema: {
    type: 'object',
    properties: {},
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        key: { type: 'string' },
        description: { type: 'string' },
        states: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

/**
 * Tool definition for getting workflow states for a team
 */
export const getWorkflowStatesToolDefinition: MCPToolDefinition = {
  name: 'linear_getWorkflowStates',
  description: 'Get workflow states for a team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'ID of the team to get workflow states for',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Whether to include archived states (default: false)',
      },
    },
    required: ['teamId'],
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        position: { type: 'number' },
        color: { type: 'string' },
        description: { type: 'string' },
      },
    },
  },
};
