import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('issue MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('defines project milestone assignment on issue create and update', () => {
    const createIssueTool = allToolDefinitions.find((tool) => tool.name === 'linear_createIssue');
    const updateIssueTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateIssue');
    const getIssueByIdTool = allToolDefinitions.find((tool) => tool.name === 'linear_getIssueById');

    expect(createIssueTool?.input_schema.properties).toMatchObject({
      projectMilestoneId: {
        type: 'string',
        description: 'ID of the project milestone the issue belongs to',
      },
    });

    expect(updateIssueTool?.input_schema.properties).toMatchObject({
      projectMilestoneId: {
        type: 'string',
        description: 'ID of the project milestone to assign to the issue',
      },
    });

    expect(getIssueByIdTool?.output_schema.properties).toMatchObject({
      projectMilestone: { type: 'object' },
    });
  });

  it('routes milestone assignment through issue create and update handlers', async () => {
    const createIssue = jest.fn().mockResolvedValue({ id: 'issue-1' });
    const updateIssue = jest.fn().mockResolvedValue({ id: 'issue-1' });
    const handlers = registerToolHandlers({ createIssue, updateIssue } as unknown as LinearService);

    await expect(
      handlers.linear_createIssue({
        title: 'Test issue',
        teamId: 'team-1',
        projectMilestoneId: 'milestone-1',
      }),
    ).resolves.toEqual({ id: 'issue-1' });

    await expect(
      handlers.linear_updateIssue({
        id: 'issue-1',
        projectMilestoneId: 'milestone-1',
      }),
    ).resolves.toEqual({ id: 'issue-1' });

    expect(createIssue).toHaveBeenCalledWith({
      title: 'Test issue',
      teamId: 'team-1',
      projectMilestoneId: 'milestone-1',
    });
    expect(updateIssue).toHaveBeenCalledWith({
      id: 'issue-1',
      projectMilestoneId: 'milestone-1',
    });
  });
});
