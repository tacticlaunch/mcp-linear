import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';
import {
  isCreateCustomerArgs,
  isCreateCustomerNeedArgs,
  isCreateCustomerNeedFromAttachmentArgs,
  isCustomerIdArgs,
  isCustomerListArgs,
  isCustomerMetadataListArgs,
  isCustomerNeedListArgs,
  isUpdateCustomerArgs,
  isUpdateCustomerNeedArgs,
} from '../type-guards.js';

export function handleGetCustomers(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerListArgs(args)) {
        throw new Error('Invalid arguments for getCustomers');
      }

      return await linearService.getCustomers(args);
    } catch (error) {
      logError('Error getting customers', error);
      throw error;
    }
  };
}

export function handleGetCustomerById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for getCustomerById');
      }

      return await linearService.getCustomerById(args.id);
    } catch (error) {
      logError('Error getting customer by ID', error);
      throw error;
    }
  };
}

export function handleCreateCustomer(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateCustomerArgs(args)) {
        throw new Error('Invalid arguments for createCustomer');
      }

      return await linearService.createCustomer(args);
    } catch (error) {
      logError('Error creating customer', error);
      throw error;
    }
  };
}

export function handleUpdateCustomer(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateCustomerArgs(args)) {
        throw new Error('Invalid arguments for updateCustomer');
      }

      return await linearService.updateCustomer(args);
    } catch (error) {
      logError('Error updating customer', error);
      throw error;
    }
  };
}

export function handleDeleteCustomer(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for deleteCustomer');
      }

      return await linearService.deleteCustomer(args.id);
    } catch (error) {
      logError('Error deleting customer', error);
      throw error;
    }
  };
}

export function handleGetCustomerNeeds(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerNeedListArgs(args)) {
        throw new Error('Invalid arguments for getCustomerNeeds');
      }

      return await linearService.getCustomerNeeds(args);
    } catch (error) {
      logError('Error getting customer needs', error);
      throw error;
    }
  };
}

export function handleGetCustomerNeedById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for getCustomerNeedById');
      }

      return await linearService.getCustomerNeedById(args.id);
    } catch (error) {
      logError('Error getting customer need by ID', error);
      throw error;
    }
  };
}

export function handleCreateCustomerNeed(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateCustomerNeedArgs(args)) {
        throw new Error('Invalid arguments for createCustomerNeed');
      }

      return await linearService.createCustomerNeed(args);
    } catch (error) {
      logError('Error creating customer need', error);
      throw error;
    }
  };
}

export function handleCreateCustomerNeedFromAttachment(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateCustomerNeedFromAttachmentArgs(args)) {
        throw new Error('Invalid arguments for createCustomerNeedFromAttachment');
      }

      return await linearService.createCustomerNeedFromAttachment(args);
    } catch (error) {
      logError('Error creating customer need from attachment', error);
      throw error;
    }
  };
}

export function handleUpdateCustomerNeed(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateCustomerNeedArgs(args)) {
        throw new Error('Invalid arguments for updateCustomerNeed');
      }

      return await linearService.updateCustomerNeed(args);
    } catch (error) {
      logError('Error updating customer need', error);
      throw error;
    }
  };
}

export function handleArchiveCustomerNeed(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for archiveCustomerNeed');
      }

      return await linearService.archiveCustomerNeed(args.id);
    } catch (error) {
      logError('Error archiving customer need', error);
      throw error;
    }
  };
}

export function handleUnarchiveCustomerNeed(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for unarchiveCustomerNeed');
      }

      return await linearService.unarchiveCustomerNeed(args.id);
    } catch (error) {
      logError('Error unarchiving customer need', error);
      throw error;
    }
  };
}

export function handleDeleteCustomerNeed(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerIdArgs(args)) {
        throw new Error('Invalid arguments for deleteCustomerNeed');
      }

      return await linearService.deleteCustomerNeed(args.id);
    } catch (error) {
      logError('Error deleting customer need', error);
      throw error;
    }
  };
}

export function handleGetCustomerStatuses(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerMetadataListArgs(args)) {
        throw new Error('Invalid arguments for getCustomerStatuses');
      }

      return await linearService.getCustomerStatuses(args);
    } catch (error) {
      logError('Error getting customer statuses', error);
      throw error;
    }
  };
}

export function handleGetCustomerTiers(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCustomerMetadataListArgs(args)) {
        throw new Error('Invalid arguments for getCustomerTiers');
      }

      return await linearService.getCustomerTiers(args);
    } catch (error) {
      logError('Error getting customer tiers', error);
      throw error;
    }
  };
}
