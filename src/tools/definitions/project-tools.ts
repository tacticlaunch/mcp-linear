import { MCPToolDefinition } from '../../types.js';

const issueOrderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
};

const positiveLimitSchema = {
  type: 'integer',
  minimum: 1,
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

/**
 * Tool definition for getting projects
 */
export const getProjectsToolDefinition: MCPToolDefinition = {
  name: 'linear_getProjects',
  description: 'Get a list of projects from Linear',
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
        description: { type: 'string' },
        content: { type: 'string' },
        state: { type: 'string' },
        teams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
        url: { type: 'string' },
      },
    },
  },
};

export const getProjectMembersToolDefinition: MCPToolDefinition = {
  name: 'linear_getProjectMembers',
  description: 'Get members assigned to a project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'ID of the project to inspect' },
      limit: { ...positiveLimitSchema, description: 'Maximum number of members to return (default: 25)' },
      includeArchived: { type: 'boolean', description: 'Include archived members' },
      includeDisabled: { type: 'boolean', description: 'Include disabled users' },
      orderBy: { ...issueOrderBySchema, description: 'Sort members by created or updated date when supported' },
    },
    required: ['projectId'],
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: ['string', 'null'] },
        displayName: { type: ['string', 'null'] },
      },
    },
  },
};

export const addProjectMemberToolDefinition: MCPToolDefinition = {
  name: 'linear_addProjectMember',
  description: 'Add a member to a project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'ID of the project to update' },
      userId: { type: 'string', description: 'ID of the user to add' },
    },
    required: ['projectId', 'userId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      projectId: { type: 'string' },
      userId: { type: 'string' },
    },
  },
};

export const removeProjectMemberToolDefinition: MCPToolDefinition = {
  name: 'linear_removeProjectMember',
  description: 'Remove a member from a project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'ID of the project to update' },
      userId: { type: 'string', description: 'ID of the user to remove' },
    },
    required: ['projectId', 'userId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      projectId: { type: 'string' },
      userId: { type: 'string' },
    },
  },
};

/**
 * Tool definition for creating a project
 */
export const createProjectToolDefinition: MCPToolDefinition = {
  name: 'linear_createProject',
  description: 'Create a new project in Linear',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the project',
      },
      description: {
        type: 'string',
        description: 'Short summary of the project',
      },
      content: {
        type: 'string',
        description: 'Content of the project (Markdown supported)',
      },
      teamIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of the teams this project belongs to',
      },
      state: {
        type: 'string',
        description:
          "Initial state of the project (e.g., 'planned', 'started', 'paused', 'completed', 'canceled')",
      },
    },
    required: ['name', 'teamIds'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      url: { type: 'string' },
    },
  },
};

/**
 * Tool definition for updating a project
 */
export const updateProjectToolDefinition: MCPToolDefinition = {
  name: 'linear_updateProject',
  description: 'Update an existing project in Linear',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the project to update',
      },
      name: {
        type: 'string',
        description: 'New name of the project',
      },
      description: {
        type: 'string',
        description: 'New short summary of the project',
      },
      content: {
        type: 'string',
        description: 'New content of the project (Markdown supported)',
      },
      state: {
        type: 'string',
        description:
          "New state of the project (e.g., 'planned', 'started', 'paused', 'completed', 'canceled')",
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      state: { type: 'string' },
      url: { type: 'string' },
    },
  },
};

/**
 * Tool definition for creating a project update
 */
export const createProjectUpdateToolDefinition: MCPToolDefinition = {
  name: 'linear_createProjectUpdate',
  description: 'Create a new project update for a Linear project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'ID of the project to create the update for',
      },
      body: {
        type: 'string',
        description: 'Body content of the project update',
      },
      health: {
        type: 'string',
        description: 'Optional health status for the update',
        enum: ['onTrack', 'atRisk', 'offTrack'],
      },
    },
    required: ['projectId', 'body'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      body: { type: 'string' },
      health: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
      project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for updating a project update
 */
export const updateProjectUpdateToolDefinition: MCPToolDefinition = {
  name: 'linear_updateProjectUpdate',
  description: 'Update an existing project update in Linear',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the project update to update',
      },
      body: {
        type: 'string',
        description: 'Updated body content of the project update',
      },
      health: {
        type: 'string',
        description: 'Updated health status for the project update',
        enum: ['onTrack', 'atRisk', 'offTrack'],
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      body: { type: 'string' },
      health: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
      project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for getting project updates
 */
export const getProjectUpdatesToolDefinition: MCPToolDefinition = {
  name: 'linear_getProjectUpdates',
  description: 'Get all updates associated with a project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'ID of the project to get updates for',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of project updates to return (default: 25)',
      },
    },
    required: ['projectId'],
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        body: { type: 'string' },
        health: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
};

/**
 * Tool definition for archiving a project
 */
export const archiveProjectToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveProject',
  description: 'Archive a project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'ID of the project to archive',
      },
    },
    required: ['projectId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          state: { type: 'string' },
          archivedAt: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for adding an issue to a project
 */
export const addIssueToProjectToolDefinition: MCPToolDefinition = {
  name: 'linear_addIssueToProject',
  description: 'Add an existing issue to a project',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to add to the project',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to add the issue to',
      },
    },
    required: ['issueId', 'projectId'],
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
          project: {
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
 * Tool definition for removing an issue from a project
 */
export const removeIssueFromProjectToolDefinition: MCPToolDefinition = {
  name: 'linear_removeIssueFromProject',
  description: 'Remove an existing issue from a project',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to remove from the project',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to remove the issue from',
      },
    },
    required: ['issueId', 'projectId'],
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
      project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for getting issues in a project
 */
export const getProjectIssuesToolDefinition: MCPToolDefinition = {
  name: 'linear_getProjectIssues',
  description: 'Get issues associated with a project, with PM-friendly filters like state, assignee, labels, cycle, and milestone',
  input_schema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'ID of the project to get issues for',
      },
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of issues to return (default: 25)',
      },
      states: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter issues by workflow state names',
      },
      assigneeId: {
        type: 'string',
        description: 'Filter issues by assignee ID',
      },
      labelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter issues by label IDs',
      },
      cycleId: {
        type: 'string',
        description: 'Filter issues by cycle ID',
      },
      projectMilestoneId: {
        type: 'string',
        description: 'Filter issues by project milestone ID',
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
    required: ['projectId'],
  },
  output_schema: {
    type: 'array',
    items: {
      ...issueSummaryOutputSchema,
    },
  },
};
