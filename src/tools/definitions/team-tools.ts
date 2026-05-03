import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = { type: 'integer', minimum: 1 };
const paginationOrderBySchema = { type: 'string', enum: ['createdAt', 'updatedAt'] };

const teamOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    key: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    color: { type: ['string', 'null'] },
    icon: { type: ['string', 'null'] },
    private: { type: 'boolean' },
    timezone: { type: ['string', 'null'] },
    archivedAt: { type: ['string', 'null'] },
  },
};

const teamMembershipOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    owner: { type: 'boolean' },
    sortOrder: { type: ['number', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    team: { type: ['object', 'null'] },
    user: { type: ['object', 'null'] },
  },
};

const workflowStateOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    type: { type: 'string' },
    position: { type: 'number' },
    color: { type: 'string' },
    description: { type: ['string', 'null'] },
    team: { type: ['object', 'null'] },
  },
};

const teamLabelOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    color: { type: 'string' },
    description: { type: ['string', 'null'] },
    team: { type: ['object', 'null'] },
    parent: { type: ['object', 'null'] },
  },
};

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

export const createWorkflowStateToolDefinition: MCPToolDefinition = {
  name: 'linear_createWorkflowState',
  description: 'Create a new workflow state',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Workflow state name' },
      teamId: { type: 'string', description: 'Team that owns the workflow state' },
      type: { type: 'string', description: 'Workflow state type' },
      color: { type: 'string', description: 'Workflow state color' },
      description: { type: 'string', description: 'Optional workflow state description' },
      position: { type: 'number', description: 'Optional position in the workflow' },
    },
    required: ['name', 'teamId', 'type', 'color'],
  },
  output_schema: workflowStateOutputSchema,
};

export const updateWorkflowStateToolDefinition: MCPToolDefinition = {
  name: 'linear_updateWorkflowState',
  description: 'Update a workflow state. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the workflow state to update' },
      name: { type: 'string' },
      color: { type: 'string' },
      description: { type: 'string' },
      position: { type: 'number' },
    },
    required: ['id'],
  },
  output_schema: workflowStateOutputSchema,
};

export const updateTeamToolDefinition: MCPToolDefinition = {
  name: 'linear_updateTeam',
  description: 'Update team settings',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the team to update' },
      name: { type: 'string' },
      key: { type: 'string' },
      description: { type: 'string' },
      color: { type: 'string' },
      icon: { type: 'string' },
      timezone: { type: 'string' },
      parentId: { type: 'string' },
      private: { type: 'boolean' },
    },
    required: ['id'],
  },
  output_schema: teamOutputSchema,
};

export const getTeamMembershipsToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeamMemberships',
  description: 'Get team memberships',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team to inspect' },
      limit: { ...positiveLimitSchema, description: 'Maximum number of memberships to return (default: 25)' },
      includeArchived: { type: 'boolean', description: 'Include archived memberships' },
      orderBy: { ...paginationOrderBySchema, description: 'Sort memberships by created or updated date' },
    },
    required: ['teamId'],
  },
  output_schema: { type: 'array', items: teamMembershipOutputSchema },
};

export const createTeamToolDefinition: MCPToolDefinition = {
  name: 'linear_createTeam',
  description: 'Create a new team',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Team name' },
      key: { type: 'string' },
      description: { type: 'string' },
      color: { type: 'string' },
      icon: { type: 'string' },
      timezone: { type: 'string' },
      parentId: { type: 'string' },
      private: { type: 'boolean' },
    },
    required: ['name'],
  },
  output_schema: teamOutputSchema,
};

export const archiveTeamToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveTeam',
  description: 'Archive a team',
  input_schema: { type: 'object', properties: { id: { type: 'string', description: 'ID of the team to archive' } }, required: ['id'] },
  output_schema: { type: 'object', properties: { success: { type: 'boolean' }, id: { type: 'string' } } },
};

export const addUserToTeamToolDefinition: MCPToolDefinition = {
  name: 'linear_addUserToTeam',
  description: 'Add a user to a team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team to update' },
      userId: { type: 'string', description: 'ID of the user to add' },
      owner: { type: 'boolean', description: 'Whether the user should be a team owner' },
      sortOrder: { type: 'number', description: 'Optional membership sort order' },
    },
    required: ['teamId', 'userId'],
  },
  output_schema: teamMembershipOutputSchema,
};

export const removeUserFromTeamToolDefinition: MCPToolDefinition = {
  name: 'linear_removeUserFromTeam',
  description: 'Remove a user from a team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team to update' },
      userId: { type: 'string', description: 'ID of the user to remove' },
      alsoLeaveParentTeams: { type: 'boolean', description: 'Also leave parent teams when removing membership' },
    },
    required: ['teamId', 'userId'],
  },
  output_schema: { type: 'object', properties: { success: { type: 'boolean' }, teamId: { type: 'string' }, userId: { type: 'string' } } },
};

export const updateTeamMembershipToolDefinition: MCPToolDefinition = {
  name: 'linear_updateTeamMembership',
  description: 'Update a user\'s role in a team. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the team membership to update' },
      owner: { type: 'boolean' },
      sortOrder: { type: 'number' },
    },
    required: ['id'],
  },
  output_schema: teamMembershipOutputSchema,
};

export const getTeamLabelsToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeamLabels',
  description: 'Get labels for a specific team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team to inspect' },
      limit: { ...positiveLimitSchema, description: 'Maximum number of labels to return (default: 25)' },
      includeArchived: { type: 'boolean', description: 'Include archived labels' },
      orderBy: { ...paginationOrderBySchema, description: 'Sort labels by created or updated date' },
    },
    required: ['teamId'],
  },
  output_schema: { type: 'array', items: teamLabelOutputSchema },
};

export const createTeamLabelToolDefinition: MCPToolDefinition = {
  name: 'linear_createTeamLabel',
  description: 'Create a new label for a team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team that owns the label' },
      name: { type: 'string', description: 'Label name' },
      color: { type: 'string', description: 'Label color' },
      description: { type: 'string', description: 'Optional label description' },
      parentId: { type: 'string', description: 'Optional parent label ID' },
    },
    required: ['teamId', 'name'],
  },
  output_schema: teamLabelOutputSchema,
};
