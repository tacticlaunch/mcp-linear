import { MCPToolDefinition } from '../../types.js';
import {
  APP_ACTOR_OAUTH_SCOPES,
  OAUTH_APPLICATION_GRANT_TYPES,
  OAUTH_AUTHORIZATION_SCOPES,
  WEBHOOK_RESOURCE_TYPES,
} from '../oauth-constants.js';

const redirectUrisSchema = {
  type: 'array',
  minItems: 1,
  maxItems: 32,
  uniqueItems: true,
  items: {
    type: 'string',
    format: 'uri',
    pattern: '^[Hh][Tt][Tt][Pp][Ss]?://',
  },
};

const grantTypesSchema = {
  type: 'array',
  minItems: 1,
  maxItems: OAUTH_APPLICATION_GRANT_TYPES.length,
  uniqueItems: true,
  items: { type: 'string', enum: [...OAUTH_APPLICATION_GRANT_TYPES] },
  contains: { const: 'authorization_code' },
};

const webhookResourceTypesSchema = {
  type: 'array',
  minItems: 1,
  maxItems: WEBHOOK_RESOURCE_TYPES.length,
  uniqueItems: true,
  items: { type: 'string', enum: [...WEBHOOK_RESOURCE_TYPES] },
};

const manifestClientNameSchema = {
  type: 'string',
  minLength: 2,
  maxLength: 80,
  pattern: '^(?!.*[Ll][Ii][Nn][Ee][Aa][Rr])(?!.*[Hh][Tt][Tt][Pp][Ss]?://).*$',
  description: 'OAuth client name. Must not contain "Linear" or an http(s) URL.',
};

const secretExposureConfirmationSchema = {
  type: 'boolean',
  const: true,
  description:
    'Must be true to acknowledge that a one-time secret will be returned in the MCP tool result.',
};

const managedOAuthApplicationOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    clientId: { type: 'string' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    developer: { type: 'string' },
    developerUrl: { type: 'string' },
    distribution: { type: 'string', enum: ['private', 'public'] },
    grantTypes: { type: 'array', items: { type: 'string', enum: [...OAUTH_APPLICATION_GRANT_TYPES] } },
    imageUrl: { type: ['string', 'null'] },
    redirectUris: { type: 'array', items: { type: 'string' } },
    webhookEnabled: { type: 'boolean' },
    webhookUrl: { type: ['string', 'null'] },
    webhookResourceTypes: {
      type: 'array',
      items: { type: 'string', enum: [...WEBHOOK_RESOURCE_TYPES] },
    },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};

const managedOAuthApplicationCreateProperties = {
  name: manifestClientNameSchema,
  developer: { type: 'string', minLength: 2, maxLength: 80 },
  developerUrl: {
    type: 'string',
    format: 'uri',
    pattern: '^[Hh][Tt][Tt][Pp][Ss]?://',
  },
  description: { type: 'string', maxLength: 1000 },
  imageUrl: {
    type: 'string',
    format: 'uri',
    pattern: '^[Hh][Tt][Tt][Pp][Ss]?://',
  },
  redirectUris: redirectUrisSchema,
  grantTypes: grantTypesSchema,
  idempotencyKey: { type: 'string', minLength: 1 },
  webhookUrl: {
    type: 'string',
    format: 'uri',
    pattern: '^[Hh][Tt][Tt][Pp][Ss]://',
    maxLength: 1000,
  },
  webhookResourceTypes: webhookResourceTypesSchema,
};

export const generateOAuthApplicationSetupToolDefinition: MCPToolDefinition = {
  name: 'linear_generateOAuthApplicationSetup',
  description:
    'Generate an official Linear OAuth application manifest and a human-confirmed setup URL. This does not create the application; an authorized workspace admin or owner must review and submit it in Linear. developerUrl is optional for private apps but required when distribution is public.',
  input_schema: {
    type: 'object',
    properties: {
      name: manifestClientNameSchema,
      developer: { type: 'string', minLength: 2, maxLength: 80 },
      developerUrl: managedOAuthApplicationCreateProperties.developerUrl,
      description: { type: 'string', maxLength: 1000 },
      imageUrl: managedOAuthApplicationCreateProperties.imageUrl,
      distribution: { type: 'string', enum: ['private', 'public'] },
      redirectUris: redirectUrisSchema,
      grantTypes: grantTypesSchema,
      webhookEnabled: { type: 'boolean' },
      webhookUrl: managedOAuthApplicationCreateProperties.webhookUrl,
      webhookResourceTypes: webhookResourceTypesSchema,
    },
    required: ['name', 'developer', 'redirectUris'],
    allOf: [
      {
        if: { properties: { distribution: { const: 'public' } }, required: ['distribution'] },
        then: { required: ['developerUrl'] },
      },
      {
        if: {
          anyOf: [
            { required: ['webhookEnabled'] },
            { required: ['webhookUrl'] },
            { required: ['webhookResourceTypes'] },
          ],
        },
        then: { required: ['webhookUrl', 'webhookResourceTypes'] },
      },
    ],
  } as MCPToolDefinition['input_schema'],
  output_schema: {
    type: 'object',
    properties: {
      requiresUserConfirmation: { type: 'boolean' },
      creationUrl: { type: 'string' },
      manifest: { type: 'object', additionalProperties: true },
    },
  },
};

