import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import { isGetWorkflowStatesArgs } from '../type-guards.js';

/**
 * Handler for getting teams
 */
export function handleGetTeams(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getTeams();
    } catch (error) {
      logError('Error getting teams', error);
      throw error;
    }
  };
}

/**
 * Handler for getting workflow states for a team
 */
export function handleGetWorkflowStates(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetWorkflowStatesArgs(args)) {
        throw new Error('Invalid arguments for getWorkflowStates');
      }

      return await linearService.getWorkflowStates(args.teamId, args.includeArchived || false);
    } catch (error) {
      logError('Error getting workflow states', error);
      throw error;
    }
  };
}
