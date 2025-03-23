import { MCPToolDefinition } from '../../types.js';

/**
 * Tool definition for getting the current viewer's information
 */
export const getViewerToolDefinition: MCPToolDefinition = {
  name: 'linear_getViewer',
  description: 'Get information about the currently authenticated user',
  input_schema: {
    type: 'object',
    properties: {},
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      active: { type: 'boolean' },
      displayName: { type: 'string' },
      organization: {
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
 * Tool definition for getting organization information
 */
export const getOrganizationToolDefinition: MCPToolDefinition = {
  name: 'linear_getOrganization',
  description: 'Get information about the current Linear organization',
  input_schema: {
    type: 'object',
    properties: {},
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      urlKey: { type: 'string' },
      logoUrl: { type: 'string' },
    },
  },
};

/**
 * Tool definition for getting users
 */
export const getUsersToolDefinition: MCPToolDefinition = {
  name: 'linear_getUsers',
  description: 'Get a list of users in the Linear organization',
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
        email: { type: 'string' },
        displayName: { type: 'string' },
        active: { type: 'boolean' },
      },
    },
  },
};

/**
 * Tool definition for getting labels
 */
export const getLabelsToolDefinition: MCPToolDefinition = {
  name: 'linear_getLabels',
  description: 'Get a list of issue labels from Linear',
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
        color: { type: 'string' },
        team: {
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
