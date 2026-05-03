import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = { type: 'integer', minimum: 1 };
const paginationOrderBySchema = { type: 'string', enum: ['createdAt', 'updatedAt'] };

const webhookOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    label: { type: ['string', 'null'] },
    url: { type: ['string', 'null'] },
    enabled: { type: 'boolean' },
    allPublicTeams: { type: 'boolean' },
    resourceTypes: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    archivedAt: { type: ['string', 'null'] },
    team: { type: ['object', 'null'] },
    creator: { type: ['object', 'null'] },
  },
};

const attachmentOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: ['string', 'null'] },
    url: { type: 'string' },
    metadata: { type: 'object', additionalProperties: true },
    sourceType: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    issue: { type: ['object', 'null'] },
  },
};

const notificationOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
    url: { type: 'string' },
    readAt: { type: ['string', 'null'] },
    snoozedUntilAt: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    actor: { type: ['object', 'null'] },
  },
};

const subscriptionOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    active: { type: 'boolean' },
    notificationSubscriptionTypes: { type: 'array', items: { type: 'string' } },
    contextViewType: { type: ['string', 'null'] },
    userContextViewType: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    team: { type: ['object', 'null'] },
    project: { type: ['object', 'null'] },
    cycle: { type: ['object', 'null'] },
    label: { type: ['object', 'null'] },
    initiative: { type: ['object', 'null'] },
    customView: { type: ['object', 'null'] },
    subscriber: { type: ['object', 'null'] },
  },
};

const authSessionOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    client: { type: ['string', 'null'] },
    browserType: { type: ['string', 'null'] },
    operatingSystem: { type: ['string', 'null'] },
    ip: { type: ['string', 'null'] },
    location: { type: ['string', 'null'] },
    isCurrentSession: { type: 'boolean' },
    countryCodes: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    lastActiveAt: { type: ['string', 'null'] },
    type: { type: 'string' },
  },
};

const auditEntryOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    actorId: { type: ['string', 'null'] },
    countryCode: { type: ['string', 'null'] },
    ip: { type: ['string', 'null'] },
    metadata: { type: ['object', 'null'] },
    requestInformation: { type: ['object', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    actor: { type: ['object', 'null'] },
  },
};

const integrationOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    service: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    archivedAt: { type: ['string', 'null'] },
    creator: { type: ['object', 'null'] },
    team: { type: ['object', 'null'] },
  },
};

export const getWebhooksToolDefinition: MCPToolDefinition = { name: 'linear_getWebhooks', description: 'Get a list of webhooks', input_schema: { type: 'object', properties: { teamId: { type: 'string' }, limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } } }, output_schema: { type: 'array', items: webhookOutputSchema } };
export const createWebhookToolDefinition: MCPToolDefinition = { name: 'linear_createWebhook', description: 'Create a webhook for integration events', input_schema: { type: 'object', properties: { url: { type: 'string' }, resourceTypes: { type: 'array', items: { type: 'string' } }, teamId: { type: 'string' }, enabled: { type: 'boolean' }, label: { type: 'string' }, secret: { type: 'string' }, allPublicTeams: { type: 'boolean' } }, required: ['url', 'resourceTypes'] }, output_schema: webhookOutputSchema };
export const deleteWebhookToolDefinition: MCPToolDefinition = { name: 'linear_deleteWebhook', description: 'Delete a webhook', input_schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, output_schema: { type: 'object', properties: { success: { type: 'boolean' }, id: { type: 'string' } } } };
export const getAttachmentsToolDefinition: MCPToolDefinition = { name: 'linear_getAttachments', description: 'Get attachments for an issue', input_schema: { type: 'object', properties: { issueId: { type: 'string' }, limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } }, required: ['issueId'] }, output_schema: { type: 'array', items: attachmentOutputSchema } };
export const addAttachmentToolDefinition: MCPToolDefinition = { name: 'linear_addAttachment', description: 'Add an attachment to an issue', input_schema: { type: 'object', properties: { issueId: { type: 'string' }, title: { type: 'string' }, url: { type: 'string' }, subtitle: { type: 'string' }, iconUrl: { type: 'string' }, metadata: { type: 'object', additionalProperties: true }, commentBody: { type: 'string' }, groupBySource: { type: 'boolean' } }, required: ['issueId', 'title', 'url'] }, output_schema: attachmentOutputSchema };
export const getNotificationsToolDefinition: MCPToolDefinition = { name: 'linear_getNotifications', description: 'Get notifications for the current user', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } } }, output_schema: { type: 'array', items: notificationOutputSchema } };
export const markNotificationAsReadToolDefinition: MCPToolDefinition = { name: 'linear_markNotificationAsRead', description: 'Mark a notification as read', input_schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, output_schema: { type: 'object', properties: { success: { type: 'boolean' }, id: { type: 'string' } } } };
export const getSubscriptionsToolDefinition: MCPToolDefinition = { name: 'linear_getSubscriptions', description: 'Get subscriptions for the current user', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } } }, output_schema: { type: 'array', items: subscriptionOutputSchema } };
export const markAllNotificationsAsReadToolDefinition: MCPToolDefinition = { name: 'linear_markAllNotificationsAsRead', description: 'Mark all notifications as read', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema } } }, output_schema: { type: 'object', properties: { success: { type: 'boolean' }, count: { type: 'number' } } } };
export const getUnreadNotificationCountToolDefinition: MCPToolDefinition = { name: 'linear_getUnreadNotificationCount', description: 'Get count of unread notifications', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema } } }, output_schema: { type: 'object', properties: { count: { type: 'number' } } } };
export const getAuthenticationSessionsToolDefinition: MCPToolDefinition = { name: 'linear_getAuthenticationSessions', description: 'Get active authentication sessions', input_schema: { type: 'object', properties: {} }, output_schema: { type: 'array', items: authSessionOutputSchema } };
export const logoutSessionToolDefinition: MCPToolDefinition = { name: 'linear_logoutSession', description: 'Revoke a specific session', input_schema: { type: 'object', properties: { sessionId: { type: 'string' } }, required: ['sessionId'] }, output_schema: { type: 'object', properties: { success: { type: 'boolean' } } } };
export const logoutOtherSessionsToolDefinition: MCPToolDefinition = { name: 'linear_logoutOtherSessions', description: 'Revoke all other sessions', input_schema: { type: 'object', properties: {} }, output_schema: { type: 'object', properties: { success: { type: 'boolean' } } } };
export const logoutAllSessionsToolDefinition: MCPToolDefinition = { name: 'linear_logoutAllSessions', description: 'Revoke all sessions', input_schema: { type: 'object', properties: {} }, output_schema: { type: 'object', properties: { success: { type: 'boolean' } } } };
export const getOrganizationAuditEventsToolDefinition: MCPToolDefinition = { name: 'linear_getOrganizationAuditEvents', description: 'Get audit events for the organization', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } } }, output_schema: { type: 'array', items: auditEntryOutputSchema } };
export const getUserAuditEventsToolDefinition: MCPToolDefinition = { name: 'linear_getUserAuditEvents', description: 'Get audit events for a specific user', input_schema: { type: 'object', properties: { userId: { type: 'string' }, limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } }, required: ['userId'] }, output_schema: { type: 'array', items: auditEntryOutputSchema } };
export const getIntegrationsToolDefinition: MCPToolDefinition = { name: 'linear_getIntegrations', description: 'Get a list of active integrations', input_schema: { type: 'object', properties: { limit: { ...positiveLimitSchema }, includeArchived: { type: 'boolean' }, orderBy: { ...paginationOrderBySchema } } }, output_schema: { type: 'array', items: integrationOutputSchema } };
