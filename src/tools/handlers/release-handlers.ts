import { LinearService } from '../../services/linear-service.js';
import {
  isAddIssueToReleaseArgs,
  isArchiveReleaseArgs,
  isArchiveReleasePipelineArgs,
  isArchiveReleaseStageArgs,
  isCompleteReleaseArgs,
  isCreateReleaseArgs,
  isCreateReleaseNoteArgs,
  isCreateReleasePipelineArgs,
  isCreateReleaseStageArgs,
  isDeleteReleaseNoteArgs,
  isDeleteReleasePipelineArgs,
  isGetReleaseByIdArgs,
  isGetReleaseNoteByIdArgs,
  isGetReleaseNotesArgs,
  isGetReleasePipelineByIdArgs,
  isGetReleasePipelinesArgs,
  isGetReleaseStagesArgs,
  isGetReleasesArgs,
  isRemoveIssueFromReleaseArgs,
  isSearchReleasesArgs,
  isUnarchiveReleasePipelineArgs,
  isUnarchiveReleaseArgs,
  isUnarchiveReleaseStageArgs,
  isUpdateReleaseArgs,
  isUpdateReleaseNoteArgs,
  isUpdateReleasePipelineArgs,
  isUpdateReleaseStageArgs,
} from '../type-guards.js';
import { logError } from '../../utils/config.js';

export function handleGetReleasePipelines(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isGetReleasePipelinesArgs(args)) {
        throw new Error('Invalid arguments for getReleasePipelines');
      }

      return await linearService.getReleasePipelines(args === null ? undefined : args);
    } catch (error) {
      logError('Error getting release pipelines', error);
      throw error;
    }
  };
}

export function handleGetReleasePipelineById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetReleasePipelineByIdArgs(args)) {
        throw new Error('Invalid arguments for getReleasePipelineById');
      }

      return await linearService.getReleasePipelineById(args.id);
    } catch (error) {
      logError('Error getting release pipeline by ID', error);
      throw error;
    }
  };
}

export function handleCreateReleasePipeline(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateReleasePipelineArgs(args)) {
        throw new Error('Invalid arguments for createReleasePipeline');
      }

      return await linearService.createReleasePipeline(args);
    } catch (error) {
      logError('Error creating release pipeline', error);
      throw error;
    }
  };
}

export function handleUpdateReleasePipeline(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateReleasePipelineArgs(args)) {
        throw new Error('Invalid arguments for updateReleasePipeline');
      }

      return await linearService.updateReleasePipeline(args);
    } catch (error) {
      logError('Error updating release pipeline', error);
      throw error;
    }
  };
}

export function handleArchiveReleasePipeline(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveReleasePipelineArgs(args)) {
        throw new Error('Invalid arguments for archiveReleasePipeline');
      }

      return await linearService.archiveReleasePipeline(args.pipelineId);
    } catch (error) {
      logError('Error archiving release pipeline', error);
      throw error;
    }
  };
}

export function handleUnarchiveReleasePipeline(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUnarchiveReleasePipelineArgs(args)) {
        throw new Error('Invalid arguments for unarchiveReleasePipeline');
      }

      return await linearService.unarchiveReleasePipeline(args.pipelineId);
    } catch (error) {
      logError('Error unarchiving release pipeline', error);
      throw error;
    }
  };
}

export function handleDeleteReleasePipeline(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDeleteReleasePipelineArgs(args)) {
        throw new Error('Invalid arguments for deleteReleasePipeline');
      }

      return await linearService.deleteReleasePipeline(args.pipelineId);
    } catch (error) {
      logError('Error deleting release pipeline', error);
      throw error;
    }
  };
}

export function handleGetReleases(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isGetReleasesArgs(args)) {
        throw new Error('Invalid arguments for getReleases');
      }

      return await linearService.getReleases(args === null ? undefined : args);
    } catch (error) {
      logError('Error getting releases', error);
      throw error;
    }
  };
}

export function handleGetReleaseById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetReleaseByIdArgs(args)) {
        throw new Error('Invalid arguments for getReleaseById');
      }

      return await linearService.getReleaseById(args.id);
    } catch (error) {
      logError('Error getting release by ID', error);
      throw error;
    }
  };
}

export function handleSearchReleases(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isSearchReleasesArgs(args)) {
        throw new Error('Invalid arguments for searchReleases');
      }

      return await linearService.searchReleases(args === null ? undefined : args);
    } catch (error) {
      logError('Error searching releases', error);
      throw error;
    }
  };
}

export function handleGetReleaseStages(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isGetReleaseStagesArgs(args)) {
        throw new Error('Invalid arguments for getReleaseStages');
      }

      return await linearService.getReleaseStages(args === null ? undefined : args);
    } catch (error) {
      logError('Error getting release stages', error);
      throw error;
    }
  };
}

