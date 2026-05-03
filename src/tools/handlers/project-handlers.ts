import {
  isAddIssueToProjectArgs,
  isAddProjectMemberArgs,
  isArchiveProjectArgs,
  isCreateProjectArgs,
  isCreateProjectUpdateArgs,
  isGetProjectMembersArgs,
  isGetProjectIssuesArgs,
  isGetProjectUpdatesArgs,
  isRemoveIssueFromProjectArgs,
  isRemoveProjectMemberArgs,
  isUpdateProjectArgs,
  isUpdateProjectUpdateArgs,
} from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting projects
 */
export function handleGetProjects(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getProjects();
    } catch (error) {
      logError('Error getting projects', error);
      throw error;
    }
  };
}

export function handleGetProjectMembers(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectMembersArgs(args)) {
        throw new Error('Invalid arguments for getProjectMembers');
      }

      return await linearService.getProjectMembers(args);
    } catch (error) {
      logError('Error getting project members', error);
      throw error;
    }
  };
}

export function handleAddProjectMember(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddProjectMemberArgs(args)) {
        throw new Error('Invalid arguments for addProjectMember');
      }

      return await linearService.addProjectMember(args.projectId, args.userId);
    } catch (error) {
      logError('Error adding project member', error);
      throw error;
    }
  };
}

export function handleRemoveProjectMember(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveProjectMemberArgs(args)) {
        throw new Error('Invalid arguments for removeProjectMember');
      }

      return await linearService.removeProjectMember(args.projectId, args.userId);
    } catch (error) {
      logError('Error removing project member', error);
      throw error;
    }
  };
}

/**
 * Handler for creating a project
 */
export function handleCreateProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateProjectArgs(args)) {
        throw new Error('Invalid arguments for createProject');
      }

      return await linearService.createProject(args);
    } catch (error) {
      logError('Error creating project', error);
      throw error;
    }
  };
}

/**
 * Handler for updating a project
 */
export function handleUpdateProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateProjectArgs(args)) {
        throw new Error('Invalid arguments for updateProject');
      }

      return await linearService.updateProject(args);
    } catch (error) {
      logError('Error updating project', error);
      throw error;
    }
  };
}

/**
 * Handler for creating a project update
 */
export function handleCreateProjectUpdate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateProjectUpdateArgs(args)) {
        throw new Error('Invalid arguments for createProjectUpdate');
      }

      return await linearService.createProjectUpdate(args);
    } catch (error) {
      logError('Error creating project update', error);
      throw error;
    }
  };
}

/**
 * Handler for updating a project update
 */
export function handleUpdateProjectUpdate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateProjectUpdateArgs(args)) {
        throw new Error('Invalid arguments for updateProjectUpdate');
      }

      return await linearService.updateProjectUpdate(args);
    } catch (error) {
      logError('Error updating project update', error);
      throw error;
    }
  };
}

/**
 * Handler for getting project updates
 */
export function handleGetProjectUpdates(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectUpdatesArgs(args)) {
        throw new Error('Invalid arguments for getProjectUpdates');
      }

      return await linearService.getProjectUpdates(args.projectId, args.limit);
    } catch (error) {
      logError('Error getting project updates', error);
      throw error;
    }
  };
}

/**
 * Handler for adding an issue to a project
 */
export function handleAddIssueToProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueToProjectArgs(args)) {
        throw new Error('Invalid arguments for addIssueToProject');
      }

      return await linearService.addIssueToProject(args.issueId, args.projectId);
    } catch (error) {
      logError('Error adding issue to project', error);
      throw error;
    }
  };
}

/**
 * Handler for removing an issue from a project
 */
export function handleRemoveIssueFromProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveIssueFromProjectArgs(args)) {
        throw new Error('Invalid arguments for removeIssueFromProject');
      }

      return await linearService.removeIssueFromProject(args.issueId, args.projectId);
    } catch (error) {
      logError('Error removing issue from project', error);
      throw error;
    }
  };
}

/**
 * Handler for archiving a project
 */
export function handleArchiveProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveProjectArgs(args)) {
        throw new Error('Invalid arguments for archiveProject');
      }

      return await linearService.archiveProject(args.projectId);
    } catch (error) {
      logError('Error archiving project', error);
      throw error;
    }
  };
}

/**
 * Handler for getting issues in a project
 */
export function handleGetProjectIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectIssuesArgs(args)) {
        throw new Error('Invalid arguments for getProjectIssues');
      }

      return await linearService.getProjectIssues(args);
    } catch (error) {
      logError('Error getting project issues', error);
      throw error;
    }
  };
}
