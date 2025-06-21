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

    console.log('[getInitiatives] Fetching initiatives with options:', args);
    const initiatives = await linearService.getInitiatives(args);
    console.log(`[getInitiatives] Retrieved ${initiatives.length} initiatives`);
    return initiatives;
  };
}

export function getInitiativeByIdHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isGetInitiativeByIdInput(args)) {
      throw new Error('Invalid input for getInitiativeById');
    }

    console.log(`[getInitiativeById] Fetching initiative: ${args.initiativeId}`);
    const initiative = await linearService.getInitiativeById(
      args.initiativeId,
      args.includeProjects,
    );
    console.log(`[getInitiativeById] Retrieved initiative: ${initiative.name}`);
    return initiative;
  };
}

export function createInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isCreateInitiativeInput(args)) {
      throw new Error('Invalid input for createInitiative');
    }

    console.log('[createInitiative] Creating new initiative:', args.name);
    const result = await linearService.createInitiative(args);
    console.log(`[createInitiative] Initiative created successfully`);
    return result;
  };
}

export function updateInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isUpdateInitiativeInput(args)) {
      throw new Error('Invalid input for updateInitiative');
    }

    const { initiativeId, ...updateData } = args;
    console.log(`[updateInitiative] Updating initiative: ${initiativeId}`);
    const result = await linearService.updateInitiative(initiativeId, updateData);
    console.log(`[updateInitiative] Initiative updated successfully`);
    return result;
  };
}

export function archiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isArchiveInitiativeInput(args)) {
      throw new Error('Invalid input for archiveInitiative');
    }

    console.log(`[archiveInitiative] Archiving initiative: ${args.initiativeId}`);
    const result = await linearService.archiveInitiative(args.initiativeId);
    console.log(`[archiveInitiative] Initiative archived successfully`);
    return result;
  };
}

export function unarchiveInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isArchiveInitiativeInput(args)) {
      throw new Error('Invalid input for unarchiveInitiative');
    }

    console.log(`[unarchiveInitiative] Unarchiving initiative: ${args.initiativeId}`);
    const result = await linearService.unarchiveInitiative(args.initiativeId);
    console.log(`[unarchiveInitiative] Initiative unarchived successfully`);
    return result;
  };
}

export function deleteInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isDeleteInitiativeInput(args)) {
      throw new Error('Invalid input for deleteInitiative');
    }

    console.log(`[deleteInitiative] Deleting initiative: ${args.initiativeId}`);
    const result = await linearService.deleteInitiative(args.initiativeId);
    console.log(`[deleteInitiative] Initiative deleted successfully`);
    return result;
  };
}

export function getInitiativeProjectsHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isGetInitiativeProjectsInput(args)) {
      throw new Error('Invalid input for getInitiativeProjects');
    }

    console.log(`[getInitiativeProjects] Fetching projects for initiative: ${args.initiativeId}`);
    const projects = await linearService.getInitiativeProjects(
      args.initiativeId,
      args.includeArchived,
    );
    console.log(`[getInitiativeProjects] Retrieved ${projects.length} projects`);
    return projects;
  };
}

export function addProjectToInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isAddProjectToInitiativeInput(args)) {
      throw new Error('Invalid input for addProjectToInitiative');
    }

    console.log(
      `[addProjectToInitiative] Adding project ${args.projectId} to initiative ${args.initiativeId}`,
    );
    const result = await linearService.addProjectToInitiative(args.initiativeId, args.projectId);
    console.log(`[addProjectToInitiative] Project added successfully`);
    return result;
  };
}

export function removeProjectFromInitiativeHandler(linearService: LinearService) {
  return async (args: unknown) => {
    if (!isRemoveProjectFromInitiativeInput(args)) {
      throw new Error('Invalid input for removeProjectFromInitiative');
    }

    console.log(
      `[removeProjectFromInitiative] Removing project ${args.projectId} from initiative ${args.initiativeId}`,
    );
    const result = await linearService.removeProjectFromInitiative(
      args.initiativeId,
      args.projectId,
    );
    console.log(`[removeProjectFromInitiative] Project removed successfully`);
    return result;
  };
}
