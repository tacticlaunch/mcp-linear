import { LinearService } from '../../services/linear-service.js';
import {
  isArchiveRoadmapArgs,
  isCreateRoadmapArgs,
  isGetRoadmapByIdArgs,
  isGetRoadmapsArgs,
  isUpdateRoadmapArgs,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function handleGetRoadmaps(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isGetRoadmapsArgs(args)) {
        throw new Error('Invalid arguments for getRoadmaps');
      }

      const roadmapArgs =
        args === null
          ? undefined
          : (args as { limit?: number; includeArchived?: boolean; orderBy?: string } | undefined);

      return await linearService.getRoadmaps(
        roadmapArgs,
      );
    } catch (error) {
      logError('Error getting roadmaps', error);
      throw error;
    }
  };
}

export function handleGetRoadmapById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetRoadmapByIdArgs(args)) {
        throw new Error('Invalid arguments for getRoadmapById');
      }

      return await linearService.getRoadmapById(args.id);
    } catch (error) {
      logError('Error getting roadmap by ID', error);
      throw error;
    }
  };
}

export function handleCreateRoadmap(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateRoadmapArgs(args)) {
        throw new Error('Invalid arguments for createRoadmap');
      }

      return await linearService.createRoadmap(args);
    } catch (error) {
      logError('Error creating roadmap', error);
      throw error;
    }
  };
}

export function handleUpdateRoadmap(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateRoadmapArgs(args)) {
        throw new Error('Invalid arguments for updateRoadmap');
      }

      return await linearService.updateRoadmap(args);
    } catch (error) {
      logError('Error updating roadmap', error);
      throw error;
    }
  };
}

export function handleArchiveRoadmap(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveRoadmapArgs(args)) {
        throw new Error('Invalid arguments for archiveRoadmap');
      }

      return await linearService.archiveRoadmap(args.roadmapId);
    } catch (error) {
      logError('Error archiving roadmap', error);
      throw error;
    }
  };
}
