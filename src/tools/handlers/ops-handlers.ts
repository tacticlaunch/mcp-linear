import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import {
  isAddAttachmentArgs,
  isCreateWebhookArgs,
  isDeleteWebhookArgs,
  isGetAttachmentsArgs,
  isGetAuthenticationSessionsArgs,
  isGetIntegrationsArgs,
  isGetNotificationsArgs,
  isGetOrganizationAuditEventsArgs,
  isGetSubscriptionsArgs,
  isGetUserAuditEventsArgs,
  isGetWebhooksArgs,
  isLogoutAllSessionsArgs,
  isLogoutOtherSessionsArgs,
  isLogoutSessionArgs,
  isMarkAllNotificationsAsReadArgs,
  isMarkNotificationAsReadArgs,
  isGetUnreadNotificationCountArgs,
} from '../type-guards.js';

export function handleGetWebhooks(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetWebhooksArgs(args)) throw new Error('Invalid arguments for getWebhooks');
      return await linearService.getWebhooks(args);
    } catch (error) {
      logError('Error getting webhooks', error);
      throw error;
    }
  };
}
export function handleCreateWebhook(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateWebhookArgs(args)) throw new Error('Invalid arguments for createWebhook');
      return await linearService.createWebhook(args);
    } catch (error) {
      logError('Error creating webhook', error);
      throw error;
    }
  };
}
export function handleDeleteWebhook(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDeleteWebhookArgs(args)) throw new Error('Invalid arguments for deleteWebhook');
      return await linearService.deleteWebhook(args.id);
    } catch (error) {
      logError('Error deleting webhook', error);
      throw error;
    }
  };
}
export function handleGetAttachments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetAttachmentsArgs(args)) throw new Error('Invalid arguments for getAttachments');
      return await linearService.getAttachments(args);
    } catch (error) {
      logError('Error getting attachments', error);
      throw error;
    }
  };
}
export function handleAddAttachment(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddAttachmentArgs(args)) throw new Error('Invalid arguments for addAttachment');
      return await linearService.addAttachment(args);
    } catch (error) {
      logError('Error adding attachment', error);
      throw error;
    }
  };
}
export function handleGetNotifications(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetNotificationsArgs(args)) throw new Error('Invalid arguments for getNotifications');
      return await linearService.getNotifications(args);
    } catch (error) {
      logError('Error getting notifications', error);
      throw error;
    }
  };
}
export function handleMarkNotificationAsRead(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isMarkNotificationAsReadArgs(args)) throw new Error('Invalid arguments for markNotificationAsRead');
      return await linearService.markNotificationAsRead(args.id);
    } catch (error) {
      logError('Error marking notification as read', error);
      throw error;
    }
  };
}
export function handleGetSubscriptions(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetSubscriptionsArgs(args)) throw new Error('Invalid arguments for getSubscriptions');
      return await linearService.getSubscriptions(args);
    } catch (error) {
      logError('Error getting subscriptions', error);
      throw error;
    }
  };
}
export function handleMarkAllNotificationsAsRead(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isMarkAllNotificationsAsReadArgs(args)) throw new Error('Invalid arguments for markAllNotificationsAsRead');
      return await linearService.markAllNotificationsAsRead(args.limit);
    } catch (error) {
      logError('Error marking all notifications as read', error);
      throw error;
    }
  };
}
export function handleGetUnreadNotificationCount(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetUnreadNotificationCountArgs(args)) throw new Error('Invalid arguments for getUnreadNotificationCount');
      return await linearService.getUnreadNotificationCount(args.limit);
    } catch (error) {
      logError('Error getting unread notification count', error);
      throw error;
    }
  };
}
export function handleGetAuthenticationSessions(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetAuthenticationSessionsArgs(args)) throw new Error('Invalid arguments for getAuthenticationSessions');
      return await linearService.getAuthenticationSessions();
    } catch (error) {
      logError('Error getting authentication sessions', error);
      throw error;
    }
  };
}
export function handleLogoutSession(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isLogoutSessionArgs(args)) throw new Error('Invalid arguments for logoutSession');
      return await linearService.logoutSession(args.sessionId);
    } catch (error) {
      logError('Error logging out session', error);
      throw error;
    }
  };
}
export function handleLogoutOtherSessions(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isLogoutOtherSessionsArgs(args)) throw new Error('Invalid arguments for logoutOtherSessions');
      return await linearService.logoutOtherSessions();
    } catch (error) {
      logError('Error logging out other sessions', error);
      throw error;
    }
  };
}
export function handleLogoutAllSessions(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isLogoutAllSessionsArgs(args)) throw new Error('Invalid arguments for logoutAllSessions');
      return await linearService.logoutAllSessions();
    } catch (error) {
      logError('Error logging out all sessions', error);
      throw error;
    }
  };
}
export function handleGetOrganizationAuditEvents(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetOrganizationAuditEventsArgs(args)) throw new Error('Invalid arguments for getOrganizationAuditEvents');
      return await linearService.getOrganizationAuditEvents(args);
    } catch (error) {
      logError('Error getting organization audit events', error);
      throw error;
    }
  };
}
export function handleGetUserAuditEvents(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetUserAuditEventsArgs(args)) throw new Error('Invalid arguments for getUserAuditEvents');
      return await linearService.getUserAuditEvents(args);
    } catch (error) {
      logError('Error getting user audit events', error);
      throw error;
    }
  };
}
export function handleGetIntegrations(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIntegrationsArgs(args)) throw new Error('Invalid arguments for getIntegrations');
      return await linearService.getIntegrations(args);
    } catch (error) {
      logError('Error getting integrations', error);
      throw error;
    }
  };
}
