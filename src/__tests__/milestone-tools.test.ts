import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('milestone MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the milestone tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getMilestones',
        'linear_getMilestoneById',
        'linear_createMilestone',
        'linear_updateMilestone',
        'linear_archiveMilestone',
      ]),
    );
  });

  it('defines milestone schemas for valid pagination and nullable fields', () => {
    const getMilestonesTool = allToolDefinitions.find((tool) => tool.name === 'linear_getMilestones');
    const getMilestoneByIdTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getMilestoneById',
    );
    const updateMilestoneTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_updateMilestone',
    );

    expect(getMilestonesTool?.input_schema.properties?.limit).toMatchObject({
      type: 'integer',
      minimum: 1,
    });
    expect(getMilestonesTool?.input_schema.properties).toMatchObject({
      projectId: { type: 'string' },
      teamId: { type: 'string' },
      status: { type: 'string', enum: ['done', 'next', 'overdue', 'unstarted'] },
      orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
    });
    expect(getMilestonesTool?.output_schema.items.properties).toMatchObject({
      description: { type: ['string', 'null'] },
      targetDate: { type: ['string', 'null'] },
      archivedAt: { type: ['string', 'null'] },
      project: { type: ['object', 'null'] },
    });
    expect(getMilestoneByIdTool?.output_schema.properties).toMatchObject({
      description: { type: ['string', 'null'] },
      targetDate: { type: ['string', 'null'] },
      archivedAt: { type: ['string', 'null'] },
      project: { type: ['object', 'null'] },
    });
    expect(updateMilestoneTool?.input_schema).toMatchObject({
      required: ['id'],
    });
    expect(updateMilestoneTool?.description).toContain('Provide id plus at least one other field');
  });

  it('routes milestone handlers to the linear service', async () => {
    const getMilestones = jest.fn().mockResolvedValue([{ id: 'milestone-1' }]);
    const getMilestoneById = jest.fn().mockResolvedValue({ id: 'milestone-1' });
    const createMilestone = jest.fn().mockResolvedValue({ id: 'milestone-1' });
    const updateMilestone = jest.fn().mockResolvedValue({ id: 'milestone-1' });
    const archiveMilestone = jest.fn().mockResolvedValue({ success: true });
    const handlers = registerToolHandlers({
      getMilestones,
      getMilestoneById,
      createMilestone,
      updateMilestone,
      archiveMilestone,
    } as unknown as LinearService);

    await expect(
      handlers.linear_getMilestones({
        includeArchived: true,
        projectId: 'project-1',
        teamId: 'team-1',
        status: 'next',
        limit: 10,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([{ id: 'milestone-1' }]);
    expect(getMilestones).toHaveBeenCalledWith({
      includeArchived: true,
      projectId: 'project-1',
      teamId: 'team-1',
      status: 'next',
      limit: 10,
      orderBy: 'updatedAt',
    });
    await expect(handlers.linear_getMilestones(null)).resolves.toEqual([{ id: 'milestone-1' }]);
    expect(getMilestones).toHaveBeenCalledWith({});

    await expect(handlers.linear_getMilestoneById({ id: 'milestone-1' })).resolves.toEqual({
      id: 'milestone-1',
    });
    expect(getMilestoneById).toHaveBeenCalledWith('milestone-1');

    await expect(
      handlers.linear_createMilestone({
        name: 'Beta',
        projectId: 'project-1',
        description: 'Ship beta',
      }),
    ).resolves.toEqual({ id: 'milestone-1' });
    expect(createMilestone).toHaveBeenCalledWith({
      name: 'Beta',
      projectId: 'project-1',
      description: 'Ship beta',
    });

    await expect(
      handlers.linear_updateMilestone({
        id: 'milestone-1',
        targetDate: '2026-05-01',
      }),
    ).resolves.toEqual({ id: 'milestone-1' });
    expect(updateMilestone).toHaveBeenCalledWith({
      id: 'milestone-1',
      targetDate: '2026-05-01',
    });

    await expect(handlers.linear_archiveMilestone({ id: 'milestone-1' })).resolves.toEqual({
      success: true,
    });
    expect(archiveMilestone).toHaveBeenCalledWith('milestone-1');
  });

  it('rejects invalid milestone arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(handlers.linear_getMilestones({ limit: '10' })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ limit: -1 })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ limit: 1.5 })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ limit: Number.NaN })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ limit: Number.POSITIVE_INFINITY })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones([])).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ status: 'active' })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );
    await expect(handlers.linear_getMilestones({ orderBy: 'priority' })).rejects.toThrow(
      'Invalid arguments for getMilestones',
    );

    await expect(handlers.linear_getMilestoneById({})).rejects.toThrow(
      'Invalid arguments for getMilestoneById',
    );

    await expect(
      handlers.linear_createMilestone({
        name: 'Beta',
      }),
    ).rejects.toThrow('Invalid arguments for createMilestone');

    await expect(
      handlers.linear_updateMilestone({
        id: 'milestone-1',
        sortOrder: '1',
      }),
    ).rejects.toThrow('Invalid arguments for updateMilestone');
    await expect(
      handlers.linear_updateMilestone({
        id: 'milestone-1',
      }),
    ).rejects.toThrow('Invalid arguments for updateMilestone');

    await expect(handlers.linear_archiveMilestone({})).rejects.toThrow(
      'Invalid arguments for archiveMilestone',
    );
  });
});
