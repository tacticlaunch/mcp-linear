import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('future batch three MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers webhook, attachment, notification, session, audit, and generic support tools', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_getWebhooks',
        'linear_createWebhook',
        'linear_deleteWebhook',
        'linear_getAttachments',
        'linear_addAttachment',
        'linear_getNotifications',
        'linear_markNotificationAsRead',
        'linear_getSubscriptions',
        'linear_markAllNotificationsAsRead',
        'linear_getUnreadNotificationCount',
        'linear_getAuthenticationSessions',
        'linear_logoutSession',
        'linear_logoutOtherSessions',
        'linear_logoutAllSessions',
        'linear_getOrganizationAuditEvents',
        'linear_getUserAuditEvents',
        'linear_getIntegrations',
      ]),
    );
  });

  it('routes final-batch handlers to the service layer', async () => {
    const service = {
      getWebhooks: jest.fn().mockResolvedValue([{ id: 'webhook-1' }]),
      createWebhook: jest.fn().mockResolvedValue({ id: 'webhook-1' }),
      deleteWebhook: jest.fn().mockResolvedValue({ success: true, id: 'webhook-1' }),
      getAttachments: jest.fn().mockResolvedValue([{ id: 'attachment-1' }]),
      addAttachment: jest.fn().mockResolvedValue({ id: 'attachment-1' }),
      getNotifications: jest.fn().mockResolvedValue([{ id: 'notification-1' }]),
      markNotificationAsRead: jest.fn().mockResolvedValue({ success: true, id: 'notification-1' }),
      getSubscriptions: jest.fn().mockResolvedValue([{ id: 'subscription-1' }]),
      markAllNotificationsAsRead: jest.fn().mockResolvedValue({ success: true, count: 3 }),
      getUnreadNotificationCount: jest.fn().mockResolvedValue({ count: 5 }),
      getAuthenticationSessions: jest.fn().mockResolvedValue([{ id: 'session-1' }]),
      logoutSession: jest.fn().mockResolvedValue({ success: true }),
      logoutOtherSessions: jest.fn().mockResolvedValue({ success: true }),
      logoutAllSessions: jest.fn().mockResolvedValue({ success: true }),
      getOrganizationAuditEvents: jest.fn().mockResolvedValue([{ id: 'audit-1' }]),
      getUserAuditEvents: jest.fn().mockResolvedValue([{ id: 'audit-2' }]),
      getIntegrations: jest.fn().mockResolvedValue([{ id: 'integration-1' }]),
      subscribeToIssue: jest.fn().mockResolvedValue({ success: true, message: 'subscribed' }),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(handlers.linear_getWebhooks({ limit: 10 })).resolves.toEqual([{ id: 'webhook-1' }]);
    await expect(handlers.linear_createWebhook({ url: 'https://example.com', resourceTypes: ['Issue'] })).resolves.toEqual({ id: 'webhook-1' });
    await expect(handlers.linear_deleteWebhook({ id: 'webhook-1' })).resolves.toEqual({ success: true, id: 'webhook-1' });
    await expect(handlers.linear_getAttachments({ issueId: 'ISS-1', limit: 10 })).resolves.toEqual([{ id: 'attachment-1' }]);
    await expect(handlers.linear_addAttachment({ issueId: 'ISS-1', title: 'Spec', url: 'https://example.com/spec' })).resolves.toEqual({ id: 'attachment-1' });
    await expect(handlers.linear_getNotifications({ limit: 10 })).resolves.toEqual([{ id: 'notification-1' }]);
    await expect(handlers.linear_markNotificationAsRead({ id: 'notification-1' })).resolves.toEqual({ success: true, id: 'notification-1' });
    await expect(handlers.linear_getSubscriptions({ limit: 10 })).resolves.toEqual([{ id: 'subscription-1' }]);
    await expect(handlers.linear_markAllNotificationsAsRead({ limit: 10 })).resolves.toEqual({ success: true, count: 3 });
    await expect(handlers.linear_getUnreadNotificationCount({ limit: 10 })).resolves.toEqual({ count: 5 });
    await expect(handlers.linear_getAuthenticationSessions({})).resolves.toEqual([{ id: 'session-1' }]);
    await expect(handlers.linear_logoutSession({ sessionId: 'session-1' })).resolves.toEqual({ success: true });
    await expect(handlers.linear_logoutOtherSessions({})).resolves.toEqual({ success: true });
    await expect(handlers.linear_logoutAllSessions({})).resolves.toEqual({ success: true });
    await expect(handlers.linear_getOrganizationAuditEvents({ limit: 10 })).resolves.toEqual([{ id: 'audit-1' }]);
    await expect(handlers.linear_getUserAuditEvents({ userId: 'user-1', limit: 10 })).resolves.toEqual([{ id: 'audit-2' }]);
    await expect(handlers.linear_getIntegrations({ limit: 10 })).resolves.toEqual([{ id: 'integration-1' }]);
    await expect(handlers.linear_subscribeToIssue({ issueId: 'ISS-1' })).resolves.toEqual({ success: true, message: 'subscribed' });
  });
});
