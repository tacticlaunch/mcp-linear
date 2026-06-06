import { MCPToolDefinition } from '../../types.js';

const paginationSchema = {
  type: 'integer',
  minimum: 1,
};

const orderBySchema = {
  type: 'string',
  enum: ['createdAt', 'updatedAt'],
};

const releasePipelineTypeSchema = {
  type: 'string',
  enum: ['continuous', 'scheduled'],
};

const releaseStageTypeSchema = {
  type: 'string',
  enum: ['planned', 'started', 'completed', 'canceled'],
};

const userReferenceSchema = {
  type: ['object', 'null'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: ['string', 'null'] },
  },
};

const teamReferenceSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    key: { type: ['string', 'null'] },
  },
};

const issueReferenceSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    identifier: { type: 'string' },
    title: { type: 'string' },
  },
};

const releaseStageProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  color: { type: ['string', 'null'] },
  type: releaseStageTypeSchema,
  position: { type: ['number', 'null'] },
  description: { type: ['string', 'null'] },
  frozen: { type: 'boolean' },
  createdAt: { type: ['string', 'null'] },
  updatedAt: { type: ['string', 'null'] },
  archivedAt: { type: ['string', 'null'] },
};

const releasePipelineSummaryProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  slugId: { type: ['string', 'null'] },
  description: { type: ['string', 'null'] },
  type: releasePipelineTypeSchema,
  production: { type: 'boolean' },
  pathPatterns: {
    type: 'array',
    items: { type: 'string' },
  },
  createdAt: { type: ['string', 'null'] },
  updatedAt: { type: ['string', 'null'] },
  archivedAt: { type: ['string', 'null'] },
  url: { type: ['string', 'null'] },
};

const releasePipelineSummarySchema = {
  type: 'object',
  properties: releasePipelineSummaryProperties,
};

const releaseSummaryProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  version: { type: ['string', 'null'] },
  description: { type: ['string', 'null'] },
  commitSha: { type: ['string', 'null'] },
  startDate: { type: ['string', 'null'] },
  targetDate: { type: ['string', 'null'] },
  startedAt: { type: ['string', 'null'] },
  completedAt: { type: ['string', 'null'] },
  canceledAt: { type: ['string', 'null'] },
  createdAt: { type: ['string', 'null'] },
  updatedAt: { type: ['string', 'null'] },
  trashed: { type: ['boolean', 'null'] },
  url: { type: ['string', 'null'] },
  issueCount: { type: ['number', 'null'] },
  currentProgress: { type: ['object', 'null'], additionalProperties: true },
  creator: userReferenceSchema,
  pipeline: {
    type: ['object', 'null'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      slugId: { type: ['string', 'null'] },
      type: releasePipelineTypeSchema,
    },
  },
  stage: {
    type: ['object', 'null'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      color: { type: ['string', 'null'] },
      type: releaseStageTypeSchema,
      frozen: { type: 'boolean' },
    },
  },
};

const releaseSummarySchema = {
  type: 'object',
  properties: releaseSummaryProperties,
};

const releaseNoteSummaryProperties = {
  id: { type: 'string' },
  title: { type: ['string', 'null'] },
  slugId: { type: ['string', 'null'] },
  content: { type: ['string', 'null'] },
  createdAt: { type: ['string', 'null'] },
  updatedAt: { type: ['string', 'null'] },
  lastRelease: {
    type: ['object', 'null'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      version: { type: ['string', 'null'] },
    },
  },
  releases: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        version: { type: ['string', 'null'] },
      },
    },
  },
};

const releaseNoteSummarySchema = {
  type: 'object',
  properties: releaseNoteSummaryProperties,
};

const releaseStageSchema = {
  type: 'object',
  properties: {
    ...releaseStageProperties,
    pipeline: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slugId: { type: ['string', 'null'] },
        type: releasePipelineTypeSchema,
      },
    },
  },
};

const releasePipelineDetailSchema = {
  type: 'object',
  properties: {
    ...releasePipelineSummaryProperties,
    teams: {
      type: 'array',
      items: teamReferenceSchema,
    },
    stages: {
      type: 'array',
      items: {
        type: 'object',
        properties: releaseStageProperties,
      },
    },
    latestReleaseNote: {
      type: ['object', 'null'],
      properties: releaseNoteSummaryProperties,
    },
  },
};

export const getReleasePipelinesToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleasePipelines',
  description: 'Get release pipelines from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...paginationSchema,
        description: 'Maximum number of release pipelines to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived release pipelines in the results',
      },
      orderBy: {
        ...orderBySchema,
        description: 'Sort release pipelines by created or updated date',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: releasePipelineSummarySchema,
  },
};

export const getReleasePipelineByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleasePipelineById',
  description: 'Get details of a specific release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID or slug of the release pipeline to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: releasePipelineDetailSchema,
};

