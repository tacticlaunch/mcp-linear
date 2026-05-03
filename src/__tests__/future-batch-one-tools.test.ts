import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('future batch one MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers comment, cycle, project member, and template tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_updateComment',
        'linear_deleteComment',
        'linear_getProjectMembers',
        'linear_addProjectMember',
        'linear_removeProjectMember',
        'linear_getCycleById',
        'linear_createCycle',
        'linear_updateCycle',
        'linear_completeCycle',
        'linear_getCycleStats',
        'linear_getIssueTemplates',
        'linear_getIssueTemplateById',
        'linear_createIssueTemplate',
        'linear_updateIssueTemplate',
        'linear_createIssueFromTemplate',
        'linear_getTeamTemplates',
        'linear_archiveTemplate',
      ]),
    );
  });

  it('routes batch-one handlers to the service layer', async () => {
    const service = {
      updateComment: jest.fn().mockResolvedValue({ id: 'comment-1' }),
      deleteComment: jest.fn().mockResolvedValue({ success: true, id: 'comment-1' }),
      getProjectMembers: jest.fn().mockResolvedValue([{ id: 'user-1' }]),
      addProjectMember: jest.fn().mockResolvedValue({ success: true, projectId: 'project-1', userId: 'user-1' }),
      removeProjectMember: jest.fn().mockResolvedValue({ success: true, projectId: 'project-1', userId: 'user-1' }),
      getCycleById: jest.fn().mockResolvedValue({ id: 'cycle-1' }),
      createCycle: jest.fn().mockResolvedValue({ id: 'cycle-1' }),
      updateCycle: jest.fn().mockResolvedValue({ id: 'cycle-1' }),
      completeCycle: jest.fn().mockResolvedValue({ id: 'cycle-1', completedAt: '2026-04-19T00:00:00.000Z' }),
      getCycleStats: jest.fn().mockResolvedValue({ id: 'cycle-1', progress: 50 }),
      getIssueTemplates: jest.fn().mockResolvedValue([{ id: 'template-1' }]),
      getIssueTemplateById: jest.fn().mockResolvedValue({ id: 'template-1' }),
      createIssueTemplate: jest.fn().mockResolvedValue({ id: 'template-1' }),
      updateIssueTemplate: jest.fn().mockResolvedValue({ id: 'template-1' }),
      createIssueFromTemplate: jest.fn().mockResolvedValue({ id: 'issue-1' }),
      getTeamTemplates: jest.fn().mockResolvedValue([{ id: 'template-2' }]),
      archiveTemplate: jest.fn().mockResolvedValue({ success: true, id: 'template-1' }),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(handlers.linear_updateComment({ id: 'comment-1', body: 'Updated body' })).resolves.toEqual({ id: 'comment-1' });
    await expect(handlers.linear_deleteComment({ id: 'comment-1' })).resolves.toEqual({ success: true, id: 'comment-1' });
    await expect(handlers.linear_getProjectMembers({ projectId: 'project-1', limit: 10 })).resolves.toEqual([{ id: 'user-1' }]);
    await expect(handlers.linear_addProjectMember({ projectId: 'project-1', userId: 'user-1' })).resolves.toEqual({ success: true, projectId: 'project-1', userId: 'user-1' });
    await expect(handlers.linear_removeProjectMember({ projectId: 'project-1', userId: 'user-1' })).resolves.toEqual({ success: true, projectId: 'project-1', userId: 'user-1' });
    await expect(handlers.linear_getCycleById({ id: 'cycle-1' })).resolves.toEqual({ id: 'cycle-1' });
    await expect(handlers.linear_createCycle({ teamId: 'team-1', startsAt: '2026-04-20', endsAt: '2026-05-03' })).resolves.toEqual({ id: 'cycle-1' });
    await expect(handlers.linear_updateCycle({ id: 'cycle-1', name: 'Cycle 13' })).resolves.toEqual({ id: 'cycle-1' });
    await expect(handlers.linear_completeCycle({ id: 'cycle-1' })).resolves.toEqual({ id: 'cycle-1', completedAt: '2026-04-19T00:00:00.000Z' });
    await expect(handlers.linear_getCycleStats({ id: 'cycle-1' })).resolves.toEqual({ id: 'cycle-1', progress: 50 });
    await expect(handlers.linear_getIssueTemplates({ limit: 10 })).resolves.toEqual([{ id: 'template-1' }]);
    await expect(handlers.linear_getIssueTemplateById({ id: 'template-1' })).resolves.toEqual({ id: 'template-1' });
    await expect(handlers.linear_createIssueTemplate({ name: 'Bug template', templateData: { title: 'Bug' } })).resolves.toEqual({ id: 'template-1' });
    await expect(handlers.linear_updateIssueTemplate({ id: 'template-1', description: 'Updated' })).resolves.toEqual({ id: 'template-1' });
    await expect(handlers.linear_createIssueFromTemplate({ teamId: 'team-1', templateId: 'template-1', title: 'Instantiated' })).resolves.toEqual({ id: 'issue-1' });
    await expect(handlers.linear_getTeamTemplates({ teamId: 'team-1', limit: 10 })).resolves.toEqual([{ id: 'template-2' }]);
    await expect(handlers.linear_archiveTemplate({ id: 'template-1' })).resolves.toEqual({ success: true, id: 'template-1' });
  });
});
