import { LinearService } from './linear-service.js';
import { CacheManager, TTL } from './cache.js';
import { logInfo } from '../utils/config.js';

/**
 * Cached wrapper around LinearService.
 *
 * - All read methods check cache first (with resource-appropriate TTLs)
 * - All write methods invalidate related cache entries
 * - Cache is in-memory (lives as long as the MCP server process)
 * - Zero external dependencies
 *
 * Enable/disable via LINEAR_CACHE_ENABLED env var (default: true).
 * Configure max entries via LINEAR_CACHE_MAX_SIZE env var (default: 500).
 */
export class CachedLinearService extends LinearService {
  private cacheManager: CacheManager;

  constructor(client: any, cacheEnabled = true, maxSize = 500) {
    super(client);
    this.cacheManager = new CacheManager(maxSize, cacheEnabled);
    if (cacheEnabled) {
      logInfo('Cache layer enabled (in-memory TTL cache)');
    }
  }

  // ── Read methods (cached) ──────────────────────────────────────────

  override async getUserInfo() {
    const key = CacheManager.key('getUserInfo');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getUserInfo']>>>(key);
    if (cached) return cached;

    const result = await super.getUserInfo();
    this.cacheManager.set(key, result, TTL.VIEWER);
    return result;
  }

  override async getOrganizationInfo() {
    const key = CacheManager.key('getOrganizationInfo');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getOrganizationInfo']>>>(key);
    if (cached) return cached;

    const result = await super.getOrganizationInfo();
    this.cacheManager.set(key, result, TTL.ORGANIZATION);
    return result;
  }

  override async getAllUsers() {
    const key = CacheManager.key('getAllUsers');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getAllUsers']>>>(key);
    if (cached) return cached;

    const result = await super.getAllUsers();
    this.cacheManager.set(key, result, TTL.USERS);
    return result;
  }

  override async getLabels() {
    const key = CacheManager.key('getLabels');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getLabels']>>>(key);
    if (cached) return cached;

    const result = await super.getLabels();
    this.cacheManager.set(key, result, TTL.LABELS);
    return result;
  }

  override async getTeams() {
    const key = CacheManager.key('getTeams');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getTeams']>>>(key);
    if (cached) return cached;

    const result = await super.getTeams();
    this.cacheManager.set(key, result, TTL.TEAMS);
    return result;
  }

  override async getProjects() {
    const key = CacheManager.key('getProjects');
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getProjects']>>>(key);
    if (cached) return cached;

    const result = await super.getProjects();
    this.cacheManager.set(key, result, TTL.PROJECTS);
    return result;
  }

  override async getIssues(limit = 25) {
    const key = CacheManager.key('getIssues', limit);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getIssues']>>>(key);
    if (cached) return cached;

    const result = await super.getIssues(limit);
    this.cacheManager.set(key, result, TTL.ISSUE_LIST);
    return result;
  }

  override async getIssueById(id: string) {
    const key = CacheManager.key('getIssueById', id);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getIssueById']>>>(key);
    if (cached) return cached;

    const result = await super.getIssueById(id);
    this.cacheManager.set(key, result, TTL.ISSUE_SINGLE);
    return result;
  }

  override async searchIssues(args: Parameters<LinearService['searchIssues']>[0]) {
    const key = CacheManager.key('searchIssues', args);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['searchIssues']>>>(key);
    if (cached) return cached;

    const result = await super.searchIssues(args);
    this.cacheManager.set(key, result, TTL.SEARCH);
    return result;
  }

  override async getWorkflowStates(teamId: string, includeArchived = false) {
    const key = CacheManager.key('getWorkflowStates', teamId, includeArchived);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getWorkflowStates']>>>(key);
    if (cached) return cached;

    const result = await super.getWorkflowStates(teamId, includeArchived);
    this.cacheManager.set(key, result, TTL.WORKFLOW_STATES);
    return result;
  }

  override async getCycles(teamId?: string, limit = 25) {
    const key = CacheManager.key('getCycles', teamId, limit);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getCycles']>>>(key);
    if (cached) return cached;

    const result = await super.getCycles(teamId, limit);
    this.cacheManager.set(key, result, TTL.CYCLES);
    return result;
  }

  override async getActiveCycle(teamId: string) {
    const key = CacheManager.key('getActiveCycle', teamId);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getActiveCycle']>>>(key);
    if (cached) return cached;

    const result = await super.getActiveCycle(teamId);
    this.cacheManager.set(key, result, TTL.CYCLES);
    return result;
  }

  override async getComments(issueId: string, limit = 25) {
    const key = CacheManager.key('getComments', issueId, limit);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getComments']>>>(key);
    if (cached) return cached;

    const result = await super.getComments(issueId, limit);
    this.cacheManager.set(key, result, TTL.ISSUE_SINGLE);
    return result;
  }

  override async getProjectIssues(projectId: string, limit = 25) {
    const key = CacheManager.key('getProjectIssues', projectId, limit);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getProjectIssues']>>>(key);
    if (cached) return cached;

    const result = await super.getProjectIssues(projectId, limit);
    this.cacheManager.set(key, result, TTL.ISSUE_LIST);
    return result;
  }

  override async getIssueHistory(issueId: string, limit = 10) {
    const key = CacheManager.key('getIssueHistory', issueId, limit);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getIssueHistory']>>>(key);
    if (cached) return cached;

    const result = await super.getIssueHistory(issueId, limit);
    this.cacheManager.set(key, result, TTL.ISSUE_SINGLE);
    return result;
  }

  override async getInitiatives(args: Parameters<LinearService['getInitiatives']>[0] = {}) {
    const key = CacheManager.key('getInitiatives', args);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getInitiatives']>>>(key);
    if (cached) return cached;

    const result = await super.getInitiatives(args);
    this.cacheManager.set(key, result, TTL.INITIATIVES);
    return result;
  }

