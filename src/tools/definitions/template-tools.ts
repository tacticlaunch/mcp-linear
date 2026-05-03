import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = {
  type: 'integer',
  minimum: 1,
};

const paginationOrderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
};

const templateOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    sortOrder: { type: 'number' },
    type: { type: 'string' },
    archivedAt: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    templateData: { type: 'object', additionalProperties: true },
    team: { type: ['object', 'null'] },
    creator: { type: ['object', 'null'] },
  },
};

export const getIssueTemplatesToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssueTemplates',
  description: 'Get a list of issue templates',
  input_schema: {
    type: 'object',
    properties: {
      limit: { ...positiveLimitSchema, description: 'Maximum number of templates to return (default: 25)' },
      includeArchived: { type: 'boolean', description: 'Include archived templates' },
      orderBy: { ...paginationOrderBySchema, description: 'Sort templates by created or updated date' },
    },
  },
  output_schema: { type: 'array', items: templateOutputSchema },
};

export const getIssueTemplateByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssueTemplateById',
  description: 'Get details of a specific issue template',
  input_schema: { type: 'object', properties: { id: { type: 'string', description: 'ID of the template to retrieve' } }, required: ['id'] },
  output_schema: templateOutputSchema,
};

export const createIssueTemplateToolDefinition: MCPToolDefinition = {
  name: 'linear_createIssueTemplate',
  description: 'Create a new issue template',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Template name' },
      description: { type: 'string', description: 'Optional template description' },
      teamId: { type: 'string', description: 'Optional team ID' },
      templateData: { type: 'object', additionalProperties: true, description: 'Template issue payload as JSON' },
      sortOrder: { type: 'number', description: 'Optional sort order' },
    },
    required: ['name', 'templateData'],
  },
  output_schema: templateOutputSchema,
};

export const updateIssueTemplateToolDefinition: MCPToolDefinition = {
  name: 'linear_updateIssueTemplate',
  description: 'Update an existing issue template. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the template to update' },
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      teamId: { type: ['string', 'null'] },
      templateData: { type: 'object', additionalProperties: true },
      sortOrder: { type: 'number' },
    },
    required: ['id'],
  },
  output_schema: templateOutputSchema,
};

export const createIssueFromTemplateToolDefinition: MCPToolDefinition = {
  name: 'linear_createIssueFromTemplate',
  description: 'Create a new issue from a template',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team where the issue will be created' },
      templateId: { type: 'string', description: 'ID of the issue template to apply' },
      title: { type: 'string', description: 'Optional title override' },
      description: { type: 'string', description: 'Optional description override' },
      priority: { type: 'number', description: 'Optional priority override' },
      projectId: { type: 'string', description: 'Optional project override' },
      projectMilestoneId: { type: 'string', description: 'Optional project milestone override' },
      cycleId: { type: 'string', description: 'Optional cycle override' },
    },
    required: ['teamId', 'templateId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      url: { type: 'string' },
    },
  },
};

export const getTeamTemplatesToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeamTemplates',
  description: 'Get templates for a specific team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: { type: 'string', description: 'ID of the team to inspect' },
      limit: { ...positiveLimitSchema, description: 'Maximum number of templates to return (default: 25)' },
      includeArchived: { type: 'boolean', description: 'Include archived templates' },
      orderBy: { ...paginationOrderBySchema, description: 'Sort templates by created or updated date' },
    },
    required: ['teamId'],
  },
  output_schema: { type: 'array', items: templateOutputSchema },
};

export const archiveTemplateToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveTemplate',
  description: 'Archive an issue template',
  input_schema: { type: 'object', properties: { id: { type: 'string', description: 'ID of the template to archive' } }, required: ['id'] },
  output_schema: { type: 'object', properties: { success: { type: 'boolean' }, id: { type: 'string' } } },
};
