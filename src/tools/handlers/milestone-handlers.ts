import { LinearService } from '../../services/linear-service.js';
import {
  isArchiveMilestoneArgs,
  isCreateMilestoneArgs,
  isGetMilestoneByIdArgs,
  isGetMilestonesArgs,
  isUpdateMilestoneArgs,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function handleGetMilestones(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      const normalizedArgs = args ?? {};

      if (!isGetMilestonesArgs(normalizedArgs)) {
        throw new Error('Invalid arguments for getMilestones');
      }

      return await linearService.getMilestones(normalizedArgs);
    } catch (error) {
      logError('Error getting milestones', error);
      throw error;
    }
  };
}

export function handleGetMilestoneById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetMilestoneByIdArgs(args)) {
        throw new Error('Invalid arguments for getMilestoneById');
      }

      return await linearService.getMilestoneById(args.id);
    } catch (error) {
      logError('Error getting milestone by id', error);
      throw error;
    }
  };
}

export function handleCreateMilestone(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateMilestoneArgs(args)) {
        throw new Error('Invalid arguments for createMilestone');
      }

      return await linearService.createMilestone(args);
    } catch (error) {
      logError('Error creating milestone', error);
      throw error;
    }
  };
}

export function handleUpdateMilestone(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateMilestoneArgs(args)) {
        throw new Error('Invalid arguments for updateMilestone');
      }

      return await linearService.updateMilestone(args);
    } catch (error) {
      logError('Error updating milestone', error);
      throw error;
    }
  };
}

export function handleArchiveMilestone(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveMilestoneArgs(args)) {
        throw new Error('Invalid arguments for archiveMilestone');
      }

      return await linearService.archiveMilestone(args.id);
    } catch (error) {
      logError('Error archiving milestone', error);
      throw error;
    }
  };
}
