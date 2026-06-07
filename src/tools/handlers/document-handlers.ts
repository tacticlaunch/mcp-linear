import { LinearService } from '../../services/linear-service.js';
import {
  isArchiveDocumentArgs,
  isCreateDocumentArgs,
  isGetCycleDocumentsArgs,
  isGetDocumentByIdArgs,
  isGetDocumentContentHistoryArgs,
  isGetDocumentsArgs,
  isGetInitiativeDocumentsArgs,
  isGetIssueDocumentsArgs,
  isGetProjectDocumentsArgs,
  isGetReleaseDocumentsArgs,
  isGetTeamDocumentsArgs,
  isGetTeamResourcesArgs,
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

export function handleGetInitiativeDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetInitiativeDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getInitiativeDocuments');
      }

      return await linearService.getInitiativeDocuments(args);
    } catch (error) {
      logError('Error getting initiative documents', error);
      throw error;
    }
  };
}

export function handleGetTeamDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetTeamDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getTeamDocuments');
      }

      return await linearService.getTeamDocuments(args);
    } catch (error) {
      logError('Error getting team documents', error);
      throw error;
    }
  };
}

export function handleGetIssueDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssueDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getIssueDocuments');
      }

      return await linearService.getIssueDocuments(args);
    } catch (error) {
      logError('Error getting issue documents', error);
      throw error;
    }
  };
}

export function handleGetReleaseDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetReleaseDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getReleaseDocuments');
      }

      return await linearService.getReleaseDocuments(args);
    } catch (error) {
      logError('Error getting release documents', error);
      throw error;
    }
  };
}

export function handleGetCycleDocuments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCycleDocumentsArgs(args)) {
        throw new Error('Invalid arguments for getCycleDocuments');
      }

      return await linearService.getCycleDocuments(args);
    } catch (error) {
      logError('Error getting cycle documents', error);
      throw error;
    }
  };
}

export function handleGetTeamResources(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetTeamResourcesArgs(args)) {
        throw new Error('Invalid arguments for getTeamResources');
      }

      return await linearService.getTeamResources(args.teamId);
    } catch (error) {
      logError('Error getting team resources', error);
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
