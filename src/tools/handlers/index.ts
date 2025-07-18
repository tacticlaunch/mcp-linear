import { LinearService } from '../../services/linear-service.js';
import {
  handleGetIssues,
  handleGetIssueById,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleCreateComment,
  handleAddIssueLabel,
  handleRemoveIssueLabel,
  // New Issue Management handlers
  handleAssignIssue,
  handleSubscribeToIssue,
  handleConvertIssueToSubtask,
  handleCreateIssueRelation,
  handleArchiveIssue,
  handleSetIssuePriority,
  handleTransferIssue,
  handleDuplicateIssue,
  handleGetIssueHistory,
  // Comment Management handlers
  handleGetComments,
} from './issue-handlers.js';
import {
  handleGetProjects,
  handleCreateProject,
  // Project Management handlers
  handleUpdateProject,
  handleAddIssueToProject,
  handleGetProjectIssues,
} from './project-handlers.js';
import { handleGetTeams, handleGetWorkflowStates } from './team-handlers.js';
import {
  handleGetViewer,
  handleGetOrganization,
  handleGetUsers,
  handleGetLabels,
} from './user-handlers.js';
import {
  // Cycle Management handlers
  handleGetCycles,
  handleGetActiveCycle,
  handleAddIssueToCycle,
} from './cycle-handlers.js';
import {
  // Initiative Management handlers
  getInitiativesHandler,
  getInitiativeByIdHandler,
  createInitiativeHandler,
  updateInitiativeHandler,
  archiveInitiativeHandler,
  unarchiveInitiativeHandler,
  deleteInitiativeHandler,
  getInitiativeProjectsHandler,
  addProjectToInitiativeHandler,
  removeProjectFromInitiativeHandler,
} from './initiative-handlers.js';

/**
 * Registers all tool handlers for the MCP Linear
 * @param linearService The Linear service instance
 * @returns A map of tool name to handler function
 */
export function registerToolHandlers(linearService: LinearService) {
  return {
    // User tools
    linear_getViewer: handleGetViewer(linearService),
    linear_getOrganization: handleGetOrganization(linearService),
    linear_getUsers: handleGetUsers(linearService),
    linear_getLabels: handleGetLabels(linearService),

    // Team tools
    linear_getTeams: handleGetTeams(linearService),
    linear_getWorkflowStates: handleGetWorkflowStates(linearService),

    // Project tools
    linear_getProjects: handleGetProjects(linearService),
    linear_createProject: handleCreateProject(linearService),

    // Project Management tools
    linear_updateProject: handleUpdateProject(linearService),
    linear_addIssueToProject: handleAddIssueToProject(linearService),
    linear_getProjectIssues: handleGetProjectIssues(linearService),

    // Cycle Management tools
    linear_getCycles: handleGetCycles(linearService),
    linear_getActiveCycle: handleGetActiveCycle(linearService),
    linear_addIssueToCycle: handleAddIssueToCycle(linearService),

    // Initiative Management tools
    linear_getInitiatives: getInitiativesHandler(linearService),
    linear_getInitiativeById: getInitiativeByIdHandler(linearService),
    linear_createInitiative: createInitiativeHandler(linearService),
    linear_updateInitiative: updateInitiativeHandler(linearService),
    linear_archiveInitiative: archiveInitiativeHandler(linearService),
    linear_unarchiveInitiative: unarchiveInitiativeHandler(linearService),
    linear_deleteInitiative: deleteInitiativeHandler(linearService),
    linear_getInitiativeProjects: getInitiativeProjectsHandler(linearService),
    linear_addProjectToInitiative: addProjectToInitiativeHandler(linearService),
    linear_removeProjectFromInitiative: removeProjectFromInitiativeHandler(linearService),

    // Issue tools
    linear_getIssues: handleGetIssues(linearService),
    linear_getIssueById: handleGetIssueById(linearService),
    linear_searchIssues: handleSearchIssues(linearService),
    linear_createIssue: handleCreateIssue(linearService),
    linear_updateIssue: handleUpdateIssue(linearService),
    linear_createComment: handleCreateComment(linearService),
    linear_addIssueLabel: handleAddIssueLabel(linearService),
    linear_removeIssueLabel: handleRemoveIssueLabel(linearService),

    // New Issue Management tools
    linear_assignIssue: handleAssignIssue(linearService),
    linear_subscribeToIssue: handleSubscribeToIssue(linearService),
    linear_convertIssueToSubtask: handleConvertIssueToSubtask(linearService),
    linear_createIssueRelation: handleCreateIssueRelation(linearService),
    linear_archiveIssue: handleArchiveIssue(linearService),
    linear_setIssuePriority: handleSetIssuePriority(linearService),
    linear_transferIssue: handleTransferIssue(linearService),
    linear_duplicateIssue: handleDuplicateIssue(linearService),
    linear_getIssueHistory: handleGetIssueHistory(linearService),

    // Comment Management tools
    linear_getComments: handleGetComments(linearService),
  };
}

// Export all handlers individually
export {
  handleGetIssues,
  handleGetIssueById,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleCreateComment,
  handleAddIssueLabel,
  handleRemoveIssueLabel,
  handleGetProjects,
  handleCreateProject,
  handleGetTeams,
  handleGetWorkflowStates,
  handleGetViewer,
  handleGetOrganization,
  handleGetUsers,
  handleGetLabels,

  // New Issue Management handlers
  handleAssignIssue,
  handleSubscribeToIssue,
  handleConvertIssueToSubtask,
  handleCreateIssueRelation,
  handleArchiveIssue,
  handleSetIssuePriority,
  handleTransferIssue,
  handleDuplicateIssue,
  handleGetIssueHistory,

  // Comment Management handlers
  handleGetComments,

  // Project Management handlers
  handleUpdateProject,
  handleAddIssueToProject,
  handleGetProjectIssues,

  // Cycle Management handlers
  handleGetCycles,
  handleGetActiveCycle,
  handleAddIssueToCycle,

  // Initiative Management handlers
  getInitiativesHandler,
  getInitiativeByIdHandler,
  createInitiativeHandler,
  updateInitiativeHandler,
  archiveInitiativeHandler,
  unarchiveInitiativeHandler,
  deleteInitiativeHandler,
  getInitiativeProjectsHandler,
  addProjectToInitiativeHandler,
  removeProjectFromInitiativeHandler,
};
