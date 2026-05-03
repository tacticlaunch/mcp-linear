import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('cycle MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the cycle issue tool definition', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(expect.arrayContaining(['linear_getCycleIssues']));
  });

  it('defines PM-oriented cycle issue filters', () => {
    const getCycleIssuesTool = allToolDefinitions.find((tool) => tool.name === 'linear_getCycleIssues');

    expect(getCycleIssuesTool?.input_schema).toMatchObject({
      required: ['cycleId'],
      properties: {
        limit: { type: 'integer', minimum: 1 },
        states: { type: 'array', items: { type: 'string' } },
        assigneeId: { type: 'string' },
        labelIds: { type: 'array', items: { type: 'string' } },
        includeCompleted: { type: 'boolean' },
        orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
      },
    });

    expect(getCycleIssuesTool?.output_schema.items.properties).toMatchObject({
      labels: { type: 'array' },
      cycle: { type: ['object', 'null'] },
      projectMilestone: { type: ['object', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    });
  });

  it('routes cycle issue filters to the linear service', async () => {
    const getCycleIssues = jest.fn().mockResolvedValue([{ id: 'issue-1' }]);
    const handlers = registerToolHandlers({ getCycleIssues } as unknown as LinearService);

    await expect(
      handlers.linear_getCycleIssues({
        cycleId: 'cycle-1',
        limit: 10,
        states: ['Todo'],
        assigneeId: 'user-1',
        labelIds: ['label-1'],
        includeCompleted: false,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([{ id: 'issue-1' }]);

    expect(getCycleIssues).toHaveBeenCalledWith({
      cycleId: 'cycle-1',
      limit: 10,
      states: ['Todo'],
      assigneeId: 'user-1',
      labelIds: ['label-1'],
      includeCompleted: false,
      orderBy: 'updatedAt',
    });
  });

  it('rejects invalid cycle issue arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(handlers.linear_getCycleIssues({})).rejects.toThrow(
      'Invalid arguments for getCycleIssues',
    );

    await expect(
      handlers.linear_getCycleIssues({
        cycleId: 'cycle-1',
        limit: 0,
      }),
    ).rejects.toThrow('Invalid arguments for getCycleIssues');

    await expect(
      handlers.linear_getCycleIssues({
        cycleId: 'cycle-1',
        labelIds: 'label-1',
      }),
    ).rejects.toThrow('Invalid arguments for getCycleIssues');

    await expect(
      handlers.linear_getCycleIssues({
        cycleId: 'cycle-1',
        orderBy: 'priority',
      }),
    ).rejects.toThrow('Invalid arguments for getCycleIssues');
  });
});
