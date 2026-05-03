import { LinearService } from '../../services/linear-service.js';
import {
  isGetInitiativesInput,
  isGetInitiativeByIdInput,
  isCreateInitiativeInput,
  isUpdateInitiativeInput,
  isArchiveInitiativeInput,
  isDeleteInitiativeInput,
  isGetInitiativeProjectsInput,
  isAddProjectToInitiativeInput,
  isRemoveProjectFromInitiativeInput,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function getInitiativesHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetInitiativesInput(args)) {
        throw new Error('Invalid input for getInitiatives');
      }

      return await linearService.getInitiatives(args);
    } catch (error) {
      logError('Error getting initiatives', error);
      throw error;
    }
  };
}

export function getInitiativeByIdHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetInitiativeByIdInput(args)) {
        throw new Error('Invalid input for getInitiativeById');
      }

      return await linearService.getInitiativeById(args.initiativeId, args.includeProjects);
    } catch (error) {
      logError('Error getting initiative by ID', error);
      throw error;
    }
  };
}

export function createInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateInitiativeInput(args)) {
        throw new Error('Invalid input for createInitiative');
      }

      return await linearService.createInitiative(args);
    } catch (error) {
      logError('Error creating initiative', error);
      throw error;
    }
  };
}

export function updateInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateInitiativeInput(args)) {
        throw new Error('Invalid input for updateInitiative');
      }

      const { initiativeId, ...updateData } = args;
      return await linearService.updateInitiative(initiativeId, updateData);
    } catch (error) {
      logError('Error updating initiative', error);
      throw error;
    }
  };
}

export function archiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveInitiativeInput(args)) {
        throw new Error('Invalid input for archiveInitiative');
      }

      return await linearService.archiveInitiative(args.initiativeId);
    } catch (error) {
      logError('Error archiving initiative', error);
      throw error;
    }
  };
}

export function unarchiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveInitiativeInput(args)) {
        throw new Error('Invalid input for unarchiveInitiative');
      }

      return await linearService.unarchiveInitiative(args.initiativeId);
    } catch (error) {
      logError('Error unarchiving initiative', error);
      throw error;
    }
  };
}

export function deleteInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDeleteInitiativeInput(args)) {
        throw new Error('Invalid input for deleteInitiative');
      }

      return await linearService.deleteInitiative(args.initiativeId);
    } catch (error) {
      logError('Error deleting initiative', error);
      throw error;
    }
  };
}

export function getInitiativeProjectsHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetInitiativeProjectsInput(args)) {
        throw new Error('Invalid input for getInitiativeProjects');
      }

      return await linearService.getInitiativeProjects(args.initiativeId, args.includeArchived);
    } catch (error) {
      logError('Error getting initiative projects', error);
      throw error;
    }
  };
}

export function addProjectToInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddProjectToInitiativeInput(args)) {
        throw new Error('Invalid input for addProjectToInitiative');
      }

      return await linearService.addProjectToInitiative(args.initiativeId, args.projectId);
    } catch (error) {
      logError('Error adding project to initiative', error);
      throw error;
    }
  };
}

export function removeProjectFromInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveProjectFromInitiativeInput(args)) {
        throw new Error('Invalid input for removeProjectFromInitiative');
      }

      return await linearService.removeProjectFromInitiative(args.initiativeId, args.projectId);
    } catch (error) {
      logError('Error removing project from initiative', error);
      throw error;
    }
  };
}
