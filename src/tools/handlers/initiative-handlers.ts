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

export function getInitiativesHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isGetInitiativesInput(args)) {
      throw new Error('Invalid input for getInitiatives');
    }

    console.error('[getInitiatives] Fetching initiatives with options:', args);
    const initiatives = await linearService.getInitiatives(args);
    console.error(`[getInitiatives] Retrieved ${initiatives.length} initiatives`);
    return initiatives;
  };
}

export function getInitiativeByIdHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isGetInitiativeByIdInput(args)) {
      throw new Error('Invalid input for getInitiativeById');
    }

    console.error(`[getInitiativeById] Fetching initiative: ${args.initiativeId}`);
    const initiative = await linearService.getInitiativeById(
      args.initiativeId,
      args.includeProjects,
    );
    console.error(`[getInitiativeById] Retrieved initiative: ${initiative.name}`);
    return initiative;
  };
}

export function createInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isCreateInitiativeInput(args)) {
      throw new Error('Invalid input for createInitiative');
    }

    console.error('[createInitiative] Creating new initiative:', args.name);
    const result = await linearService.createInitiative(args);
    console.error(`[createInitiative] Initiative created successfully`);
    return result;
  };
}

export function updateInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isUpdateInitiativeInput(args)) {
      throw new Error('Invalid input for updateInitiative');
    }

    const { initiativeId, ...updateData } = args;
    console.error(`[updateInitiative] Updating initiative: ${initiativeId}`);
    const result = await linearService.updateInitiative(initiativeId, updateData);
    console.error(`[updateInitiative] Initiative updated successfully`);
    return result;
  };
}

export function archiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isArchiveInitiativeInput(args)) {
      throw new Error('Invalid input for archiveInitiative');
    }

    console.error(`[archiveInitiative] Archiving initiative: ${args.initiativeId}`);
    const result = await linearService.archiveInitiative(args.initiativeId);
    console.error(`[archiveInitiative] Initiative archived successfully`);
    return result;
  };
}

export function unarchiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isArchiveInitiativeInput(args)) {
      throw new Error('Invalid input for unarchiveInitiative');
    }

    console.error(`[unarchiveInitiative] Unarchiving initiative: ${args.initiativeId}`);
    const result = await linearService.unarchiveInitiative(args.initiativeId);
    console.error(`[unarchiveInitiative] Initiative unarchived successfully`);
    return result;
  };
}

export function deleteInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isDeleteInitiativeInput(args)) {
      throw new Error('Invalid input for deleteInitiative');
    }

    console.error(`[deleteInitiative] Deleting initiative: ${args.initiativeId}`);
    const result = await linearService.deleteInitiative(args.initiativeId);
    console.error(`[deleteInitiative] Initiative deleted successfully`);
    return result;
  };
}

export function getInitiativeProjectsHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isGetInitiativeProjectsInput(args)) {
      throw new Error('Invalid input for getInitiativeProjects');
    }

    console.error(`[getInitiativeProjects] Fetching projects for initiative: ${args.initiativeId}`);
    const projects = await linearService.getInitiativeProjects(
      args.initiativeId,
      args.includeArchived,
    );
    console.error(`[getInitiativeProjects] Retrieved ${projects.length} projects`);
    return projects;
  };
}

export function addProjectToInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isAddProjectToInitiativeInput(args)) {
      throw new Error('Invalid input for addProjectToInitiative');
    }

    console.error(
      `[addProjectToInitiative] Adding project ${args.projectId} to initiative ${args.initiativeId}`,
    );
    const result = await linearService.addProjectToInitiative(args.initiativeId, args.projectId);
    console.error(`[addProjectToInitiative] Project added successfully`);
    return result;
  };
}

export function removeProjectFromInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isRemoveProjectFromInitiativeInput(args)) {
      throw new Error('Invalid input for removeProjectFromInitiative');
    }

    console.error(
      `[removeProjectFromInitiative] Removing project ${args.projectId} from initiative ${args.initiativeId}`,
    );
    const result = await linearService.removeProjectFromInitiative(
      args.initiativeId,
      args.projectId,
    );
    console.error(`[removeProjectFromInitiative] Project removed successfully`);
    return result;
  };
}
