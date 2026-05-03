import { readLinearResource, getLinearResourceDefinitions } from '../mcp-resources.js';
import { LinearService } from '../services/linear-service.js';

describe('Linear MCP resources', () => {
  it('lists static resources for discovery', () => {
    const resources = getLinearResourceDefinitions();
    const uris = resources.map((resource) => resource.uri);

    expect(uris).toEqual(
      expect.arrayContaining([
        'linear://viewer',
        'linear://organization',
        'linear://teams',
        'linear://projects',
        'linear://rate-limit',
        'linear://resource-guide',
      ]),
    );
  });

  it('reads static and dynamic resources through the service layer', async () => {
    const linearService = {
      getUserInfo: jest.fn().mockResolvedValue({ id: 'user-1' }),
      getProjectById: jest.fn().mockResolvedValue({ id: 'project-1' }),
      getProjectIssues: jest.fn().mockResolvedValue([{ id: 'issue-1' }]),
      getProjectDocuments: jest.fn().mockResolvedValue([{ id: 'doc-1' }]),
      getIssueById: jest.fn().mockResolvedValue({ id: 'issue-1' }),
      getDocumentById: jest.fn().mockResolvedValue({ id: 'doc-1' }),
      getRoadmapById: jest.fn().mockResolvedValue({ id: 'roadmap-1' }),
      getMilestoneById: jest.fn().mockResolvedValue({ id: 'milestone-1' }),
      getOrganizationInfo: jest.fn(),
      getTeams: jest.fn(),
      getProjects: jest.fn(),
    } as unknown as LinearService;

    const viewer = await readLinearResource('linear://viewer', {
      linearService,
      getRateLimitSnapshot: () => ({
        blockedUntil: 0,
        isBlocked: false,
        lastRateLimitedAt: null,
        lastDelayMs: null,
        lastOperation: null,
      }),
    });
    expect(viewer.contents[0]).toMatchObject({ uri: 'linear://viewer', mimeType: 'application/json' });

    await readLinearResource('linear://project/project-1', {
      linearService,
      getRateLimitSnapshot: () => ({
        blockedUntil: 0,
        isBlocked: false,
        lastRateLimitedAt: null,
        lastDelayMs: null,
        lastOperation: null,
      }),
    });
    expect(linearService.getProjectById).toHaveBeenCalledWith('project-1');

    await readLinearResource(
      'linear://project/project-1/issues?limit=5&orderBy=updatedAt&includeCompleted=false&states=Todo,In%20Progress&labelIds=label-1,label-2',
      {
        linearService,
        getRateLimitSnapshot: () => ({
          blockedUntil: 0,
          isBlocked: false,
          lastRateLimitedAt: null,
          lastDelayMs: null,
          lastOperation: null,
        }),
      },
    );
    expect(linearService.getProjectIssues).toHaveBeenCalledWith({
      projectId: 'project-1',
      limit: 5,
      states: ['Todo', 'In Progress'],
      assigneeId: undefined,
      labelIds: ['label-1', 'label-2'],
      cycleId: undefined,
      projectMilestoneId: undefined,
      includeCompleted: false,
      orderBy: 'updatedAt',
    });

    const rateLimit = await readLinearResource('linear://rate-limit', {
      linearService,
      getRateLimitSnapshot: () => ({
        blockedUntil: 100,
        isBlocked: true,
        lastRateLimitedAt: 10,
        lastDelayMs: 90,
        lastOperation: 'request',
      }),
    });
    expect(rateLimit.contents[0].text).toContain('"isBlocked": true');
  });
});
