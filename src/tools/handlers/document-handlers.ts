import { LinearService } from '../../services/linear-service.js';
import {
  isArchiveDocumentArgs,
  isCreateDocumentArgs,
  isGetDocumentByIdArgs,
  isGetDocumentContentHistoryArgs,
  isGetDocumentsArgs,
  isGetProjectDocumentsArgs,
  isSearchDocumentsArgs,
  isUnarchiveDocumentArgs,
  isUpdateDocumentArgs,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function handleGetDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getDocuments');
      }

      return await linearService.getDocuments(args);
    } catch (error) {
      logError('Error getting documents', error);
      throw error;
    }
  };
}

export function handleGetDocumentById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetDocumentByIdArgs(args)) {
        throw new Error('Invalid arguments for getDocumentById');
      }

      return await linearService.getDocumentById(args.id);
    } catch (error) {
      logError('Error getting document by ID', error);
      throw error;
    }
  };
}

export function handleGetProjectDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getProjectDocuments');
      }

      return await linearService.getProjectDocuments(args);
    } catch (error) {
      logError('Error getting project documents', error);
      throw error;
    }
  };
}

export function handleSearchDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isSearchDocumentsArgs(args)) {
        throw new Error('Invalid arguments for searchDocuments');
      }

      return await linearService.searchDocuments(args);
    } catch (error) {
      logError('Error searching documents', error);
      throw error;
    }
  };
}

export function handleGetDocumentContentHistory(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetDocumentContentHistoryArgs(args)) {
        throw new Error('Invalid arguments for getDocumentContentHistory');
      }

      return await linearService.getDocumentContentHistory(args.id);
    } catch (error) {
      logError('Error getting document content history', error);
      throw error;
    }
  };
}

export function handleCreateDocument(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateDocumentArgs(args)) {
        throw new Error('Invalid arguments for createDocument');
      }

      return await linearService.createDocument(args);
    } catch (error) {
      logError('Error creating document', error);
      throw error;
    }
  };
}

export function handleUpdateDocument(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateDocumentArgs(args)) {
        throw new Error('Invalid arguments for updateDocument');
      }

      return await linearService.updateDocument(args);
    } catch (error) {
      logError('Error updating document', error);
      throw error;
    }
  };
}

export function handleArchiveDocument(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveDocumentArgs(args)) {
        throw new Error('Invalid arguments for archiveDocument');
      }

      return await linearService.archiveDocument(args.id);
    } catch (error) {
      logError('Error archiving document', error);
      throw error;
    }
  };
}

export function handleUnarchiveDocument(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUnarchiveDocumentArgs(args)) {
        throw new Error('Invalid arguments for unarchiveDocument');
      }

      return await linearService.unarchiveDocument(args.id);
    } catch (error) {
      logError('Error unarchiving document', error);
      throw error;
    }
  };
}
