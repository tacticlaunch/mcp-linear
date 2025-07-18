import { MCPToolDefinition } from '../../types.js';
import {
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
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
  addIssueToProjectToolDefinition,
  getProjectIssuesToolDefinition,
} from './project-tools.js';
import { getTeamsToolDefinition, getWorkflowStatesToolDefinition } from './team-tools.js';
import {
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,
} from './user-tools.js';
import {
  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,
} from './cycle-tools.js';
import { initiativeToolDefinitions } from './initiative-tools.js';

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

  // Project tools
  getProjectsToolDefinition,
  createProjectToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  addIssueToProjectToolDefinition,
  getProjectIssuesToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,

  // Initiative Management tools
  ...initiativeToolDefinitions,

  // Issue tools
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
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
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  getProjectsToolDefinition,
  createProjectToolDefinition,
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,

  // Comment Management tools
  getCommentsToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  addIssueToProjectToolDefinition,
  getProjectIssuesToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,
};
