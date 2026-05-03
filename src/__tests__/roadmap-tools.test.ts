import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('roadmap MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers roadmap tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);
    const getRoadmapsDefinition = allToolDefinitions.find((tool) => tool.name === 'linear_getRoadmaps');
    const getRoadmapByIdDefinition = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getRoadmapById',
    );

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getRoadmaps',
        'linear_getRoadmapById',
        'linear_createRoadmap',
        'linear_updateRoadmap',
        'linear_archiveRoadmap',
      ]),
    );
    expect(getRoadmapsDefinition?.input_schema.properties.limit).toMatchObject({
      type: 'integer',
      minimum: 1,
      default: 25,
    });
    expect(getRoadmapByIdDefinition?.output_schema.properties?.owner).toMatchObject({
      type: ['object', 'null'],
    });
    expect(getRoadmapByIdDefinition?.output_schema.properties?.creator).toMatchObject({
      type: ['object', 'null'],
    });
    expect(getRoadmapByIdDefinition?.output_schema.properties?.archivedAt).toMatchObject({
      type: ['string', 'null'],
    });
  });

  it('routes roadmap calls to the linear service', async () => {
    const getRoadmaps = jest.fn().mockResolvedValue([{ id: 'roadmap-1' }]);
    const getRoadmapById = jest.fn().mockResolvedValue({ id: 'roadmap-1' });
    const createRoadmap = jest.fn().mockResolvedValue({ id: 'roadmap-1' });
    const updateRoadmap = jest.fn().mockResolvedValue({ id: 'roadmap-1' });
    const archiveRoadmap = jest.fn().mockResolvedValue({ success: true });
    const handlers = registerToolHandlers(
      {
        getRoadmaps,
        getRoadmapById,
        createRoadmap,
        updateRoadmap,
        archiveRoadmap,
      } as unknown as LinearService,
    );

    await expect(
      handlers.linear_getRoadmaps({
        limit: 10,
        includeArchived: true,
        orderBy: 'updatedAt',
      }),
    ).resolves.toEqual([{ id: 'roadmap-1' }]);
    expect(getRoadmaps).toHaveBeenCalledWith({
      limit: 10,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    await expect(handlers.linear_getRoadmapById({ id: 'roadmap-1' })).resolves.toEqual({
      id: 'roadmap-1',
    });
    expect(getRoadmapById).toHaveBeenCalledWith('roadmap-1');

    await expect(
      handlers.linear_createRoadmap({
        name: 'Q3 Roadmap',
        description: 'Key milestones',
      }),
    ).resolves.toEqual({ id: 'roadmap-1' });
    expect(createRoadmap).toHaveBeenCalledWith({
      name: 'Q3 Roadmap',
      description: 'Key milestones',
    });

    await expect(
      handlers.linear_updateRoadmap({
        id: 'roadmap-1',
        color: '#00ff00',
      }),
    ).resolves.toEqual({ id: 'roadmap-1' });
    expect(updateRoadmap).toHaveBeenCalledWith({
      id: 'roadmap-1',
      color: '#00ff00',
    });

    await expect(handlers.linear_archiveRoadmap({ roadmapId: 'roadmap-1' })).resolves.toEqual({
      success: true,
    });
    expect(archiveRoadmap).toHaveBeenCalledWith('roadmap-1');
  });

  it('allows getRoadmaps to be called with null args', async () => {
    const getRoadmaps = jest.fn().mockResolvedValue([{ id: 'roadmap-1' }]);
    const handlers = registerToolHandlers(
      {
        getRoadmaps,
      } as unknown as LinearService,
    );

    await expect(handlers.linear_getRoadmaps(null)).resolves.toEqual([{ id: 'roadmap-1' }]);
    expect(getRoadmaps).toHaveBeenCalledWith(undefined);
  });

  it('rejects invalid roadmap arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(handlers.linear_getRoadmaps({ limit: 0 })).rejects.toThrow(
      'Invalid arguments for getRoadmaps',
    );
    await expect(handlers.linear_getRoadmapById({})).rejects.toThrow(
      'Invalid arguments for getRoadmapById',
    );
    await expect(handlers.linear_createRoadmap({ description: 'Missing name' })).rejects.toThrow(
      'Invalid arguments for createRoadmap',
    );
    await expect(handlers.linear_updateRoadmap({ id: 'roadmap-1' })).rejects.toThrow(
      'Invalid arguments for updateRoadmap',
    );
    await expect(handlers.linear_archiveRoadmap({ id: 'roadmap-1' })).rejects.toThrow(
      'Invalid arguments for archiveRoadmap',
    );
  });
});
