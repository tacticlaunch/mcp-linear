import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('document MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the document tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getDocuments',
        'linear_getDocumentById',
        'linear_getProjectDocuments',
        'linear_searchDocuments',
        'linear_getDocumentContentHistory',
        'linear_createDocument',
        'linear_updateDocument',
        'linear_archiveDocument',
        'linear_unarchiveDocument',
      ]),
    );
  });

  it('defines document query and mutation schemas', () => {
    const getDocumentsTool = allToolDefinitions.find((tool) => tool.name === 'linear_getDocuments');
    const getProjectDocumentsTool = allToolDefinitions.find(
      (tool) => tool.name === 'linear_getProjectDocuments',
    );
    const searchDocumentsTool = allToolDefinitions.find((tool) => tool.name === 'linear_searchDocuments');
    const updateDocumentTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateDocument');

    expect(getDocumentsTool?.input_schema).toMatchObject({
      properties: {
        limit: { type: 'integer', minimum: 1 },
        includeArchived: { type: 'boolean' },
        orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
        projectId: { type: 'string' },
        initiativeId: { type: 'string' },
        title: { type: 'string' },
      },
    });

    expect(getProjectDocumentsTool?.input_schema).toMatchObject({
      required: ['projectId'],
      properties: {
        limit: { type: 'integer', minimum: 1 },
        includeArchived: { type: 'boolean' },
        orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
        title: { type: 'string' },
      },
    });

    expect(searchDocumentsTool?.input_schema).toMatchObject({
      required: ['term'],
      properties: {
        term: { type: 'string' },
        teamId: { type: 'string' },
        includeComments: { type: 'boolean' },
        limit: { type: 'integer', minimum: 1 },
        includeArchived: { type: 'boolean' },
        orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
      },
    });

    expect(updateDocumentTool?.description).toContain('Provide id plus at least one other field');
    expect(updateDocumentTool?.input_schema).toMatchObject({
      required: ['id'],
      properties: {
        title: { type: 'string' },
        content: { type: ['string', 'null'] },
        icon: { type: ['string', 'null'] },
        color: { type: ['string', 'null'] },
        hiddenAt: { type: ['string', 'null'] },
        projectId: { type: ['string', 'null'] },
        initiativeId: { type: ['string', 'null'] },
        trashed: { type: 'boolean' },
      },
    });
  });

  it('routes document handlers to the linear service', async () => {
    const getDocuments = jest.fn().mockResolvedValue([{ id: 'doc-1' }]);
    const getDocumentById = jest.fn().mockResolvedValue({ id: 'doc-1' });
    const getProjectDocuments = jest.fn().mockResolvedValue([{ id: 'doc-2' }]);
    const searchDocuments = jest.fn().mockResolvedValue({ nodes: [{ id: 'doc-3' }], totalCount: 1 });
    const getDocumentContentHistory = jest.fn().mockResolvedValue({ success: true, history: [] });
    const createDocument = jest.fn().mockResolvedValue({ id: 'doc-4' });
    const updateDocument = jest.fn().mockResolvedValue({ id: 'doc-5' });
    const archiveDocument = jest.fn().mockResolvedValue({ success: true, id: 'doc-6' });
    const unarchiveDocument = jest.fn().mockResolvedValue({ success: true, id: 'doc-7' });
    const handlers = registerToolHandlers({
      getDocuments,
      getDocumentById,
      getProjectDocuments,
      searchDocuments,
      getDocumentContentHistory,
      createDocument,
      updateDocument,
      archiveDocument,
      unarchiveDocument,
    } as unknown as LinearService);

    await expect(
      handlers.linear_getDocuments({ limit: 5, includeArchived: true, orderBy: 'updatedAt' }),
    ).resolves.toEqual([{ id: 'doc-1' }]);
    await expect(handlers.linear_getDocumentById({ id: 'doc-1' })).resolves.toEqual({ id: 'doc-1' });
    await expect(
      handlers.linear_getProjectDocuments({ projectId: 'project-1', limit: 10 }),
    ).resolves.toEqual([{ id: 'doc-2' }]);
    await expect(
      handlers.linear_searchDocuments({ term: 'auth flow', teamId: 'team-1', limit: 3 }),
    ).resolves.toEqual({ nodes: [{ id: 'doc-3' }], totalCount: 1 });
    await expect(handlers.linear_getDocumentContentHistory({ id: 'content-1' })).resolves.toEqual({
      success: true,
      history: [],
    });
    await expect(
      handlers.linear_createDocument({ title: 'Spec', projectId: 'project-1', content: '# Spec' }),
    ).resolves.toEqual({ id: 'doc-4' });
    await expect(
      handlers.linear_updateDocument({ id: 'doc-5', content: null, title: 'Updated Spec' }),
    ).resolves.toEqual({ id: 'doc-5' });
    await expect(handlers.linear_archiveDocument({ id: 'doc-6' })).resolves.toEqual({
      success: true,
      id: 'doc-6',
    });
    await expect(handlers.linear_unarchiveDocument({ id: 'doc-7' })).resolves.toEqual({
      success: true,
      id: 'doc-7',
    });

    expect(getDocuments).toHaveBeenCalledWith({ limit: 5, includeArchived: true, orderBy: 'updatedAt' });
    expect(getDocumentById).toHaveBeenCalledWith('doc-1');
    expect(getProjectDocuments).toHaveBeenCalledWith({ projectId: 'project-1', limit: 10 });
    expect(searchDocuments).toHaveBeenCalledWith({ term: 'auth flow', teamId: 'team-1', limit: 3 });
    expect(getDocumentContentHistory).toHaveBeenCalledWith('content-1');
    expect(createDocument).toHaveBeenCalledWith({ title: 'Spec', projectId: 'project-1', content: '# Spec' });
    expect(updateDocument).toHaveBeenCalledWith({ id: 'doc-5', content: null, title: 'Updated Spec' });
    expect(archiveDocument).toHaveBeenCalledWith('doc-6');
    expect(unarchiveDocument).toHaveBeenCalledWith('doc-7');
  });

  it('rejects invalid document tool arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(handlers.linear_getDocuments({ limit: 0 })).rejects.toThrow(
      'Invalid arguments for getDocuments',
    );
    await expect(handlers.linear_getProjectDocuments({ projectId: 'project-1', orderBy: 'priority' })).rejects.toThrow(
      'Invalid arguments for getProjectDocuments',
    );
    await expect(handlers.linear_searchDocuments({})).rejects.toThrow(
      'Invalid arguments for searchDocuments',
    );
    await expect(handlers.linear_createDocument({ title: '' })).rejects.toThrow(
      'Invalid arguments for createDocument',
    );
    await expect(handlers.linear_updateDocument({ id: 'doc-1' })).rejects.toThrow(
      'Invalid arguments for updateDocument',
    );
    await expect(handlers.linear_archiveDocument({})).rejects.toThrow(
      'Invalid arguments for archiveDocument',
    );
    await expect(handlers.linear_unarchiveDocument({})).rejects.toThrow(
      'Invalid arguments for unarchiveDocument',
    );
  });
});
