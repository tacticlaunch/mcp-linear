import { MCPToolDefinition } from '../../types.js';

const roadmapUserSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
  },
};

const roadmapProjectSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    state: { type: 'string' },
    url: { type: 'string' },
  },
};

const roadmapProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  description: { type: 'string' },
  color: { type: 'string' },
  slugId: { type: 'string' },
  sortOrder: { type: 'number' },
  owner: roadmapUserSchema,
  creator: roadmapUserSchema,
  createdAt: { type: 'string' },
  updatedAt: { type: 'string' },
  archivedAt: { type: ['string', 'null'] },
  url: { type: 'string' },
};

export const getRoadmapsToolDefinition: MCPToolDefinition = {
  name: 'linear_getRoadmaps',
  description: 'Get a list of roadmaps from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        type: 'integer',
        minimum: 1,
        default: 25,
        description: 'Maximum number of roadmaps to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Whether to include archived roadmaps in the results',
      },
      orderBy: {
        type: 'string',
        enum: ['createdAt', 'updatedAt'],
        description: 'Sort order field. Supported values: createdAt or updatedAt',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: roadmapProperties,
    },
  },
};

export const getRoadmapByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getRoadmapById',
  description: 'Get details of a specific roadmap by ID',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the roadmap to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      ...roadmapProperties,
      projects: {
        type: 'array',
        items: roadmapProjectSchema,
      },
    },
  },
};

export const createRoadmapToolDefinition: MCPToolDefinition = {
  name: 'linear_createRoadmap',
  description: 'Create a new roadmap in Linear',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the roadmap',
      },
      description: {
        type: 'string',
        description: 'The description of the roadmap',
      },
      color: {
        type: 'string',
        description: 'The roadmap color',
      },
      ownerId: {
        type: 'string',
        description: 'The ID of the roadmap owner',
      },
      sortOrder: {
        type: 'number',
        description: 'The sort order of the roadmap within the organization',
      },
    },
    required: ['name'],
  },
  output_schema: {
    type: 'object',
    properties: {
      ...roadmapProperties,
      projects: {
        type: 'array',
        items: roadmapProjectSchema,
      },
    },
  },
};

export const updateRoadmapToolDefinition: MCPToolDefinition = {
  name: 'linear_updateRoadmap',
  description: 'Update an existing roadmap',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the roadmap to update',
      },
      name: {
        type: 'string',
        description: 'The new name of the roadmap',
      },
      description: {
        type: 'string',
        description: 'The new description of the roadmap',
      },
      color: {
        type: 'string',
        description: 'The new roadmap color',
      },
      ownerId: {
        type: 'string',
        description: 'The ID of the new roadmap owner',
      },
      sortOrder: {
        type: 'number',
        description: 'The new sort order of the roadmap',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      ...roadmapProperties,
      projects: {
        type: 'array',
        items: roadmapProjectSchema,
      },
    },
  },
};

export const archiveRoadmapToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveRoadmap',
  description: 'Archive a roadmap',
  input_schema: {
    type: 'object',
    properties: {
      roadmapId: {
        type: 'string',
        description: 'The ID of the roadmap to archive',
      },
    },
    required: ['roadmapId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      roadmap: {
        type: 'object',
        properties: roadmapProperties,
      },
    },
  },
};

export const roadmapToolDefinitions: MCPToolDefinition[] = [
  getRoadmapsToolDefinition,
  getRoadmapByIdToolDefinition,
  createRoadmapToolDefinition,
  updateRoadmapToolDefinition,
  archiveRoadmapToolDefinition,
];
