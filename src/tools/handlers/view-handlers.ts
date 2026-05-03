import { LinearService } from '../../services/linear-service.js';
import {
  isAddToFavoritesArgs,
  isCreateSavedViewArgs,
  isDeleteSavedViewArgs,
  isGetFavoriteViewsArgs,
  isGetSavedViewsArgs,
  isRemoveFromFavoritesArgs,
  isUpdateSavedViewArgs,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function handleGetSavedViews(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetSavedViewsArgs(args)) {
        throw new Error('Invalid arguments for getSavedViews');
      }

      return await linearService.getSavedViews(args);
    } catch (error) {
      logError('Error getting saved views', error);
      throw error;
    }
  };
}

export function handleCreateSavedView(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateSavedViewArgs(args)) {
        throw new Error('Invalid arguments for createSavedView');
      }

      return await linearService.createSavedView(args);
    } catch (error) {
      logError('Error creating saved view', error);
      throw error;
    }
  };
}

export function handleUpdateSavedView(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateSavedViewArgs(args)) {
        throw new Error('Invalid arguments for updateSavedView');
      }

      return await linearService.updateSavedView(args);
    } catch (error) {
      logError('Error updating saved view', error);
      throw error;
    }
  };
}

export function handleDeleteSavedView(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDeleteSavedViewArgs(args)) {
        throw new Error('Invalid arguments for deleteSavedView');
      }

      return await linearService.deleteSavedView(args.id);
    } catch (error) {
      logError('Error deleting saved view', error);
      throw error;
    }
  };
}

export function handleGetFavoriteViews(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetFavoriteViewsArgs(args)) {
        throw new Error('Invalid arguments for getFavoriteViews');
      }

      return await linearService.getFavoriteViews(args);
    } catch (error) {
      logError('Error getting favorite views', error);
      throw error;
    }
  };
}

export function handleAddToFavorites(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddToFavoritesArgs(args)) {
        throw new Error('Invalid arguments for addToFavorites');
      }

      return await linearService.addToFavorites(args);
    } catch (error) {
      logError('Error adding item to favorites', error);
      throw error;
    }
  };
}

export function handleRemoveFromFavorites(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveFromFavoritesArgs(args)) {
        throw new Error('Invalid arguments for removeFromFavorites');
      }

      return await linearService.removeFromFavorites(args);
    } catch (error) {
      logError('Error removing item from favorites', error);
      throw error;
    }
  };
}
