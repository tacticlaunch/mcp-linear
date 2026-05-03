import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import {
  isAddUserToTeamArgs,
  isArchiveTeamArgs,
  isCreateTeamArgs,
  isCreateTeamLabelArgs,
  isCreateWorkflowStateArgs,
  isGetTeamLabelsArgs,
  isGetTeamMembershipsArgs,
  isGetWorkflowStatesArgs,
  isRemoveUserFromTeamArgs,
  isUpdateTeamArgs,
  isUpdateTeamMembershipArgs,
  isUpdateWorkflowStateArgs,
} from '../type-guards.js';

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

export function handleCreateWorkflowState(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateWorkflowStateArgs(args)) {
        throw new Error('Invalid arguments for createWorkflowState');
      }

      return await linearService.createWorkflowState(args);
    } catch (error) {
      logError('Error creating workflow state', error);
      throw error;
    }
  };
}

export function handleUpdateWorkflowState(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateWorkflowStateArgs(args)) {
        throw new Error('Invalid arguments for updateWorkflowState');
      }

      return await linearService.updateWorkflowState(args);
    } catch (error) {
      logError('Error updating workflow state', error);
      throw error;
    }
  };
}

export function handleUpdateTeam(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateTeamArgs(args)) {
        throw new Error('Invalid arguments for updateTeam');
      }

      return await linearService.updateTeam(args);
    } catch (error) {
      logError('Error updating team', error);
      throw error;
    }
  };
}

export function handleGetTeamMemberships(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetTeamMembershipsArgs(args)) {
        throw new Error('Invalid arguments for getTeamMemberships');
      }

      return await linearService.getTeamMemberships(args);
    } catch (error) {
      logError('Error getting team memberships', error);
      throw error;
    }
  };
}

export function handleCreateTeam(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateTeamArgs(args)) {
        throw new Error('Invalid arguments for createTeam');
      }

      return await linearService.createTeam(args);
    } catch (error) {
      logError('Error creating team', error);
      throw error;
    }
  };
}

export function handleArchiveTeam(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveTeamArgs(args)) {
        throw new Error('Invalid arguments for archiveTeam');
      }

      return await linearService.archiveTeam(args.id);
    } catch (error) {
      logError('Error archiving team', error);
      throw error;
    }
  };
}

export function handleAddUserToTeam(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddUserToTeamArgs(args)) {
        throw new Error('Invalid arguments for addUserToTeam');
      }

      return await linearService.addUserToTeam(args);
    } catch (error) {
      logError('Error adding user to team', error);
      throw error;
    }
  };
}

export function handleRemoveUserFromTeam(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveUserFromTeamArgs(args)) {
        throw new Error('Invalid arguments for removeUserFromTeam');
      }

      return await linearService.removeUserFromTeam(args);
    } catch (error) {
      logError('Error removing user from team', error);
      throw error;
    }
  };
}

export function handleUpdateTeamMembership(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateTeamMembershipArgs(args)) {
        throw new Error('Invalid arguments for updateTeamMembership');
      }

      return await linearService.updateTeamMembership(args);
    } catch (error) {
      logError('Error updating team membership', error);
      throw error;
    }
  };
}

export function handleGetTeamLabels(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetTeamLabelsArgs(args)) {
        throw new Error('Invalid arguments for getTeamLabels');
      }

      return await linearService.getTeamLabels(args);
    } catch (error) {
      logError('Error getting team labels', error);
      throw error;
    }
  };
}

export function handleCreateTeamLabel(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateTeamLabelArgs(args)) {
        throw new Error('Invalid arguments for createTeamLabel');
      }

      return await linearService.createTeamLabel(args);
    } catch (error) {
      logError('Error creating team label', error);
      throw error;
    }
  };
}
