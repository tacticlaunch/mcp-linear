export const OAUTH_APPLICATION_GRANT_TYPES = [
  'authorization_code',
  'client_credentials',
] as const;

export type OAuthApplicationGrantTypeValue = (typeof OAUTH_APPLICATION_GRANT_TYPES)[number];

export const OAUTH_AUTHORIZATION_SCOPES = [
  'read',
  'write',
  'issues:create',
  'comments:create',
  'timeSchedule:write',
  'admin',
  'app:assignable',
  'app:mentionable',
  'customer:read',
  'customer:write',
  'initiative:read',
  'initiative:write',
] as const;

export type OAuthAuthorizationScopeValue = (typeof OAUTH_AUTHORIZATION_SCOPES)[number];

export const APP_ACTOR_OAUTH_SCOPES: ReadonlyArray<
  Exclude<OAuthAuthorizationScopeValue, 'admin'>
> = OAUTH_AUTHORIZATION_SCOPES.filter(
  (scope): scope is Exclude<OAuthAuthorizationScopeValue, 'admin'> => scope !== 'admin',
);

export const APP_ONLY_OAUTH_SCOPES = [
  'app:assignable',
  'app:mentionable',
  'customer:read',
  'customer:write',
  'initiative:read',
  'initiative:write',
] as const satisfies readonly OAuthAuthorizationScopeValue[];

export const WEBHOOK_RESOURCE_TYPES = [
  'AgentSessionEvent',
  'AppUserNotification',
  'Attachment',
  'Comment',
  'Customer',
  'CustomerNeed',
  'Cycle',
  'Document',
  'Initiative',
  'InitiativeUpdate',
  'Issue',
  'IssueLabel',
  'IssueSLA',
  'OAuthAuthorization',
  'PermissionChange',
  'Project',
  'ProjectLabel',
  'ProjectUpdate',
  'Reaction',
  'Release',
  'ReleaseNote',
  'User',
] as const;

export type WebhookResourceTypeValue = (typeof WEBHOOK_RESOURCE_TYPES)[number];
