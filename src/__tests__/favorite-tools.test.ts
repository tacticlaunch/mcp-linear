import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('favorite MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the favorite mutation tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining(['linear_addToFavorites', 'linear_removeFromFavorites']),
    );
  });

  it('routes favorite mutations to the linear service', async () => {
    const addToFavorites = jest.fn().mockResolvedValue({ success: true });
    const removeFromFavorites = jest.fn().mockResolvedValue({ success: true });
    const handlers = registerToolHandlers({
      addToFavorites,
      removeFromFavorites,
    } as unknown as LinearService);

    await expect(handlers.linear_addToFavorites({ entityId: 'view-1' })).resolves.toEqual({
      success: true,
    });
    await expect(
      handlers.linear_removeFromFavorites({ favoriteId: 'favorite-1' }),
    ).resolves.toEqual({ success: true });

    expect(addToFavorites).toHaveBeenCalledWith({ entityId: 'view-1' });
    expect(removeFromFavorites).toHaveBeenCalledWith({ favoriteId: 'favorite-1' });
  });

  it('rejects invalid favorite mutation arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(handlers.linear_addToFavorites({})).rejects.toThrow(
      'Invalid arguments for addToFavorites',
    );
    await expect(handlers.linear_removeFromFavorites({})).rejects.toThrow(
      'Invalid arguments for removeFromFavorites',
    );
  });
});
