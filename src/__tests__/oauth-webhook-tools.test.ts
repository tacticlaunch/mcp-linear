import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';
import {
  isCreateManagedOAuthApplicationArgs,
  isCreateOAuthClientCredentialsTokenArgs,
  isCreateWebhookArgs,
  isGenerateOAuthApplicationSetupArgs,
  isGenerateOAuthAuthorizationUrlArgs,
  isRotateManagedOAuthApplicationSecretArgs,
  isRotateWebhookSecretArgs,
  isUpdateManagedOAuthApplicationArgs,
  isUpdateWebhookArgs,
} from '../tools/type-guards.js';

const managedOAuthApplication = {
  id: 'oauth-app-1',
  clientId: 'client-1',
  name: 'Pipeline Agent',
  description: 'Creates issues from GitHub workflows',
  developer: 'Tactic Launch',
  developerUrl: 'https://example.com/linear',
  distribution: 'private',
  grantTypes: ['authorization_code', 'client_credentials'],
  imageUrl: 'https://example.com/icon.png',
  redirectUris: ['https://example.com/oauth/callback'],
  webhookEnabled: true,
  webhookUrl: 'https://example.com/webhooks/linear',
  webhookResourceTypes: ['Issue', 'Comment'],
  createdAt: '2026-07-10T12:00:00.000Z',
  updatedAt: '2026-07-10T12:01:00.000Z',
};

const webhook = {
  id: 'webhook-1',
  label: 'GitHub pipeline',
  url: 'https://example.com/webhooks/linear',
  enabled: true,
  allPublicTeams: false,
  resourceTypes: ['Issue', 'Comment'],
  createdAt: new Date('2026-07-10T12:00:00.000Z'),
  updatedAt: new Date('2026-07-10T12:01:00.000Z'),
  archivedAt: null,
  team: Promise.resolve({ id: 'team-1', name: 'Platform', key: 'PLAT' }),
  creator: Promise.resolve({ id: 'user-1', name: 'Alex', email: 'alex@example.com' }),
};

function makeService(client: Record<string, unknown>) {
  return new LinearService(client as never);
}

