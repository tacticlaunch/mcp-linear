import { MCPToolDefinition } from '../../types.js';

const initiativeUpdateOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    body: { type: 'string' },
    health: { type: ['string', 'null'] },
    diff: { type: ['object', 'null'] },
    diffMarkdown: { type: ['string', 'null'] },
    isDiffHidden: { type: 'boolean' },
    isStale: { type: 'boolean' },
    commentCount: { type: ['number', 'null'] },
    url: { type: ['string', 'null'] },
    slugId: { type: ['string', 'null'] },
    archivedAt: { type: ['string', 'null'] },
    editedAt: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    user: { type: ['object', 'null'] },
    initiative: { type: ['object', 'null'] },
  },
};

const initiativeUpdateArchiveOutputSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    id: { type: 'string' },
  },
};

export const initiativeToolDefinitions: MCPToolDefinition[] = [
  {
    name: 'linear_getInitiatives',
    description: 'Get a list of all initiatives from Linear',
    input_schema: {
      type: 'object',
      properties: {
        includeArchived: {
          type: 'boolean',
          description: 'Include archived initiatives in the results',
          default: false,
        },
        limit: {
          type: 'number',
          description: 'Maximum number of initiatives to return',
          default: 50,
        },
      },
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
          icon: { type: 'string' },
          color: { type: 'string' },
          status: { type: 'string' },
          targetDate: { type: 'string' },
          sortOrder: { type: 'number' },
          owner: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          url: { type: 'string' },
        },
      },
    },
  },
  {
    name: 'linear_getInitiativeById',
    description: 'Get details of a specific initiative by ID',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative to retrieve',
        },
        includeProjects: {
          type: 'boolean',
          description: 'Include associated projects in the response',
          default: true,
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        icon: { type: 'string' },
        color: { type: 'string' },
        status: { type: 'string' },
        targetDate: { type: 'string' },
        sortOrder: { type: 'number' },
        owner: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        projects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              state: { type: 'string' },
            },
          },
        },
        url: { type: 'string' },
      },
    },
  },
  {
    name: 'linear_createInitiative',
    description: 'Create a new initiative',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the initiative',
        },
        description: {
          type: 'string',
          description: 'Description of the initiative',
        },
        content: {
          type: 'string',
          description: 'Content in markdown format',
        },
        ownerId: {
          type: 'string',
          description: 'ID of the user who owns the initiative',
        },
        targetDate: {
          type: 'string',
          description: 'Target completion date (ISO 8601 format)',
        },
        status: {
          type: 'string',
          description: 'Status of the initiative',
          enum: ['Planned', 'Active', 'Completed'],
        },
        icon: {
          type: 'string',
          description: 'Icon emoji for the initiative',
        },
        color: {
          type: 'string',
          description: 'Color of the initiative in hex format',
        },
      },
      required: ['name'],
    },
    output_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        url: { type: 'string' },
      },
    },
  },
  {
    name: 'linear_updateInitiative',
    description: 'Update an existing initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative to update',
        },
        name: {
          type: 'string',
          description: 'Updated name of the initiative',
        },
        description: {
          type: 'string',
          description: 'Updated description of the initiative',
        },
        content: {
          type: 'string',
          description: 'Updated content in markdown format',
        },
        ownerId: {
          type: 'string',
          description: 'Updated owner ID',
        },
        targetDate: {
          type: 'string',
          description: 'Updated target completion date (ISO 8601 format)',
        },
        status: {
          type: 'string',
          description: 'Updated status of the initiative',
          enum: ['Planned', 'Active', 'Completed'],
        },
        icon: {
          type: 'string',
          description: 'Updated icon emoji',
        },
        color: {
          type: 'string',
          description: 'Updated color in hex format',
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        url: { type: 'string' },
      },
    },
  },
  {
    name: 'linear_archiveInitiative',
    description: 'Archive an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative to archive',
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  },
  {
    name: 'linear_unarchiveInitiative',
    description: 'Unarchive an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative to unarchive',
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  },
  {
    name: 'linear_deleteInitiative',
    description: 'Delete an initiative (move to trash)',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative to delete',
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  },
  {
    name: 'linear_getInitiativeProjects',
    description: 'Get all projects associated with an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative',
        },
        includeArchived: {
          type: 'boolean',
          description: 'Include archived projects in the results',
          default: false,
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          state: { type: 'string' },
          progress: { type: 'number' },
          startDate: { type: 'string' },
          targetDate: { type: 'string' },
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
  },
  {
    name: 'linear_getInitiativeUpdateById',
    description: 'Get a specific initiative update by ID',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the initiative update to retrieve' },
      },
      required: ['id'],
    },
    output_schema: initiativeUpdateOutputSchema,
  },
  {
    name: 'linear_getInitiativeUpdates',
    description: 'Get updates for an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: { type: 'string', description: 'ID of the initiative to inspect' },
        limit: {
          type: 'integer',
          minimum: 1,
          description: 'Maximum number of initiative updates to return (default: 25)',
        },
      },
      required: ['initiativeId'],
    },
    output_schema: {
      type: 'array',
      items: initiativeUpdateOutputSchema,
    },
  },
  {
    name: 'linear_createInitiativeUpdate',
    description: 'Create a new initiative update',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: { type: 'string', description: 'ID of the initiative to update' },
        body: { type: 'string', description: 'Initiative update body in Markdown' },
        health: {
          type: 'string',
          enum: ['onTrack', 'atRisk', 'offTrack'],
          description: 'Optional health status for the initiative update',
        },
        isDiffHidden: {
          type: 'boolean',
          description: 'Whether Linear should hide the diff against the previous update',
        },
      },
      required: ['initiativeId', 'body'],
    },
    output_schema: initiativeUpdateOutputSchema,
  },
  {
    name: 'linear_updateInitiativeUpdate',
    description: 'Update an existing initiative update',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the initiative update to update' },
        body: { type: 'string', description: 'Updated body in Markdown' },
        health: {
          type: 'string',
          enum: ['onTrack', 'atRisk', 'offTrack'],
          description: 'Updated health status',
        },
        isDiffHidden: {
          type: 'boolean',
          description: 'Whether Linear should hide the diff against the previous update',
        },
      },
      required: ['id'],
    },
    output_schema: initiativeUpdateOutputSchema,
  },
  {
    name: 'linear_archiveInitiativeUpdate',
    description: 'Archive an initiative update',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the initiative update to archive' },
      },
      required: ['id'],
    },
    output_schema: initiativeUpdateArchiveOutputSchema,
  },
  {
    name: 'linear_unarchiveInitiativeUpdate',
    description: 'Restore an archived initiative update',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the initiative update to restore' },
      },
      required: ['id'],
    },
    output_schema: initiativeUpdateArchiveOutputSchema,
  },
  {
    name: 'linear_addProjectToInitiative',
    description: 'Add a project to an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative',
        },
        projectId: {
          type: 'string',
          description: 'The ID of the project to add',
        },
      },
      required: ['initiativeId', 'projectId'],
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
            initiative: {
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
  },
  {
    name: 'linear_removeProjectFromInitiative',
    description: 'Remove a project from an initiative',
    input_schema: {
      type: 'object',
      properties: {
        initiativeId: {
          type: 'string',
          description: 'The ID of the initiative',
        },
        projectId: {
          type: 'string',
          description: 'The ID of the project to remove',
        },
      },
      required: ['initiativeId', 'projectId'],
    },
    output_schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        initiative: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
];
