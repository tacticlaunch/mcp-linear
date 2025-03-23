import { MCPToolDefinition } from '../../types.js';

/**
 * Tool definition for getting all cycles
 */
export const getCyclesToolDefinition: MCPToolDefinition = {
  name: 'linear_getCycles',
  description: 'Get a list of all cycles',
  input_schema: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'ID of the team to get cycles for (optional)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of cycles to return (default: 25)',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        number: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        startsAt: { type: 'string' },
        endsAt: { type: 'string' },
        completedAt: { type: 'string' },
        team: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            key: { type: 'string' },
          },
        },
      },
    },
  },
};

/**
 * Tool definition for getting the active cycle for a team
 */
export const getActiveCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_getActiveCycle',
  description: 'Get the currently active cycle for a team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'ID of the team to get the active cycle for',
      },
    },
    required: ['teamId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      number: { type: 'number' },
      name: { type: 'string' },
      description: { type: 'string' },
      startsAt: { type: 'string' },
      endsAt: { type: 'string' },
      team: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          key: { type: 'string' },
        },
      },
      progress: { type: 'number' },
      issueCount: { type: 'number' },
      completedIssueCount: { type: 'number' },
    },
  },
};

/**
 * Tool definition for adding an issue to a cycle
 */
export const addIssueToCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_addIssueToCycle',
  description: 'Add an issue to a cycle',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to add to the cycle',
      },
      cycleId: {
        type: 'string',
        description: 'ID of the cycle to add the issue to',
      },
    },
    required: ['issueId', 'cycleId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          cycle: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              number: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
