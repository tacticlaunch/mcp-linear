import { MCPToolDefinition } from '../../types.js';
import {
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  updateCommentToolDefinition,
  deleteCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  deleteIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,
  // Comment Management tools
  getCommentsToolDefinition,
} from './issue-tools.js';
import {
  getProjectsToolDefinition,
  createProjectToolDefinition,
  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdateByIdToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectUpdateToolDefinition,
  unarchiveProjectUpdateToolDefinition,
  deleteProjectUpdateToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,
  getProjectMembersToolDefinition,
  addProjectMemberToolDefinition,
  removeProjectMemberToolDefinition,
  getProjectByIdToolDefinition,
} from './project-tools.js';
import {
  archiveRoadmapToolDefinition,
  createRoadmapToolDefinition,
  getRoadmapByIdToolDefinition,
  getRoadmapsToolDefinition,
  roadmapToolDefinitions,
  updateRoadmapToolDefinition,
} from './roadmap-tools.js';
import { releaseToolDefinitions } from './release-tools.js';
import {
  archiveMilestoneToolDefinition,
  createMilestoneToolDefinition,
  getMilestoneByIdToolDefinition,
  getMilestonesToolDefinition,
  updateMilestoneToolDefinition,
} from './milestone-tools.js';
import {
  archiveDocumentToolDefinition,
  createDocumentToolDefinition,
  getCycleDocumentsToolDefinition,
  getDocumentByIdToolDefinition,
  getDocumentContentHistoryToolDefinition,
  getDocumentsToolDefinition,
  getInitiativeDocumentsToolDefinition,
  getIssueDocumentsToolDefinition,
  getProjectDocumentsToolDefinition,
  getReleaseDocumentsToolDefinition,
  getTeamDocumentsToolDefinition,
  getTeamResourcesToolDefinition,
  searchDocumentsToolDefinition,
  unarchiveDocumentToolDefinition,
  updateDocumentToolDefinition,
} from './document-tools.js';
import { getRateLimitStatusToolDefinition, getServerStatusToolDefinition } from './server-tools.js';
import {
  getWebhooksToolDefinition,
  createWebhookToolDefinition,
  deleteWebhookToolDefinition,
  getAttachmentsToolDefinition,
  addAttachmentToolDefinition,
  getNotificationsToolDefinition,
  markNotificationAsReadToolDefinition,
  getSubscriptionsToolDefinition,
  markAllNotificationsAsReadToolDefinition,
  getUnreadNotificationCountToolDefinition,
  getAuthenticationSessionsToolDefinition,
  logoutSessionToolDefinition,
  logoutOtherSessionsToolDefinition,
  logoutAllSessionsToolDefinition,
  getOrganizationAuditEventsToolDefinition,
  getUserAuditEventsToolDefinition,
  getIntegrationsToolDefinition,
} from './ops-tools.js';
import {
  addToFavoritesToolDefinition,
  createSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,
  getSavedViewsToolDefinition,
  removeFromFavoritesToolDefinition,
  updateSavedViewToolDefinition,
} from './view-tools.js';
import {
  getIssueTemplatesToolDefinition,
  getIssueTemplateByIdToolDefinition,
  createIssueTemplateToolDefinition,
  updateIssueTemplateToolDefinition,
  createIssueFromTemplateToolDefinition,
  getTeamTemplatesToolDefinition,
  archiveTemplateToolDefinition,
} from './template-tools.js';
import {
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,
  createWorkflowStateToolDefinition,
  updateWorkflowStateToolDefinition,
  updateTeamToolDefinition,
  getTeamMembershipsToolDefinition,
  createTeamToolDefinition,
  archiveTeamToolDefinition,
  addUserToTeamToolDefinition,
  removeUserFromTeamToolDefinition,
  updateTeamMembershipToolDefinition,
  getTeamLabelsToolDefinition,
  createTeamLabelToolDefinition,
} from './team-tools.js';
import {
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,
} from './user-tools.js';
import {
  // Cycle Management tools
  getCyclesToolDefinition,
  getCycleByIdToolDefinition,
  createCycleToolDefinition,
  updateCycleToolDefinition,
  completeCycleToolDefinition,
  getCycleStatsToolDefinition,
  getActiveCycleToolDefinition,
  getCycleIssuesToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,
} from './cycle-tools.js';
import { initiativeToolDefinitions } from './initiative-tools.js';
import { customerToolDefinitions } from './customer-tools.js';