export const generateOAuthAuthorizationUrlToolDefinition: MCPToolDefinition = {
  name: 'linear_generateOAuthAuthorizationUrl',
  description:
    'Generate a Linear OAuth authorization URL. Scopes are requested during authorization; this tool does not create, grant, approve, persist, or modify scopes. Actor/scope rules: with actor: "app" the admin scope is rejected, and the agent-only scopes (app:assignable, app:mentionable, customer:read, customer:write, initiative:read, initiative:write) require actor: "app".',
  input_schema: {
    type: 'object',
    properties: {
      clientId: { type: 'string', minLength: 1 },
      redirectUri: {
        type: 'string',
        format: 'uri',
        pattern: '^[Hh][Tt][Tt][Pp][Ss]?://',
      },
      scopes: {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: { type: 'string', enum: [...OAUTH_AUTHORIZATION_SCOPES] },
        description:
          'Scopes to request. The read scope is always included. app:assignable, app:mentionable, customer:*, and initiative:* scopes require actor: "app"; admin is unavailable with actor: "app".',
      },
      actor: { type: 'string', enum: ['user', 'app'] },
      state: { type: 'string', minLength: 1 },
      promptConsent: { type: 'boolean' },
      codeChallenge: {
        type: 'string',
        minLength: 43,
        maxLength: 43,
        pattern: '^[A-Za-z0-9_-]{43}$',
        description:
          'RFC 7636 S256 PKCE challenge: exactly 43 base64url characters. The method is set to S256 automatically.',
      },
    },
    required: ['clientId', 'redirectUri', 'scopes'],
  },
  output_schema: {
    type: 'object',
    properties: {
      authorizationUrl: { type: 'string' },
      scopes: { type: 'array', items: { type: 'string', enum: [...OAUTH_AUTHORIZATION_SCOPES] } },
      warnings: { type: 'array', items: { type: 'string' } },
    },
  },
};

export const createOAuthClientCredentialsTokenToolDefinition: MCPToolDefinition = {
  name: 'linear_createOAuthClientCredentialsToken',
  description:
    'Issue a scoped Linear app-actor access token through the client_credentials grant for server-to-server pipelines. The token is returned once, has no refresh token, and is normally valid for 30 days. If the requested scope set differs from existing app-actor tokens, Linear revokes those existing tokens.',
  input_schema: {
    type: 'object',
    properties: {
      clientId: { type: 'string', minLength: 1 },
      clientSecret: {
        type: 'string',
        minLength: 1,
        description: 'The OAuth application client secret. It is sent only to Linear\'s token endpoint.',
      },
      scopes: {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: { type: 'string', enum: [...APP_ACTOR_OAUTH_SCOPES] },
        description: 'Scopes for the app-actor token. The read scope is always included.',
      },
      confirmSecretExposure: secretExposureConfirmationSchema,
      confirmScopeChangeRisk: {
        type: 'boolean',
        const: true,
        description:
          'Must be true to acknowledge that requesting a different scope set revokes existing app-actor tokens for this OAuth application.',
      },
    },
    required: [
      'clientId',
      'clientSecret',
      'scopes',
      'confirmSecretExposure',
      'confirmScopeChangeRisk',
    ],
  },
  output_schema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      tokenType: { type: 'string' },
      expiresIn: { type: 'integer', minimum: 1 },
      scopes: {
        type: 'array',
        items: { type: 'string', enum: [...APP_ACTOR_OAUTH_SCOPES] },
      },
    },
  },
};

export const getManagedOAuthApplicationsToolDefinition: MCPToolDefinition = {
  name: 'linear_getManagedOAuthApplications',
  description:
    'List alpha child OAuth applications owned by the calling OAuth application. This is not a workspace-wide OAuth application admin listing and does not work as generic scope CRUD.',
  input_schema: { type: 'object', properties: {} },
  output_schema: { type: 'array', items: managedOAuthApplicationOutputSchema },
};

export const getManagedOAuthApplicationByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getManagedOAuthApplicationById',
  description:
    'Get an alpha child OAuth application owned by the calling OAuth application. It cannot retrieve an arbitrary workspace OAuth application.',
  input_schema: {
    type: 'object',
    properties: { id: { type: 'string', minLength: 1 } },
    required: ['id'],
  },
  output_schema: managedOAuthApplicationOutputSchema,
};

