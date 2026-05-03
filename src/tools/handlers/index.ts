import { LinearService } from '../../services/linear-service.js';
import {
  handleGetIssues,
  handleGetIssueById,
  handleGetCustomFields,
  handleGetIssueCustomFields,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleUpdateIssueCustomField,
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
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
  handleCreateProjectUpdate,
  handleUpdateProjectUpdate,
  handleGetProjectUpdates,
  handleArchiveProject,
  handleAddIssueToProject,
  handleRemoveIssueFromProject,
  handleGetProjectIssues,
  handleGetProjectMembers,
  handleAddProjectMember,
  handleRemoveProjectMember,
} from './project-handlers.js';
import {
  handleArchiveRoadmap,
  handleCreateRoadmap,
  handleGetRoadmapById,
  handleGetRoadmaps,
  handleUpdateRoadmap,
} from './roadmap-handlers.js';
import {
  handleAddIssueToRelease,
  handleArchiveRelease,
  handleArchiveReleasePipeline,
  handleArchiveReleaseStage,
  handleCompleteRelease,
  handleCreateRelease,
  handleCreateReleaseNote,
  handleCreateReleasePipeline,
  handleCreateReleaseStage,
  handleDeleteReleaseNote,
  handleDeleteReleasePipeline,
  handleGetReleaseById,
  handleGetReleaseNoteById,
  handleGetReleaseNotes,
  handleGetReleasePipelineById,
  handleGetReleasePipelines,
  handleGetReleaseStages,
  handleGetReleases,
  handleRemoveIssueFromRelease,
  handleSearchReleases,
  handleUnarchiveRelease,
  handleUnarchiveReleasePipeline,
  handleUnarchiveReleaseStage,
  handleUpdateRelease,
  handleUpdateReleaseNote,
  handleUpdateReleasePipeline,
  handleUpdateReleaseStage,
} from './release-handlers.js';
import {
  handleArchiveMilestone,
  handleCreateMilestone,
  handleGetMilestoneById,
  handleGetMilestones,
  handleUpdateMilestone,
} from './milestone-handlers.js';
import {
  handleArchiveDocument,
  handleCreateDocument,
  handleGetDocumentById,
  handleGetDocumentContentHistory,
  handleGetDocuments,
  handleGetProjectDocuments,
  handleSearchDocuments,
  handleUnarchiveDocument,
  handleUpdateDocument,
} from './document-handlers.js';
import { handleGetRateLimitStatus, handleGetServerStatus } from './server-handlers.js';
import {
  handleGetWebhooks,
  handleCreateWebhook,
  handleDeleteWebhook,
  handleGetAttachments,
  handleAddAttachment,
  handleGetNotifications,
  handleMarkNotificationAsRead,
  handleGetSubscriptions,
  handleMarkAllNotificationsAsRead,
  handleGetUnreadNotificationCount,
  handleGetAuthenticationSessions,
  handleLogoutSession,
  handleLogoutOtherSessions,
  handleLogoutAllSessions,
  handleGetOrganizationAuditEvents,
  handleGetUserAuditEvents,
  handleGetIntegrations,
} from './ops-handlers.js';
import {
  handleAddToFavorites,
  handleCreateSavedView,
  handleDeleteSavedView,
  handleGetFavoriteViews,
  handleGetSavedViews,
  handleRemoveFromFavorites,
  handleUpdateSavedView,
} from './view-handlers.js';
import {
  handleGetTeams,
  handleGetWorkflowStates,
  handleCreateWorkflowState,
  handleUpdateWorkflowState,
  handleUpdateTeam,
  handleGetTeamMemberships,
  handleCreateTeam,
  handleArchiveTeam,
  handleAddUserToTeam,
  handleRemoveUserFromTeam,
  handleUpdateTeamMembership,
  handleGetTeamLabels,
  handleCreateTeamLabel,
} from './team-handlers.js';
import {
  handleGetViewer,
  handleGetOrganization,
  handleGetUsers,
  handleGetLabels,
} from './user-handlers.js';
import {
  // Cycle Management handlers
  handleGetCycles,
  handleGetCycleById,
  handleCreateCycle,
  handleUpdateCycle,
  handleCompleteCycle,
  handleGetCycleStats,
  handleGetActiveCycle,
  handleGetCycleIssues,
  handleAddIssueToCycle,
  handleRemoveIssueFromCycle,
} from './cycle-handlers.js';
import {
  handleGetIssueTemplates,
  handleGetIssueTemplateById,
  handleCreateIssueTemplate,
  handleUpdateIssueTemplate,
  handleCreateIssueFromTemplate,
  handleGetTeamTemplates,
  handleArchiveTemplate,
} from './template-handlers.js';
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
type RegisterToolHandlerOptions = {
  getRateLimitStatus?: () => unknown | Promise<unknown>;
  getServerStatus?: () => unknown | Promise<unknown>;
};