// All tool definitions
export const allToolDefinitions: MCPToolDefinition[] = [
  // User tools
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,

  // Team tools
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,
  createWorkflowStateToolDefinition,
  updateWorkflowStateToolDefinition,
  updateTeamToolDefinition,
  getTeamMembershipsToolDefinition,
  createTeamToolDefinition,
  archiveTeamToolDefinition,
  addUserToTeamToolDefinition,
  removeUserFromTeamToolDefinition,
  updateTeamMembershipToolDefinition,
  getTeamLabelsToolDefinition,
  createTeamLabelToolDefinition,

  // Project tools
  getProjectsToolDefinition,
  getProjectByIdToolDefinition,
  createProjectToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdateByIdToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectUpdateToolDefinition,
  unarchiveProjectUpdateToolDefinition,
  deleteProjectUpdateToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,
  getProjectMembersToolDefinition,
  addProjectMemberToolDefinition,
  removeProjectMemberToolDefinition,

  // Roadmap tools
  ...roadmapToolDefinitions,

  // Release tools
  ...releaseToolDefinitions,

  // Milestone tools
  getMilestonesToolDefinition,
  getMilestoneByIdToolDefinition,
  createMilestoneToolDefinition,
  updateMilestoneToolDefinition,
  archiveMilestoneToolDefinition,

  // Document tools
  getDocumentsToolDefinition,
  getDocumentByIdToolDefinition,
  getProjectDocumentsToolDefinition,
  getInitiativeDocumentsToolDefinition,
  getTeamDocumentsToolDefinition,
  getIssueDocumentsToolDefinition,
  getReleaseDocumentsToolDefinition,
  getCycleDocumentsToolDefinition,
  getTeamResourcesToolDefinition,
  searchDocumentsToolDefinition,
  getDocumentContentHistoryToolDefinition,
  createDocumentToolDefinition,
  updateDocumentToolDefinition,
  archiveDocumentToolDefinition,
  unarchiveDocumentToolDefinition,

  // Server tools
  getRateLimitStatusToolDefinition,
  getServerStatusToolDefinition,

  // Ops tools
  getWebhooksToolDefinition,
  createWebhookToolDefinition,
  deleteWebhookToolDefinition,
  getAttachmentsToolDefinition,
  addAttachmentToolDefinition,
  getNotificationsToolDefinition,
  markNotificationAsReadToolDefinition,
  getSubscriptionsToolDefinition,
  markAllNotificationsAsReadToolDefinition,
  getUnreadNotificationCountToolDefinition,
  getAuthenticationSessionsToolDefinition,
  logoutSessionToolDefinition,
  logoutOtherSessionsToolDefinition,
  logoutAllSessionsToolDefinition,
  getOrganizationAuditEventsToolDefinition,
  getUserAuditEventsToolDefinition,
  getIntegrationsToolDefinition,

  // View tools
  getSavedViewsToolDefinition,
  createSavedViewToolDefinition,
  updateSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,
  addToFavoritesToolDefinition,
  removeFromFavoritesToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getCycleByIdToolDefinition,
  createCycleToolDefinition,
  updateCycleToolDefinition,
  completeCycleToolDefinition,
  getCycleStatsToolDefinition,
  getActiveCycleToolDefinition,
  getCycleIssuesToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,

  // Initiative Management tools
  ...initiativeToolDefinitions,

  // Customer tools
  ...customerToolDefinitions,

  // Issue tools
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  updateCommentToolDefinition,
  deleteCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,

  // Template tools
  getIssueTemplatesToolDefinition,
  getIssueTemplateByIdToolDefinition,
  createIssueTemplateToolDefinition,
  updateIssueTemplateToolDefinition,
  createIssueFromTemplateToolDefinition,
  getTeamTemplatesToolDefinition,
  archiveTemplateToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  deleteIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,

  // Comment Management tools
  getCommentsToolDefinition,
];