export function handleCreateReleaseStage(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateReleaseStageArgs(args)) {
        throw new Error('Invalid arguments for createReleaseStage');
      }

      return await linearService.createReleaseStage(args);
    } catch (error) {
      logError('Error creating release stage', error);
      throw error;
    }
  };
}

export function handleUpdateReleaseStage(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateReleaseStageArgs(args)) {
        throw new Error('Invalid arguments for updateReleaseStage');
      }

      return await linearService.updateReleaseStage(args);
    } catch (error) {
      logError('Error updating release stage', error);
      throw error;
    }
  };
}

export function handleArchiveReleaseStage(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveReleaseStageArgs(args)) {
        throw new Error('Invalid arguments for archiveReleaseStage');
      }

      return await linearService.archiveReleaseStage(args.stageId);
    } catch (error) {
      logError('Error archiving release stage', error);
      throw error;
    }
  };
}

export function handleUnarchiveReleaseStage(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUnarchiveReleaseStageArgs(args)) {
        throw new Error('Invalid arguments for unarchiveReleaseStage');
      }

      return await linearService.unarchiveReleaseStage(args.stageId);
    } catch (error) {
      logError('Error unarchiving release stage', error);
      throw error;
    }
  };
}

export function handleGetReleaseNotes(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (args != null && !isGetReleaseNotesArgs(args)) {
        throw new Error('Invalid arguments for getReleaseNotes');
      }

      return await linearService.getReleaseNotes(args === null ? undefined : args);
    } catch (error) {
      logError('Error getting release notes', error);
      throw error;
    }
  };
}

export function handleGetReleaseNoteById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetReleaseNoteByIdArgs(args)) {
        throw new Error('Invalid arguments for getReleaseNoteById');
      }

      return await linearService.getReleaseNoteById(args.id);
    } catch (error) {
      logError('Error getting release note by ID', error);
      throw error;
    }
  };
}

export function handleCreateRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateReleaseArgs(args)) {
        throw new Error('Invalid arguments for createRelease');
      }

      return await linearService.createRelease(args);
    } catch (error) {
      logError('Error creating release', error);
      throw error;
    }
  };
}

export function handleUpdateRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateReleaseArgs(args)) {
        throw new Error('Invalid arguments for updateRelease');
      }

      return await linearService.updateRelease(args);
    } catch (error) {
      logError('Error updating release', error);
      throw error;
    }
  };
}

export function handleCompleteRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCompleteReleaseArgs(args)) {
        throw new Error('Invalid arguments for completeRelease');
      }

      return await linearService.completeRelease(args);
    } catch (error) {
      logError('Error completing release', error);
      throw error;
    }
  };
}

export function handleArchiveRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveReleaseArgs(args)) {
        throw new Error('Invalid arguments for archiveRelease');
      }

      return await linearService.archiveRelease(args.releaseId);
    } catch (error) {
      logError('Error archiving release', error);
      throw error;
    }
  };
}

export function handleUnarchiveRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUnarchiveReleaseArgs(args)) {
        throw new Error('Invalid arguments for unarchiveRelease');
      }

      return await linearService.unarchiveRelease(args.releaseId);
    } catch (error) {
      logError('Error unarchiving release', error);
      throw error;
    }
  };
}

export function handleAddIssueToRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueToReleaseArgs(args)) {
        throw new Error('Invalid arguments for addIssueToRelease');
      }

      return await linearService.addIssueToRelease(args);
    } catch (error) {
      logError('Error adding issue to release', error);
      throw error;
    }
  };
}

export function handleRemoveIssueFromRelease(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveIssueFromReleaseArgs(args)) {
        throw new Error('Invalid arguments for removeIssueFromRelease');
      }

      return await linearService.removeIssueFromRelease(args);
    } catch (error) {
      logError('Error removing issue from release', error);
      throw error;
    }
  };
}

export function handleCreateReleaseNote(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateReleaseNoteArgs(args)) {
        throw new Error('Invalid arguments for createReleaseNote');
      }

      return await linearService.createReleaseNote(args);
    } catch (error) {
      logError('Error creating release note', error);
      throw error;
    }
  };
}

export function handleUpdateReleaseNote(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateReleaseNoteArgs(args)) {
        throw new Error('Invalid arguments for updateReleaseNote');
      }

      return await linearService.updateReleaseNote(args);
    } catch (error) {
      logError('Error updating release note', error);
      throw error;
    }
  };
}

export function handleDeleteReleaseNote(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDeleteReleaseNoteArgs(args)) {
        throw new Error('Invalid arguments for deleteReleaseNote');
      }

      return await linearService.deleteReleaseNote(args.id);
    } catch (error) {
      logError('Error deleting release note', error);
      throw error;
    }
  };
}
