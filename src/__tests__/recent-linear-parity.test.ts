import { LinearService } from '../services/linear-service.js';
import { validateToolArguments } from '../tools/argument-validation.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';
import { isCreateInitiativeInput, isUpdateInitiativeInput } from '../tools/type-guards.js';

function makeService(client: Record<string, unknown>) {
  return new LinearService(client as never);
}

function isoDate(value: string) {
  return new Date(value);
}

describe('recent Linear API parity', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers recent stable SDK-backed tools', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getCustomers',
        'linear_getCustomerById',
        'linear_createCustomer',
        'linear_updateCustomer',
        'linear_deleteCustomer',
        'linear_getCustomerNeeds',
        'linear_getCustomerNeedById',
        'linear_createCustomerNeed',
        'linear_createCustomerNeedFromAttachment',
        'linear_updateCustomerNeed',
        'linear_archiveCustomerNeed',
        'linear_unarchiveCustomerNeed',
        'linear_deleteCustomerNeed',
        'linear_getCustomerStatuses',
        'linear_getCustomerTiers',
        'linear_getInitiativeUpdateById',
        'linear_getInitiativeUpdates',
        'linear_createInitiativeUpdate',
        'linear_updateInitiativeUpdate',
        'linear_archiveInitiativeUpdate',
        'linear_unarchiveInitiativeUpdate',
        'linear_deleteIssueRelation',
      ]),
    );
  });

  it('defines schemas for generic comments and recent project/team/release fields', () => {
    const createCommentTool = allToolDefinitions.find((tool) => tool.name === 'linear_createComment');
    const getCommentsTool = allToolDefinitions.find((tool) => tool.name === 'linear_getComments');
    const createReleaseTool = allToolDefinitions.find((tool) => tool.name === 'linear_createRelease');
    const updateReleaseTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateRelease');
    const createTeamTool = allToolDefinitions.find((tool) => tool.name === 'linear_createTeam');
    const updateTeamTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateTeam');
    const createProjectTool = allToolDefinitions.find((tool) => tool.name === 'linear_createProject');
    const updateProjectTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateProject');
    const getProjectByIdTool = allToolDefinitions.find((tool) => tool.name === 'linear_getProjectById');
    const createInitiativeTool = allToolDefinitions.find((tool) => tool.name === 'linear_createInitiative');
    const updateInitiativeTool = allToolDefinitions.find((tool) => tool.name === 'linear_updateInitiative');

    expect(createCommentTool?.input_schema.properties).toMatchObject({
      issueId: { type: 'string' },
      projectId: { type: 'string' },
      initiativeId: { type: 'string' },
      projectUpdateId: { type: 'string' },
      initiativeUpdateId: { type: 'string' },
      documentContentId: { type: 'string' },
      quotedText: { type: 'string' },
      subscriberIds: { type: 'array', items: { type: 'string' } },
    });
    expect(createCommentTool?.input_schema.required).toEqual(['body']);
    expect(getCommentsTool?.input_schema.properties).toMatchObject({
      cursor: { type: 'string' },
      orderBy: { type: 'string', enum: ['createdAt', 'updatedAt'] },
      projectId: { type: 'string' },
      initiativeUpdateId: { type: 'string' },
    });
    expect(createReleaseTool?.input_schema.properties).toMatchObject({
      createdAt: { type: 'string' },
      startedAt: { type: 'string' },
      completedAt: { type: 'string' },
    });
    expect(updateReleaseTool?.input_schema.properties).toMatchObject({
      startedAt: { type: 'string' },
      completedAt: { type: 'string' },
    });
    expect(createTeamTool?.input_schema.properties).toMatchObject({
      visibility: { type: 'string', enum: ['public', 'private'] },
    });
    expect(updateTeamTool?.input_schema.properties).toMatchObject({
      visibility: { type: 'string', enum: ['public', 'private'] },
    });
    expect(createProjectTool?.input_schema.properties).toMatchObject({
      startDate: { type: 'string' },
      targetDate: { type: 'string' },
      leadId: { type: 'string' },
      memberIds: { type: 'array', items: { type: 'string' } },
      sortOrder: { type: 'number' },
      icon: { type: 'string' },
      color: { type: 'string' },
    });
    expect(updateProjectTool?.input_schema.properties).toMatchObject({
      startDate: { type: 'string' },
      targetDate: { type: 'string' },
      leadId: { type: 'string' },
      memberIds: { type: 'array', items: { type: 'string' } },
      sortOrder: { type: 'number' },
      icon: { type: 'string' },
      color: { type: 'string' },
    });
    expect(createInitiativeTool?.input_schema.properties).toMatchObject({
      status: { type: 'string', enum: ['Planned', 'Active', 'Completed'] },
    });
    expect(updateInitiativeTool?.input_schema.properties).toMatchObject({
      status: { type: 'string', enum: ['Planned', 'Active', 'Completed'] },
    });
    expect(getProjectByIdTool?.output_schema.properties).toMatchObject({
      trashed: { type: ['boolean', 'null'] },
      slackChannelId: { type: ['string', 'null'] },
      microsoftTeamsChannelId: { type: ['string', 'null'] },
    });
  });

  it('validates current Linear initiative statuses', () => {
    expect(isCreateInitiativeInput({ name: 'Initiative', status: 'Planned' })).toBe(true);
    expect(isCreateInitiativeInput({ name: 'Initiative', status: 'notStarted' })).toBe(false);
    expect(isUpdateInitiativeInput({ initiativeId: 'initiative-1', status: 'Active' })).toBe(true);
    expect(isUpdateInitiativeInput({ initiativeId: 'initiative-1', status: 'paused' })).toBe(false);
  });

  it('routes new handlers to the Linear service', async () => {
    const service = {
      getCustomers: jest.fn().mockResolvedValue([{ id: 'customer-1' }]),
      getCustomerById: jest.fn().mockResolvedValue({ id: 'customer-1' }),
      createCustomer: jest.fn().mockResolvedValue({ id: 'customer-1' }),
      updateCustomer: jest.fn().mockResolvedValue({ id: 'customer-1' }),
      deleteCustomer: jest.fn().mockResolvedValue({ success: true, id: 'customer-1' }),
      getCustomerNeeds: jest.fn().mockResolvedValue([{ id: 'need-1' }]),
      getCustomerNeedById: jest.fn().mockResolvedValue({ id: 'need-1' }),
      createCustomerNeed: jest.fn().mockResolvedValue({ id: 'need-1' }),
      createCustomerNeedFromAttachment: jest.fn().mockResolvedValue({ id: 'need-1' }),
      updateCustomerNeed: jest.fn().mockResolvedValue({ id: 'need-1' }),
      archiveCustomerNeed: jest.fn().mockResolvedValue({ success: true, id: 'need-1' }),
      unarchiveCustomerNeed: jest.fn().mockResolvedValue({ success: true, id: 'need-1' }),
      deleteCustomerNeed: jest.fn().mockResolvedValue({ success: true, id: 'need-1' }),
      getCustomerStatuses: jest.fn().mockResolvedValue([{ id: 'status-1' }]),
      getCustomerTiers: jest.fn().mockResolvedValue([{ id: 'tier-1' }]),
      getInitiativeUpdateById: jest.fn().mockResolvedValue({ id: 'initiative-update-1' }),
      getInitiativeUpdates: jest.fn().mockResolvedValue([{ id: 'initiative-update-1' }]),
      createInitiativeUpdate: jest.fn().mockResolvedValue({ id: 'initiative-update-1' }),
      updateInitiativeUpdate: jest.fn().mockResolvedValue({ id: 'initiative-update-1' }),
      archiveInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, id: 'initiative-update-1' }),
      unarchiveInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, id: 'initiative-update-1' }),
      deleteIssueRelation: jest.fn().mockResolvedValue({ success: true, id: 'relation-1' }),
      createComment: jest.fn().mockResolvedValue({ id: 'comment-1' }),
      getComments: jest.fn().mockResolvedValue([{ id: 'comment-1' }]),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(handlers.linear_getCustomers({ limit: 5, includeArchived: true })).resolves.toEqual([{ id: 'customer-1' }]);
    await expect(handlers.linear_getCustomerById({ id: 'customer-1' })).resolves.toEqual({ id: 'customer-1' });
    await expect(handlers.linear_createCustomer({ name: 'Acme', domains: ['acme.com'] })).resolves.toEqual({ id: 'customer-1' });
    await expect(handlers.linear_updateCustomer({ id: 'customer-1', ownerId: 'user-1' })).resolves.toEqual({ id: 'customer-1' });
    await expect(handlers.linear_deleteCustomer({ id: 'customer-1' })).resolves.toEqual({ success: true, id: 'customer-1' });
    await expect(handlers.linear_getCustomerNeeds({ customerId: 'customer-1', limit: 5 })).resolves.toEqual([{ id: 'need-1' }]);
    await expect(handlers.linear_getCustomerNeedById({ id: 'need-1' })).resolves.toEqual({ id: 'need-1' });
    await expect(handlers.linear_createCustomerNeed({ customerId: 'customer-1', issueId: 'issue-1', body: 'Need' })).resolves.toEqual({ id: 'need-1' });
    await expect(handlers.linear_createCustomerNeedFromAttachment({ attachmentId: 'attachment-1', customerId: 'customer-1' })).resolves.toEqual({ id: 'need-1' });
    await expect(handlers.linear_updateCustomerNeed({ id: 'need-1', priority: 1 })).resolves.toEqual({ id: 'need-1' });
    await expect(handlers.linear_archiveCustomerNeed({ id: 'need-1' })).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(handlers.linear_unarchiveCustomerNeed({ id: 'need-1' })).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(handlers.linear_deleteCustomerNeed({ id: 'need-1' })).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(handlers.linear_getCustomerStatuses({ limit: 5 })).resolves.toEqual([{ id: 'status-1' }]);
    await expect(handlers.linear_getCustomerTiers({ limit: 5 })).resolves.toEqual([{ id: 'tier-1' }]);
    await expect(handlers.linear_getInitiativeUpdateById({ id: 'initiative-update-1' })).resolves.toEqual({ id: 'initiative-update-1' });
    await expect(handlers.linear_getInitiativeUpdates({ initiativeId: 'initiative-1', limit: 5 })).resolves.toEqual([{ id: 'initiative-update-1' }]);
    await expect(handlers.linear_createInitiativeUpdate({ initiativeId: 'initiative-1', body: 'Update', health: 'onTrack' })).resolves.toEqual({ id: 'initiative-update-1' });
    await expect(handlers.linear_updateInitiativeUpdate({ id: 'initiative-update-1', isDiffHidden: true })).resolves.toEqual({ id: 'initiative-update-1' });
    await expect(handlers.linear_archiveInitiativeUpdate({ id: 'initiative-update-1' })).resolves.toEqual({ success: true, id: 'initiative-update-1' });
    await expect(handlers.linear_unarchiveInitiativeUpdate({ id: 'initiative-update-1' })).resolves.toEqual({ success: true, id: 'initiative-update-1' });
    await expect(handlers.linear_deleteIssueRelation({ id: 'relation-1' })).resolves.toEqual({ success: true, id: 'relation-1' });
    await expect(handlers.linear_createComment({ projectId: 'project-1', body: 'Comment', quotedText: 'selected' })).resolves.toEqual({ id: 'comment-1' });
    await expect(handlers.linear_getComments({ projectId: 'project-1', cursor: 'cursor-1', orderBy: 'updatedAt' })).resolves.toEqual([{ id: 'comment-1' }]);

    expect(service.getCustomers).toHaveBeenCalledWith({ limit: 5, includeArchived: true });
    expect(service.createCustomerNeedFromAttachment).toHaveBeenCalledWith({
      attachmentId: 'attachment-1',
      customerId: 'customer-1',
    });
    expect(service.getInitiativeUpdates).toHaveBeenCalledWith('initiative-1', 5);
    expect(service.createComment).toHaveBeenCalledWith({ projectId: 'project-1', body: 'Comment', quotedText: 'selected' });
    expect(service.getComments).toHaveBeenCalledWith({ projectId: 'project-1', cursor: 'cursor-1', orderBy: 'updatedAt' });
  });

  it('rejects unknown top-level tool arguments centrally', () => {
    expect(() =>
      validateToolArguments(allToolDefinitions, 'linear_createIssue', {
        title: 'Issue',
        teamId: 'team-1',
        stateId: 'state-1',
        typoStateId: 'state-2',
      }),
    ).toThrow('Unknown argument(s) for linear_createIssue: typoStateId');

    expect(() =>
      validateToolArguments(allToolDefinitions, 'linear_addAttachment', {
        issueId: 'ENG-1',
        title: 'Spec',
        url: 'https://example.com/spec',
        metadata: { arbitraryNestedKey: true },
      }),
    ).not.toThrow();
  });

  it('uses SDK methods for generic comments and issue relation deletion', async () => {
    const comment = {
      id: 'comment-1',
      body: 'Project comment',
      url: 'https://linear.app/comment-1',
      projectId: 'project-1',
      quotedText: 'selected',
      createdAt: isoDate('2026-06-05T10:00:00.000Z'),
      updatedAt: isoDate('2026-06-05T10:01:00.000Z'),
      user: Promise.resolve({ id: 'user-1', name: 'Alex', displayName: 'Alex', email: 'alex@example.com' }),
      project: Promise.resolve({ id: 'project-1', name: 'Launch' }),
    };
    const client = {
      createComment: jest.fn().mockResolvedValue({ success: true, comment: Promise.resolve(comment) }),
      comments: jest.fn().mockResolvedValue({ nodes: [comment] }),
      deleteIssueRelation: jest.fn().mockResolvedValue({ success: true, entityId: 'relation-1' }),
    };
    const service = makeService(client);

    await expect(
      service.createComment({
        projectId: 'project-1',
        body: 'Project comment',
        quotedText: 'selected',
        subscriberIds: ['user-1'],
      }),
    ).resolves.toMatchObject({
      id: 'comment-1',
      projectId: 'project-1',
      project: { id: 'project-1', name: 'Launch' },
      user: { id: 'user-1', name: 'Alex' },
    });
    await expect(service.getComments({ projectId: 'project-1', limit: 10, cursor: 'cursor-1', orderBy: 'updatedAt' })).resolves.toHaveLength(1);
    await expect(service.deleteIssueRelation('relation-1')).resolves.toEqual({ success: true, id: 'relation-1' });

    expect(client.createComment).toHaveBeenCalledWith({
      projectId: 'project-1',
      body: 'Project comment',
      quotedText: 'selected',
      subscriberIds: ['user-1'],
    });
    expect(client.comments).toHaveBeenCalledWith({
      first: 10,
      after: 'cursor-1',
      orderBy: 'updatedAt',
      filter: { project: { id: { eq: 'project-1' } } },
    });
  });

  it('uses SDK methods for initiative updates', async () => {
    const initiative = { id: 'initiative-1', name: 'Launch Initiative' };
    const update = {
      id: 'initiative-update-1',
      body: 'Weekly update',
      health: 'onTrack',
      diffMarkdown: 'diff',
      isDiffHidden: false,
      isStale: false,
      url: 'https://linear.app/update',
      slugId: 'update-slug',
      createdAt: isoDate('2026-06-05T10:00:00.000Z'),
      updatedAt: isoDate('2026-06-05T10:01:00.000Z'),
      initiative: Promise.resolve(initiative),
      user: Promise.resolve({ id: 'user-1', name: 'Alex' }),
    };
    const client = {
      initiative: jest.fn().mockResolvedValue(initiative),
      initiativeUpdate: jest.fn().mockResolvedValue(update),
      initiativeUpdates: jest.fn().mockResolvedValue({ nodes: [update] }),
      createInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, initiativeUpdate: Promise.resolve(update) }),
      updateInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, initiativeUpdate: Promise.resolve(update) }),
      archiveInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, entityId: 'initiative-update-1' }),
      unarchiveInitiativeUpdate: jest.fn().mockResolvedValue({ success: true, entityId: 'initiative-update-1' }),
    };
    const service = makeService(client);

    await expect(service.createInitiativeUpdate({ initiativeId: 'initiative-1', body: 'Weekly update', health: 'onTrack' })).resolves.toMatchObject({
      id: 'initiative-update-1',
      initiative: { id: 'initiative-1', name: 'Launch Initiative' },
    });
    await expect(service.updateInitiativeUpdate({ id: 'initiative-update-1', isDiffHidden: true })).resolves.toMatchObject({ id: 'initiative-update-1' });
    await expect(service.getInitiativeUpdateById('initiative-update-1')).resolves.toMatchObject({ id: 'initiative-update-1' });
    await expect(service.getInitiativeUpdates('initiative-1', 5)).resolves.toHaveLength(1);
    await expect(service.archiveInitiativeUpdate('initiative-update-1')).resolves.toEqual({ success: true, id: 'initiative-update-1' });
    await expect(service.unarchiveInitiativeUpdate('initiative-update-1')).resolves.toEqual({ success: true, id: 'initiative-update-1' });

    expect(client.createInitiativeUpdate).toHaveBeenCalledWith({
      initiativeId: 'initiative-1',
      body: 'Weekly update',
      health: 'onTrack',
      isDiffHidden: undefined,
    });
    expect(client.initiativeUpdates).toHaveBeenCalledWith({
      first: 5,
      filter: { initiative: { id: { eq: 'initiative-1' } } },
    });
  });

  it('uses SDK methods for customers and customer needs', async () => {
    const customer = {
      id: 'customer-1',
      name: 'Acme',
      domains: ['acme.com'],
      externalIds: ['crm-1'],
      approximateNeedCount: 1,
      createdAt: isoDate('2026-06-05T10:00:00.000Z'),
      updatedAt: isoDate('2026-06-05T10:01:00.000Z'),
      url: 'https://linear.app/customer-1',
      owner: Promise.resolve({ id: 'user-1', name: 'Alex', email: 'alex@example.com' }),
      status: Promise.resolve({ id: 'status-1', name: 'Active', type: 'active' }),
      tier: Promise.resolve({ id: 'tier-1', name: 'Enterprise', color: '#fff' }),
    };
    const need = {
      id: 'need-1',
      body: 'Need body',
      priority: 1,
      createdAt: isoDate('2026-06-05T10:00:00.000Z'),
      updatedAt: isoDate('2026-06-05T10:01:00.000Z'),
      customerId: 'customer-1',
      issueId: 'issue-1',
      customer: Promise.resolve(customer),
      issue: Promise.resolve({ id: 'issue-1', identifier: 'ENG-1', title: 'Issue' }),
    };
    const status = { id: 'status-1', name: 'Active', type: 'active', position: 1, createdAt: isoDate('2026-06-05T10:00:00.000Z'), updatedAt: isoDate('2026-06-05T10:01:00.000Z') };
    const tier = { id: 'tier-1', name: 'Enterprise', color: '#fff', position: 1, createdAt: isoDate('2026-06-05T10:00:00.000Z'), updatedAt: isoDate('2026-06-05T10:01:00.000Z') };
    const client = {
      customers: jest.fn().mockResolvedValue({ nodes: [customer] }),
      customer: jest.fn().mockResolvedValue(customer),
      createCustomer: jest.fn().mockResolvedValue({ success: true, customer: Promise.resolve(customer) }),
      updateCustomer: jest.fn().mockResolvedValue({ success: true, customer: Promise.resolve(customer) }),
      deleteCustomer: jest.fn().mockResolvedValue({ success: true, entityId: 'customer-1' }),
      customerNeeds: jest.fn().mockResolvedValue({ nodes: [need] }),
      customerNeed: jest.fn().mockResolvedValue(need),
      createCustomerNeed: jest.fn().mockResolvedValue({ success: true, need: Promise.resolve(need) }),
      customerNeedCreateFromAttachment: jest.fn().mockResolvedValue({ success: true, need: Promise.resolve(need) }),
      updateCustomerNeed: jest.fn().mockResolvedValue({ success: true, need: Promise.resolve(need) }),
      archiveCustomerNeed: jest.fn().mockResolvedValue({ success: true, entityId: 'need-1' }),
      unarchiveCustomerNeed: jest.fn().mockResolvedValue({ success: true, entityId: 'need-1' }),
      deleteCustomerNeed: jest.fn().mockResolvedValue({ success: true, entityId: 'need-1' }),
      customerStatuses: jest.fn().mockResolvedValue({ nodes: [status] }),
      customerTiers: jest.fn().mockResolvedValue({ nodes: [tier] }),
    };
    const service = makeService(client);

    await expect(service.getCustomers({ limit: 10, name: 'Acme' })).resolves.toHaveLength(1);
    await expect(service.getCustomerById('customer-1')).resolves.toMatchObject({ id: 'customer-1', status: { id: 'status-1' } });
    await expect(service.createCustomer({ name: 'Acme', domains: ['acme.com'] })).resolves.toMatchObject({ id: 'customer-1' });
    await expect(service.updateCustomer({ id: 'customer-1', ownerId: 'user-1' })).resolves.toMatchObject({ id: 'customer-1' });
    await expect(service.deleteCustomer('customer-1')).resolves.toEqual({ success: true, id: 'customer-1' });
    await expect(service.getCustomerNeeds({ customerId: 'customer-1', limit: 10 })).resolves.toHaveLength(1);
    await expect(service.getCustomerNeedById('need-1')).resolves.toMatchObject({ id: 'need-1', customer: { id: 'customer-1' } });
    await expect(service.createCustomerNeed({ customerId: 'customer-1', issueId: 'issue-1', body: 'Need body' })).resolves.toMatchObject({ id: 'need-1' });
    await expect(service.createCustomerNeedFromAttachment({ attachmentId: 'attachment-1', customerId: 'customer-1' })).resolves.toMatchObject({ id: 'need-1' });
    await expect(service.updateCustomerNeed({ id: 'need-1', priority: 1 })).resolves.toMatchObject({ id: 'need-1' });
    await expect(service.archiveCustomerNeed('need-1')).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(service.unarchiveCustomerNeed('need-1')).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(service.deleteCustomerNeed('need-1')).resolves.toEqual({ success: true, id: 'need-1' });
    await expect(service.getCustomerStatuses({ limit: 10 })).resolves.toEqual([
      expect.objectContaining({ id: 'status-1', name: 'Active' }),
    ]);
    await expect(service.getCustomerTiers({ limit: 10 })).resolves.toEqual([
      expect.objectContaining({ id: 'tier-1', name: 'Enterprise' }),
    ]);

    expect(client.customers).toHaveBeenCalledWith({
      first: 10,
      includeArchived: false,
      orderBy: undefined,
      filter: { name: { containsIgnoreCase: 'Acme' } },
    });
    expect(client.createCustomer).toHaveBeenCalledWith({ name: 'Acme', domains: ['acme.com'] });
    expect(client.createCustomerNeed).toHaveBeenCalledWith({
      customerId: 'customer-1',
      issueId: 'issue-1',
      body: 'Need body',
    });
  });
});
