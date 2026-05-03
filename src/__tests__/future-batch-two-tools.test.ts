import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('future batch two MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers team and workflow management tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_createWorkflowState',
        'linear_updateWorkflowState',
        'linear_updateTeam',
        'linear_getTeamMemberships',
        'linear_createTeam',
        'linear_archiveTeam',
        'linear_addUserToTeam',
        'linear_removeUserFromTeam',
        'linear_updateTeamMembership',
        'linear_getTeamLabels',
        'linear_createTeamLabel',
      ]),
    );
  });

  it('routes team and workflow handlers to the service layer', async () => {
    const service = {
      createWorkflowState: jest.fn().mockResolvedValue({ id: 'state-1' }),
      updateWorkflowState: jest.fn().mockResolvedValue({ id: 'state-1' }),
      updateTeam: jest.fn().mockResolvedValue({ id: 'team-1' }),
      getTeamMemberships: jest.fn().mockResolvedValue([{ id: 'membership-1' }]),
      createTeam: jest.fn().mockResolvedValue({ id: 'team-2' }),
      archiveTeam: jest.fn().mockResolvedValue({ success: true, id: 'team-1' }),
      addUserToTeam: jest.fn().mockResolvedValue({ success: true, teamId: 'team-1', userId: 'user-1' }),
      removeUserFromTeam: jest.fn().mockResolvedValue({ success: true, teamId: 'team-1', userId: 'user-1' }),
      updateTeamMembership: jest.fn().mockResolvedValue({ id: 'membership-1' }),
      getTeamLabels: jest.fn().mockResolvedValue([{ id: 'label-1' }]),
      createTeamLabel: jest.fn().mockResolvedValue({ id: 'label-1' }),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(handlers.linear_createWorkflowState({ name: 'QA', teamId: 'team-1', type: 'unstarted', color: '#123456' })).resolves.toEqual({ id: 'state-1' });
    await expect(handlers.linear_updateWorkflowState({ id: 'state-1', name: 'Doing' })).resolves.toEqual({ id: 'state-1' });
    await expect(handlers.linear_updateTeam({ id: 'team-1', name: 'Premier Studio' })).resolves.toEqual({ id: 'team-1' });
    await expect(handlers.linear_getTeamMemberships({ teamId: 'team-1', limit: 10 })).resolves.toEqual([{ id: 'membership-1' }]);
    await expect(handlers.linear_createTeam({ name: 'Platform' })).resolves.toEqual({ id: 'team-2' });
    await expect(handlers.linear_archiveTeam({ id: 'team-1' })).resolves.toEqual({ success: true, id: 'team-1' });
    await expect(handlers.linear_addUserToTeam({ teamId: 'team-1', userId: 'user-1' })).resolves.toEqual({ success: true, teamId: 'team-1', userId: 'user-1' });
    await expect(handlers.linear_removeUserFromTeam({ teamId: 'team-1', userId: 'user-1' })).resolves.toEqual({ success: true, teamId: 'team-1', userId: 'user-1' });
    await expect(handlers.linear_updateTeamMembership({ id: 'membership-1', owner: true })).resolves.toEqual({ id: 'membership-1' });
    await expect(handlers.linear_getTeamLabels({ teamId: 'team-1', limit: 10 })).resolves.toEqual([{ id: 'label-1' }]);
    await expect(handlers.linear_createTeamLabel({ teamId: 'team-1', name: 'backend', color: '#ff0000' })).resolves.toEqual({ id: 'label-1' });
  });
});
