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

const documentIssueReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    identifier: { type: 'string' },
    title: { type: 'string' },
  },
};

const documentReleaseReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    version: nullableStringSchema,
  },
};

const documentCycleReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: nullableStringSchema,
    number: { type: ['number', 'null'] },
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
    team: documentReferenceSchema,
    issue: documentIssueReferenceSchema,
    release: documentReleaseReferenceSchema,
    cycle: documentCycleReferenceSchema,
    resourceFolderId: nullableStringSchema,
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
      teamId: {
        type: 'string',
        description: 'Filter documents by team ID',
      },
      issueId: {
        type: 'string',
        description: 'Filter documents by issue ID',
      },
      releaseId: {
        type: 'string',
        description: 'Filter documents by release ID',
      },
      cycleId: {
        type: 'string',
        description: 'Filter documents by cycle ID',
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

export const getInitiativeDocumentsToolDefinition: MCPToolDefinition = {
  name: 'linear_getInitiativeDocuments',
  description: 'Get documents for a specific Linear initiative',
  input_schema: {
    type: 'object',
    properties: {
      initiativeId: {
        type: 'string',
        description: 'ID of the initiative whose documents should be returned',
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
    required: ['initiativeId'],
  },
  output_schema: {
    type: 'array',
    items: documentOutputSchema,
  },
};

export const getTeamDocumentsToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeamDocuments',
  description: 'Get documents associated with a specific Linear team',
  input_schema: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'ID of the team whose documents should be returned',
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
    required: ['teamId'],
  },
  output_schema: {
    type: 'array',
    items: documentOutputSchema,
  },
};

function createParentDocumentToolDefinition(
  name: string,
  description: string,
  idProperty: string,
  idDescription: string,
): MCPToolDefinition {
  return {
    name,
    description,
    input_schema: {
      type: 'object',
      properties: {
        [idProperty]: {
          type: 'string',
          description: idDescription,
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
      required: [idProperty],
    },
    output_schema: {
      type: 'array',
      items: documentOutputSchema,
    },
  };
}

export const getIssueDocumentsToolDefinition = createParentDocumentToolDefinition(
  'linear_getIssueDocuments',
  'Get documents associated with a specific Linear issue',
  'issueId',
  'ID or identifier of the issue whose documents should be returned',
);

export const getReleaseDocumentsToolDefinition = createParentDocumentToolDefinition(
  'linear_getReleaseDocuments',
  'Get documents associated with a specific Linear release',
  'releaseId',
  'ID of the release whose documents should be returned',
);

export const getCycleDocumentsToolDefinition = createParentDocumentToolDefinition(
  'linear_getCycleDocuments',
  'Get documents associated with a specific Linear cycle',
  'cycleId',
  'ID of the cycle whose documents should be returned',
);

const pinnedResourceSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string', enum: ['document', 'externalLink', 'unknown'] },
    sortOrder: { type: 'number' },
    createdAt: nullableStringSchema,
    updatedAt: nullableStringSchema,
    section: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
      },
    },
    document: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        url: nullableStringSchema,
        slugId: nullableStringSchema,
        icon: nullableStringSchema,
        color: nullableStringSchema,
        archivedAt: nullableStringSchema,
      },
    },
    externalLink: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        label: { type: 'string' },
        url: { type: 'string' },
        sortOrder: { type: 'number' },
        archivedAt: nullableStringSchema,
      },
    },
  },
};

export const getTeamResourcesToolDefinition: MCPToolDefinition = {
  name: 'linear_getTeamResources',
  description: 'Get team home resource sections and pinned documents or external links',
  input_schema: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'ID of the team whose home resources should be returned',
      },
    },
    required: ['teamId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      team: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          key: { type: 'string' },
        },
      },
      sections: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            sortOrder: { type: 'number' },
            createdAt: nullableStringSchema,
            updatedAt: nullableStringSchema,
            resources: {
              type: 'array',
              items: pinnedResourceSchema,
            },
          },
        },
      },
      unsectioned: {
        type: 'array',
        items: pinnedResourceSchema,
      },
    },
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
      teamId: { type: 'string', description: 'Optional team associated with the document' },
      issueId: { type: 'string', description: 'Optional issue associated with the document' },
      releaseId: { type: 'string', description: 'Optional release associated with the document' },
      cycleId: { type: 'string', description: 'Optional cycle associated with the document' },
      resourceFolderId: { type: 'string', description: 'Optional resource folder containing the document' },
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
      teamId: {
        ...nullableStringSchema,
        description: 'Updated team association. Pass null to clear it.',
      },
      issueId: {
        ...nullableStringSchema,
        description: 'Updated issue association. Pass null to clear it.',
      },
      releaseId: {
        ...nullableStringSchema,
        description: 'Updated release association. Pass null to clear it.',
      },
      cycleId: {
        ...nullableStringSchema,
        description: 'Updated cycle association. Pass null to clear it.',
      },
      resourceFolderId: {
        ...nullableStringSchema,
        description: 'Updated resource folder association. Pass null to clear it.',
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