export const createReleasePipelineToolDefinition: MCPToolDefinition = {
  name: 'linear_createReleasePipeline',
  description: 'Create a new release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the release pipeline',
      },
      teamIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'The team identifiers associated with the pipeline',
      },
      type: {
        ...releasePipelineTypeSchema,
        description: 'The pipeline type',
      },
      slugId: {
        type: 'string',
        description: 'Optional unique slug identifier for the pipeline',
      },
      isProduction: {
        type: 'boolean',
        description: 'Whether the pipeline targets a production environment',
      },
      includePathPatterns: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional glob patterns to limit matched commits by file path',
      },
    },
    required: ['name', 'teamIds'],
  },
  output_schema: releasePipelineDetailSchema,
};

export const updateReleasePipelineToolDefinition: MCPToolDefinition = {
  name: 'linear_updateReleasePipeline',
  description:
    'Update an existing release pipeline. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the release pipeline to update',
      },
      name: {
        type: 'string',
        description: 'The updated pipeline name',
      },
      teamIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'The updated team identifiers for the pipeline',
      },
      type: {
        ...releasePipelineTypeSchema,
        description: 'The updated pipeline type',
      },
      slugId: {
        type: 'string',
        description: 'The updated pipeline slug identifier',
      },
      isProduction: {
        type: 'boolean',
        description: 'Whether the pipeline targets production',
      },
      includePathPatterns: {
        type: 'array',
        items: { type: 'string' },
        description: 'Updated glob patterns to include matching commit paths',
      },
    },
    required: ['id'],
  },
  output_schema: releasePipelineDetailSchema,
};

export const archiveReleasePipelineToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveReleasePipeline',
  description: 'Archive a release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline to archive',
      },
    },
    required: ['pipelineId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      releasePipeline: releasePipelineDetailSchema,
    },
  },
};

export const unarchiveReleasePipelineToolDefinition: MCPToolDefinition = {
  name: 'linear_unarchiveReleasePipeline',
  description: 'Unarchive a release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline to unarchive',
      },
    },
    required: ['pipelineId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      releasePipeline: releasePipelineDetailSchema,
    },
  },
};

export const deleteReleasePipelineToolDefinition: MCPToolDefinition = {
  name: 'linear_deleteReleasePipeline',
  description: 'Delete a release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline to delete',
      },
    },
    required: ['pipelineId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
    },
  },
};

export const getReleasesToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleases',
  description: 'Get releases from Linear with optional pipeline and stage filters',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...paginationSchema,
        description: 'Maximum number of releases to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived releases in the results',
      },
      orderBy: {
        ...orderBySchema,
        description: 'Sort releases by created or updated date',
      },
      pipelineId: {
        type: 'string',
        description: 'Filter releases by release pipeline ID',
      },
      stageId: {
        type: 'string',
        description: 'Filter releases by release stage ID',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: releaseSummarySchema,
  },
};

export const getReleaseByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleaseById',
  description: 'Get details of a specific release',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID or slug of the release to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      ...releaseSummaryProperties,
      issues: {
        type: 'array',
        items: issueReferenceSchema,
      },
      releaseNotes: {
        type: 'array',
        items: releaseNoteSummarySchema,
      },
    },
  },
};

export const searchReleasesToolDefinition: MCPToolDefinition = {
  name: 'linear_searchReleases',
  description: 'Search releases by term, version, or pipeline name',
  input_schema: {
    type: 'object',
    properties: {
      term: {
        type: 'string',
        description: 'Search term to match against release name, version, or pipeline name',
      },
      limit: {
        ...paginationSchema,
        description: 'Maximum number of releases to return (default: 20)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived releases in the search results',
      },
      pipelineId: {
        type: 'string',
        description: 'Filter search results by release pipeline ID',
      },
      stageId: {
        type: 'string',
        description: 'Filter search results by release stage ID',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: releaseSummarySchema,
  },
};

export const getReleaseStagesToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleaseStages',
  description: 'Get release stages from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...paginationSchema,
        description: 'Maximum number of release stages to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived release stages in the results',
      },
      orderBy: {
        ...orderBySchema,
        description: 'Sort release stages by created or updated date',
      },
      pipelineId: {
        type: 'string',
        description: 'Filter release stages by release pipeline ID',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: releaseStageSchema,
  },
};

export const createReleaseStageToolDefinition: MCPToolDefinition = {
  name: 'linear_createReleaseStage',
  description: 'Create a new release stage in a pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline that owns the stage',
      },
      name: {
        type: 'string',
        description: 'The name of the release stage',
      },
      color: {
        type: 'string',
        description: 'The UI color for the stage as a HEX string',
      },
      position: {
        type: 'number',
        description: 'The position of the stage within the pipeline',
      },
      type: {
        ...releaseStageTypeSchema,
        description: 'The stage type',
      },
      frozen: {
        type: 'boolean',
        description: 'Whether the started stage should be frozen',
      },
      id: {
        type: 'string',
        description: 'Optional explicit UUID for the stage',
      },
    },
    required: ['pipelineId', 'name', 'color', 'position', 'type'],
  },
  output_schema: releaseStageSchema,
};