export function registerToolHandlers(
  linearService: LinearService,
  options: RegisterToolHandlerOptions = {},
) {
  return {
    // Server tools
    linear_getRateLimitStatus: handleGetRateLimitStatus(options.getRateLimitStatus),
    linear_getServerStatus: handleGetServerStatus(options.getServerStatus),

    // Ops tools
    linear_getWebhooks: handleGetWebhooks(linearService),
    linear_createWebhook: handleCreateWebhook(linearService),
    linear_deleteWebhook: handleDeleteWebhook(linearService),
    linear_getAttachments: handleGetAttachments(linearService),
    linear_addAttachment: handleAddAttachment(linearService),
    linear_getNotifications: handleGetNotifications(linearService),
    linear_markNotificationAsRead: handleMarkNotificationAsRead(linearService),
    linear_getSubscriptions: handleGetSubscriptions(linearService),
    linear_markAllNotificationsAsRead: handleMarkAllNotificationsAsRead(linearService),
    linear_getUnreadNotificationCount: handleGetUnreadNotificationCount(linearService),
    linear_getAuthenticationSessions: handleGetAuthenticationSessions(linearService),
    linear_logoutSession: handleLogoutSession(linearService),
    linear_logoutOtherSessions: handleLogoutOtherSessions(linearService),
    linear_logoutAllSessions: handleLogoutAllSessions(linearService),
    linear_getOrganizationAuditEvents: handleGetOrganizationAuditEvents(linearService),
    linear_getUserAuditEvents: handleGetUserAuditEvents(linearService),
    linear_getIntegrations: handleGetIntegrations(linearService),

    // User tools
    linear_getViewer: handleGetViewer(linearService),
    linear_getOrganization: handleGetOrganization(linearService),
    linear_getUsers: handleGetUsers(linearService),
    linear_getLabels: handleGetLabels(linearService),

    // Team tools
    linear_getTeams: handleGetTeams(linearService),
    linear_getWorkflowStates: handleGetWorkflowStates(linearService),
    linear_createWorkflowState: handleCreateWorkflowState(linearService),
    linear_updateWorkflowState: handleUpdateWorkflowState(linearService),
    linear_updateTeam: handleUpdateTeam(linearService),
    linear_getTeamMemberships: handleGetTeamMemberships(linearService),
    linear_createTeam: handleCreateTeam(linearService),
    linear_archiveTeam: handleArchiveTeam(linearService),
    linear_addUserToTeam: handleAddUserToTeam(linearService),
    linear_removeUserFromTeam: handleRemoveUserFromTeam(linearService),
    linear_updateTeamMembership: handleUpdateTeamMembership(linearService),
    linear_getTeamLabels: handleGetTeamLabels(linearService),
    linear_createTeamLabel: handleCreateTeamLabel(linearService),

    // Project tools
    linear_getProjects: handleGetProjects(linearService),
    linear_createProject: handleCreateProject(linearService),

    // Project Management tools
    linear_updateProject: handleUpdateProject(linearService),
    linear_getProjectMembers: handleGetProjectMembers(linearService),
    linear_addProjectMember: handleAddProjectMember(linearService),
    linear_removeProjectMember: handleRemoveProjectMember(linearService),
    linear_createProjectUpdate: handleCreateProjectUpdate(linearService),
    linear_updateProjectUpdate: handleUpdateProjectUpdate(linearService),
    linear_getProjectUpdates: handleGetProjectUpdates(linearService),
    linear_archiveProject: handleArchiveProject(linearService),
    linear_addIssueToProject: handleAddIssueToProject(linearService),
    linear_removeIssueFromProject: handleRemoveIssueFromProject(linearService),
    linear_getProjectIssues: handleGetProjectIssues(linearService),

    // Roadmap tools
    linear_getRoadmaps: handleGetRoadmaps(linearService),
    linear_getRoadmapById: handleGetRoadmapById(linearService),
    linear_createRoadmap: handleCreateRoadmap(linearService),
    linear_updateRoadmap: handleUpdateRoadmap(linearService),
    linear_archiveRoadmap: handleArchiveRoadmap(linearService),

    // Release tools
    linear_getReleasePipelines: handleGetReleasePipelines(linearService),
    linear_getReleasePipelineById: handleGetReleasePipelineById(linearService),
    linear_createReleasePipeline: handleCreateReleasePipeline(linearService),
    linear_updateReleasePipeline: handleUpdateReleasePipeline(linearService),
    linear_archiveReleasePipeline: handleArchiveReleasePipeline(linearService),
    linear_unarchiveReleasePipeline: handleUnarchiveReleasePipeline(linearService),
    linear_deleteReleasePipeline: handleDeleteReleasePipeline(linearService),
    linear_getReleases: handleGetReleases(linearService),
    linear_getReleaseById: handleGetReleaseById(linearService),
    linear_searchReleases: handleSearchReleases(linearService),
    linear_getReleaseStages: handleGetReleaseStages(linearService),
    linear_createReleaseStage: handleCreateReleaseStage(linearService),
    linear_updateReleaseStage: handleUpdateReleaseStage(linearService),
    linear_archiveReleaseStage: handleArchiveReleaseStage(linearService),
    linear_unarchiveReleaseStage: handleUnarchiveReleaseStage(linearService),
    linear_getReleaseNotes: handleGetReleaseNotes(linearService),
    linear_getReleaseNoteById: handleGetReleaseNoteById(linearService),
    linear_createRelease: handleCreateRelease(linearService),
    linear_updateRelease: handleUpdateRelease(linearService),
    linear_completeRelease: handleCompleteRelease(linearService),
    linear_archiveRelease: handleArchiveRelease(linearService),
    linear_unarchiveRelease: handleUnarchiveRelease(linearService),
    linear_addIssueToRelease: handleAddIssueToRelease(linearService),
    linear_removeIssueFromRelease: handleRemoveIssueFromRelease(linearService),
    linear_createReleaseNote: handleCreateReleaseNote(linearService),
    linear_updateReleaseNote: handleUpdateReleaseNote(linearService),
    linear_deleteReleaseNote: handleDeleteReleaseNote(linearService),

    // Milestone tools
    linear_getMilestones: handleGetMilestones(linearService),
    linear_getMilestoneById: handleGetMilestoneById(linearService),
    linear_createMilestone: handleCreateMilestone(linearService),
    linear_updateMilestone: handleUpdateMilestone(linearService),
    linear_archiveMilestone: handleArchiveMilestone(linearService),

    // Document tools
    linear_getDocuments: handleGetDocuments(linearService),
    linear_getDocumentById: handleGetDocumentById(linearService),
    linear_getProjectDocuments: handleGetProjectDocuments(linearService),
    linear_searchDocuments: handleSearchDocuments(linearService),
    linear_getDocumentContentHistory: handleGetDocumentContentHistory(linearService),
    linear_createDocument: handleCreateDocument(linearService),
    linear_updateDocument: handleUpdateDocument(linearService),
    linear_archiveDocument: handleArchiveDocument(linearService),
    linear_unarchiveDocument: handleUnarchiveDocument(linearService),

    // View tools
    linear_getSavedViews: handleGetSavedViews(linearService),
    linear_createSavedView: handleCreateSavedView(linearService),
    linear_updateSavedView: handleUpdateSavedView(linearService),
    linear_deleteSavedView: handleDeleteSavedView(linearService),
    linear_getFavoriteViews: handleGetFavoriteViews(linearService),
    linear_addToFavorites: handleAddToFavorites(linearService),
    linear_removeFromFavorites: handleRemoveFromFavorites(linearService),

    // Cycle Management tools
    linear_getCycles: handleGetCycles(linearService),
    linear_getCycleById: handleGetCycleById(linearService),
    linear_createCycle: handleCreateCycle(linearService),
    linear_updateCycle: handleUpdateCycle(linearService),
    linear_completeCycle: handleCompleteCycle(linearService),
    linear_getCycleStats: handleGetCycleStats(linearService),
    linear_getActiveCycle: handleGetActiveCycle(linearService),
    linear_getCycleIssues: handleGetCycleIssues(linearService),
    linear_addIssueToCycle: handleAddIssueToCycle(linearService),
    linear_removeIssueFromCycle: handleRemoveIssueFromCycle(linearService),

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
    linear_getCustomFields: handleGetCustomFields(linearService),
    linear_getIssueCustomFields: handleGetIssueCustomFields(linearService),
    linear_searchIssues: handleSearchIssues(linearService),
    linear_createIssue: handleCreateIssue(linearService),
    linear_updateIssue: handleUpdateIssue(linearService),
    linear_updateIssueCustomField: handleUpdateIssueCustomField(linearService),
    linear_createComment: handleCreateComment(linearService),
    linear_updateComment: handleUpdateComment(linearService),
    linear_deleteComment: handleDeleteComment(linearService),
    linear_addIssueLabel: handleAddIssueLabel(linearService),
    linear_removeIssueLabel: handleRemoveIssueLabel(linearService),

    // Template tools
    linear_getIssueTemplates: handleGetIssueTemplates(linearService),
    linear_getIssueTemplateById: handleGetIssueTemplateById(linearService),
    linear_createIssueTemplate: handleCreateIssueTemplate(linearService),
    linear_updateIssueTemplate: handleUpdateIssueTemplate(linearService),
    linear_createIssueFromTemplate: handleCreateIssueFromTemplate(linearService),
    linear_getTeamTemplates: handleGetTeamTemplates(linearService),
    linear_archiveTemplate: handleArchiveTemplate(linearService),

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
  handleGetCustomFields,
  handleGetIssueCustomFields,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleUpdateIssueCustomField,
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleAddIssueLabel,
  handleRemoveIssueLabel,
  handleGetProjects,
  handleCreateProject,
  handleGetTeams,
  handleGetWorkflowStates,
  handleCreateWorkflowState,
  handleUpdateWorkflowState,
  handleUpdateTeam,
  handleGetTeamMemberships,
  handleCreateTeam,
  handleArchiveTeam,
  handleAddUserToTeam,
  handleRemoveUserFromTeam,
  handleUpdateTeamMembership,
  handleGetTeamLabels,
  handleCreateTeamLabel,
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

  // Roadmap handlers
  handleGetRoadmaps,
  handleGetRoadmapById,
  handleCreateRoadmap,
  handleUpdateRoadmap,
  handleArchiveRoadmap,

  // Project Management handlers
  handleUpdateProject,
  handleCreateProjectUpdate,
  handleUpdateProjectUpdate,
  handleGetProjectUpdates,
  handleArchiveProject,
  handleAddIssueToProject,
  handleRemoveIssueFromProject,
  handleGetProjectIssues,
  handleGetProjectMembers,
  handleAddProjectMember,
  handleRemoveProjectMember,

  // Milestone handlers
  handleGetMilestones,
  handleGetMilestoneById,
  handleCreateMilestone,
  handleUpdateMilestone,
  handleArchiveMilestone,

  // Document handlers
  handleGetDocuments,
  handleGetDocumentById,
  handleGetProjectDocuments,
  handleSearchDocuments,
  handleGetDocumentContentHistory,
  handleCreateDocument,
  handleUpdateDocument,
  handleArchiveDocument,
  handleUnarchiveDocument,

  // Server handlers
  handleGetRateLimitStatus,
  handleGetServerStatus,
  handleGetWebhooks,
  handleCreateWebhook,
  handleDeleteWebhook,
  handleGetAttachments,
  handleAddAttachment,
  handleGetNotifications,
  handleMarkNotificationAsRead,
  handleGetSubscriptions,
  handleMarkAllNotificationsAsRead,
  handleGetUnreadNotificationCount,
  handleGetAuthenticationSessions,
  handleLogoutSession,
  handleLogoutOtherSessions,
  handleLogoutAllSessions,
  handleGetOrganizationAuditEvents,
  handleGetUserAuditEvents,
  handleGetIntegrations,

  // View handlers
  handleGetSavedViews,
  handleCreateSavedView,
  handleUpdateSavedView,
  handleDeleteSavedView,
  handleGetFavoriteViews,
  handleAddToFavorites,
  handleRemoveFromFavorites,

  // Cycle Management handlers
  handleGetCycles,
  handleGetCycleById,
  handleCreateCycle,
  handleUpdateCycle,
  handleCompleteCycle,
  handleGetCycleStats,
  handleGetActiveCycle,
  handleGetCycleIssues,
  handleAddIssueToCycle,
  handleRemoveIssueFromCycle,

  // Template handlers
  handleGetIssueTemplates,
  handleGetIssueTemplateById,
  handleCreateIssueTemplate,
  handleUpdateIssueTemplate,
  handleCreateIssueFromTemplate,
  handleGetTeamTemplates,
  handleArchiveTemplate,

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