export const createManagedOAuthApplicationToolDefinition: MCPToolDefinition = {
  name: 'linear_createManagedOAuthApplication',
  description:
    'Create an alpha child OAuth application owned by the calling OAuth application. This is not the human setup flow and returns one-time client and optional webhook secrets in the MCP result. It cannot set distribution or pre-grant OAuth scopes.',
  input_schema: {
    type: 'object',
    properties: {
      ...managedOAuthApplicationCreateProperties,
      confirmSecretExposure: secretExposureConfirmationSchema,
    },
    required: ['name', 'developer', 'redirectUris', 'confirmSecretExposure'],
    allOf: [
      {
        if: {
          anyOf: [{ required: ['webhookUrl'] }, { required: ['webhookResourceTypes'] }],
        },
        then: { required: ['webhookUrl', 'webhookResourceTypes'] },
      },
    ],
  } as MCPToolDefinition['input_schema'],
  output_schema: {
    type: 'object',
    properties: {
      application: managedOAuthApplicationOutputSchema,
      clientSecret: { type: ['string', 'null'] },
      webhookSecret: { type: ['string', 'null'] },
    },
  },
};

export const updateManagedOAuthApplicationToolDefinition: MCPToolDefinition = {
  name: 'linear_updateManagedOAuthApplication',
  description:
    'Update metadata, grant capabilities, or webhook configuration for an alpha child app owned by the calling OAuth application. This does not grant or approve token scopes.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
      name: managedOAuthApplicationCreateProperties.name,
      developer: managedOAuthApplicationCreateProperties.developer,
      developerUrl: {
        ...managedOAuthApplicationCreateProperties.developerUrl,
        type: ['string', 'null'],
      },
      description: {
        ...managedOAuthApplicationCreateProperties.description,
        type: ['string', 'null'],
      },
      imageUrl: {
        ...managedOAuthApplicationCreateProperties.imageUrl,
        type: ['string', 'null'],
      },
      redirectUris: managedOAuthApplicationCreateProperties.redirectUris,
      grantTypes: managedOAuthApplicationCreateProperties.grantTypes,
      webhookEnabled: { type: 'boolean' },
      webhookUrl: {
        ...managedOAuthApplicationCreateProperties.webhookUrl,
        type: ['string', 'null'],
      },
      webhookResourceTypes: managedOAuthApplicationCreateProperties.webhookResourceTypes,
    },
    required: ['id'],
    anyOf: [
      { required: ['name'] },
      { required: ['developer'] },
      { required: ['developerUrl'] },
      { required: ['description'] },
      { required: ['imageUrl'] },
      { required: ['redirectUris'] },
      { required: ['grantTypes'] },
      { required: ['webhookEnabled'] },
      { required: ['webhookUrl'] },
      { required: ['webhookResourceTypes'] },
    ],
  },
  output_schema: managedOAuthApplicationOutputSchema,
};

export const archiveManagedOAuthApplicationToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveManagedOAuthApplication',
  description:
    'Archive an alpha child OAuth application owned by the calling OAuth application. This does not revoke an unrelated authorized application.',
  input_schema: {
    type: 'object',
    properties: { id: { type: 'string', minLength: 1 } },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: { success: { type: 'boolean' }, id: { type: 'string' } },
  },
};

export const rotateManagedOAuthApplicationSecretToolDefinition: MCPToolDefinition = {
  name: 'linear_rotateManagedOAuthApplicationSecret',
  description:
    'Rotate the client secret of an alpha child app owned by the calling OAuth application. The new one-time secret is exposed in the MCP result and existing client-credentials tokens may be invalidated.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
      confirmSecretExposure: secretExposureConfirmationSchema,
    },
    required: ['id', 'confirmSecretExposure'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
      clientSecret: { type: 'string' },
    },
  },
};

export const rotateManagedOAuthApplicationWebhookSecretToolDefinition: MCPToolDefinition = {
  name: 'linear_rotateManagedOAuthApplicationWebhookSecret',
  description:
    'Rotate the webhook signing secret of an alpha child app owned by the calling OAuth application. The new one-time secret is exposed in the MCP result.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
      confirmSecretExposure: secretExposureConfirmationSchema,
    },
    required: ['id', 'confirmSecretExposure'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
      webhookSecret: { type: 'string' },
    },
  },
};

export const oauthToolDefinitions: MCPToolDefinition[] = [
  generateOAuthApplicationSetupToolDefinition,
  generateOAuthAuthorizationUrlToolDefinition,
  createOAuthClientCredentialsTokenToolDefinition,
  getManagedOAuthApplicationsToolDefinition,
  getManagedOAuthApplicationByIdToolDefinition,
  createManagedOAuthApplicationToolDefinition,
  updateManagedOAuthApplicationToolDefinition,
  archiveManagedOAuthApplicationToolDefinition,
  rotateManagedOAuthApplicationSecretToolDefinition,
  rotateManagedOAuthApplicationWebhookSecretToolDefinition,
];
