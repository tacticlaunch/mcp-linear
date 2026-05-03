import { LinearClient } from '@linear/sdk';

import { LinearService } from '../services/linear-service.js';

function createService() {
  return new LinearService(new LinearClient({ apiKey: 'test-token' }));
}

describe('LinearService release queries', () => {
  it('returns normalized release pipelines with pagination options', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releasePipelines: {
        nodes: [
          {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            description: 'Production mobile releases',
            type: 'scheduled',
            production: true,
            pathPatterns: ['apps/ios/**'],
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-01T10:00:00.000Z',
            archivedAt: null,
            url: 'https://linear.app/pipelines/ios-production',
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(
      service.getReleasePipelines({
        limit: 10,
        includeArchived: true,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([
      {
        id: 'pipeline-1',
        name: 'iOS Production',
        slugId: 'ios-production',
        description: 'Production mobile releases',
        type: 'scheduled',
        production: true,
        pathPatterns: ['apps/ios/**'],
        createdAt: new Date('2026-04-30T10:00:00.000Z'),
        updatedAt: new Date('2026-05-01T10:00:00.000Z'),
        archivedAt: null,
        url: 'https://linear.app/pipelines/ios-production',
      },
    ]);

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('query LinearGetReleasePipelines'),
      {
        first: 10,
        includeArchived: true,
        orderBy: 'updatedAt',
      },
    );
  });

  it('returns release pipeline details with teams, stages, and latest release note', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releasePipeline: {
        id: 'pipeline-1',
        name: 'iOS Production',
        slugId: 'ios-production',
        description: 'Production mobile releases',
        type: 'scheduled',
        production: true,
        pathPatterns: ['apps/ios/**'],
        createdAt: '2026-04-30T10:00:00.000Z',
        updatedAt: '2026-05-01T10:00:00.000Z',
        archivedAt: null,
        url: 'https://linear.app/pipelines/ios-production',
        teams: {
          nodes: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
        },
        stages: {
          nodes: [
            {
              id: 'stage-1',
              name: 'In QA',
              color: '#ffaa00',
              type: 'started',
              position: 2,
              description: 'Testing release candidates',
              frozen: false,
              createdAt: '2026-04-30T10:00:00.000Z',
              updatedAt: '2026-05-01T10:00:00.000Z',
              archivedAt: null,
            },
          ],
        },
        latestReleaseNote: {
          id: 'note-1',
          title: '1.2.3 Notes',
          slugId: '1-2-3-notes',
          createdAt: '2026-05-01T12:00:00.000Z',
          updatedAt: '2026-05-01T12:30:00.000Z',
          documentContent: { content: 'Shipped fixes' },
          releases: [
            {
              id: 'release-1',
              name: 'Release 1.2.3',
              version: '1.2.3',
            },
          ],
          lastRelease: {
            id: 'release-1',
            name: 'Release 1.2.3',
            version: '1.2.3',
          },
        },
      },
    });
    service['client'].client.request = request;

    await expect(service.getReleasePipelineById('pipeline-1')).resolves.toEqual({
      id: 'pipeline-1',
      name: 'iOS Production',
      slugId: 'ios-production',
      description: 'Production mobile releases',
      type: 'scheduled',
      production: true,
      pathPatterns: ['apps/ios/**'],
      createdAt: new Date('2026-04-30T10:00:00.000Z'),
      updatedAt: new Date('2026-05-01T10:00:00.000Z'),
      archivedAt: null,
      url: 'https://linear.app/pipelines/ios-production',
      teams: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
      stages: [
        {
          id: 'stage-1',
          name: 'In QA',
          color: '#ffaa00',
          type: 'started',
          position: 2,
          description: 'Testing release candidates',
          frozen: false,
          createdAt: new Date('2026-04-30T10:00:00.000Z'),
          updatedAt: new Date('2026-05-01T10:00:00.000Z'),
          archivedAt: null,
        },
      ],
      latestReleaseNote: {
        id: 'note-1',
        title: '1.2.3 Notes',
        slugId: '1-2-3-notes',
        content: 'Shipped fixes',
        createdAt: new Date('2026-05-01T12:00:00.000Z'),
        updatedAt: new Date('2026-05-01T12:30:00.000Z'),
        releases: [{ id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' }],
        lastRelease: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
      },
    });
  });

  it('returns normalized releases with pipeline and stage filters', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releases: {
        nodes: [
          {
            id: 'release-1',
            name: 'Release 1.2.3',
            version: '1.2.3',
            description: 'Mobile rollout',
            commitSha: 'abc123',
            startDate: '2026-05-01',
            targetDate: '2026-05-03',
            startedAt: '2026-05-01T08:00:00.000Z',
            completedAt: null,
            canceledAt: null,
            createdAt: '2026-05-01T07:00:00.000Z',
            updatedAt: '2026-05-01T08:30:00.000Z',
            trashed: false,
            url: 'https://linear.app/releases/release-1',
            issueCount: 3,
            currentProgress: { completed: 2, started: 1 },
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
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(
      service.getReleases({
        limit: 5,
        includeArchived: true,
        orderBy: 'updatedAt',
        pipelineId: 'pipeline-1',
        stageId: 'stage-1',
      }),
    ).resolves.toEqual([
      {
        id: 'release-1',
        name: 'Release 1.2.3',
        version: '1.2.3',
        description: 'Mobile rollout',
        commitSha: 'abc123',
        startDate: '2026-05-01',
        targetDate: '2026-05-03',
        startedAt: new Date('2026-05-01T08:00:00.000Z'),
        completedAt: null,
        canceledAt: null,
        createdAt: new Date('2026-05-01T07:00:00.000Z'),
        updatedAt: new Date('2026-05-01T08:30:00.000Z'),
        trashed: false,
        url: 'https://linear.app/releases/release-1',
        issueCount: 3,
        currentProgress: { completed: 2, started: 1 },
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
      },
    ]);

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('query LinearGetReleases'),
      {
        first: 5,
        includeArchived: true,
        orderBy: 'updatedAt',
        filter: {
          pipeline: { id: { eq: 'pipeline-1' } },
          stage: { id: { eq: 'stage-1' } },
        },
      },
    );
  });

  it('returns release details with issues and release notes', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      release: {
        id: 'release-1',
        name: 'Release 1.2.3',
        version: '1.2.3',
        description: 'Mobile rollout',
        commitSha: 'abc123',
        startDate: '2026-05-01',
        targetDate: '2026-05-03',
        startedAt: '2026-05-01T08:00:00.000Z',
        completedAt: null,
        canceledAt: null,
        createdAt: '2026-05-01T07:00:00.000Z',
        updatedAt: '2026-05-01T08:30:00.000Z',
        trashed: false,
        url: 'https://linear.app/releases/release-1',
        issueCount: 2,
        currentProgress: { completed: 1, started: 1 },
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
        issues: {
          nodes: [
            { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
            { id: 'issue-2', identifier: 'ENG-124', title: 'Ship auth fix' },
          ],
        },
        releaseNotes: [
          {
            id: 'note-1',
            title: '1.2.3 Notes',
            slugId: '1-2-3-notes',
            createdAt: '2026-05-01T12:00:00.000Z',
            updatedAt: '2026-05-01T12:30:00.000Z',
            documentContent: { content: 'Shipped fixes' },
            releases: [
              {
                id: 'release-1',
                name: 'Release 1.2.3',
                version: '1.2.3',
              },
            ],
            lastRelease: {
              id: 'release-1',
              name: 'Release 1.2.3',
              version: '1.2.3',
            },
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(service.getReleaseById('release-1')).resolves.toEqual({
      id: 'release-1',
      name: 'Release 1.2.3',
      version: '1.2.3',
      description: 'Mobile rollout',
      commitSha: 'abc123',
      startDate: '2026-05-01',
      targetDate: '2026-05-03',
      startedAt: new Date('2026-05-01T08:00:00.000Z'),
      completedAt: null,
      canceledAt: null,
      createdAt: new Date('2026-05-01T07:00:00.000Z'),
      updatedAt: new Date('2026-05-01T08:30:00.000Z'),
      trashed: false,
      url: 'https://linear.app/releases/release-1',
      issueCount: 2,
      currentProgress: { completed: 1, started: 1 },
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
      issues: [
        { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
        { id: 'issue-2', identifier: 'ENG-124', title: 'Ship auth fix' },
      ],
      releaseNotes: [
        {
          id: 'note-1',
          title: '1.2.3 Notes',
          slugId: '1-2-3-notes',
          content: 'Shipped fixes',
          createdAt: new Date('2026-05-01T12:00:00.000Z'),
          updatedAt: new Date('2026-05-01T12:30:00.000Z'),
          releases: [{ id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' }],
          lastRelease: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
        },
      ],
    });
  });

  it('throws when the requested release does not exist', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({ release: null });
    service['client'].client.request = request;

    await expect(service.getReleaseById('missing-release')).rejects.toThrow(
      'Release with ID missing-release not found',
    );
  });

  it('searches releases and applies release filters', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseSearch: [
        {
          id: 'release-1',
          name: 'Release 1.2.3',
          version: '1.2.3',
          description: null,
          commitSha: null,
          startDate: null,
          targetDate: null,
          startedAt: null,
          completedAt: null,
          canceledAt: null,
          createdAt: '2026-05-01T07:00:00.000Z',
          updatedAt: '2026-05-01T08:30:00.000Z',
          trashed: false,
          url: 'https://linear.app/releases/release-1',
          issueCount: 1,
          currentProgress: {},
          creator: null,
          pipeline: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            type: 'scheduled',
          },
          stage: {
            id: 'stage-2',
            name: 'Completed',
            color: '#00aa00',
            type: 'completed',
            frozen: false,
          },
        },
      ],
    });
    service['client'].client.request = request;

    await expect(
      service.searchReleases({
        term: '1.2.3',
        limit: 5,
        pipelineId: 'pipeline-1',
        stageId: 'stage-2',
      }),
    ).resolves.toHaveLength(1);

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('query LinearSearchReleases'),
      {
        first: 5,
        term: '1.2.3',
        filter: {
          pipeline: { id: { eq: 'pipeline-1' } },
          stage: { id: { eq: 'stage-2' } },
        },
      },
    );
  });

  it('returns normalized release stages', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseStages: {
        nodes: [
          {
            id: 'stage-1',
            name: 'In QA',
            color: '#ffaa00',
            type: 'started',
            position: 2,
            description: 'Testing release candidates',
            frozen: false,
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-01T10:00:00.000Z',
            archivedAt: null,
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(service.getReleaseStages({ pipelineId: 'pipeline-1' })).resolves.toEqual([
      {
        id: 'stage-1',
        name: 'In QA',
        color: '#ffaa00',
        type: 'started',
        position: 2,
        description: 'Testing release candidates',
        frozen: false,
        createdAt: new Date('2026-04-30T10:00:00.000Z'),
        updatedAt: new Date('2026-05-01T10:00:00.000Z'),
        archivedAt: null,
        pipeline: {
          id: 'pipeline-1',
          name: 'iOS Production',
          slugId: 'ios-production',
          type: 'scheduled',
        },
      },
    ]);
  });

  it('returns normalized release notes and extracts document-backed content', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseNotes: {
        nodes: [
          {
            id: 'note-1',
            title: '1.2.3 Notes',
            slugId: '1-2-3-notes',
            createdAt: '2026-05-01T12:00:00.000Z',
            updatedAt: '2026-05-01T12:30:00.000Z',
            documentContent: { content: 'Shipped fixes' },
            releases: [
              {
                id: 'release-1',
                name: 'Release 1.2.3',
                version: '1.2.3',
              },
            ],
            lastRelease: {
              id: 'release-1',
              name: 'Release 1.2.3',
              version: '1.2.3',
            },
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(service.getReleaseNotes({ limit: 5, includeArchived: true })).resolves.toEqual([
      {
        id: 'note-1',
        title: '1.2.3 Notes',
        slugId: '1-2-3-notes',
        content: 'Shipped fixes',
        createdAt: new Date('2026-05-01T12:00:00.000Z'),
        updatedAt: new Date('2026-05-01T12:30:00.000Z'),
        releases: [{ id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' }],
        lastRelease: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
      },
    ]);
  });
});

describe('LinearService release mutations', () => {
  it('creates a release pipeline and returns normalized details', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releasePipelineCreate: {
        success: true,
        releasePipeline: {
          id: 'pipeline-1',
          name: 'iOS Production',
          slugId: 'ios-production',
          description: 'Production mobile releases',
          type: 'scheduled',
          production: true,
          pathPatterns: ['apps/ios/**'],
          createdAt: '2026-04-30T10:00:00.000Z',
          updatedAt: '2026-05-01T10:00:00.000Z',
          archivedAt: null,
          url: 'https://linear.app/pipelines/ios-production',
          teams: {
            nodes: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
          },
          stages: {
            nodes: [],
          },
          latestReleaseNote: null,
        },
      },
    });
    service['client'].client.request = request;

    await expect(
      service.createReleasePipeline({
        name: 'iOS Production',
        teamIds: ['team-1'],
        type: 'scheduled',
        slugId: 'ios-production',
        isProduction: true,
        includePathPatterns: ['apps/ios/**'],
      }),
    ).resolves.toMatchObject({
      id: 'pipeline-1',
      name: 'iOS Production',
      teams: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
      stages: [],
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearCreateReleasePipeline'),
      {
        input: {
          name: 'iOS Production',
          teamIds: ['team-1'],
          type: 'scheduled',
          slugId: 'ios-production',
          isProduction: true,
          includePathPatterns: ['apps/ios/**'],
        },
      },
    );
  });

  it('rejects release pipeline updates without any mutable fields', async () => {
    const service = createService();

    await expect(service.updateReleasePipeline({ id: 'pipeline-1' })).rejects.toThrow(
      'At least one release pipeline field must be provided',
    );
  });

  it('updates a release pipeline and preserves empty includePathPatterns arrays', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releasePipelineUpdate: {
        success: true,
        releasePipeline: {
          id: 'pipeline-1',
          name: 'iOS Prod',
          slugId: 'ios-prod',
          description: 'Production mobile releases',
          type: 'continuous',
          production: false,
          pathPatterns: [],
          createdAt: '2026-04-30T10:00:00.000Z',
          updatedAt: '2026-05-02T10:00:00.000Z',
          archivedAt: null,
          url: 'https://linear.app/pipelines/ios-prod',
          teams: {
            nodes: [{ id: 'team-1', name: 'iOS', key: 'IOS' }],
          },
          stages: {
            nodes: [],
          },
          latestReleaseNote: null,
        },
      },
    });
    service['client'].client.request = request;

    await expect(
      service.updateReleasePipeline({
        id: 'pipeline-1',
        name: 'iOS Prod',
        type: 'continuous',
        isProduction: false,
        includePathPatterns: [],
      }),
    ).resolves.toMatchObject({
      id: 'pipeline-1',
      name: 'iOS Prod',
      type: 'continuous',
      production: false,
      pathPatterns: [],
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearUpdateReleasePipeline'),
      {
        id: 'pipeline-1',
        input: {
          name: 'iOS Prod',
          type: 'continuous',
          isProduction: false,
          includePathPatterns: [],
        },
      },
    );
  });

  it('archives, unarchives, and deletes a release pipeline', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        releasePipelineArchive: {
          success: true,
          entity: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            description: 'Production mobile releases',
            type: 'scheduled',
            production: true,
            pathPatterns: ['apps/ios/**'],
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-01T10:00:00.000Z',
            archivedAt: '2026-05-03T10:00:00.000Z',
            url: 'https://linear.app/pipelines/ios-production',
            teams: { nodes: [{ id: 'team-1', name: 'iOS', key: 'IOS' }] },
            stages: { nodes: [] },
            latestReleaseNote: null,
          },
        },
      })
      .mockResolvedValueOnce({
        releasePipelineUnarchive: {
          success: true,
          entity: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            description: 'Production mobile releases',
            type: 'scheduled',
            production: true,
            pathPatterns: ['apps/ios/**'],
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-04T10:00:00.000Z',
            archivedAt: null,
            url: 'https://linear.app/pipelines/ios-production',
            teams: { nodes: [{ id: 'team-1', name: 'iOS', key: 'IOS' }] },
            stages: { nodes: [] },
            latestReleaseNote: null,
          },
        },
      })
      .mockResolvedValueOnce({
        releasePipelineDelete: {
          success: true,
        },
      });
    service['client'].client.request = request;

    await expect(service.archiveReleasePipeline('pipeline-1')).resolves.toEqual({
      success: true,
      releasePipeline: expect.objectContaining({ id: 'pipeline-1' }),
    });
    await expect(service.unarchiveReleasePipeline('pipeline-1')).resolves.toEqual({
      success: true,
      releasePipeline: expect.objectContaining({ id: 'pipeline-1' }),
    });
    await expect(service.deleteReleasePipeline('pipeline-1')).resolves.toEqual({
      success: true,
      id: 'pipeline-1',
    });
  });

  it('creates a release stage with pipeline context', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseStageCreate: {
        success: true,
        releaseStage: {
          id: 'stage-1',
          name: 'In QA',
          color: '#ffaa00',
          type: 'started',
          position: 2,
          description: 'Testing release candidates',
          frozen: false,
          createdAt: '2026-04-30T10:00:00.000Z',
          updatedAt: '2026-05-01T10:00:00.000Z',
          archivedAt: null,
          pipeline: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            type: 'scheduled',
          },
        },
      },
    });
    service['client'].client.request = request;

    await expect(
      service.createReleaseStage({
        pipelineId: 'pipeline-1',
        name: 'In QA',
        color: '#ffaa00',
        position: 2,
        type: 'started',
        frozen: false,
      }),
    ).resolves.toMatchObject({
      id: 'stage-1',
      name: 'In QA',
      pipeline: { id: 'pipeline-1', type: 'scheduled' },
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearCreateReleaseStage'),
      {
        input: {
          pipelineId: 'pipeline-1',
          name: 'In QA',
          color: '#ffaa00',
          position: 2,
          type: 'started',
          frozen: false,
        },
      },
    );
  });

  it('rejects release stage updates without any mutable fields', async () => {
    const service = createService();

    await expect(service.updateReleaseStage({ id: 'stage-1' })).rejects.toThrow(
      'At least one release stage field must be provided',
    );
  });

  it('updates, archives, and unarchives a release stage', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        releaseStageUpdate: {
          success: true,
          releaseStage: {
            id: 'stage-1',
            name: 'Validation',
            color: '#ffcc00',
            type: 'started',
            position: 0,
            description: 'Testing release candidates',
            frozen: true,
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-02T10:00:00.000Z',
            archivedAt: null,
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
          },
        },
      })
      .mockResolvedValueOnce({
        releaseStageArchive: {
          success: true,
          entity: {
            id: 'stage-1',
            name: 'Validation',
            color: '#ffcc00',
            type: 'started',
            position: 0,
            description: 'Testing release candidates',
            frozen: true,
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-03T10:00:00.000Z',
            archivedAt: '2026-05-03T10:00:00.000Z',
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
          },
        },
      })
      .mockResolvedValueOnce({
        releaseStageUnarchive: {
          success: true,
          entity: {
            id: 'stage-1',
            name: 'Validation',
            color: '#ffcc00',
            type: 'started',
            position: 0,
            description: 'Testing release candidates',
            frozen: true,
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-04T10:00:00.000Z',
            archivedAt: null,
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
          },
        },
      });
    service['client'].client.request = request;

    await expect(
      service.updateReleaseStage({
        id: 'stage-1',
        name: 'Validation',
        position: 0,
        frozen: true,
      }),
    ).resolves.toMatchObject({
      id: 'stage-1',
      name: 'Validation',
      position: 0,
      frozen: true,
    });

    expect(request).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('mutation LinearUpdateReleaseStage'),
      {
        id: 'stage-1',
        input: {
          name: 'Validation',
          position: 0,
          frozen: true,
        },
      },
    );

    await expect(service.archiveReleaseStage('stage-1')).resolves.toEqual({
      success: true,
      releaseStage: expect.objectContaining({ id: 'stage-1' }),
    });
    await expect(service.unarchiveReleaseStage('stage-1')).resolves.toEqual({
      success: true,
      releaseStage: expect.objectContaining({ id: 'stage-1' }),
    });
  });

  it('creates a release and omits empty optional fields', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseCreate: {
        success: true,
        release: {
          id: 'release-1',
          name: 'Release 1.2.3',
          version: '1.2.3',
          description: null,
          commitSha: 'abc123',
          startDate: null,
          targetDate: '2026-05-03',
          startedAt: null,
          completedAt: null,
          canceledAt: null,
          createdAt: '2026-05-01T07:00:00.000Z',
          updatedAt: '2026-05-01T08:30:00.000Z',
          trashed: false,
          url: 'https://linear.app/releases/release-1',
          issueCount: 0,
          currentProgress: {},
          creator: null,
          pipeline: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            type: 'scheduled',
          },
          stage: {
            id: 'stage-1',
            name: 'Planned',
            color: '#666666',
            type: 'planned',
            frozen: false,
          },
        },
      },
    });
    service['client'].client.request = request;

    await expect(
      service.createRelease({
        pipelineId: 'pipeline-1',
        name: 'Release 1.2.3',
        version: '1.2.3',
        description: '',
        commitSha: 'abc123',
        stageId: '',
        startDate: '',
        targetDate: '2026-05-03',
      }),
    ).resolves.toMatchObject({
      id: 'release-1',
      name: 'Release 1.2.3',
      version: '1.2.3',
      commitSha: 'abc123',
      targetDate: '2026-05-03',
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearCreateRelease'),
      {
        input: {
          pipelineId: 'pipeline-1',
          name: 'Release 1.2.3',
          version: '1.2.3',
          commitSha: 'abc123',
          targetDate: '2026-05-03',
        },
      },
    );
  });

  it('rejects release updates without any mutable fields', async () => {
    const service = createService();

    await expect(service.updateRelease({ id: 'release-1' })).rejects.toThrow(
      'At least one release field must be provided',
    );
  });

  it('updates a release and omits empty optional fields', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseUpdate: {
        success: true,
        release: {
          id: 'release-1',
          name: 'Release 1.2.4',
          version: '1.2.4',
          description: 'Updated',
          commitSha: 'def456',
          startDate: '2026-05-02',
          targetDate: '2026-05-04',
          startedAt: '2026-05-02T08:00:00.000Z',
          completedAt: null,
          canceledAt: null,
          createdAt: '2026-05-01T07:00:00.000Z',
          updatedAt: '2026-05-02T08:30:00.000Z',
          trashed: false,
          url: 'https://linear.app/releases/release-1',
          issueCount: 1,
          currentProgress: { started: 1 },
          creator: null,
          pipeline: {
            id: 'pipeline-1',
            name: 'iOS Production',
            slugId: 'ios-production',
            type: 'scheduled',
          },
          stage: {
            id: 'stage-2',
            name: 'In QA',
            color: '#ffaa00',
            type: 'started',
            frozen: false,
          },
        },
      },
    });
    service['client'].client.request = request;

    await expect(
      service.updateRelease({
        id: 'release-1',
        name: 'Release 1.2.4',
        description: 'Updated',
        commitSha: 'def456',
        stageId: 'stage-2',
        startDate: '2026-05-02',
        targetDate: '',
      }),
    ).resolves.toMatchObject({
      id: 'release-1',
      name: 'Release 1.2.4',
      stage: { id: 'stage-2' },
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearUpdateRelease'),
      {
        id: 'release-1',
        input: {
          name: 'Release 1.2.4',
          description: 'Updated',
          commitSha: 'def456',
          stageId: 'stage-2',
          startDate: '2026-05-02',
        },
      },
    );
  });

  it('completes a release using the dedicated pipeline mutation', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        releaseStages: {
          nodes: [
            {
              id: 'stage-3',
              name: 'Released',
              color: '#00aa00',
              type: 'completed',
              position: 3,
              frozen: false,
              createdAt: '2026-05-01T07:00:00.000Z',
              updatedAt: '2026-05-03T09:00:00.000Z',
              archivedAt: null,
              pipeline: {
                id: 'pipeline-1',
                name: 'iOS Production',
                slugId: 'ios-production',
                type: 'scheduled',
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        releaseComplete: {
          success: true,
          release: {
            id: 'release-1',
            name: 'Release 1.2.3',
            version: '1.2.3',
            description: null,
            commitSha: 'abc123',
            startDate: '2026-05-01',
            targetDate: '2026-05-03',
            startedAt: '2026-05-01T08:00:00.000Z',
            completedAt: '2026-05-03T09:00:00.000Z',
            canceledAt: null,
            createdAt: '2026-05-01T07:00:00.000Z',
            updatedAt: '2026-05-03T09:00:00.000Z',
            trashed: false,
            url: 'https://linear.app/releases/release-1',
            issueCount: 3,
            currentProgress: { completed: 3 },
            creator: null,
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
            stage: {
              id: 'stage-3',
              name: 'Released',
              color: '#00aa00',
              type: 'completed',
              frozen: false,
            },
          },
        },
      });
    service['client'].client.request = request;

    await expect(
      service.completeRelease({ pipelineId: 'pipeline-1', version: '1.2.3' }),
    ).resolves.toMatchObject({
      id: 'release-1',
      completedAt: new Date('2026-05-03T09:00:00.000Z'),
      stage: { type: 'completed' },
    });

    expect(request).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('query LinearGetReleaseStages'),
      {
        first: 100,
        includeArchived: false,
        orderBy: 'updatedAt',
      },
    );

    expect(request).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('mutation LinearCompleteRelease'),
      {
        input: {
          pipelineId: 'pipeline-1',
          version: '1.2.3',
        },
      },
    );
  });

  it('rejects completeRelease when the pipeline has no completed stage', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseStages: {
        nodes: [
          {
            id: 'stage-1',
            name: 'In QA',
            color: '#ffaa00',
            type: 'started',
            position: 2,
            frozen: false,
            createdAt: '2026-04-30T10:00:00.000Z',
            updatedAt: '2026-05-01T10:00:00.000Z',
            archivedAt: null,
            pipeline: {
              id: 'pipeline-1',
              name: 'iOS Production',
              slugId: 'ios-production',
              type: 'scheduled',
            },
          },
        ],
      },
    });
    service['client'].client.request = request;

    await expect(service.completeRelease({ pipelineId: 'pipeline-1', version: '1.2.3' })).rejects.toThrow(
      'Cannot complete release for pipeline pipeline-1: no completed release stage exists. Create a completed stage in Linear before calling completeRelease.',
    );

    expect(request).toHaveBeenCalledTimes(1);
  });

  it('archives and unarchives a release', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        releaseArchive: {
          success: true,
          entity: {
            id: 'release-1',
            name: 'Release 1.2.3',
            version: '1.2.3',
            description: null,
            commitSha: null,
            startDate: null,
            targetDate: null,
            startedAt: null,
            completedAt: null,
            canceledAt: null,
            createdAt: '2026-05-01T07:00:00.000Z',
            updatedAt: '2026-05-02T07:00:00.000Z',
            trashed: false,
            url: 'https://linear.app/releases/release-1',
            issueCount: 0,
            currentProgress: {},
            creator: null,
            pipeline: null,
            stage: null,
          },
        },
      })
      .mockResolvedValueOnce({
        releaseUnarchive: {
          success: true,
          entity: {
            id: 'release-1',
            name: 'Release 1.2.3',
            version: '1.2.3',
            description: null,
            commitSha: null,
            startDate: null,
            targetDate: null,
            startedAt: null,
            completedAt: null,
            canceledAt: null,
            createdAt: '2026-05-01T07:00:00.000Z',
            updatedAt: '2026-05-03T07:00:00.000Z',
            trashed: false,
            url: 'https://linear.app/releases/release-1',
            issueCount: 0,
            currentProgress: {},
            creator: null,
            pipeline: null,
            stage: null,
          },
        },
      });
    service['client'].client.request = request;

    await expect(service.archiveRelease('release-1')).resolves.toEqual({
      success: true,
      release: expect.objectContaining({ id: 'release-1' }),
    });
    await expect(service.unarchiveRelease('release-1')).resolves.toEqual({
      success: true,
      release: expect.objectContaining({ id: 'release-1' }),
    });
  });

  it('adds and removes issue-to-release associations', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        issueToReleaseCreate: {
          success: true,
          issueToRelease: {
            issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
            release: {
              id: 'release-1',
              name: 'Release 1.2.3',
              version: '1.2.3',
            },
          },
        },
      })
      .mockResolvedValueOnce({
        issueToReleaseDeleteByIssueAndRelease: {
          success: true,
        },
      });
    service['client'].client.request = request;

    await expect(
      service.addIssueToRelease({ issueId: 'ENG-123', releaseId: 'release-1' }),
    ).resolves.toEqual({
      success: true,
      issue: { id: 'issue-1', identifier: 'ENG-123', title: 'Ship mobile fix' },
      release: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
    });

    await expect(
      service.removeIssueFromRelease({ issueId: 'ENG-123', releaseId: 'release-1' }),
    ).resolves.toEqual({
      success: true,
      issue: { id: 'ENG-123', identifier: 'ENG-123', title: '' },
      release: { id: 'release-1', name: '', version: null },
    });
  });

  it('creates and updates release notes with explicit release IDs and release ranges', async () => {
    const service = createService();
    const request = jest
      .fn()
      .mockResolvedValueOnce({
        releaseNoteCreate: {
          success: true,
          releaseNote: {
            id: 'note-1',
            title: '1.2.3 Notes',
            slugId: '1-2-3-notes',
            createdAt: '2026-05-01T12:00:00.000Z',
            updatedAt: '2026-05-01T12:30:00.000Z',
            documentContent: { content: 'Shipped fixes' },
            releases: [{ id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' }],
            lastRelease: { id: 'release-1', name: 'Release 1.2.3', version: '1.2.3' },
          },
        },
      })
      .mockResolvedValueOnce({
        releaseNoteUpdate: {
          success: true,
          releaseNote: {
            id: 'note-1',
            title: '1.2.4 Notes',
            slugId: '1-2-4-notes',
            createdAt: '2026-05-01T12:00:00.000Z',
            updatedAt: '2026-05-02T12:30:00.000Z',
            documentContent: { content: 'Updated notes' },
            releases: [{ id: 'release-2', name: 'Release 1.2.4', version: '1.2.4' }],
            lastRelease: { id: 'release-2', name: 'Release 1.2.4', version: '1.2.4' },
          },
        },
      });
    service['client'].client.request = request;

    await expect(
      service.createReleaseNote({
        pipelineId: 'pipeline-1',
        content: 'Shipped fixes',
        releaseIds: ['release-1'],
      }),
    ).resolves.toMatchObject({
      id: 'note-1',
      content: 'Shipped fixes',
    });

    await expect(
      service.updateReleaseNote({
        id: 'note-1',
        content: 'Updated notes',
        rangeFromReleaseId: 'release-1',
        rangeToReleaseId: 'release-2',
      }),
    ).resolves.toMatchObject({
      id: 'note-1',
      content: 'Updated notes',
    });

    expect(request).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('mutation LinearCreateReleaseNote'),
      {
        input: {
          pipelineId: 'pipeline-1',
          content: 'Shipped fixes',
          releaseIds: ['release-1'],
        },
      },
    );
    expect(request).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('mutation LinearUpdateReleaseNote'),
      {
        id: 'note-1',
        input: {
          content: 'Updated notes',
          rangeFromReleaseId: 'release-1',
          rangeToReleaseId: 'release-2',
        },
      },
    );
  });

  it('rejects release note mutations with invalid release selection shapes', async () => {
    const service = createService();

    await expect(
      service.createReleaseNote({ pipelineId: 'pipeline-1', content: 'Notes' }),
    ).rejects.toThrow('A release note must specify either releaseIds or a complete release range');
    await expect(
      service.createReleaseNote({
        pipelineId: 'pipeline-1',
        releaseIds: ['release-1'],
        rangeFromReleaseId: 'release-1',
        rangeToReleaseId: 'release-2',
      }),
    ).rejects.toThrow('A release note cannot specify both explicit releaseIds and a release range');
    await expect(service.updateReleaseNote({ id: 'note-1' })).rejects.toThrow(
      'At least one release note field must be provided',
    );
    await expect(
      service.updateReleaseNote({ id: 'note-1', rangeFromReleaseId: 'release-1' }),
    ).rejects.toThrow('A release note range update must include both rangeFromReleaseId and rangeToReleaseId');
  });

  it('deletes release notes', async () => {
    const service = createService();
    const request = jest.fn().mockResolvedValue({
      releaseNoteDelete: {
        success: true,
      },
    });
    service['client'].client.request = request;

    await expect(service.deleteReleaseNote('note-1')).resolves.toEqual({ success: true, id: 'note-1' });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearDeleteReleaseNote'),
      { id: 'note-1' },
    );
  });
});
