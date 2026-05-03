import { MCPToolDefinition } from '../../types.js';

// Linear calls these saved views in the UI, but the GraphQL API and SDK expose them as CustomView.

const savedViewOrderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
  description: "Sort order field. Supported values: 'createdAt' or 'updatedAt'",
};

const positiveLimitSchema = {
  type: 'integer',
  minimum: 1,
};

const nullableStringSchema = {
  type: ['string', 'null'],
};

const nullableObjectSchema = {
  type: ['object', 'null'],
};

const savedViewReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
};

const savedViewUserSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
  },
};

const savedViewOutputItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: nullableStringSchema,
    shared: { type: 'boolean' },
    icon: nullableStringSchema,
    color: nullableStringSchema,
    slugId: { type: 'string' },
    filterData: { type: 'object' },
    filters: { type: 'object' },
    projectFilterData: nullableObjectSchema,
    team: savedViewReferenceSchema,
    owner: savedViewUserSchema,
    creator: savedViewUserSchema,
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};

export const getSavedViewsToolDefinition: MCPToolDefinition = {
  name: 'linear_getSavedViews',
  description: 'Get Linear saved views (API: CustomView)',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of saved views to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived saved views in the results',
      },
      orderBy: {
        ...savedViewOrderBySchema,
      },
    },
  },
  output_schema: {
    type: 'array',
    items: savedViewOutputItemSchema,
  },
};

export const createSavedViewToolDefinition: MCPToolDefinition = {
  name: 'linear_createSavedView',
  description: 'Create a Linear saved view (API: createCustomView)',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Saved view name',
      },
      description: {
        type: 'string',
        description: 'Saved view description',
      },
      shared: {
        type: 'boolean',
        description: 'Whether the saved view is shared across the organization',
      },
      icon: {
        type: 'string',
        description: 'Icon for the saved view',
      },
      color: {
        type: 'string',
        description: 'Icon color for the saved view',
      },
      teamId: {
        type: 'string',
        description: 'Optional team associated with the saved view',
      },
      projectId: {
        type: 'string',
        description: 'Optional project associated with the saved view',
      },
      ownerId: {
        type: 'string',
        description: 'Optional owner for the saved view',
      },
      filters: {
        type: 'object',
        description: 'Raw filters object to store on the saved view',
      },
      filterData: {
        type: 'object',
        description: 'Issue filter data for the saved view',
      },
      projectFilterData: {
        type: 'object',
        description: 'Project filter data for the saved view',
      },
    },
    required: ['name'],
  },
  output_schema: savedViewOutputItemSchema,
};

export const updateSavedViewToolDefinition: MCPToolDefinition = {
  name: 'linear_updateSavedView',
  description:
    'Update a Linear saved view (API: updateCustomView). Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the saved view to update',
      },
      name: {
        type: 'string',
        description: 'Updated saved view name',
      },
      description: {
        ...nullableStringSchema,
        description: 'Updated saved view description. Pass null to clear it.',
      },
      shared: {
        type: 'boolean',
        description: 'Whether the saved view is shared across the organization',
      },
      icon: {
        ...nullableStringSchema,
        description: 'Updated icon for the saved view. Pass null to clear it.',
      },
      color: {
        ...nullableStringSchema,
        description: 'Updated icon color for the saved view. Pass null to clear it.',
      },
      teamId: {
        ...nullableStringSchema,
        description: 'Updated team associated with the saved view. Pass null to clear it.',
      },
      projectId: {
        ...nullableStringSchema,
        description: 'Updated project associated with the saved view. Pass null to clear it.',
      },
      ownerId: {
        ...nullableStringSchema,
        description: 'Updated owner for the saved view. Pass null to clear it.',
      },
      filters: {
        ...nullableObjectSchema,
        description: 'Updated raw filters object to store on the saved view. Pass null to clear it.',
      },
      filterData: {
        ...nullableObjectSchema,
        description: 'Updated issue filter data for the saved view. Pass null to clear it.',
      },
      projectFilterData: {
        ...nullableObjectSchema,
        description: 'Updated project filter data for the saved view. Pass null to clear it.',
      },
    },
    required: ['id'],
  },
  output_schema: savedViewOutputItemSchema,
};

export const deleteSavedViewToolDefinition: MCPToolDefinition = {
  name: 'linear_deleteSavedView',
  description: 'Delete a Linear saved view (API: deleteCustomView)',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the saved view to delete',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
    },
  },
};

export const getFavoriteViewsToolDefinition: MCPToolDefinition = {
  name: 'linear_getFavoriteViews',
  description: 'Get favorite Linear views, including saved views and predefined views',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of favorite entries to inspect (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived favorites in the results',
      },
      orderBy: {
        ...savedViewOrderBySchema,
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        sortOrder: { type: 'number' },
        customView: {
          type: ['object', 'null'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slugId: nullableStringSchema,
            shared: { type: 'boolean' },
          },
        },
        predefinedViewType: nullableStringSchema,
        predefinedViewTeam: {
          type: ['object', 'null'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        url: { type: 'string' },
      },
    },
  },
};

const favoriteOutputItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    sortOrder: { type: ['number', 'null'] },
    customView: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slugId: nullableStringSchema,
        shared: { type: 'boolean' },
      },
    },
    predefinedViewType: nullableStringSchema,
    predefinedViewTeam: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    createdAt: { type: ['string', 'null'] },
    updatedAt: { type: ['string', 'null'] },
    url: nullableStringSchema,
  },
};

const favoriteMutationOutputSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    id: nullableStringSchema,
    entityId: nullableStringSchema,
    favorite: {
      ...favoriteOutputItemSchema,
      type: ['object', 'null'],
    },
  },
};

export const addToFavoritesToolDefinition: MCPToolDefinition = {
  name: 'linear_addToFavorites',
  description: 'Add an entity to the current user\'s Linear favorites',
  input_schema: {
    type: 'object',
    properties: {
      entityId: {
        type: 'string',
        description: 'ID of the Linear entity to add to favorites',
      },
    },
    required: ['entityId'],
  },
  output_schema: favoriteMutationOutputSchema,
};

export const removeFromFavoritesToolDefinition: MCPToolDefinition = {
  name: 'linear_removeFromFavorites',
  description:
    'Remove an entity or favorite entry from the current user\'s Linear favorites. Provide either favoriteId or entityId.',
  input_schema: {
    type: 'object',
    properties: {
      favoriteId: {
        type: 'string',
        description: 'Favorite entry ID to remove when available from a favorites query',
      },
      entityId: {
        type: 'string',
        description: 'Entity ID to remove from favorites when the workspace schema supports it',
      },
    },
  },
  output_schema: favoriteMutationOutputSchema,
};
