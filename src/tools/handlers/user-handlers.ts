import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting viewer information
 */
export function handleGetViewer(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getUserInfo();
    } catch (error) {
      logError('Error getting viewer information', error);
      throw error;
    }
  };
}

/**
 * Handler for getting organization information
 */
export function handleGetOrganization(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getOrganizationInfo();
    } catch (error) {
      logError('Error getting organization information', error);
      throw error;
    }
  };
}

/**
 * Handler for getting users
 */
export function handleGetUsers(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getAllUsers();
    } catch (error) {
      logError('Error getting users', error);
      throw error;
    }
  };
}

/**
 * Handler for getting labels
 */
export function handleGetLabels(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getLabels();
    } catch (error) {
      logError('Error getting labels', error);
      throw error;
    }
  };
}
