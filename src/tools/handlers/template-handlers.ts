import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import {
  isArchiveTemplateArgs,
  isCreateIssueFromTemplateArgs,
  isCreateIssueTemplateArgs,
  isGetIssueTemplateByIdArgs,
  isGetIssueTemplatesArgs,
  isGetTeamTemplatesArgs,
  isUpdateIssueTemplateArgs,
} from '../type-guards.js';

export function handleGetIssueTemplates(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssueTemplatesArgs(args)) {
        throw new Error('Invalid arguments for getIssueTemplates');
      }

      return await linearService.getIssueTemplates(args);
    } catch (error) {
      logError('Error getting issue templates', error);
      throw error;
    }
  };
}

export function handleGetIssueTemplateById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssueTemplateByIdArgs(args)) {
        throw new Error('Invalid arguments for getIssueTemplateById');
      }

      return await linearService.getIssueTemplateById(args.id);
    } catch (error) {
      logError('Error getting issue template by ID', error);
      throw error;
    }
  };
}

export function handleCreateIssueTemplate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateIssueTemplateArgs(args)) {
        throw new Error('Invalid arguments for createIssueTemplate');
      }

      return await linearService.createIssueTemplate(args);
    } catch (error) {
      logError('Error creating issue template', error);
      throw error;
    }
  };
}

export function handleUpdateIssueTemplate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateIssueTemplateArgs(args)) {
        throw new Error('Invalid arguments for updateIssueTemplate');
      }

      return await linearService.updateIssueTemplate(args);
    } catch (error) {
      logError('Error updating issue template', error);
      throw error;
    }
  };
}

export function handleCreateIssueFromTemplate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateIssueFromTemplateArgs(args)) {
        throw new Error('Invalid arguments for createIssueFromTemplate');
      }

      return await linearService.createIssueFromTemplate(args);
    } catch (error) {
      logError('Error creating issue from template', error);
      throw error;
    }
  };
}

export function handleGetTeamTemplates(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetTeamTemplatesArgs(args)) {
        throw new Error('Invalid arguments for getTeamTemplates');
      }

      return await linearService.getTeamTemplates(args);
    } catch (error) {
      logError('Error getting team templates', error);
      throw error;
    }
  };
}

export function handleArchiveTemplate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveTemplateArgs(args)) {
        throw new Error('Invalid arguments for archiveTemplate');
      }

      return await linearService.archiveTemplate(args.id);
    } catch (error) {
      logError('Error archiving template', error);
      throw error;
    }
  };
}
