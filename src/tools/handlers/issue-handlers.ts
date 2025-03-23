import {
  isAddIssueLabelArgs,
  isArchiveIssueArgs,
  isAssignIssueArgs,
  isConvertIssueToSubtaskArgs,
  isCreateCommentArgs,
  isCreateIssueArgs,
  isCreateIssueRelationArgs,
  isDuplicateIssueArgs,
  isGetCommentsArgs,
  isGetIssueByIdArgs,
  isGetIssueHistoryArgs,
  isGetIssuesArgs,
  isRemoveIssueLabelArgs,
  isSearchIssuesArgs,
  isSetIssuePriorityArgs,
  isSubscribeToIssueArgs,
  isTransferIssueArgs,
  isUpdateIssueArgs,
} from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting issues
 */
export function handleGetIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssuesArgs(args)) {
        throw new Error('Invalid arguments for getIssues');
      }

      return await linearService.getIssues(args.limit);
    } catch (error) {
      logError('Error getting issues', error);
      throw error;
    }
  };
}

/**
 * Handler for getting issue by ID
 */
export function handleGetIssueById(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssueByIdArgs(args)) {
        throw new Error('Invalid arguments for getIssueById');
      }

      return await linearService.getIssueById(args.id);
    } catch (error) {
      logError('Error getting issue by ID', error);
      throw error;
    }
  };
}

/**
 * Handler for searching issues
 */
export function handleSearchIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      console.log('searchIssues args:', JSON.stringify(args, null, 2));

      if (!isSearchIssuesArgs(args)) {
        console.error('Invalid arguments for searchIssues');
        throw new Error('Invalid arguments for searchIssues');
      }

      console.log('Arguments validated successfully');
      return await linearService.searchIssues(args);
    } catch (error) {
      logError('Error searching issues', error);
      throw error;
    }
  };
}

/**
 * Handler for creating an issue
 */
export function handleCreateIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateIssueArgs(args)) {
        throw new Error('Invalid arguments for createIssue');
      }

      return await linearService.createIssue(args);
    } catch (error) {
      logError('Error creating issue', error);
      throw error;
    }
  };
}

/**
 * Handler for updating an issue
 */
export function handleUpdateIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateIssueArgs(args)) {
        throw new Error('Invalid arguments for updateIssue');
      }

      return await linearService.updateIssue(args);
    } catch (error) {
      logError('Error updating issue', error);
      throw error;
    }
  };
}

/**
 * Handler for creating a comment
 */
export function handleCreateComment(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateCommentArgs(args)) {
        throw new Error('Invalid arguments for createComment');
      }

      return await linearService.createComment(args);
    } catch (error) {
      logError('Error creating comment', error);
      throw error;
    }
  };
}

/**
 * Handler for adding a label to an issue
 */
export function handleAddIssueLabel(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueLabelArgs(args)) {
        throw new Error('Invalid arguments for addIssueLabel');
      }

      return await linearService.addIssueLabel(args.issueId, args.labelId);
    } catch (error) {
      logError('Error adding label to issue', error);
      throw error;
    }
  };
}

/**
 * Handler for removing a label from an issue
 */
export function handleRemoveIssueLabel(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveIssueLabelArgs(args)) {
        throw new Error('Invalid arguments for removeIssueLabel');
      }

      return await linearService.removeIssueLabel(args.issueId, args.labelId);
    } catch (error) {
      logError('Error removing label from issue', error);
      throw error;
    }
  };
}

/**
 * Handler for assigning an issue to a user
 */
export function handleAssignIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAssignIssueArgs(args)) {
        throw new Error('Invalid arguments for assignIssue');
      }

      return await linearService.assignIssue(args.issueId, args.assigneeId);
    } catch (error) {
      logError('Error assigning issue', error);
      throw error;
    }
  };
}

/**
 * Handler for subscribing to issue updates
 */
export function handleSubscribeToIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isSubscribeToIssueArgs(args)) {
        throw new Error('Invalid arguments for subscribeToIssue');
      }

      return await linearService.subscribeToIssue(args.issueId);
    } catch (error) {
      logError('Error subscribing to issue', error);
      throw error;
    }
  };
}

/**
 * Handler for converting an issue to a subtask
 */
export function handleConvertIssueToSubtask(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isConvertIssueToSubtaskArgs(args)) {
        throw new Error('Invalid arguments for convertIssueToSubtask');
      }

      return await linearService.convertIssueToSubtask(args.issueId, args.parentIssueId);
    } catch (error) {
      logError('Error converting issue to subtask', error);
      throw error;
    }
  };
}

/**
 * Handler for creating an issue relation
 */
export function handleCreateIssueRelation(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateIssueRelationArgs(args)) {
        throw new Error('Invalid arguments for createIssueRelation');
      }

      return await linearService.createIssueRelation(args.issueId, args.relatedIssueId, args.type);
    } catch (error) {
      logError('Error creating issue relation', error);
      throw error;
    }
  };
}

/**
 * Handler for archiving an issue
 */
export function handleArchiveIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isArchiveIssueArgs(args)) {
        throw new Error('Invalid arguments for archiveIssue');
      }

      return await linearService.archiveIssue(args.issueId);
    } catch (error) {
      logError('Error archiving issue', error);
      throw error;
    }
  };
}

/**
 * Handler for setting issue priority
 */
export function handleSetIssuePriority(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isSetIssuePriorityArgs(args)) {
        throw new Error('Invalid arguments for setIssuePriority');
      }

      return await linearService.setIssuePriority(args.issueId, args.priority);
    } catch (error) {
      logError('Error setting issue priority', error);
      throw error;
    }
  };
}

/**
 * Handler for transferring an issue
 */
export function handleTransferIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isTransferIssueArgs(args)) {
        throw new Error('Invalid arguments for transferIssue');
      }

      return await linearService.transferIssue(args.issueId, args.teamId);
    } catch (error) {
      logError('Error transferring issue', error);
      throw error;
    }
  };
}

/**
 * Handler for duplicating an issue
 */
export function handleDuplicateIssue(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isDuplicateIssueArgs(args)) {
        throw new Error('Invalid arguments for duplicateIssue');
      }

      return await linearService.duplicateIssue(args.issueId);
    } catch (error) {
      logError('Error duplicating issue', error);
      throw error;
    }
  };
}

/**
 * Handler for getting issue history
 */
export function handleGetIssueHistory(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetIssueHistoryArgs(args)) {
        throw new Error('Invalid arguments for getIssueHistory');
      }

      return await linearService.getIssueHistory(args.issueId, args.limit);
    } catch (error) {
      logError('Error getting issue history', error);
      throw error;
    }
  };
}

/**
 * Handler for getting comments for an issue
 */
export function handleGetComments(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCommentsArgs(args)) {
        throw new Error('Invalid arguments for getComments');
      }

      return await linearService.getComments(args.issueId, args.limit);
    } catch (error) {
      logError('Error getting comments for issue', error);
      throw error;
    }
  };
}
