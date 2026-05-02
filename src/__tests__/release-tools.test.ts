import { LinearClient } from '@linear/sdk';

import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

function createService() {
  return new LinearService(new LinearClient({ apiKey: 'test-token' }));
}

function makeReleaseNote(id: string) {
  return {
    id,
    title: `${id} title`,
    slugId: `${id}-slug`,
    content: `${id} content`,
    createdAt: new Date('2026-05-01T12:00:00.000Z'),
    updatedAt: new Date('2026-05-01T12:30:00.000Z'),
    releases: [{ id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' }],
    lastRelease: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
  };
}

function makeReleaseStage(id: string) {
  return {
    id,
    name: `${id} name`,
    color: '#ffaa00',
    type: 'started',
    position: 2,
    description: `${id} description`,
    frozen: false,
    createdAt: new Date('2026-05-01T08:00:00.000Z'),
    updatedAt: new Date('2026-05-01T09:00:00.000Z'),
    archivedAt: null,
    pipeline: { id: 'pipeline-1', name: 'iOS Production', slugId: 'ios-production', type: 'scheduled' },
  };
}

function makeReleasePipelineSummary(id: string) {
  return {
    id,
    name: `${id} name`,
    slugId: `${id}-slug`,
    description: `${id} description`,
    type: 'scheduled',
    production: true,
    pathPatterns: ['apps/ios/**'],
    createdAt: new Date('2026-05-01T08:00:00.000Z'),
    updatedAt: new Date('2026-05-01T09:00:00.000Z'),
    archivedAt: null,
    url: `https://linear.app/${id}`,
  };
}

function makeReleasePipelineDetail(id: string) {
  return {
    ...makeReleasePipelineSummary(id),
    teams: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
    stages: [makeReleaseStage('stage-1')],
    latestReleaseNote: makeReleaseNote('note-1'),
  };
}

function makeReleaseSummary(id: string) {
  return {
    id,
    name: `${id} name`,
    version: '1.2.3',
    description: `${id} description`,
    commitSha: 'abc123',
    startDate: '2026-05-01',
    targetDate: '2026-05-03',
    startedAt: new Date('2026-05-01T08:00:00.000Z'),
    completedAt: null,
    canceledAt: null,
    createdAt: new Date('2026-05-01T07:00:00.000Z'),
    updatedAt: new Date('2026-05-01T08:30:00.000Z'),
    trashed: false,
    url: `https://linear.app/${id}`,
    issueCount: 1,
    currentProgress: { started: 1 },
    creator: { id: 'user-1', name: 'Alex', email: '__VG_EMAIL_327b39ce856f__' },
    pipeline: {
      id: 'pipeline-1',
      name: 'iOS Production',
      slugId: 'ios-production',
      type: 'scheduled',
    },
    stage: {
      id: 'stage-1',
      name: 'In QA',
      color: '#ffaa00',
      type: 'started',
      frozen: false,
    },
  };
}

function makeReleaseDetail(id: string) {
  return {
    ...makeReleaseSummary(id),
    issues: [{ id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' }],
    releaseNotes: [makeReleaseNote('note-1')],
  };
}

describe('release MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers release tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getReleasePipelines',
        'linear_getReleasePipelineById',
        'linear_createReleasePipeline',
        'linear_updateReleasePipeline',
        'linear_archiveReleasePipeline',
        'linear_unarchiveReleasePipeline',
        'linear_deleteReleasePipeline',
        'linear_getReleases',
        'linear_getReleaseById',
        'linear_searchReleases',
        'linear_getReleaseStages',
        'linear_createReleaseStage',
        'linear_updateReleaseStage',
        'linear_archiveReleaseStage',
        'linear_unarchiveReleaseStage',
        'linear_getReleaseNotes',
        'linear_getReleaseNoteById',
        'linear_createRelease',
        'linear_updateRelease',
        'linear_completeRelease',
        'linear_archiveRelease',
        'linear_unarchiveRelease',
        'linear_addIssueToRelease',
        'linear_removeIssueFromRelease',
        'linear_createReleaseNote',
        'linear_updateReleaseNote',
        'linear_deleteReleaseNote',
      ]),
    );
  });

  it('defines release schemas for pagination, nullable fields, and guarded updates', () => {
    const getReleasePipelinesTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getReleasePipelines',
    );
    const getReleaseByIdTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getReleaseById',
    );
    const createReleasePipelineTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_createReleasePipeline',
    );
    const updateReleasePipelineTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_updateReleasePipeline',
    );
    const createReleaseTool = allToolDefinitions.find((tool) => tool.name === 'linear_createRelease');
    const updateReleaseTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateRelease');
    const createReleaseStageTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_createReleaseStage',
    );
    const updateReleaseStageTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_updateReleaseStage',
    );
    const completeReleaseTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_completeRelease',
    );
    const getReleaseNotesTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getReleaseNotes',
    );
    const createReleaseNoteTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_createReleaseNote',
    );

    expect(getReleasePipelinesTool?.input_schema.properties.limit).toMatchObject({
      type: 'integer',
      minimum: 1,
    });
    expect(getReleaseByIdTool?.output_schema.properties).toMatchObject({
      version: { type: ['string', 'null'] },
      commitSha: { type: ['string', 'null'] },
      issueCount: { type: ['number', 'null'] },
      issues: { type: 'array' },
      releaseNotes: { type: 'array' },
    });
    expect(createReleasePipelineTool?.input_schema.required).toEqual(['name', 'teamIds']);
    expect(createReleasePipelineTool?.description).toBe('Create a new release pipeline');
    expect(createReleasePipelineTool?.input_schema.properties).toMatchObject({
      type: { type: 'string', enum: ['continuous', 'scheduled'] },
      includePathPatterns: { type: 'array' },
    });
    expect(updateReleasePipelineTool?.description).toContain('Provide id plus at least one other field');
    expect(createReleaseTool?.input_schema.required).toEqual(['pipelineId', 'name']);
    expect(updateReleaseTool?.description).toContain('Provide id plus at least one other field');
    expect(createReleaseStageTool?.input_schema.required).toEqual([
      'pipelineId',
      'name',
      'color',
      'position',
      'type',
    ]);
    expect(updateReleaseStageTool?.description).toContain('Provide id plus at least one other field');
    expect(completeReleaseTool?.description).toContain('completed release stage configured');
    expect(getReleaseNotesTool?.input_schema.properties).toMatchObject({
      limit: { type: 'integer', minimum: 1 },
      includeArchived: { type: 'boolean' },
      orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
    });
    expect(createReleaseNoteTool?.input_schema.properties).toMatchObject({
      pipelineId: { type: 'string' },
      releaseIds: { type: 'array' },
      rangeFromReleaseId: { type: 'string' },
      rangeToReleaseId: { type: 'string' },
    });
  });

  it('routes release read handlers to the Linear service', async () => {
    const service = createService();
    const getReleasePipelines = jest
      .spyOn(service, 'getReleasePipelines')
      .mockResolvedValue([makeReleasePipelineSummary('pipeline-1')]);
    const getReleasePipelineById = jest
      .spyOn(service, 'getReleasePipelineById')
      .mockResolvedValue(makeReleasePipelineDetail('pipeline-1'));
    const createReleasePipeline = jest
      .spyOn(service, 'createReleasePipeline')
      .mockResolvedValue(makeReleasePipelineDetail('pipeline-1'));
    const updateReleasePipeline = jest
      .spyOn(service, 'updateReleasePipeline')
      .mockResolvedValue(makeReleasePipelineDetail('pipeline-1'));
    const archiveReleasePipeline = jest
      .spyOn(service, 'archiveReleasePipeline')
      .mockResolvedValue({ success: true, releasePipeline: makeReleasePipelineDetail('pipeline-1') });
    const unarchiveReleasePipeline = jest
      .spyOn(service, 'unarchiveReleasePipeline')
      .mockResolvedValue({ success: true, releasePipeline: makeReleasePipelineDetail('pipeline-1') });
    const deleteReleasePipeline = jest
      .spyOn(service, 'deleteReleasePipeline')
      .mockResolvedValue({ success: true, id: 'pipeline-1' });
    const getReleases = jest
      .spyOn(service, 'getReleases')
      .mockResolvedValue([makeReleaseSummary('release-1')]);
    const getReleaseById = jest
      .spyOn(service, 'getReleaseById')
      .mockResolvedValue(makeReleaseDetail('release-1'));
    const searchReleases = jest
      .spyOn(service, 'searchReleases')
      .mockResolvedValue([makeReleaseSummary('release-1')]);
    const getReleaseStages = jest
      .spyOn(service, 'getReleaseStages')
      .mockResolvedValue([makeReleaseStage('stage-1')]);
    const createReleaseStage = jest
      .spyOn(service, 'createReleaseStage')
      .mockResolvedValue(makeReleaseStage('stage-1'));
    const updateReleaseStage = jest
      .spyOn(service, 'updateReleaseStage')
      .mockResolvedValue(makeReleaseStage('stage-1'));
    const archiveReleaseStage = jest
      .spyOn(service, 'archiveReleaseStage')
      .mockResolvedValue({ success: true, releaseStage: makeReleaseStage('stage-1') });
    const unarchiveReleaseStage = jest
      .spyOn(service, 'unarchiveReleaseStage')
      .mockResolvedValue({ success: true, releaseStage: makeReleaseStage('stage-1') });
    const getReleaseNotes = jest
      .spyOn(service, 'getReleaseNotes')
      .mockResolvedValue([makeReleaseNote('note-1')]);
    const getReleaseNoteById = jest
      .spyOn(service, 'getReleaseNoteById')
      .mockResolvedValue(makeReleaseNote('note-1'));
    const handlers = registerToolHandlers(service);

    await expect(
      handlers.linear_getReleasePipelines({
        limit: 10,
        includeArchived: true,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([makeReleasePipelineSummary('pipeline-1')]);
    expect(getReleasePipelines).toHaveBeenCalledWith({
      limit: 10,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    await expect(handlers.linear_getReleasePipelineById({ id: 'pipeline-1' })).resolves.toEqual(
      makeReleasePipelineDetail('pipeline-1'),
    );
    expect(getReleasePipelineById).toHaveBeenCalledWith('pipeline-1');

    await expect(
      handlers.linear_createReleasePipeline({
        name: 'iOS Production',
        teamIds: ['team-1'],
        type: 'scheduled',
        isProduction: true,
        includePathPatterns: ['apps/ios/**'],
      }),
    ).resolves.toEqual(makeReleasePipelineDetail('pipeline-1'));
    expect(createReleasePipeline).toHaveBeenCalledWith({
      name: 'iOS Production',
      teamIds: ['team-1'],
      type: 'scheduled',
      isProduction: true,
      includePathPatterns: ['apps/ios/**'],
    });

    await expect(
      handlers.linear_updateReleasePipeline({
        id: 'pipeline-1',
        slugId: 'ios-prod',
        includePathPatterns: [],
      }),
    ).resolves.toEqual(makeReleasePipelineDetail('pipeline-1'));
    expect(updateReleasePipeline).toHaveBeenCalledWith({
      id: 'pipeline-1',
      slugId: 'ios-prod',
      includePathPatterns: [],
    });

    await expect(
      handlers.linear_archiveReleasePipeline({ pipelineId: 'pipeline-1' }),
    ).resolves.toEqual({
      success: true,
      releasePipeline: makeReleasePipelineDetail('pipeline-1'),
    });
    expect(archiveReleasePipeline).toHaveBeenCalledWith('pipeline-1');

    await expect(
      handlers.linear_unarchiveReleasePipeline({ pipelineId: 'pipeline-1' }),
    ).resolves.toEqual({
      success: true,
      releasePipeline: makeReleasePipelineDetail('pipeline-1'),
    });
    expect(unarchiveReleasePipeline).toHaveBeenCalledWith('pipeline-1');

    await expect(
      handlers.linear_deleteReleasePipeline({ pipelineId: 'pipeline-1' }),
    ).resolves.toEqual({
      success: true,
      id: 'pipeline-1',
    });
    expect(deleteReleasePipeline).toHaveBeenCalledWith('pipeline-1');

    await expect(
      handlers.linear_getReleases({
        limit: 10,
        includeArchived: true,
        orderBy: 'updatedAt',
        pipelineId: 'pipeline-1',
        stageId: 'stage-1',
      }),
    ).resolves.toEqual([makeReleaseSummary('release-1')]);
    expect(getReleases).toHaveBeenCalledWith({
      limit: 10,
      includeArchived: true,
      orderBy: 'updatedAt',
      pipelineId: 'pipeline-1',
      stageId: 'stage-1',
    });

    await expect(handlers.linear_getReleaseById({ id: 'release-1' })).resolves.toEqual(
      makeReleaseDetail('release-1'),
    );
    expect(getReleaseById).toHaveBeenCalledWith('release-1');

    await expect(
      handlers.linear_searchReleases({
        term: '1.2.3',
        limit: 5,
        includeArchived: true,
        pipelineId: 'pipeline-1',
        stageId: 'stage-1',
      }),
    ).resolves.toEqual([makeReleaseSummary('release-1')]);
    expect(searchReleases).toHaveBeenCalledWith({
      term: '1.2.3',
      limit: 5,
      includeArchived: true,
      pipelineId: 'pipeline-1',
      stageId: 'stage-1',
    });

    await expect(
      handlers.linear_getReleaseStages({
        limit: 5,
        includeArchived: false,
        orderBy: 'createdAt',
        pipelineId: 'pipeline-1',
      }),
    ).resolves.toEqual([makeReleaseStage('stage-1')]);
    expect(getReleaseStages).toHaveBeenCalledWith({
      limit: 5,
      includeArchived: false,
      orderBy: 'createdAt',
      pipelineId: 'pipeline-1',
    });

    await expect(
      handlers.linear_createReleaseStage({
        pipelineId: 'pipeline-1',
        name: 'In QA',
        color: '#ffaa00',
        position: 2,
        type: 'started',
        frozen: false,
      }),
    ).resolves.toEqual(makeReleaseStage('stage-1'));
    expect(createReleaseStage).toHaveBeenCalledWith({
      pipelineId: 'pipeline-1',
      name: 'In QA',
      color: '#ffaa00',
      position: 2,
      type: 'started',
      frozen: false,
    });

    await expect(
      handlers.linear_updateReleaseStage({
        id: 'stage-1',
        position: 3,
        frozen: true,
      }),
    ).resolves.toEqual(makeReleaseStage('stage-1'));
    expect(updateReleaseStage).toHaveBeenCalledWith({
      id: 'stage-1',
      position: 3,
      frozen: true,
    });

    await expect(handlers.linear_archiveReleaseStage({ stageId: 'stage-1' })).resolves.toEqual({
      success: true,
      releaseStage: makeReleaseStage('stage-1'),
    });
    expect(archiveReleaseStage).toHaveBeenCalledWith('stage-1');

    await expect(handlers.linear_unarchiveReleaseStage({ stageId: 'stage-1' })).resolves.toEqual({
      success: true,
      releaseStage: makeReleaseStage('stage-1'),
    });
    expect(unarchiveReleaseStage).toHaveBeenCalledWith('stage-1');

    await expect(
      handlers.linear_getReleaseNotes({
        limit: 5,
        includeArchived: true,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([makeReleaseNote('note-1')]);
    expect(getReleaseNotes).toHaveBeenCalledWith({
      limit: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    await expect(handlers.linear_getReleaseNoteById({ id: 'note-1' })).resolves.toEqual(
      makeReleaseNote('note-1'),
    );
    expect(getReleaseNoteById).toHaveBeenCalledWith('note-1');
  });

  it('routes release write handlers to the Linear service', async () => {
    const service = createService();
    const createRelease = jest
      .spyOn(service, 'createRelease')
      .mockResolvedValue(makeReleaseDetail('release-1'));
    const updateRelease = jest
      .spyOn(service, 'updateRelease')
      .mockResolvedValue(makeReleaseDetail('release-1'));
    const completeRelease = jest
      .spyOn(service, 'completeRelease')
      .mockResolvedValue(makeReleaseDetail('release-1'));
    const archiveRelease = jest
      .spyOn(service, 'archiveRelease')
      .mockResolvedValue({ success: true, release: makeReleaseDetail('release-1') });
    const unarchiveRelease = jest
      .spyOn(service, 'unarchiveRelease')
      .mockResolvedValue({ success: true, release: makeReleaseDetail('release-1') });
    const addIssueToRelease = jest
      .spyOn(service, 'addIssueToRelease')
      .mockResolvedValue({
        success: true,
        issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
        release: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
      });
    const removeIssueFromRelease = jest
      .spyOn(service, 'removeIssueFromRelease')
      .mockResolvedValue({
        success: true,
        issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
        release: { id: 'release-1', name: '', version: null },
      });
    const createReleaseNote = jest
      .spyOn(service, 'createReleaseNote')
      .mockResolvedValue(makeReleaseNote('note-1'));
    const updateReleaseNote = jest
      .spyOn(service, 'updateReleaseNote')
      .mockResolvedValue(makeReleaseNote('note-1'));
    const deleteReleaseNote = jest
      .spyOn(service, 'deleteReleaseNote')
      .mockResolvedValue({ success: true, id: 'note-1' });
    const handlers = registerToolHandlers(service);

    await expect(
      handlers.linear_createRelease({
        pipelineId: 'pipeline-1',
        name: 'Release 1.2.3',
        version: '1.2.3',
        description: 'Ship mobile update',
      }),
    ).resolves.toEqual(makeReleaseDetail('release-1'));
    expect(createRelease).toHaveBeenCalledWith({
      pipelineId: 'pipeline-1',
      name: 'Release 1.2.3',
      version: '1.2.3',
      description: 'Ship mobile update',
    });

    await expect(
      handlers.linear_updateRelease({
        id: 'release-1',
        stageId: 'stage-1',
      }),
    ).resolves.toEqual(makeReleaseDetail('release-1'));
    expect(updateRelease).toHaveBeenCalledWith({
      id: 'release-1',
      stageId: 'stage-1',
    });

    await expect(
      handlers.linear_completeRelease({
        pipelineId: 'pipeline-1',
        version: '1.2.3',
      }),
    ).resolves.toEqual(makeReleaseDetail('release-1'));
    expect(completeRelease).toHaveBeenCalledWith({
      pipelineId: 'pipeline-1',
      version: '1.2.3',
    });

    await expect(handlers.linear_archiveRelease({ releaseId: 'release-1' })).resolves.toEqual({
      success: true,
      release: makeReleaseDetail('release-1'),
    });
    expect(archiveRelease).toHaveBeenCalledWith('release-1');

    await expect(handlers.linear_unarchiveRelease({ releaseId: 'release-1' })).resolves.toEqual({
      success: true,
      release: makeReleaseDetail('release-1'),
    });
    expect(unarchiveRelease).toHaveBeenCalledWith('release-1');

    await expect(
      handlers.linear_addIssueToRelease({ issueId: 'ENG-123', releaseId: 'release-1' }),
    ).resolves.toEqual({
      success: true,
      issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
      release: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
    });
    expect(addIssueToRelease).toHaveBeenCalledWith({
      issueId: 'ENG-123',
      releaseId: 'release-1',
    });

    await expect(
      handlers.linear_removeIssueFromRelease({ issueId: 'ENG-123', releaseId: 'release-1' }),
    ).resolves.toEqual({
      success: true,
      issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
      release: { id: 'release-1', name: '', version: null },
    });
    expect(removeIssueFromRelease).toHaveBeenCalledWith({
      issueId: 'ENG-123',
      releaseId: 'release-1',
    });

    await expect(
      handlers.linear_createReleaseNote({
        pipelineId: 'pipeline-1',
        releaseIds: ['release-1', 'release-2'],
        content: 'Notes',
      }),
    ).resolves.toEqual(makeReleaseNote('note-1'));
    expect(createReleaseNote).toHaveBeenCalledWith({
      pipelineId: 'pipeline-1',
      releaseIds: ['release-1', 'release-2'],
      content: 'Notes',
    });

    await expect(
      handlers.linear_updateReleaseNote({
        id: 'note-1',
        rangeFromReleaseId: 'release-1',
        rangeToReleaseId: 'release-3',
      }),
    ).resolves.toEqual(makeReleaseNote('note-1'));
    expect(updateReleaseNote).toHaveBeenCalledWith({
      id: 'note-1',
      rangeFromReleaseId: 'release-1',
      rangeToReleaseId: 'release-3',
    });

    await expect(handlers.linear_deleteReleaseNote({ id: 'note-1' })).resolves.toEqual({
      success: true,
      id: 'note-1',
    });
    expect(deleteReleaseNote).toHaveBeenCalledWith('note-1');
  });

  it('allows list and search release handlers to be called with null args', async () => {
    const service = createService();
    const getReleasePipelines = jest
      .spyOn(service, 'getReleasePipelines')
      .mockResolvedValue([makeReleasePipelineSummary('pipeline-1')]);
    const getReleases = jest
      .spyOn(service, 'getReleases')
      .mockResolvedValue([makeReleaseSummary('release-1')]);
    const searchReleases = jest
      .spyOn(service, 'searchReleases')
      .mockResolvedValue([makeReleaseSummary('release-1')]);
    const getReleaseStages = jest
      .spyOn(service, 'getReleaseStages')
      .mockResolvedValue([makeReleaseStage('stage-1')]);
    const getReleaseNotes = jest
      .spyOn(service, 'getReleaseNotes')
      .mockResolvedValue([makeReleaseNote('note-1')]);
    const handlers = registerToolHandlers(service);

    await expect(handlers.linear_getReleasePipelines(null)).resolves.toEqual([
      makeReleasePipelineSummary('pipeline-1'),
    ]);
    expect(getReleasePipelines).toHaveBeenCalledWith(undefined);

    await expect(handlers.linear_getReleases(null)).resolves.toEqual([
      makeReleaseSummary('release-1'),
    ]);
    expect(getReleases).toHaveBeenCalledWith(undefined);

    await expect(handlers.linear_searchReleases(null)).resolves.toEqual([
      makeReleaseSummary('release-1'),
    ]);
    expect(searchReleases).toHaveBeenCalledWith(undefined);

    await expect(handlers.linear_getReleaseStages(null)).resolves.toEqual([
      makeReleaseStage('stage-1'),
    ]);
    expect(getReleaseStages).toHaveBeenCalledWith(undefined);

    await expect(handlers.linear_getReleaseNotes(null)).resolves.toEqual([makeReleaseNote('note-1')]);
    expect(getReleaseNotes).toHaveBeenCalledWith(undefined);
  });

  it('rejects invalid release arguments', async () => {
    const handlers = registerToolHandlers(createService());

    await expect(handlers.linear_getReleasePipelines({ limit: 0 })).rejects.toThrow(
      'Invalid arguments for getReleasePipelines',
    );
    await expect(handlers.linear_createReleasePipeline({ name: '', teamIds: ['team-1'] })).rejects.toThrow(
      'Invalid arguments for createReleasePipeline',
    );
    await expect(handlers.linear_updateReleasePipeline({ id: 'pipeline-1' })).rejects.toThrow(
      'Invalid arguments for updateReleasePipeline',
    );
    await expect(handlers.linear_archiveReleasePipeline({ pipelineId: 123 })).rejects.toThrow(
      'Invalid arguments for archiveReleasePipeline',
    );
    await expect(handlers.linear_deleteReleasePipeline({ id: 'pipeline-1' })).rejects.toThrow(
      'Invalid arguments for deleteReleasePipeline',
    );
    await expect(handlers.linear_getReleasePipelineById({})).rejects.toThrow(
      'Invalid arguments for getReleasePipelineById',
    );
    await expect(handlers.linear_getReleases({ stageId: 5 })).rejects.toThrow(
      'Invalid arguments for getReleases',
    );
    await expect(handlers.linear_getReleaseById({})).rejects.toThrow(
      'Invalid arguments for getReleaseById',
    );
    await expect(handlers.linear_searchReleases({ limit: 1.5 })).rejects.toThrow(
      'Invalid arguments for searchReleases',
    );
    await expect(handlers.linear_getReleaseStages({ pipelineId: 8 })).rejects.toThrow(
      'Invalid arguments for getReleaseStages',
    );
    await expect(
      handlers.linear_createReleaseStage({
        pipelineId: 'pipeline-1',
        name: 'In QA',
        color: '#ffaa00',
        position: '2',
        type: 'started',
      }),
    ).rejects.toThrow('Invalid arguments for createReleaseStage');
    await expect(handlers.linear_updateReleaseStage({ id: 'stage-1' })).rejects.toThrow(
      'Invalid arguments for updateReleaseStage',
    );
    await expect(handlers.linear_archiveReleaseStage({ stageId: null })).rejects.toThrow(
      'Invalid arguments for archiveReleaseStage',
    );
    await expect(handlers.linear_unarchiveReleaseStage({ id: 'stage-1' })).rejects.toThrow(
      'Invalid arguments for unarchiveReleaseStage',
    );
    await expect(handlers.linear_getReleaseNotes({ orderBy: 'priority' })).rejects.toThrow(
      'Invalid arguments for getReleaseNotes',
    );
    await expect(handlers.linear_getReleaseNoteById({})).rejects.toThrow(
      'Invalid arguments for getReleaseNoteById',
    );
    await expect(handlers.linear_createRelease({ pipelineId: 'pipeline-1' })).rejects.toThrow(
      'Invalid arguments for createRelease',
    );
    await expect(handlers.linear_updateRelease({ id: 'release-1' })).rejects.toThrow(
      'Invalid arguments for updateRelease',
    );
    await expect(handlers.linear_completeRelease({ version: '1.2.3' })).rejects.toThrow(
      'Invalid arguments for completeRelease',
    );
    await expect(handlers.linear_archiveRelease({ id: 'release-1' })).rejects.toThrow(
      'Invalid arguments for archiveRelease',
    );
    await expect(handlers.linear_unarchiveRelease({ id: 'release-1' })).rejects.toThrow(
      'Invalid arguments for unarchiveRelease',
    );
    await expect(handlers.linear_addIssueToRelease({ issueId: 'ENG-123' })).rejects.toThrow(
      'Invalid arguments for addIssueToRelease',
    );
    await expect(
      handlers.linear_removeIssueFromRelease({ releaseId: 'release-1' }),
    ).rejects.toThrow('Invalid arguments for removeIssueFromRelease');
    await expect(
      handlers.linear_createReleaseNote({ pipelineId: 'pipeline-1', content: 'Notes' }),
    ).rejects.toThrow('Invalid arguments for createReleaseNote');
    await expect(
      handlers.linear_createReleaseNote({
        pipelineId: 'pipeline-1',
        releaseIds: ['release-1'],
        rangeFromReleaseId: 'release-1',
        rangeToReleaseId: 'release-2',
      }),
    ).rejects.toThrow('Invalid arguments for createReleaseNote');
    await expect(handlers.linear_updateReleaseNote({ id: 'note-1' })).rejects.toThrow(
      'Invalid arguments for updateReleaseNote',
    );
    await expect(
      handlers.linear_updateReleaseNote({ id: 'note-1', rangeFromReleaseId: 'release-1' }),
    ).rejects.toThrow('Invalid arguments for updateReleaseNote');
    await expect(handlers.linear_deleteReleaseNote({})).rejects.toThrow(
      'Invalid arguments for deleteReleaseNote',
    );
  });
});
