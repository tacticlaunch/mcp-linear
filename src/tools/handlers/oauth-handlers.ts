import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import {
  isArchiveManagedOAuthApplicationArgs,
  isCreateManagedOAuthApplicationArgs,
  isCreateOAuthClientCredentialsTokenArgs,
  isGenerateOAuthApplicationSetupArgs,
  isGenerateOAuthAuthorizationUrlArgs,
  isGetManagedOAuthApplicationByIdArgs,
  isGetManagedOAuthApplicationsArgs,
  isRotateManagedOAuthApplicationSecretArgs,
  isRotateManagedOAuthApplicationWebhookSecretArgs,
  isUpdateManagedOAuthApplicationArgs,
} from '../type-guards.js';

function rethrowSecretProducingOAuthError(action: string): never {
  const safeError = new Error(
    `Failed ${action}; Linear error details were omitted because the response may contain a one-time secret`,
  );
  logError(`Error ${action}`, safeError);
  throw safeError;
}

export function handleGenerateOAuthApplicationSetup(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGenerateOAuthApplicationSetupArgs(args)) {
        throw new Error('Invalid arguments for generateOAuthApplicationSetup');
      }
      return linearService.generateOAuthApplicationSetup(args);
    } catch (error) {
      logError('Error generating OAuth application setup', error);
      throw error;
    }
  };
}

export function handleGenerateOAuthAuthorizationUrl(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGenerateOAuthAuthorizationUrlArgs(args)) {
        throw new Error('Invalid arguments for generateOAuthAuthorizationUrl');
      }
      return linearService.generateOAuthAuthorizationUrl(args);
    } catch (error) {
      logError('Error generating OAuth authorization URL', error);
      throw error;
    }
  };
}

export function handleCreateOAuthClientCredentialsToken(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isCreateOAuthClientCredentialsTokenArgs(args)) {
      const error = new Error('Invalid arguments for createOAuthClientCredentialsToken');
      logError('Error creating OAuth client-credentials token', error);
      throw error;
    }

    try {
      return await linearService.createOAuthClientCredentialsToken({
        clientId: args.clientId,
        clientSecret: args.clientSecret,
        scopes: args.scopes,
      });
    } catch {
      rethrowSecretProducingOAuthError('creating OAuth client-credentials token');
    }
  };
}

export function handleGetManagedOAuthApplications(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetManagedOAuthApplicationsArgs(args)) {
        throw new Error('Invalid arguments for getManagedOAuthApplications');
      }
      return await linearService.getManagedOAuthApplications();
    } catch (error) {
      logError('Error getting managed OAuth applications', error);
      throw error;
    }
  };
}

export function handleGetManagedOAuthApplicationById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetManagedOAuthApplicationByIdArgs(args)) {
        throw new Error('Invalid arguments for getManagedOAuthApplicationById');
      }
      return await linearService.getManagedOAuthApplicationById(args.id);
    } catch (error) {
      logError('Error getting managed OAuth application', error);
      throw error;
    }
  };
}

export function handleCreateManagedOAuthApplication(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isCreateManagedOAuthApplicationArgs(args)) {
      const error = new Error('Invalid arguments for createManagedOAuthApplication');
      logError('Error creating managed OAuth application', error);
      throw error;
    }
    try {
      const { confirmSecretExposure, ...serviceArgs } = args;
      return await linearService.createManagedOAuthApplication(serviceArgs);
    } catch {
      rethrowSecretProducingOAuthError('creating managed OAuth application');
    }
  };
}

export function handleUpdateManagedOAuthApplication(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateManagedOAuthApplicationArgs(args)) {
        throw new Error('Invalid arguments for updateManagedOAuthApplication');
      }
      return await linearService.updateManagedOAuthApplication(args);
    } catch (error) {
      logError('Error updating managed OAuth application', error);
      throw error;
    }
  };
}

export function handleArchiveManagedOAuthApplication(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveManagedOAuthApplicationArgs(args)) {
        throw new Error('Invalid arguments for archiveManagedOAuthApplication');
      }
      return await linearService.archiveManagedOAuthApplication(args.id);
    } catch (error) {
      logError('Error archiving managed OAuth application', error);
      throw error;
    }
  };
}

export function handleRotateManagedOAuthApplicationSecret(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isRotateManagedOAuthApplicationSecretArgs(args)) {
      const error = new Error('Invalid arguments for rotateManagedOAuthApplicationSecret');
      logError('Error rotating managed OAuth application secret', error);
      throw error;
    }
    try {
      return await linearService.rotateManagedOAuthApplicationSecret(args.id);
    } catch {
      rethrowSecretProducingOAuthError('rotating managed OAuth application secret');
    }
  };
}

export function handleRotateManagedOAuthApplicationWebhookSecret(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isRotateManagedOAuthApplicationWebhookSecretArgs(args)) {
      const error = new Error('Invalid arguments for rotateManagedOAuthApplicationWebhookSecret');
      logError('Error rotating managed OAuth application webhook secret', error);
      throw error;
    }
    try {
      return await linearService.rotateManagedOAuthApplicationWebhookSecret(args.id);
    } catch {
      rethrowSecretProducingOAuthError('rotating managed OAuth application webhook secret');
    }
  };
}