export const updateReleaseStageToolDefinition: MCPToolDefinition = {
  name: 'linear_updateReleaseStage',
  description:
    'Update an existing release stage. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the release stage to update',
      },
      name: {
        type: 'string',
        description: 'The updated stage name',
      },
      color: {
        type: 'string',
        description: 'The updated UI color as a HEX string',
      },
      position: {
        type: 'number',
        description: 'The updated stage position',
      },
      frozen: {
        type: 'boolean',
        description: 'Whether the started stage should be frozen',
      },
    },
    required: ['id'],
  },
  output_schema: releaseStageSchema,
};

export const archiveReleaseStageToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveReleaseStage',
  description: 'Archive a release stage',
  input_schema: {
    type: 'object',
    properties: {
      stageId: {
        type: 'string',
        description: 'The ID of the release stage to archive',
      },
    },
    required: ['stageId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      releaseStage: releaseStageSchema,
    },
  },
};

export const unarchiveReleaseStageToolDefinition: MCPToolDefinition = {
  name: 'linear_unarchiveReleaseStage',
  description: 'Unarchive a release stage',
  input_schema: {
    type: 'object',
    properties: {
      stageId: {
        type: 'string',
        description: 'The ID of the release stage to unarchive',
      },
    },
    required: ['stageId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      releaseStage: releaseStageSchema,
    },
  },
};

export const getReleaseNotesToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleaseNotes',
  description: 'Get release notes from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        ...paginationSchema,
        description: 'Maximum number of release notes to return (default: 25)',
      },
      includeArchived: {
        type: 'boolean',
        description: 'Include archived release notes in the results',
      },
      orderBy: {
        ...orderBySchema,
        description: 'Sort release notes by created or updated date',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: releaseNoteSummarySchema,
  },
};

export const getReleaseNoteByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getReleaseNoteById',
  description: 'Get details of a specific release note',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID or slug of the release note to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: releaseNoteSummaryProperties,
  },
};

export const createReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_createRelease',
  description: 'Create a new release in a release pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline this release belongs to',
      },
      name: {
        type: 'string',
        description: 'The name of the release',
      },
      version: {
        type: 'string',
        description: 'The version identifier for the release',
      },
      description: {
        type: 'string',
        description: 'The release description in markdown or plain text',
      },
      commitSha: {
        type: 'string',
        description: 'The Git commit SHA associated with the release',
      },
      stageId: {
        type: 'string',
        description: 'Optional stage ID for the release',
      },
      startDate: {
        type: 'string',
        description: 'Optional estimated start date in YYYY-MM-DD format',
      },
      targetDate: {
        type: 'string',
        description: 'Optional estimated completion date in YYYY-MM-DD format',
      },
      createdAt: {
        type: 'string',
        description: 'Optional creation timestamp for a backfilled release (ISO 8601)',
      },
      startedAt: {
        type: 'string',
        description: 'Optional actual start timestamp for a backfilled release (ISO 8601)',
      },
      completedAt: {
        type: 'string',
        description: 'Optional actual completion timestamp for a backfilled release (ISO 8601)',
      },
    },
    required: ['pipelineId', 'name'],
  },
  output_schema: releaseSummarySchema,
};

export const updateReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_updateRelease',
  description: 'Update an existing release. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the release to update',
      },
      name: {
        type: 'string',
        description: 'The updated release name',
      },
      version: {
        type: 'string',
        description: 'The updated release version',
      },
      description: {
        type: 'string',
        description: 'The updated release description',
      },
      commitSha: {
        type: 'string',
        description: 'The updated Git commit SHA',
      },
      pipelineId: {
        type: 'string',
        description: 'The updated release pipeline ID',
      },
      stageId: {
        type: 'string',
        description: 'The updated release stage ID',
      },
      startDate: {
        type: 'string',
        description: 'The updated start date in YYYY-MM-DD format',
      },
      targetDate: {
        type: 'string',
        description: 'The updated target date in YYYY-MM-DD format',
      },
      startedAt: {
        type: 'string',
        description: 'The updated actual start timestamp (ISO 8601)',
      },
      completedAt: {
        type: 'string',
        description: 'The updated actual completion timestamp (ISO 8601)',
      },
      trashed: {
        type: 'boolean',
        description: 'Whether the release should be marked as trashed',
      },
    },
    required: ['id'],
  },
  output_schema: releaseSummarySchema,
};