describe('OAuth application and complete webhook management', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers truthful OAuth setup, managed-app, and webhook lifecycle tools', () => {
    const names = allToolDefinitions.map((tool) => tool.name);

    expect(names).toEqual(
      expect.arrayContaining([
        'linear_generateOAuthApplicationSetup',
        'linear_generateOAuthAuthorizationUrl',
        'linear_createOAuthClientCredentialsToken',
        'linear_getManagedOAuthApplications',
        'linear_getManagedOAuthApplicationById',
        'linear_createManagedOAuthApplication',
        'linear_updateManagedOAuthApplication',
        'linear_archiveManagedOAuthApplication',
        'linear_rotateManagedOAuthApplicationSecret',
        'linear_rotateManagedOAuthApplicationWebhookSecret',
        'linear_getWebhookById',
        'linear_updateWebhook',
        'linear_rotateWebhookSecret',
      ]),
    );

    const setup = allToolDefinitions.find((tool) => tool.name === 'linear_generateOAuthApplicationSetup');
    expect(setup?.description).toContain('does not create the application');
    expect(setup?.input_schema.required).toEqual(['name', 'developer', 'redirectUris']);
    expect(setup?.input_schema.properties.grantTypes).toMatchObject({
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: { type: 'string', enum: ['authorization_code', 'client_credentials'] },
    });

    const authorize = allToolDefinitions.find((tool) => tool.name === 'linear_generateOAuthAuthorizationUrl');
    expect(authorize?.input_schema.properties.scopes.items.enum).toEqual(
      expect.arrayContaining([
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
      ]),
    );
    expect(authorize?.input_schema.properties.codeChallenge).toMatchObject({
      minLength: 43,
      maxLength: 43,
      pattern: '^[A-Za-z0-9_-]{43}$',
    });
    expect(authorize?.input_schema.properties).not.toHaveProperty('codeChallengeMethod');

    const createManaged = allToolDefinitions.find((tool) => tool.name === 'linear_createManagedOAuthApplication');
    expect(createManaged?.description).toContain('calling OAuth application');
    expect(createManaged?.input_schema.required).toEqual(
      expect.arrayContaining(['name', 'developer', 'redirectUris', 'confirmSecretExposure']),
    );
    expect(createManaged?.input_schema.properties).not.toHaveProperty('distribution');
    expect(createManaged?.input_schema.properties.webhookResourceTypes.items.enum).toEqual([
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
    ]);
    expect(createManaged?.output_schema.properties).toMatchObject({
      application: {
        type: 'object',
        properties: { developerUrl: { type: 'string' } },
      },
      clientSecret: { type: ['string', 'null'] },
      webhookSecret: { type: ['string', 'null'] },
    });

    const rotateWebhook = allToolDefinitions.find((tool) => tool.name === 'linear_rotateWebhookSecret');
    expect(rotateWebhook?.input_schema.required).toEqual(['id', 'confirmSecretExposure']);
    expect(rotateWebhook?.output_schema.properties?.secret).toEqual({ type: 'string' });
    const updateWebhook = allToolDefinitions.find((tool) => tool.name === 'linear_updateWebhook');
    expect(updateWebhook?.input_schema.properties?.label).toMatchObject({
      type: ['string', 'null'],
    });
    expect(updateWebhook?.input_schema.properties?.resourceTypes.items).toEqual({
      type: 'string',
      minLength: 1,
    });
    const clientCredentials = allToolDefinitions.find(
      (tool) => tool.name === 'linear_createOAuthClientCredentialsToken',
    );
    expect(clientCredentials?.input_schema.required).toEqual(
      expect.arrayContaining(['clientSecret', 'confirmSecretExposure', 'confirmScopeChangeRisk']),
    );
  });

  it('keeps the advertised tool registry unique and in exact parity with handlers', () => {
    const definitionNames = allToolDefinitions.map((tool) => tool.name);
    const handlerNames = Object.keys(registerToolHandlers({} as LinearService));

    expect(new Set(definitionNames).size).toBe(definitionNames.length);
    expect(handlerNames.sort()).toEqual([...definitionNames].sort());
  });

  it('validates OAuth grants, webhook pairing, scope compatibility, and explicit secret exposure', () => {
    const createArgs = {
      name: 'Pipeline Agent',
      developer: 'Tactic Launch',
      developerUrl: 'https://example.com/linear',
      redirectUris: ['https://example.com/oauth/callback'],
      grantTypes: ['authorization_code', 'client_credentials'],
      webhookUrl: 'https://example.com/webhooks/linear',
      webhookResourceTypes: ['Issue', 'Comment'],
      confirmSecretExposure: true,
    };

    expect(isCreateManagedOAuthApplicationArgs(createArgs)).toBe(true);
    expect(isCreateManagedOAuthApplicationArgs({ ...createArgs, confirmSecretExposure: false })).toBe(false);
    expect(isCreateManagedOAuthApplicationArgs({ ...createArgs, redirectUris: [] })).toBe(false);
    expect(isCreateManagedOAuthApplicationArgs({ ...createArgs, grantTypes: ['client_credentials'] })).toBe(false);
    expect(isCreateManagedOAuthApplicationArgs({ ...createArgs, webhookResourceTypes: undefined })).toBe(false);
    expect(
      isCreateManagedOAuthApplicationArgs({
        ...createArgs,
        redirectUris: ['https://example.com/oauth/callback', 'https://example.com/oauth/callback'],
      }),
    ).toBe(false);

    expect(isUpdateManagedOAuthApplicationArgs({ id: 'oauth-app-1', name: 'Renamed' })).toBe(true);
    expect(isUpdateManagedOAuthApplicationArgs({ id: 'oauth-app-1' })).toBe(false);
    expect(
      isUpdateManagedOAuthApplicationArgs({ id: 'oauth-app-1', grantTypes: ['client_credentials'] }),
    ).toBe(false);

    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        developerUrl: 'https://example.com/linear',
        redirectUris: ['https://example.com/oauth/callback'],
        grantTypes: ['authorization_code', 'client_credentials'],
      }),
    ).toBe(true);
    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Private Agent',
        developer: 'Tactic Launch',
        redirectUris: ['https://example.com/oauth/callback'],
      }),
    ).toBe(true);
    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Public Agent',
        developer: 'Tactic Launch',
        distribution: 'public',
        redirectUris: ['https://example.com/oauth/callback'],
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Linear Agent',
        developer: 'Tactic Launch',
        redirectUris: ['https://example.com/oauth/callback'],
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        developerUrl: 'https://example.com/linear',
        redirectUris: ['https://example.com/oauth/callback'],
        webhookUrl: 'https://example.com/webhooks/linear',
      }),
    ).toBe(false);

    expect(
      isGenerateOAuthAuthorizationUrlArgs({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['issues:create', 'comments:create'],
        actor: 'app',
        state: 'csrf-state',
      }),
    ).toBe(true);
    expect(
      isGenerateOAuthAuthorizationUrlArgs({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['admin'],
        actor: 'app',
      }),
    ).toBe(false);

    const clientCredentialsArgs = {
      clientId: 'client-1',
      clientSecret: 'client-secret-once',
      scopes: ['issues:create', 'comments:create'],
      confirmSecretExposure: true,
      confirmScopeChangeRisk: true,
    };
    expect(isCreateOAuthClientCredentialsTokenArgs(clientCredentialsArgs)).toBe(true);
    expect(
      isCreateOAuthClientCredentialsTokenArgs({
        ...clientCredentialsArgs,
        scopes: ['admin'],
      }),
    ).toBe(false);
    expect(
      isCreateOAuthClientCredentialsTokenArgs({
        ...clientCredentialsArgs,
        confirmScopeChangeRisk: false,
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthAuthorizationUrlArgs({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['repository:write'],
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthAuthorizationUrlArgs({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['read'],
        codeChallenge: 'challenge',
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthAuthorizationUrlArgs({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['read'],
        codeChallenge: `${'a'.repeat(42)}.`,
      }),
    ).toBe(false);

    expect(isUpdateWebhookArgs({ id: 'webhook-1', enabled: false })).toBe(true);
    expect(isUpdateWebhookArgs({ id: 'webhook-1', label: null })).toBe(true);
    expect(
      isUpdateWebhookArgs({ id: 'webhook-1', resourceTypes: ['FutureWorkspaceEvent'] }),
    ).toBe(true);
    expect(isUpdateWebhookArgs({ id: 'webhook-1' })).toBe(false);
    expect(isUpdateWebhookArgs({ id: 'webhook-1', resourceTypes: [] })).toBe(false);
    expect(isRotateWebhookSecretArgs({ id: 'webhook-1', confirmSecretExposure: true })).toBe(true);
    expect(isRotateWebhookSecretArgs({ id: 'webhook-1', confirmSecretExposure: false })).toBe(false);
    expect(
      isRotateManagedOAuthApplicationSecretArgs({ id: 'oauth-app-1', confirmSecretExposure: true }),
    ).toBe(true);

    expect(
      isCreateWebhookArgs({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
        teamId: 'team-1',
      }),
    ).toBe(true);
    expect(
      isCreateWebhookArgs({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
        allPublicTeams: true,
      }),
    ).toBe(true);
    expect(
      isCreateWebhookArgs({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
      }),
    ).toBe(false);
    expect(
      isCreateWebhookArgs({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
        allPublicTeams: false,
      }),
    ).toBe(false);
    expect(
      isCreateWebhookArgs({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
        teamId: 'team-1',
        allPublicTeams: true,
      }),
    ).toBe(false);
    for (const url of [
      'https://localhost/webhooks/linear',
      'https://127.0.0.1/webhooks/linear',
      'https://10.0.0.8/webhooks/linear',
      'https://[::1]/webhooks/linear',
      'https://user:password@example.com/webhooks/linear',
    ]) {
      expect(
        isCreateWebhookArgs({
          url,
          resourceTypes: ['Issue'],
          teamId: 'team-1',
        }),
      ).toBe(false);
    }
    expect(
      isUpdateWebhookArgs({ id: 'webhook-1', url: 'https://localhost/webhooks/linear' }),
    ).toBe(false);
    expect(
      isUpdateManagedOAuthApplicationArgs({
        id: 'oauth-app-1',
        webhookUrl: 'https://192.168.1.10/webhooks/linear',
      }),
    ).toBe(false);
    expect(
      isGenerateOAuthApplicationSetupArgs({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        redirectUris: ['https://example.com/oauth/callback'],
        webhookEnabled: true,
        webhookUrl: 'https://localhost/webhooks/linear',
        webhookResourceTypes: ['Issue'],
      }),
    ).toBe(false);
    expect(
      isCreateWebhookArgs({
        url: 'https://linear.app/public-webhook-target',
        resourceTypes: ['FutureWorkspaceEvent'],
        teamId: 'team-1',
      }),
    ).toBe(true);
    expect(
      isCreateManagedOAuthApplicationArgs({
        ...createArgs,
        webhookResourceTypes: ['FutureWorkspaceEvent'],
      }),
    ).toBe(false);
  });

  it('generates an official manifest setup link and an OAuth authorization URL without inventing scope CRUD', () => {
    const service = makeService({});
    const setup = service.generateOAuthApplicationSetup({
      name: 'Pipeline Agent',
      developer: 'Tactic Launch',
      developerUrl: 'https://example.com/linear',
      description: 'Creates Linear issues from GitHub',
      imageUrl: 'https://example.com/icon.png',
      distribution: 'private',
      redirectUris: ['https://example.com/oauth/callback'],
      grantTypes: ['authorization_code', 'client_credentials'],
      webhookEnabled: true,
      webhookUrl: 'https://example.com/webhooks/linear',
      webhookResourceTypes: ['Issue', 'Comment', 'OAuthAuthorization'],
    });

    expect(setup.requiresUserConfirmation).toBe(true);
    expect(setup.manifest).toEqual({
      $schema: 'https://linear.app/.well-known/oauth-app-manifest.schema.json',
      schemaVersion: '1.0.0',
      distribution: 'private',
      display: {
        description: 'Creates Linear issues from GitHub',
        iconUrl: 'https://example.com/icon.png',
      },
      developer: { name: 'Tactic Launch' },
      oauth: {
        client_name: 'Pipeline Agent',
        client_uri: 'https://example.com/linear',
        redirect_uris: ['https://example.com/oauth/callback'],
        grant_types: ['authorization_code', 'client_credentials'],
      },
      webhook: {
        enabled: true,
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue', 'Comment', 'OAuthAuthorization'],
      },
    });
    const setupUrl = new URL(setup.creationUrl);
    expect(`${setupUrl.origin}${setupUrl.pathname}`).toBe('https://linear.app/settings/api/applications/new');
    expect(JSON.parse(setupUrl.searchParams.get('manifest') as string)).toEqual(setup.manifest);

    const authorization = service.generateOAuthAuthorizationUrl({
      clientId: 'client-1',
      redirectUri: 'https://example.com/oauth/callback',
      scopes: ['issues:create', 'comments:create', 'issues:create'],
      actor: 'app',
      state: 'csrf-state',
      promptConsent: true,
      codeChallenge: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    });
    const authorizationUrl = new URL(authorization.authorizationUrl);
    expect(authorization.scopes).toEqual(['read', 'issues:create', 'comments:create']);
    expect(authorization.warnings).toEqual([]);
    expect(authorizationUrl.origin + authorizationUrl.pathname).toBe('https://linear.app/oauth/authorize');
    expect(Object.fromEntries(authorizationUrl.searchParams)).toMatchObject({
      response_type: 'code',
      client_id: 'client-1',
      redirect_uri: 'https://example.com/oauth/callback',
      scope: 'read,issues:create,comments:create',
      actor: 'app',
      state: 'csrf-state',
      prompt: 'consent',
      code_challenge: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      code_challenge_method: 'S256',
    });

    expect(
      service.generateOAuthAuthorizationUrl({
        clientId: 'client-1',
        redirectUri: 'https://example.com/oauth/callback',
        scopes: ['read'],
      }).warnings,
    ).toEqual([expect.stringContaining('state')]);
  });

  it('issues a scoped client-credentials token for server-to-server pipelines', async () => {
    const abortTimeoutSpy = jest.spyOn(AbortSignal, 'timeout');
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'pipeline-access-token-once',
        token_type: 'Bearer',
        expires_in: 2_591_999,
        scope: 'read issues:create comments:create',
      }),
    } as Response);
    const service = makeService({});

    await expect(
      service.createOAuthClientCredentialsToken({
        clientId: 'client-1',
        clientSecret: 'client-secret-once',
        scopes: ['issues:create', 'comments:create'],
      }),
    ).resolves.toEqual({
      accessToken: 'pipeline-access-token-once',
      tokenType: 'Bearer',
      expiresIn: 2_591_999,
      scopes: ['read', 'issues:create', 'comments:create'],
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.linear.app/oauth/token',
      expect.objectContaining({
        method: 'POST',
        redirect: 'error',
        signal: expect.any(AbortSignal),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );
    const requestBody = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(abortTimeoutSpy).toHaveBeenCalledWith(15_000);
    expect(requestBody.toString()).toBe(
      'grant_type=client_credentials&scope=read%2Cissues%3Acreate%2Ccomments%3Acreate&client_id=client-1&client_secret=client-secret-once',
    );

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ access_token: null }),
    } as Response);
    await expect(
      service.createOAuthClientCredentialsToken({
        clientId: 'client-1',
        clientSecret: 'client-secret-once',
        scopes: ['read'],
      }),
    ).rejects.toThrow('Linear OAuth token response was incomplete');

    for (const malformedPayload of [
      {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 1.5,
        scope: 'read',
      },
      {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 2_591_999,
        scope: 'read unexpected:scope',
      },
    ]) {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => malformedPayload,
      } as Response);
      await expect(
        service.createOAuthClientCredentialsToken({
          clientId: 'client-1',
          clientSecret: 'client-secret-once',
          scopes: ['read'],
        }),
      ).rejects.toThrow('Linear OAuth token response was incomplete');
    }

    fetchSpy.mockRejectedValueOnce(new DOMException('token endpoint timed out', 'TimeoutError'));
    await expect(
      service.createOAuthClientCredentialsToken({
        clientId: 'client-1',
        clientSecret: 'client-secret-once',
        scopes: ['read'],
      }),
    ).rejects.toThrow('token endpoint timed out');
  });

  it('uses narrow GraphQL for alpha managed OAuth application lifecycle and preserves one-time secrets', async () => {
    const request = jest.fn(async (query: string, variables?: Record<string, unknown>) => {
      if (query.includes('query LinearGetManagedOAuthApplications')) {
        return { oauthApplications: [managedOAuthApplication] };
      }
      if (query.includes('query LinearGetManagedOAuthApplication')) {
        return { oauthApplication: managedOAuthApplication };
      }
      if (query.includes('mutation LinearCreateManagedOAuthApplication')) {
        return {
          oauthApplicationCreate: {
            success: true,
            application: managedOAuthApplication,
            clientSecret: 'client-secret-once',
            webhookSecret: 'webhook-secret-once',
          },
        };
      }
      if (query.includes('mutation LinearUpdateManagedOAuthApplication')) {
        return { oauthApplicationUpdate: { success: true, application: managedOAuthApplication } };
      }
      if (query.includes('mutation LinearArchiveManagedOAuthApplication')) {
        return { oauthApplicationArchive: { success: true } };
      }
      if (query.includes('mutation LinearRotateManagedOAuthApplicationSecret')) {
        return { oauthApplicationRotateSecret: { success: true, clientSecret: 'rotated-client-secret' } };
      }
      if (query.includes('mutation LinearRotateManagedOAuthApplicationWebhookSecret')) {
        return {
          oauthApplicationRotateWebhookSecret: { success: true, webhookSecret: 'rotated-webhook-secret' },
        };
      }
      throw new Error(`Unexpected GraphQL request: ${query}`);
    });
    const service = makeService({ client: { request } });

    await expect(service.getManagedOAuthApplications()).resolves.toEqual([managedOAuthApplication]);
    await expect(service.getManagedOAuthApplicationById('oauth-app-1')).resolves.toEqual(managedOAuthApplication);
    await expect(
      service.createManagedOAuthApplication({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        developerUrl: 'https://example.com/linear',
        redirectUris: ['https://example.com/oauth/callback'],
        grantTypes: ['authorization_code', 'client_credentials'],
        idempotencyKey: 'pipeline-agent-v1',
        webhookUrl: 'https://example.com/webhooks/linear',
        webhookResourceTypes: ['Issue', 'Comment'],
      }),
    ).resolves.toEqual({
      application: managedOAuthApplication,
      clientSecret: 'client-secret-once',
      webhookSecret: 'webhook-secret-once',
    });
    await expect(
      service.updateManagedOAuthApplication({
        id: 'oauth-app-1',
        name: 'Renamed Pipeline Agent',
        webhookEnabled: false,
      }),
    ).resolves.toEqual(managedOAuthApplication);
    await expect(service.archiveManagedOAuthApplication('oauth-app-1')).resolves.toEqual({
      success: true,
      id: 'oauth-app-1',
    });
    await expect(service.rotateManagedOAuthApplicationSecret('oauth-app-1')).resolves.toEqual({
      success: true,
      id: 'oauth-app-1',
      clientSecret: 'rotated-client-secret',
    });
    await expect(service.rotateManagedOAuthApplicationWebhookSecret('oauth-app-1')).resolves.toEqual({
      success: true,
      id: 'oauth-app-1',
      webhookSecret: 'rotated-webhook-secret',
    });

    const createCall = request.mock.calls.find(([query]) => query.includes('LinearCreateManagedOAuthApplication'));
    expect(createCall?.[1]).toEqual({
      input: {
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        developerUrl: 'https://example.com/linear',
        redirectUris: ['https://example.com/oauth/callback'],
        grantTypes: ['authorization_code', 'client_credentials'],
        idempotencyKey: 'pipeline-agent-v1',
        webhookUrl: 'https://example.com/webhooks/linear',
        webhookResourceTypes: ['Issue', 'Comment'],
      },
    });
    const updateCall = request.mock.calls.find(([query]) => query.includes('LinearUpdateManagedOAuthApplication'));
    expect(updateCall?.[1]).toEqual({
      id: 'oauth-app-1',
      input: { name: 'Renamed Pipeline Agent', webhookEnabled: false },
    });
  });

  it('fails managed OAuth mutations when Linear does not return a successful complete payload', async () => {
    const request = jest.fn(async (query: string) => {
      if (query.includes('LinearGetManagedOAuthApplications')) {
        return { oauthApplications: null };
      }
      if (query.includes('LinearCreateManagedOAuthApplication')) {
        return { oauthApplicationCreate: { success: false, application: null } };
      }
      if (query.includes('LinearUpdateManagedOAuthApplication')) {
        return { oauthApplicationUpdate: { success: false, application: null } };
      }
      if (query.includes('LinearArchiveManagedOAuthApplication')) {
        return { oauthApplicationArchive: { success: false } };
      }
      if (query.includes('LinearRotateManagedOAuthApplicationSecret')) {
        return { oauthApplicationRotateSecret: { success: true, clientSecret: null } };
      }
      if (query.includes('LinearRotateManagedOAuthApplicationWebhookSecret')) {
        return { oauthApplicationRotateWebhookSecret: { success: true, webhookSecret: null } };
      }
      return { oauthApplication: null };
    });
    const service = makeService({ client: { request } });

    await expect(service.getManagedOAuthApplications()).rejects.toThrow(
      'Failed to list managed OAuth applications',
    );
    await expect(service.getManagedOAuthApplicationById('missing')).rejects.toThrow(
      'Managed OAuth application missing not found',
    );
    await expect(
      service.createManagedOAuthApplication({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        redirectUris: ['https://example.com/oauth/callback'],
      }),
    ).rejects.toThrow('Failed to create managed OAuth application');
    await expect(service.rotateManagedOAuthApplicationSecret('oauth-app-1')).rejects.toThrow(
      'did not return a client secret',
    );
    await expect(
      service.updateManagedOAuthApplication({ id: 'oauth-app-1', name: 'Renamed' }),
    ).rejects.toThrow('Failed to update managed OAuth application');
    await expect(service.archiveManagedOAuthApplication('oauth-app-1')).rejects.toThrow(
      'Failed to archive managed OAuth application',
    );
    await expect(service.rotateManagedOAuthApplicationWebhookSecret('oauth-app-1')).rejects.toThrow(
      'did not return a webhook secret',
    );
  });

  it('completes ordinary webhook get, update, and secret-rotation lifecycle through SDK methods', async () => {
    const client = {
      webhook: jest.fn().mockResolvedValue(webhook),
      updateWebhook: jest.fn().mockResolvedValue({ success: true, webhook: Promise.resolve(webhook) }),
      rotateSecretWebhook: jest.fn().mockResolvedValue({ success: true, secret: 'rotated-webhook-secret' }),
    };
    const service = makeService(client);

    await expect(service.getWebhookById('webhook-1')).resolves.toMatchObject({
      id: 'webhook-1',
      team: { id: 'team-1', name: 'Platform', key: 'PLAT' },
    });
    await expect(
      service.updateWebhook({
        id: 'webhook-1',
        url: 'https://example.com/webhooks/linear-v2',
        label: null,
        enabled: false,
        resourceTypes: ['Issue'],
      }),
    ).resolves.toMatchObject({ id: 'webhook-1' });
    await expect(service.rotateWebhookSecret('webhook-1')).resolves.toEqual({
      success: true,
      id: 'webhook-1',
      secret: 'rotated-webhook-secret',
    });

    expect(client.webhook).toHaveBeenCalledWith('webhook-1');
    expect(client.updateWebhook).toHaveBeenCalledWith('webhook-1', {
      url: 'https://example.com/webhooks/linear-v2',
      label: null,
      enabled: false,
      resourceTypes: ['Issue'],
    });
    expect(client.rotateSecretWebhook).toHaveBeenCalledWith('webhook-1');
  });

  it('fails ordinary webhook operations on missing or unsuccessful SDK payloads', async () => {
    const service = makeService({
      webhook: jest.fn().mockResolvedValue(null),
      updateWebhook: jest.fn().mockResolvedValue({ success: false, webhook: null }),
      rotateSecretWebhook: jest.fn().mockResolvedValue({ success: true, secret: null }),
    });

    await expect(service.getWebhookById('missing')).rejects.toThrow(
      'Webhook with ID missing not found',
    );
    await expect(service.updateWebhook({ id: 'webhook-1', enabled: false })).rejects.toThrow(
      'Failed to update webhook webhook-1',
    );
    await expect(service.rotateWebhookSecret('webhook-1')).rejects.toThrow(
      'did not return a secret',
    );
  });

  it('routes handlers and strips secret-exposure acknowledgements before service calls', async () => {
    const service = {
      generateOAuthApplicationSetup: jest.fn().mockReturnValue({ creationUrl: 'https://linear.app/setup' }),
      generateOAuthAuthorizationUrl: jest.fn().mockReturnValue({ authorizationUrl: 'https://linear.app/oauth/authorize' }),
      createOAuthClientCredentialsToken: jest.fn().mockResolvedValue({ accessToken: 'once' }),
      getManagedOAuthApplications: jest.fn().mockResolvedValue([managedOAuthApplication]),
      getManagedOAuthApplicationById: jest.fn().mockResolvedValue(managedOAuthApplication),
      createManagedOAuthApplication: jest.fn().mockResolvedValue({ application: managedOAuthApplication }),
      updateManagedOAuthApplication: jest.fn().mockResolvedValue(managedOAuthApplication),
      archiveManagedOAuthApplication: jest.fn().mockResolvedValue({ success: true, id: 'oauth-app-1' }),
      rotateManagedOAuthApplicationSecret: jest.fn().mockResolvedValue({ clientSecret: 'once' }),
      rotateManagedOAuthApplicationWebhookSecret: jest.fn().mockResolvedValue({ webhookSecret: 'once' }),
      getWebhookById: jest.fn().mockResolvedValue(webhook),
      updateWebhook: jest.fn().mockResolvedValue(webhook),
      rotateWebhookSecret: jest.fn().mockResolvedValue({ secret: 'once' }),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await handlers.linear_generateOAuthApplicationSetup({
      name: 'Pipeline Agent',
      developer: 'Tactic Launch',
      redirectUris: ['https://example.com/oauth/callback'],
    });
    await handlers.linear_generateOAuthAuthorizationUrl({
      clientId: 'client-1',
      redirectUri: 'https://example.com/oauth/callback',
      scopes: ['read'],
    });
    await handlers.linear_createOAuthClientCredentialsToken({
      clientId: 'client-1',
      clientSecret: 'client-secret-once',
      scopes: ['issues:create'],
      confirmSecretExposure: true,
      confirmScopeChangeRisk: true,
    });
    await handlers.linear_getManagedOAuthApplications({});
    await handlers.linear_getManagedOAuthApplicationById({ id: 'oauth-app-1' });
    await handlers.linear_createManagedOAuthApplication({
      name: 'Pipeline Agent',
      developer: 'Tactic Launch',
      redirectUris: ['https://example.com/oauth/callback'],
      confirmSecretExposure: true,
    });
    await handlers.linear_rotateManagedOAuthApplicationSecret({
      id: 'oauth-app-1',
      confirmSecretExposure: true,
    });
    await handlers.linear_rotateManagedOAuthApplicationWebhookSecret({
      id: 'oauth-app-1',
      confirmSecretExposure: true,
    });
    await handlers.linear_updateManagedOAuthApplication({ id: 'oauth-app-1', name: 'Renamed' });
    await handlers.linear_archiveManagedOAuthApplication({ id: 'oauth-app-1' });
    await handlers.linear_getWebhookById({ id: 'webhook-1' });
    await handlers.linear_updateWebhook({ id: 'webhook-1', enabled: false });
    await handlers.linear_rotateWebhookSecret({ id: 'webhook-1', confirmSecretExposure: true });

    expect(service.createManagedOAuthApplication).toHaveBeenCalledWith({
      name: 'Pipeline Agent',
      developer: 'Tactic Launch',
      redirectUris: ['https://example.com/oauth/callback'],
    });
    expect(service.generateOAuthApplicationSetup).toHaveBeenCalled();
    expect(service.generateOAuthAuthorizationUrl).toHaveBeenCalled();
    expect(service.createOAuthClientCredentialsToken).toHaveBeenCalledWith({
      clientId: 'client-1',
      clientSecret: 'client-secret-once',
      scopes: ['issues:create'],
    });
    expect(service.getManagedOAuthApplications).toHaveBeenCalledWith();
    expect(service.getManagedOAuthApplicationById).toHaveBeenCalledWith('oauth-app-1');
    expect(service.updateManagedOAuthApplication).toHaveBeenCalledWith({
      id: 'oauth-app-1',
      name: 'Renamed',
    });
    expect(service.archiveManagedOAuthApplication).toHaveBeenCalledWith('oauth-app-1');
    expect(service.rotateManagedOAuthApplicationSecret).toHaveBeenCalledWith('oauth-app-1');
    expect(service.rotateManagedOAuthApplicationWebhookSecret).toHaveBeenCalledWith('oauth-app-1');
    expect(service.getWebhookById).toHaveBeenCalledWith('webhook-1');
    expect(service.updateWebhook).toHaveBeenCalledWith({ id: 'webhook-1', enabled: false });
    expect(service.rotateWebhookSecret).toHaveBeenCalledWith('webhook-1');

    await expect(
      handlers.linear_rotateWebhookSecret({ id: 'webhook-1', confirmSecretExposure: false }),
    ).rejects.toThrow('Invalid arguments for rotateWebhookSecret');
  });

  it('does not log a caller-provided webhook signing secret when Linear rejects the request', async () => {
    const leakedSecret = 'must-not-appear-in-logs';
    const linearError = Object.assign(new Error(`Invalid secret ${leakedSecret}`), {
      variables: { input: { secret: leakedSecret } },
    });
    const service = {
      createWebhook: jest.fn().mockRejectedValue(linearError),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(
      handlers.linear_createWebhook({
        url: 'https://example.com/webhooks/linear',
        resourceTypes: ['Issue'],
        teamId: 'team-1',
        secret: leakedSecret,
      }),
    ).rejects.toThrow('error details were omitted');

    expect(JSON.stringify((console.error as jest.Mock).mock.calls)).not.toContain(leakedSecret);
  });

  it('does not expose raw errors from operations whose responses may contain one-time secrets', async () => {
    const leakedSecret = 'one-time-secret-that-must-not-leak';
    const secretError = Object.assign(new Error(`Partial GraphQL response: ${leakedSecret}`), {
      raw: { data: { secret: leakedSecret } },
    });
    const service = {
      createManagedOAuthApplication: jest.fn().mockRejectedValue(secretError),
      createOAuthClientCredentialsToken: jest.fn().mockRejectedValue(secretError),
      rotateManagedOAuthApplicationSecret: jest.fn().mockRejectedValue(secretError),
      rotateManagedOAuthApplicationWebhookSecret: jest.fn().mockRejectedValue(secretError),
      rotateWebhookSecret: jest.fn().mockRejectedValue(secretError),
    } as unknown as LinearService;
    const handlers = registerToolHandlers(service);

    await expect(
      handlers.linear_createOAuthClientCredentialsToken({
        clientId: 'client-1',
        clientSecret: leakedSecret,
        scopes: ['issues:create'],
        confirmSecretExposure: true,
        confirmScopeChangeRisk: true,
      }),
    ).rejects.toThrow('error details were omitted');
    await expect(
      handlers.linear_createManagedOAuthApplication({
        name: 'Pipeline Agent',
        developer: 'Tactic Launch',
        redirectUris: ['https://example.com/oauth/callback'],
        confirmSecretExposure: true,
      }),
    ).rejects.toThrow('error details were omitted');
    await expect(
      handlers.linear_rotateManagedOAuthApplicationSecret({
        id: 'oauth-app-1',
        confirmSecretExposure: true,
      }),
    ).rejects.toThrow('error details were omitted');
    await expect(
      handlers.linear_rotateManagedOAuthApplicationWebhookSecret({
        id: 'oauth-app-1',
        confirmSecretExposure: true,
      }),
    ).rejects.toThrow('error details were omitted');
    await expect(
      handlers.linear_rotateWebhookSecret({
        id: 'webhook-1',
        confirmSecretExposure: true,
      }),
    ).rejects.toThrow('error details were omitted');

    expect(JSON.stringify((console.error as jest.Mock).mock.calls)).not.toContain(leakedSecret);
  });
});
