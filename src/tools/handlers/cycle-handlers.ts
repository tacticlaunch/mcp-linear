import {
  isAddIssueToCycleArgs,
  isCompleteCycleArgs,
  isCreateCycleArgs,
  isGetActiveCycleArgs,
  isGetCycleByIdArgs,
  isGetCycleIssuesArgs,
  isGetCycleStatsArgs,
  isGetCyclesArgs,
  isRemoveIssueFromCycleArgs,
  isUpdateCycleArgs,
} from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting all cycles
 */
export function handleGetCycles(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCyclesArgs(args)) {
        throw new Error('Invalid arguments for getCycles');
      }

      return await linearService.getCycles(args.teamId, args.limit);
    } catch (error) {
      logError('Error getting cycles', error);
      throw error;
    }
  };
}

export function handleGetCycleById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCycleByIdArgs(args)) {
        throw new Error('Invalid arguments for getCycleById');
      }

      return await linearService.getCycleById(args.id);
    } catch (error) {
      logError('Error getting cycle by ID', error);
      throw error;
    }
  };
}

export function handleCreateCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateCycleArgs(args)) {
        throw new Error('Invalid arguments for createCycle');
      }

      return await linearService.createCycle(args);
    } catch (error) {
      logError('Error creating cycle', error);
      throw error;
    }
  };
}

export function handleUpdateCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateCycleArgs(args)) {
        throw new Error('Invalid arguments for updateCycle');
      }

      return await linearService.updateCycle(args);
    } catch (error) {
      logError('Error updating cycle', error);
      throw error;
    }
  };
}

export function handleCompleteCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCompleteCycleArgs(args)) {
        throw new Error('Invalid arguments for completeCycle');
      }

      return await linearService.completeCycle(args.id);
    } catch (error) {
      logError('Error completing cycle', error);
      throw error;
    }
  };
}

export function handleGetCycleStats(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCycleStatsArgs(args)) {
        throw new Error('Invalid arguments for getCycleStats');
      }

      return await linearService.getCycleStats(args.id);
    } catch (error) {
      logError('Error getting cycle stats', error);
      throw error;
    }
  };
}

/**
 * Handler for getting the active cycle for a team
 */
export function handleGetActiveCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetActiveCycleArgs(args)) {
        throw new Error('Invalid arguments for getActiveCycle');
      }

      return await linearService.getActiveCycle(args.teamId);
    } catch (error) {
      logError('Error getting active cycle', error);
      throw error;
    }
  };
}

export function handleGetCycleIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCycleIssuesArgs(args)) {
        throw new Error('Invalid arguments for getCycleIssues');
      }

      return await linearService.getCycleIssues(args);
    } catch (error) {
      logError('Error getting cycle issues', error);
      throw error;
    }
  };
}

/**
 * Handler for adding an issue to a cycle
 */
export function handleAddIssueToCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueToCycleArgs(args)) {
        throw new Error('Invalid arguments for addIssueToCycle');
      }

      return await linearService.addIssueToCycle(args.issueId, args.cycleId);
    } catch (error) {
      logError('Error adding issue to cycle', error);
      throw error;
    }
  };
}

/**
 * Handler for removing an issue from a cycle
 */
export function handleRemoveIssueFromCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveIssueFromCycleArgs(args)) {
        throw new Error('Invalid arguments for removeIssueFromCycle');
      }

      return await linearService.removeIssueFromCycle(args.issueId, args.cycleId);
    } catch (error) {
      logError('Error removing issue from cycle', error);
      throw error;
    }
  };
}