  override async getInitiativeById(id: string, includeProjects = true) {
    const key = CacheManager.key('getInitiativeById', id, includeProjects);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getInitiativeById']>>>(key);
    if (cached) return cached;

    const result = await super.getInitiativeById(id, includeProjects);
    this.cacheManager.set(key, result, TTL.INITIATIVES);
    return result;
  }

  override async getInitiativeProjects(initiativeId: string, includeArchived = false) {
    const key = CacheManager.key('getInitiativeProjects', initiativeId, includeArchived);
    const cached = this.cacheManager.get<Awaited<ReturnType<LinearService['getInitiativeProjects']>>>(key);
    if (cached) return cached;

    const result = await super.getInitiativeProjects(initiativeId, includeArchived);
    this.cacheManager.set(key, result, TTL.INITIATIVES);
    return result;
  }

  // ── Write methods (invalidate cache) ───────────────────────────────

  override async createIssue(args: Parameters<LinearService['createIssue']>[0]) {
    const result = await super.createIssue(args);
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    this.cacheManager.invalidate('getProjectIssues');
    return result;
  }

  override async updateIssue(args: Parameters<LinearService['updateIssue']>[0]) {
    const result = await super.updateIssue(args);
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getProjectIssues');
    this.cacheManager.invalidate('getComments');
    return result;
  }

  override async createComment(args: Parameters<LinearService['createComment']>[0]) {
    const result = await super.createComment(args);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getComments');
    return result;
  }

  override async addIssueLabel(issueId: string, labelId: string) {
    const result = await super.addIssueLabel(issueId, labelId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    return result;
  }

  override async removeIssueLabel(issueId: string, labelId: string) {
    const result = await super.removeIssueLabel(issueId, labelId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    return result;
  }

  override async assignIssue(issueId: string, assigneeId: string) {
    const result = await super.assignIssue(issueId, assigneeId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    return result;
  }

  override async convertIssueToSubtask(issueId: string, parentIssueId: string) {
    const result = await super.convertIssueToSubtask(issueId, parentIssueId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    return result;
  }

  override async createIssueRelation(issueId: string, relatedIssueId: string, relationType: string) {
    const result = await super.createIssueRelation(issueId, relatedIssueId, relationType);
    this.cacheManager.invalidate('getIssueById');
    return result;
  }

  override async archiveIssue(issueId: string) {
    const result = await super.archiveIssue(issueId);
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('searchIssues');
    this.cacheManager.invalidate('getProjectIssues');
    return result;
  }

  override async setIssuePriority(issueId: string, priority: number) {
    const result = await super.setIssuePriority(issueId, priority);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    return result;
  }

  override async transferIssue(issueId: string, teamId: string) {
    const result = await super.transferIssue(issueId, teamId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    return result;
  }

  override async duplicateIssue(issueId: string) {
    const result = await super.duplicateIssue(issueId);
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('searchIssues');
    return result;
  }

  override async addIssueToCycle(issueId: string, cycleId: string) {
    const result = await super.addIssueToCycle(issueId, cycleId);
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getCycles');
    this.cacheManager.invalidate('getActiveCycle');
    return result;
  }

  override async createProject(args: Parameters<LinearService['createProject']>[0]) {
    const result = await super.createProject(args);
    this.cacheManager.invalidate('getProjects');
    return result;
  }

  override async updateProject(args: Parameters<LinearService['updateProject']>[0]) {
    const result = await super.updateProject(args);
    this.cacheManager.invalidate('getProjects');
    return result;
  }

  override async addIssueToProject(issueId: string, projectId: string) {
    const result = await super.addIssueToProject(issueId, projectId);
    this.cacheManager.invalidate('getIssueById');
    this.cacheManager.invalidate('getIssues');
    this.cacheManager.invalidate('getProjectIssues');
    return result;
  }

  override async archiveProject(projectId: string) {
    const result = await super.archiveProject(projectId);
    this.cacheManager.invalidate('getProjects');
    return result;
  }

  override async createInitiative(args: Parameters<LinearService['createInitiative']>[0]) {
    const result = await super.createInitiative(args);
    this.cacheManager.invalidate('getInitiatives');
    return result;
  }

  override async updateInitiative(
    initiativeId: string,
    updateData: Parameters<LinearService['updateInitiative']>[1],
  ) {
    const result = await super.updateInitiative(initiativeId, updateData);
    this.cacheManager.invalidate('getInitiatives');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  override async archiveInitiative(id: string) {
    const result = await super.archiveInitiative(id);
    this.cacheManager.invalidate('getInitiatives');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  override async unarchiveInitiative(id: string) {
    const result = await super.unarchiveInitiative(id);
    this.cacheManager.invalidate('getInitiatives');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  override async deleteInitiative(id: string) {
    const result = await super.deleteInitiative(id);
    this.cacheManager.invalidate('getInitiatives');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  override async addProjectToInitiative(initiativeId: string, projectId: string, sortOrder?: number) {
    const result = await super.addProjectToInitiative(initiativeId, projectId, sortOrder);
    this.cacheManager.invalidate('getInitiativeProjects');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  override async removeProjectFromInitiative(initiativeId: string, projectId: string) {
    const result = await super.removeProjectFromInitiative(initiativeId, projectId);
    this.cacheManager.invalidate('getInitiativeProjects');
    this.cacheManager.invalidate('getInitiativeById');
    return result;
  }

  // ── Cache management ───────────────────────────────────────────────

  /** Get cache statistics */
  getCacheStats() {
    return this.cacheManager.getStats();
  }

  /** Clear entire cache */
  clearCache() {
    this.cacheManager.clear();
    return { success: true, message: 'Cache cleared' };
  }
}