export const completeReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_completeRelease',
  description:
    'Mark a release as completed within a pipeline. The target pipeline must already have a completed release stage configured.',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline containing the release',
      },
      version: {
        type: 'string',
        description: 'Optional release version to complete; defaults to the latest started release',
      },
    },
    required: ['pipelineId'],
  },
  output_schema: releaseSummarySchema,
};

export const archiveReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveRelease',
  description: 'Archive a release',
  input_schema: {
    type: 'object',
    properties: {
      releaseId: {
        type: 'string',
        description: 'The ID of the release to archive',
      },
    },
    required: ['releaseId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      release: releaseSummarySchema,
    },
  },
};

export const unarchiveReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_unarchiveRelease',
  description: 'Unarchive a release',
  input_schema: {
    type: 'object',
    properties: {
      releaseId: {
        type: 'string',
        description: 'The ID of the release to unarchive',
      },
    },
    required: ['releaseId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      release: releaseSummarySchema,
    },
  },
};

export const addIssueToReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_addIssueToRelease',
  description: 'Add an issue to a release',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'The ID or identifier of the issue to add',
      },
      releaseId: {
        type: 'string',
        description: 'The ID of the release to add the issue to',
      },
    },
    required: ['issueId', 'releaseId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: issueReferenceSchema,
      release: releaseSummarySchema,
    },
  },
};

export const removeIssueFromReleaseToolDefinition: MCPToolDefinition = {
  name: 'linear_removeIssueFromRelease',
  description: 'Remove an issue from a release',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'The ID or identifier of the issue to remove',
      },
      releaseId: {
        type: 'string',
        description: 'The ID of the release to remove the issue from',
      },
    },
    required: ['issueId', 'releaseId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: issueReferenceSchema,
      release: releaseSummarySchema,
    },
  },
};

export const createReleaseNoteToolDefinition: MCPToolDefinition = {
  name: 'linear_createReleaseNote',
  description:
    'Create a release note using either explicit release IDs or a release range within a pipeline',
  input_schema: {
    type: 'object',
    properties: {
      pipelineId: {
        type: 'string',
        description: 'The ID of the release pipeline that owns the release note',
      },
      content: {
        type: 'string',
        description: 'Optional release note content in markdown',
      },
      releaseIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Explicit release IDs to include in the note',
      },
      rangeFromReleaseId: {
        type: 'string',
        description: 'Oldest release ID in the release note range',
      },
      rangeToReleaseId: {
        type: 'string',
        description: 'Newest release ID in the release note range',
      },
    },
    required: ['pipelineId'],
  },
  output_schema: releaseNoteSummarySchema,
};

export const updateReleaseNoteToolDefinition: MCPToolDefinition = {
  name: 'linear_updateReleaseNote',
  description:
    'Update a release note using either explicit release IDs or a release range. Provide id plus at least one other field to change.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the release note to update',
      },
      content: {
        type: 'string',
        description: 'Updated release note content in markdown',
      },
      releaseIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Explicit release IDs to set on the note',
      },
      rangeFromReleaseId: {
        type: 'string',
        description: 'Updated oldest release ID in the note range',
      },
      rangeToReleaseId: {
        type: 'string',
        description: 'Updated newest release ID in the note range',
      },
    },
    required: ['id'],
  },
  output_schema: releaseNoteSummarySchema,
};

export const deleteReleaseNoteToolDefinition: MCPToolDefinition = {
  name: 'linear_deleteReleaseNote',
  description: 'Delete a release note',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the release note to delete',
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

export const releaseToolDefinitions: MCPToolDefinition[] = [
  getReleasePipelinesToolDefinition,
  getReleasePipelineByIdToolDefinition,
  createReleasePipelineToolDefinition,
  updateReleasePipelineToolDefinition,
  archiveReleasePipelineToolDefinition,
  unarchiveReleasePipelineToolDefinition,
  deleteReleasePipelineToolDefinition,
  getReleasesToolDefinition,
  getReleaseByIdToolDefinition,
  searchReleasesToolDefinition,
  getReleaseStagesToolDefinition,
  createReleaseStageToolDefinition,
  updateReleaseStageToolDefinition,
  archiveReleaseStageToolDefinition,
  unarchiveReleaseStageToolDefinition,
  getReleaseNotesToolDefinition,
  getReleaseNoteByIdToolDefinition,
  createReleaseToolDefinition,
  updateReleaseToolDefinition,
  completeReleaseToolDefinition,
  archiveReleaseToolDefinition,
  unarchiveReleaseToolDefinition,
  addIssueToReleaseToolDefinition,
  removeIssueFromReleaseToolDefinition,
  createReleaseNoteToolDefinition,
  updateReleaseNoteToolDefinition,
  deleteReleaseNoteToolDefinition,
];
