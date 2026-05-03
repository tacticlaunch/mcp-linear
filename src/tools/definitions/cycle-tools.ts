import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = {
  type: 'integer',
  minimum: 1,
};

const issueOrderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
};

const issueSummaryOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    identifier: { type: 'string' },
    title: { type: 'string' },
    description: { type: ['string', 'null'] },
    state: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        color: { type: ['string', 'null'] },
        type: { type: ['string', 'null'] },
      },
    },
    priority: { type: 'number' },
    estimate: { type: ['number', 'null'] },
    dueDate: { type: ['string', 'null'] },
    team: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    assignee: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    cycle: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    projectMilestone: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    labels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          color: { type: 'string' },
        },
      },
    },
    sortOrder: { type: 'number' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    url: { type: 'string' },
  },
};

const cycleOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    number: { type: 'number' },
    name: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    startsAt: { type: 'string' },
    endsAt: { type: 'string' },
    completedAt: { type: ['string', 'null'] },
    progress: { type: ['number', 'null'] },
    team: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        key: { type: 'string' },
      },
    },
  },
};

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
        ...positiveLimitSchema,
        description: 'Maximum number of cycles to return (default: 25)',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      ...cycleOutputSchema,
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
    ...cycleOutputSchema,
    properties: {
      ...cycleOutputSchema.properties,
      progress: { type: 'number' },
      issueCount: { type: 'number' },
      completedIssueCount: { type: 'number' },
    },
  },
};

export const getCycleByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getCycleById',
  description: 'Get details of a specific cycle',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the cycle to retrieve' },
    },
    required: ['id'],
  },
  output_schema: cycleOutputSchema,
};

export const createCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_createCycle',
  description: 'Create a new cycle',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team the cycle belongs to' },
      startsAt: { type: 'string', description: 'Cycle start timestamp or date' },
      endsAt: { type: 'string', description: 'Cycle end timestamp or date' },
      name: { type: 'string', description: 'Optional custom cycle name' },
      description: { type: 'string', description: 'Optional cycle description' },
      completedAt: { type: 'string', description: 'Optional completion timestamp' },
    },
    required: ['teamId', 'startsAt', 'endsAt'],
  },
  output_schema: cycleOutputSchema,
};

export const updateCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_updateCycle',
  description: 'Update an existing cycle. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the cycle to update' },
      startsAt: { type: 'string', description: 'Updated cycle start timestamp or date' },
      endsAt: { type: 'string', description: 'Updated cycle end timestamp or date' },
      name: { type: 'string', description: 'Updated custom cycle name' },
      description: { type: 'string', description: 'Updated cycle description' },
      completedAt: { type: 'string', description: 'Optional completion timestamp' },
    },
    required: ['id'],
  },
  output_schema: cycleOutputSchema,
};

export const completeCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_completeCycle',
  description: 'Mark a cycle as complete',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the cycle to complete' },
    },
    required: ['id'],
  },
  output_schema: cycleOutputSchema,
};

export const getCycleStatsToolDefinition: MCPToolDefinition = {
  name: 'linear_getCycleStats',
  description: 'Get statistics for a cycle',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the cycle to inspect' },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      number: { type: 'number' },
      name: { type: ['string', 'null'] },
      progress: { type: 'number' },
      issueCount: { type: 'number' },
      completedIssueCount: { type: 'number' },
      scopeHistory: { type: 'array', items: { type: 'number' } },
      completedScopeHistory: { type: 'array', items: { type: 'number' } },
      completedIssueCountHistory: { type: 'array', items: { type: 'number' } },
      issueCountHistory: { type: 'array', items: { type: 'number' } },
    },
  },
};

export const getCycleIssuesToolDefinition: MCPToolDefinition = {
  name: 'linear_getCycleIssues',
  description: 'Get issues in a cycle, with PM-friendly filters like state, assignee, labels, and completion status',
  input_schema: {
    type: 'object',
    properties: {
      cycleId: {
        type: 'string',
        description: 'ID of the cycle to get issues for',
      },
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of issues to return (default: 25)',
      },
      states: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter cycle issues by workflow state names',
      },
      assigneeId: {
        type: 'string',
        description: 'Filter cycle issues by assignee ID',
      },
      labelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter cycle issues by label IDs',
      },
      includeCompleted: {
        type: 'boolean',
        description: 'Include completed issues in the result set (default: true)',
      },
      orderBy: {
        ...issueOrderBySchema,
        description: 'Sort issues by created or updated date',
      },
    },
    required: ['cycleId'],
  },
  output_schema: {
    type: 'array',
    items: {
      ...issueSummaryOutputSchema,
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

/**
 * Tool definition for removing an issue from a cycle
 */
export const removeIssueFromCycleToolDefinition: MCPToolDefinition = {
  name: 'linear_removeIssueFromCycle',
  description: 'Remove an issue from a cycle',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to remove from the cycle',
      },
      cycleId: {
        type: 'string',
        description: 'ID of the cycle to remove the issue from',
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
        },
      },
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
};
