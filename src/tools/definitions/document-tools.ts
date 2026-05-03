import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = {
  type: 'integer',
  minimum: 1,
};

const paginationOrderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
};

const nullableStringSchema = {
  type: ['string', 'null'],
};

const documentReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
};

const documentUserSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
  },
};

const documentOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    content: nullableStringSchema,
    color: nullableStringSchema,
    icon: nullableStringSchema,
    slugId: { type: 'string' },
    sortOrder: { type: 'number' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    archivedAt: nullableStringSchema,
    hiddenAt: nullableStringSchema,
    trashed: { type: 'boolean' },
    documentContentId: nullableStringSchema,
    url: { type: 'string' },
    creator: documentUserSchema,
    updatedBy: documentUserSchema,
    project: documentReferenceSchema,
    initiative: documentReferenceSchema,
    lastAppliedTemplate: documentReferenceSchema,
  },
};

export const getDocumentsToolDefinition: MCPToolDefinition = {
  name: 'linear_getDocuments',
  description: 'Get workspace documents from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of documents to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived documents in the results',
      },
      orderBy: {
        ...paginationOrderBySchema,
        description: 'Sort documents by created or updated date',
      },
      projectId: {
        type: 'string',
        description: 'Filter documents by project ID',
      },
      initiativeId: {
        type: 'string',
        description: 'Filter documents by initiative ID',
      },
      title: {
        type: 'string',
        description: 'Case-insensitive title search filter',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: documentOutputSchema,
  },
};

export const getDocumentByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getDocumentById',
  description: 'Get details of a specific Linear document',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the document to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: documentOutputSchema,
};

export const getProjectDocumentsToolDefinition: MCPToolDefinition = {
  name: 'linear_getProjectDocuments',
  description: 'Get documents for a specific Linear project',
  input_schema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'ID of the project whose documents should be returned',
      },
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of documents to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived documents in the results',
      },
      orderBy: {
        ...paginationOrderBySchema,
        description: 'Sort documents by created or updated date',
      },
      title: {
        type: 'string',
        description: 'Case-insensitive title search filter',
      },
    },
    required: ['projectId'],
  },
  output_schema: {
    type: 'array',
    items: documentOutputSchema,
  },
};

export const searchDocumentsToolDefinition: MCPToolDefinition = {
  name: 'linear_searchDocuments',
  description: 'Search Linear documents by term',
  input_schema: {
    type: 'object',
    properties: {
      term: {
        type: 'string',
        description: 'Search term for document titles and content',
      },
      teamId: {
        type: 'string',
        description: 'Optional team ID to scope the search',
      },
      includeComments: {
        type: 'boolean',
        description: 'Include comment matches in the search payload when supported',
      },
      limit: {
        ...positiveLimitSchema,
        description: 'Maximum number of results to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived documents in the search',
      },
      orderBy: {
        ...paginationOrderBySchema,
        description: 'Sort results by created or updated date',
      },
      snippetSize: {
        type: 'number',
        description: 'Optional snippet size for search result context',
      },
    },
    required: ['term'],
  },
  output_schema: {
    type: 'object',
    properties: {
      totalCount: { type: 'number' },
      nodes: {
        type: 'array',
        items: {
          ...documentOutputSchema,
          properties: {
            ...documentOutputSchema.properties,
            metadata: { type: ['object', 'null'] },
          },
        },
      },
    },
  },
};

export const getDocumentContentHistoryToolDefinition: MCPToolDefinition = {
  name: 'linear_getDocumentContentHistory',
  description: 'Get content history entries for a Linear document content record',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Document content ID to inspect',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            actorIds: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string' },
            contentDataSnapshotAt: { type: 'string' },
          },
        },
      },
    },
  },
};

export const createDocumentToolDefinition: MCPToolDefinition = {
  name: 'linear_createDocument',
  description: 'Create a new Linear document',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Document title' },
      content: { type: 'string', description: 'Markdown content for the document' },
      icon: { type: 'string', description: 'Icon for the document' },
      color: { type: 'string', description: 'Icon color for the document' },
      projectId: { type: 'string', description: 'Optional project associated with the document' },
      initiativeId: { type: 'string', description: 'Optional initiative associated with the document' },
      lastAppliedTemplateId: { type: 'string', description: 'Optional template last applied to the document' },
      sortOrder: { type: 'number', description: 'Optional sort order in the resources list' },
    },
    required: ['title'],
  },
  output_schema: documentOutputSchema,
};

export const updateDocumentToolDefinition: MCPToolDefinition = {
  name: 'linear_updateDocument',
  description: 'Update an existing Linear document. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the document to update' },
      title: { type: 'string', description: 'Updated document title' },
      content: {
        ...nullableStringSchema,
        description: 'Updated markdown content. Pass null to clear it.',
      },
      icon: {
        ...nullableStringSchema,
        description: 'Updated icon. Pass null to clear it.',
      },
      color: {
        ...nullableStringSchema,
        description: 'Updated icon color. Pass null to clear it.',
      },
      hiddenAt: {
        ...nullableStringSchema,
        description: 'ISO timestamp for hiding the document. Pass null to clear it.',
      },
      projectId: {
        ...nullableStringSchema,
        description: 'Updated project association. Pass null to clear it.',
      },
      initiativeId: {
        ...nullableStringSchema,
        description: 'Updated initiative association. Pass null to clear it.',
      },
      lastAppliedTemplateId: {
        ...nullableStringSchema,
        description: 'Updated last applied template. Pass null to clear it.',
      },
      sortOrder: { type: 'number', description: 'Updated sort order in the resources list' },
      trashed: { type: 'boolean', description: 'Whether the document should be marked as trashed' },
    },
    required: ['id'],
  },
  output_schema: documentOutputSchema,
};

export const archiveDocumentToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveDocument',
  description: 'Archive (trash) a Linear document',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the document to archive' },
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

export const unarchiveDocumentToolDefinition: MCPToolDefinition = {
  name: 'linear_unarchiveDocument',
  description: 'Restore a previously archived Linear document',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the document to restore' },
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