// Export all tool definitions individually
export {
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  updateCommentToolDefinition,
  deleteCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  getProjectsToolDefinition,
  getProjectByIdToolDefinition,
  createProjectToolDefinition,
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,
  createWorkflowStateToolDefinition,
  updateWorkflowStateToolDefinition,
  updateTeamToolDefinition,
  getTeamMembershipsToolDefinition,
  createTeamToolDefinition,
  archiveTeamToolDefinition,
  addUserToTeamToolDefinition,
  removeUserFromTeamToolDefinition,
  updateTeamMembershipToolDefinition,
  getTeamLabelsToolDefinition,
  createTeamLabelToolDefinition,
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  deleteIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,

  // Comment Management tools
  getCommentsToolDefinition,

  // Roadmap tools
  getRoadmapsToolDefinition,
  getRoadmapByIdToolDefinition,
  createRoadmapToolDefinition,
  updateRoadmapToolDefinition,
  archiveRoadmapToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdateByIdToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectUpdateToolDefinition,
  unarchiveProjectUpdateToolDefinition,
  deleteProjectUpdateToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,
  getProjectMembersToolDefinition,
  addProjectMemberToolDefinition,
  removeProjectMemberToolDefinition,

  // Milestone tools
  getMilestonesToolDefinition,
  getMilestoneByIdToolDefinition,
  createMilestoneToolDefinition,
  updateMilestoneToolDefinition,
  archiveMilestoneToolDefinition,

  // Document tools
  getDocumentsToolDefinition,
  getDocumentByIdToolDefinition,
  getProjectDocumentsToolDefinition,
  getInitiativeDocumentsToolDefinition,
  getTeamDocumentsToolDefinition,
  getIssueDocumentsToolDefinition,
  getReleaseDocumentsToolDefinition,
  getCycleDocumentsToolDefinition,
  getTeamResourcesToolDefinition,
  searchDocumentsToolDefinition,
  getDocumentContentHistoryToolDefinition,
  createDocumentToolDefinition,
  updateDocumentToolDefinition,
  archiveDocumentToolDefinition,
  unarchiveDocumentToolDefinition,

  // Server tools
  getRateLimitStatusToolDefinition,
  getServerStatusToolDefinition,
  getWebhooksToolDefinition,
  createWebhookToolDefinition,
  deleteWebhookToolDefinition,
  getAttachmentsToolDefinition,
  addAttachmentToolDefinition,
  getNotificationsToolDefinition,
  markNotificationAsReadToolDefinition,
  getSubscriptionsToolDefinition,
  markAllNotificationsAsReadToolDefinition,
  getUnreadNotificationCountToolDefinition,
  getAuthenticationSessionsToolDefinition,
  logoutSessionToolDefinition,
  logoutOtherSessionsToolDefinition,
  logoutAllSessionsToolDefinition,
  getOrganizationAuditEventsToolDefinition,
  getUserAuditEventsToolDefinition,
  getIntegrationsToolDefinition,

  // View tools
  getSavedViewsToolDefinition,
  createSavedViewToolDefinition,
  updateSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,
  addToFavoritesToolDefinition,
  removeFromFavoritesToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getCycleByIdToolDefinition,
  createCycleToolDefinition,
  updateCycleToolDefinition,
  completeCycleToolDefinition,
  getCycleStatsToolDefinition,
  getActiveCycleToolDefinition,
  getCycleIssuesToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,
};
