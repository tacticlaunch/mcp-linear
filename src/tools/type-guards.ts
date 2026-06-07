type JSONGuardValue =
  | null
  | string
  | number
  | boolean
  | JSONGuardValue[]
  | { [key: string]: JSONGuardValue };

/**
 * Type guard for linear_getIssues tool arguments
 */
export function isGetIssuesArgs(args: unknown): args is { limit?: number } {
  return (
    typeof args === 'object' &&
    args !== null &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
  );
}

/**
 * Type guard for linear_getIssueById tool arguments
 */
export function isGetIssueByIdArgs(args: unknown): args is { id: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isJSONValue(value: unknown): value is JSONGuardValue {
  if (value === null) {
    return true;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every((item) => isJSONValue(item));
  }

  if (!isPlainObject(value)) {
    return false;
  }

  return Object.values(value).every((item) => isJSONValue(item));
}

/**
 * Type guard for linear_getCustomFields tool arguments
 */
export function isGetCustomFieldsArgs(
  args: unknown,
): args is Record<string, never> | undefined {
  return args === undefined || (isPlainObject(args) && Object.keys(args).length === 0);
}

/**
 * Type guard for linear_getIssueCustomFields tool arguments
 */
export function isGetIssueCustomFieldsArgs(args: unknown): args is { issueId: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string'
  );
}

/**
 * Type guard for linear_updateIssueCustomField tool arguments
 */
export function isUpdateIssueCustomFieldArgs(args: unknown): args is {
  issueId: string;
  customFieldId: string;
  value: JSONGuardValue;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'customFieldId' in args &&
    typeof (args as { customFieldId: string }).customFieldId === 'string' &&
    'value' in args &&
    isJSONValue((args as { value: unknown }).value)
  );
}

/**
 * Type guard for linear_searchIssues tool arguments
 */
export function isSearchIssuesArgs(args: unknown): args is {
  query?: string;
  teamId?: string;
  assigneeId?: string;
  projectId?: string;
  states?: string[];
  limit?: number;
} {
  // Check if args is an object
  if (typeof args !== 'object' || args === null) {
    console.error('searchIssues args is not an object or is null');
    return false;
  }

  // Check query
  if ('query' in args && typeof (args as { query: unknown }).query !== 'string') {
    console.error('searchIssues query is not a string');
    return false;
  }

  // Check teamId
  if ('teamId' in args && typeof (args as { teamId: unknown }).teamId !== 'string') {
    console.error('searchIssues teamId is not a string');
    return false;
  }

  // Check assigneeId
  if ('assigneeId' in args && typeof (args as { assigneeId: unknown }).assigneeId !== 'string') {
    console.error('searchIssues assigneeId is not a string');
    return false;
  }

  // Check projectId
  if ('projectId' in args && typeof (args as { projectId: unknown }).projectId !== 'string') {
    console.error('searchIssues projectId is not a string');
    return false;
  }

  // Check states
  if ('states' in args) {
    const states = (args as { states: unknown }).states;
    if (!Array.isArray(states)) {
      console.error('searchIssues states is not an array');
      return false;
    }

    // Check that all elements in the array are strings
    for (let i = 0; i < states.length; i++) {
      if (typeof states[i] !== 'string') {
        console.error(`searchIssues states[${i}] is not a string`);
        return false;
      }
    }
  }

  // Check limit
  if ('limit' in args && typeof (args as { limit: unknown }).limit !== 'number') {
    console.error('searchIssues limit is not a number');
    return false;
  }

  return true;
}

/**
 * Type guard for linear_createIssue tool arguments
 */
export function isCreateIssueArgs(args: unknown): args is {
  title: string;
  description?: string;
  teamId: string;
  assigneeId?: string;
  priority?: number;
  projectId?: string;
  projectMilestoneId?: string;
  cycleId?: string;
  estimate?: number;
  dueDate?: string;
  labelIds?: string[];
  parentId?: string;
  subscriberIds?: string[];
  stateId?: string;
  templateId?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'title' in args &&
    typeof (args as { title: string }).title === 'string' &&
    'teamId' in args &&
    typeof (args as { teamId: string }).teamId === 'string' &&
    (!('assigneeId' in args) || typeof (args as { assigneeId: string }).assigneeId === 'string') &&
    (!('priority' in args) || typeof (args as { priority: number }).priority === 'number') &&
    (!('projectId' in args) || typeof (args as { projectId: string }).projectId === 'string') &&
    (!('projectMilestoneId' in args) ||
      typeof (args as { projectMilestoneId: string }).projectMilestoneId === 'string') &&
    (!('cycleId' in args) || typeof (args as { cycleId: string }).cycleId === 'string') &&
    (!('estimate' in args) || typeof (args as { estimate: number }).estimate === 'number') &&
    (!('dueDate' in args) || typeof (args as { dueDate: string }).dueDate === 'string') &&
    (!('labelIds' in args) || Array.isArray((args as { labelIds: string[] }).labelIds)) &&
    (!('parentId' in args) || typeof (args as { parentId: string }).parentId === 'string') &&
    (!('subscriberIds' in args) ||
      Array.isArray((args as { subscriberIds: string[] }).subscriberIds)) &&
    (!('stateId' in args) || typeof (args as { stateId: string }).stateId === 'string') &&
    (!('templateId' in args) || typeof (args as { templateId: string }).templateId === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_updateIssue tool arguments
 */
export function isUpdateIssueArgs(args: unknown): args is {
  id: string;
  title?: string;
  description?: string;
  stateId?: string;
  priority?: number;
  projectId?: string;
  projectMilestoneId?: string;
  assigneeId?: string;
  cycleId?: string;
  estimate?: number;
  dueDate?: string;
  labelIds?: string[];
  addedLabelIds?: string[];
  removedLabelIds?: string[];
  parentId?: string;
  subscriberIds?: string[];
  teamId?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    (!('title' in args) || typeof (args as { title: string }).title === 'string') &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('stateId' in args) || typeof (args as { stateId: string }).stateId === 'string') &&
    (!('priority' in args) || typeof (args as { priority: number }).priority === 'number') &&
    (!('projectId' in args) || typeof (args as { projectId: string }).projectId === 'string') &&
    (!('projectMilestoneId' in args) ||
      typeof (args as { projectMilestoneId: string }).projectMilestoneId === 'string') &&
    (!('assigneeId' in args) || typeof (args as { assigneeId: string }).assigneeId === 'string') &&
    (!('cycleId' in args) || typeof (args as { cycleId: string }).cycleId === 'string') &&
    (!('estimate' in args) || typeof (args as { estimate: number }).estimate === 'number') &&
    (!('dueDate' in args) || typeof (args as { dueDate: string }).dueDate === 'string') &&
    (!('labelIds' in args) || Array.isArray((args as { labelIds: string[] }).labelIds)) &&
    (!('addedLabelIds' in args) ||
      Array.isArray((args as { addedLabelIds: string[] }).addedLabelIds)) &&
    (!('removedLabelIds' in args) ||
      Array.isArray((args as { removedLabelIds: string[] }).removedLabelIds)) &&
    (!('parentId' in args) || typeof (args as { parentId: string }).parentId === 'string') &&
    (!('subscriberIds' in args) ||
      Array.isArray((args as { subscriberIds: string[] }).subscriberIds)) &&
    (!('teamId' in args) || typeof (args as { teamId: string }).teamId === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_createComment tool arguments
 */
export function isCreateCommentArgs(args: unknown): args is {
  issueId?: string;
  projectId?: string;
  initiativeId?: string;
  projectUpdateId?: string;
  initiativeUpdateId?: string;
  documentContentId?: string;
  postId?: string;
  body: string;
  parentId?: string;
  quotedText?: string;
  subscriberIds?: string[];
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const targetKeys = [
    'issueId',
    'projectId',
    'initiativeId',
    'projectUpdateId',
    'initiativeUpdateId',
    'documentContentId',
    'postId',
  ];
  const targetCount = targetKeys.filter((key) => key in args && args[key] !== undefined).length;

  return (
    'body' in args &&
    typeof (args as { body: unknown }).body === 'string' &&
    (targetCount === 1 || ('parentId' in args && typeof (args as { parentId: unknown }).parentId === 'string')) &&
    targetCount <= 1 &&
    targetKeys.every((key) => !(key in args) || typeof args[key] === 'string') &&
    (!('parentId' in args) || typeof (args as { parentId: unknown }).parentId === 'string') &&
    (!('quotedText' in args) || typeof (args as { quotedText: unknown }).quotedText === 'string') &&
    (!('subscriberIds' in args) || isStringArray((args as { subscriberIds: unknown }).subscriberIds))
  );
}

export function isUpdateCommentArgs(args: unknown): args is {
  id: string;
  body?: string;
  quotedText?: string;
  resolvingCommentId?: string;
  resolvingUserId?: string;
  subscriberIds?: string[];
  doNotSubscribeToIssue?: boolean;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = ['body', 'quotedText', 'resolvingCommentId', 'resolvingUserId', 'subscriberIds', 'doNotSubscribeToIssue']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('body' in args) || typeof (args as { body: unknown }).body === 'string') &&
    (!('quotedText' in args) || typeof (args as { quotedText: unknown }).quotedText === 'string') &&
    (!('resolvingCommentId' in args) ||
      typeof (args as { resolvingCommentId: unknown }).resolvingCommentId === 'string') &&
    (!('resolvingUserId' in args) ||
      typeof (args as { resolvingUserId: unknown }).resolvingUserId === 'string') &&
    (!('subscriberIds' in args) || isStringArray((args as { subscriberIds: unknown }).subscriberIds)) &&
    (!('doNotSubscribeToIssue' in args) ||
      typeof (args as { doNotSubscribeToIssue: unknown }).doNotSubscribeToIssue === 'boolean')
  );
}

export function isDeleteCommentArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

/**
 * Type guard for linear_createProject tool arguments
 */
export function isGetProjectByIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isCreateProjectArgs(args: unknown): args is {
  name: string;
  description?: string;
  content?: string;
  teamIds: string[];
  state?: string;
  startDate?: string;
  targetDate?: string;
  leadId?: string;
  memberIds?: string[];
  sortOrder?: number;
  icon?: string;
  color?: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    'teamIds' in args &&
    isStringArray((args as { teamIds: unknown }).teamIds) &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: unknown }).content === 'string') &&
    (!('state' in args) || typeof (args as { state: unknown }).state === 'string') &&
    (!('startDate' in args) || typeof (args as { startDate: unknown }).startDate === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: unknown }).targetDate === 'string') &&
    (!('leadId' in args) || typeof (args as { leadId: unknown }).leadId === 'string') &&
    (!('memberIds' in args) || isStringArray((args as { memberIds: unknown }).memberIds)) &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number') &&
    (!('icon' in args) || typeof (args as { icon: unknown }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string')
  );
}

/**
 * Type guard for linear_addIssueLabel tool arguments
 */
export function isAddIssueLabelArgs(args: unknown): args is {
  issueId: string;
  labelId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'labelId' in args &&
    typeof (args as { labelId: string }).labelId === 'string'
  );
}

/**
 * Type guard for linear_removeIssueLabel tool arguments
 */
export function isRemoveIssueLabelArgs(args: unknown): args is {
  issueId: string;
  labelId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'labelId' in args &&
    typeof (args as { labelId: string }).labelId === 'string'
  );
}

/**
 * Type guard for linear_assignIssue tool arguments
 */
export function isAssignIssueArgs(args: unknown): args is {
  issueId: string;
  assigneeId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'assigneeId' in args &&
    typeof (args as { assigneeId: string }).assigneeId === 'string'
  );
}

/**
 * Type guard for linear_subscribeToIssue tool arguments
 */
export function isSubscribeToIssueArgs(args: unknown): args is {
  issueId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string'
  );
}

/**
 * Type guard for linear_convertIssueToSubtask tool arguments
 */
export function isConvertIssueToSubtaskArgs(args: unknown): args is {
  issueId: string;
  parentIssueId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'parentIssueId' in args &&
    typeof (args as { parentIssueId: string }).parentIssueId === 'string'
  );
}

/**
 * Type guard for linear_createIssueRelation tool arguments
 */
export function isCreateIssueRelationArgs(args: unknown): args is {
  issueId: string;
  relatedIssueId: string;
  type: 'blocks' | 'blocked_by' | 'related' | 'duplicate' | 'duplicate_of';
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'relatedIssueId' in args &&
    typeof (args as { relatedIssueId: string }).relatedIssueId === 'string' &&
    'type' in args &&
    typeof (args as { type: string }).type === 'string' &&
    ['blocks', 'blocked_by', 'related', 'duplicate', 'duplicate_of'].includes(
      (args as { type: string }).type,
    )
  );
}

export function isDeleteIssueRelationArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

/**
 * Type guard for linear_archiveIssue tool arguments
 */
export function isArchiveIssueArgs(args: unknown): args is {
  issueId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string'
  );
}

/**
 * Type guard for linear_setIssuePriority tool arguments
 */
export function isSetIssuePriorityArgs(args: unknown): args is {
  issueId: string;
  priority: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'priority' in args &&
    typeof (args as { priority: number }).priority === 'number' &&
    [0, 1, 2, 3, 4].includes((args as { priority: number }).priority)
  );
}

/**
 * Type guard for linear_transferIssue tool arguments
 */
export function isTransferIssueArgs(args: unknown): args is {
  issueId: string;
  teamId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'teamId' in args &&
    typeof (args as { teamId: string }).teamId === 'string'
  );
}

/**
 * Type guard for linear_duplicateIssue tool arguments
 */
export function isDuplicateIssueArgs(args: unknown): args is {
  issueId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string'
  );
}

/**
 * Type guard for linear_getIssueHistory tool arguments
 */
export function isGetIssueHistoryArgs(args: unknown): args is {
  issueId: string;
  limit?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
  );
}

/**
 * Type guard for linear_getComments tool arguments
 */
export function isGetCommentsArgs(args: unknown): args is {
  issueId?: string;
  projectId?: string;
  initiativeId?: string;
  projectUpdateId?: string;
  initiativeUpdateId?: string;
  documentContentId?: string;
  postId?: string;
  limit?: number;
  cursor?: string;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const targetKeys = [
    'issueId',
    'projectId',
    'initiativeId',
    'projectUpdateId',
    'initiativeUpdateId',
    'documentContentId',
    'postId',
  ];
  const targetCount = targetKeys.filter((key) => key in args && args[key] !== undefined).length;

  return (
    targetCount === 1 &&
    targetKeys.every((key) => !(key in args) || typeof args[key] === 'string') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('cursor' in args) || typeof (args as { cursor: unknown }).cursor === 'string') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_updateProject tool arguments
 */
export function isUpdateProjectArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string;
  content?: string;
  state?: string;
  startDate?: string;
  targetDate?: string;
  leadId?: string;
  memberIds?: string[];
  sortOrder?: number;
  icon?: string;
  color?: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: string }).content === 'string') &&
    (!('state' in args) || typeof (args as { state: string }).state === 'string') &&
    (!('startDate' in args) || typeof (args as { startDate: unknown }).startDate === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: unknown }).targetDate === 'string') &&
    (!('leadId' in args) || typeof (args as { leadId: unknown }).leadId === 'string') &&
    (!('memberIds' in args) || isStringArray((args as { memberIds: unknown }).memberIds)) &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number') &&
    (!('icon' in args) || typeof (args as { icon: unknown }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string')
  );
}

export function isGetProjectMembersArgs(args: unknown): args is {
  projectId: string;
  limit?: number;
  includeArchived?: boolean;
  includeDisabled?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'projectId' in args &&
    typeof (args as { projectId: unknown }).projectId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('includeDisabled' in args) || typeof (args as { includeDisabled: unknown }).includeDisabled === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isAddProjectMemberArgs(args: unknown): args is { projectId: string; userId: string } {
  return (
    isJsonObject(args) &&
    'projectId' in args && typeof (args as { projectId: unknown }).projectId === 'string' &&
    'userId' in args && typeof (args as { userId: unknown }).userId === 'string'
  );
}

export function isRemoveProjectMemberArgs(args: unknown): args is { projectId: string; userId: string } {
  return isAddProjectMemberArgs(args);
}

const PROJECT_UPDATE_HEALTH_STATUSES = ['onTrack', 'atRisk', 'offTrack'] as const;
const INITIATIVE_STATUSES = ['Planned', 'Active', 'Completed'] as const;

function isProjectUpdateHealthStatus(value: unknown): value is (typeof PROJECT_UPDATE_HEALTH_STATUSES)[number] {
  return (
    typeof value === 'string' &&
    (PROJECT_UPDATE_HEALTH_STATUSES as readonly string[]).includes(value)
  );
}

function isInitiativeStatus(value: unknown): value is (typeof INITIATIVE_STATUSES)[number] {
  return (
    typeof value === 'string' &&
    (INITIATIVE_STATUSES as readonly string[]).includes(value)
  );
}

/**
 * Type guard for linear_createProjectUpdate tool arguments
 */
export function isCreateProjectUpdateArgs(args: unknown): args is {
  projectId: string;
  body: string;
  health?: 'onTrack' | 'atRisk' | 'offTrack';
  isDiffHidden?: boolean;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string' &&
    'body' in args &&
    typeof (args as { body: string }).body === 'string' &&
    (!('health' in args) ||
      isProjectUpdateHealthStatus((args as { health: unknown }).health)) &&
    (!('isDiffHidden' in args) ||
      typeof (args as { isDiffHidden: unknown }).isDiffHidden === 'boolean')
  );
}

/**
 * Type guard for linear_updateProjectUpdate tool arguments
 */
export function isUpdateProjectUpdateArgs(args: unknown): args is {
  id: string;
  body?: string;
  health?: 'onTrack' | 'atRisk' | 'offTrack';
  isDiffHidden?: boolean;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    (!('body' in args) || typeof (args as { body: string }).body === 'string') &&
    (!('health' in args) ||
      isProjectUpdateHealthStatus((args as { health: unknown }).health)) &&
    (!('isDiffHidden' in args) ||
      typeof (args as { isDiffHidden: unknown }).isDiffHidden === 'boolean')
  );
}

export function isProjectUpdateIdArgs(args: unknown): args is { id: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string'
  );
}

export function isGetInitiativeUpdatesArgs(args: unknown): args is {
  initiativeId: string;
  limit?: number;
} {
  return (
    isJsonObject(args) &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: unknown }).initiativeId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit))
  );
}

export function isCreateInitiativeUpdateArgs(args: unknown): args is {
  initiativeId: string;
  body: string;
  health?: 'onTrack' | 'atRisk' | 'offTrack';
  isDiffHidden?: boolean;
} {
  return (
    isJsonObject(args) &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: unknown }).initiativeId === 'string' &&
    'body' in args &&
    typeof (args as { body: unknown }).body === 'string' &&
    (!('health' in args) ||
      isProjectUpdateHealthStatus((args as { health: unknown }).health)) &&
    (!('isDiffHidden' in args) ||
      typeof (args as { isDiffHidden: unknown }).isDiffHidden === 'boolean')
  );
}

export function isUpdateInitiativeUpdateArgs(args: unknown): args is {
  id: string;
  body?: string;
  health?: 'onTrack' | 'atRisk' | 'offTrack';
  isDiffHidden?: boolean;
} {
  if (!isJsonObject(args)) {
    return false;
  }
  const hasUpdateField = ['body', 'health', 'isDiffHidden']
    .some((key) => key in args && args[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('body' in args) || typeof (args as { body: unknown }).body === 'string') &&
    (!('health' in args) ||
      isProjectUpdateHealthStatus((args as { health: unknown }).health)) &&
    (!('isDiffHidden' in args) ||
      typeof (args as { isDiffHidden: unknown }).isDiffHidden === 'boolean')
  );
}

/**
 * Type guard for linear_addIssueToProject tool arguments
 */
export function isAddIssueToProjectArgs(args: unknown): args is {
  issueId: string;
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

/**
 * Type guard for linear_removeIssueFromProject tool arguments
 */
export function isRemoveIssueFromProjectArgs(args: unknown): args is {
  issueId: string;
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

/**
 * Type guard for linear_getProjectUpdates tool arguments
 */
export function isGetProjectUpdatesArgs(args: unknown): args is {
  projectId: string;
  limit?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string' &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
  );
}

/**
 * Type guard for linear_getProjectIssues tool arguments
 */
export function isGetProjectIssuesArgs(args: unknown): args is {
  projectId: string;
  limit?: number;
  states?: string[];
  assigneeId?: string;
  labelIds?: string[];
  cycleId?: string;
  projectMilestoneId?: string;
  includeCompleted?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('states' in args) || isStringArray((args as { states: unknown }).states)) &&
    (!('assigneeId' in args) || typeof (args as { assigneeId: string }).assigneeId === 'string') &&
    (!('labelIds' in args) || isStringArray((args as { labelIds: unknown }).labelIds)) &&
    (!('cycleId' in args) || typeof (args as { cycleId: string }).cycleId === 'string') &&
    (!('projectMilestoneId' in args) ||
      typeof (args as { projectMilestoneId: string }).projectMilestoneId === 'string') &&
    (!('includeCompleted' in args) ||
      typeof (args as { includeCompleted: boolean }).includeCompleted === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_archiveProject tool arguments
 */
export function isArchiveProjectArgs(args: unknown): args is {
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

/**
 * Type guard for roadmap list tool arguments
 */
export function isGetRoadmapsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for roadmap by ID tool arguments
 */
export function isGetRoadmapByIdArgs(args: unknown): args is { id: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for roadmap create tool arguments
 */
export function isCreateRoadmapArgs(args: unknown): args is {
  name: string;
  description?: string;
  color?: string;
  ownerId?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('sortOrder' in args) ||
      typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

/**
 * Type guard for roadmap update tool arguments
 */
export function isUpdateRoadmapArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  ownerId?: string;
  sortOrder?: number;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = ['name', 'description', 'color', 'ownerId', 'sortOrder'].some(
    (key) => key in args && (args as Record<string, unknown>)[key] !== undefined,
  );

  return (
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    hasUpdateField &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('sortOrder' in args) ||
      typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

/**
 * Type guard for roadmap archive tool arguments
 */
export function isArchiveRoadmapArgs(args: unknown): args is { roadmapId: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'roadmapId' in args &&
    typeof (args as { roadmapId: string }).roadmapId === 'string'
  );
}

function hasReleaseRangeShape(args: Record<string, unknown>): boolean {
  const hasFrom = typeof args.rangeFromReleaseId === 'string';
  const hasTo = typeof args.rangeToReleaseId === 'string';
  return hasFrom && hasTo;
}

function hasReleaseIdsShape(args: Record<string, unknown>): boolean {
  return isStringArray(args.releaseIds) && args.releaseIds.length > 0;
}

function hasExclusiveReleaseSelection(args: Record<string, unknown>): boolean {
  const hasIds = hasReleaseIdsShape(args);
  const hasRange = hasReleaseRangeShape(args);
  return (hasIds || hasRange) && !(hasIds && hasRange);
}

export function isGetReleasePipelinesArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isGetReleasePipelineByIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isCreateReleasePipelineArgs(args: unknown): args is {
  name: string;
  teamIds: string[];
  type?: 'continuous' | 'scheduled';
  slugId?: string;
  isProduction?: boolean;
  includePathPatterns?: string[];
} {
  return (
    isJsonObject(args) &&
    'name' in args &&
    isNonEmptyString((args as { name: unknown }).name) &&
    'teamIds' in args &&
    isStringArray((args as { teamIds: unknown }).teamIds) &&
    (!('type' in args) || isReleasePipelineType((args as { type: unknown }).type)) &&
    (!('slugId' in args) || typeof (args as { slugId: unknown }).slugId === 'string') &&
    (!('isProduction' in args) || typeof (args as { isProduction: unknown }).isProduction === 'boolean') &&
    (!('includePathPatterns' in args) ||
      isStringArray((args as { includePathPatterns: unknown }).includePathPatterns))
  );
}

export function isUpdateReleasePipelineArgs(args: unknown): args is {
  id: string;
  name?: string;
  teamIds?: string[];
  type?: 'continuous' | 'scheduled';
  slugId?: string;
  isProduction?: boolean;
  includePathPatterns?: string[];
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = ['name', 'teamIds', 'type', 'slugId', 'isProduction', 'includePathPatterns']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('teamIds' in args) || isStringArray((args as { teamIds: unknown }).teamIds)) &&
    (!('type' in args) || isReleasePipelineType((args as { type: unknown }).type)) &&
    (!('slugId' in args) || typeof (args as { slugId: unknown }).slugId === 'string') &&
    (!('isProduction' in args) || typeof (args as { isProduction: unknown }).isProduction === 'boolean') &&
    (!('includePathPatterns' in args) ||
      isStringArray((args as { includePathPatterns: unknown }).includePathPatterns))
  );
}

export function isArchiveReleasePipelineArgs(args: unknown): args is { pipelineId: string } {
  return (
    isJsonObject(args) &&
    'pipelineId' in args &&
    typeof (args as { pipelineId: unknown }).pipelineId === 'string'
  );
}

export function isUnarchiveReleasePipelineArgs(args: unknown): args is { pipelineId: string } {
  return isArchiveReleasePipelineArgs(args);
}

export function isDeleteReleasePipelineArgs(args: unknown): args is { pipelineId: string } {
  return isArchiveReleasePipelineArgs(args);
}

export function isGetReleasesArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  pipelineId?: string;
  stageId?: string;
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('pipelineId' in args) || typeof (args as { pipelineId: unknown }).pipelineId === 'string') &&
    (!('stageId' in args) || typeof (args as { stageId: unknown }).stageId === 'string')
  );
}

export function isGetReleaseByIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isSearchReleasesArgs(args: unknown): args is {
  term?: string;
  limit?: number;
  includeArchived?: boolean;
  pipelineId?: string;
  stageId?: string;
} {
  return (
    isJsonObject(args) &&
    (!('term' in args) || typeof (args as { term: unknown }).term === 'string') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('pipelineId' in args) || typeof (args as { pipelineId: unknown }).pipelineId === 'string') &&
    (!('stageId' in args) || typeof (args as { stageId: unknown }).stageId === 'string')
  );
}

export function isGetReleaseStagesArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  pipelineId?: string;
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('pipelineId' in args) || typeof (args as { pipelineId: unknown }).pipelineId === 'string')
  );
}

export function isCreateReleaseStageArgs(args: unknown): args is {
  pipelineId: string;
  name: string;
  color: string;
  position: number;
  type: 'planned' | 'started' | 'completed' | 'canceled';
  frozen?: boolean;
  id?: string;
} {
  return (
    isJsonObject(args) &&
    'pipelineId' in args &&
    typeof (args as { pipelineId: unknown }).pipelineId === 'string' &&
    'name' in args &&
    isNonEmptyString((args as { name: unknown }).name) &&
    'color' in args &&
    isNonEmptyString((args as { color: unknown }).color) &&
    'position' in args &&
    isFiniteNumber((args as { position: unknown }).position) &&
    'type' in args &&
    isReleaseStageType((args as { type: unknown }).type) &&
    (!('frozen' in args) || typeof (args as { frozen: unknown }).frozen === 'boolean') &&
    (!('id' in args) || typeof (args as { id: unknown }).id === 'string')
  );
}

export function isUpdateReleaseStageArgs(args: unknown): args is {
  id: string;
  name?: string;
  color?: string;
  position?: number;
  frozen?: boolean;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = ['name', 'color', 'position', 'frozen']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('position' in args) || typeof (args as { position: unknown }).position === 'number') &&
    (!('frozen' in args) || typeof (args as { frozen: unknown }).frozen === 'boolean')
  );
}

export function isArchiveReleaseStageArgs(args: unknown): args is { stageId: string } {
  return isJsonObject(args) && 'stageId' in args && typeof (args as { stageId: unknown }).stageId === 'string';
}

export function isUnarchiveReleaseStageArgs(args: unknown): args is { stageId: string } {
  return isArchiveReleaseStageArgs(args);
}

export function isGetReleaseNotesArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isGetReleaseNoteByIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isCreateReleaseArgs(args: unknown): args is {
  pipelineId: string;
  name: string;
  version?: string;
  description?: string;
  commitSha?: string;
  stageId?: string;
  startDate?: string;
  targetDate?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
} {
  return (
    isJsonObject(args) &&
    'pipelineId' in args &&
    typeof (args as { pipelineId: unknown }).pipelineId === 'string' &&
    'name' in args &&
    isNonEmptyString((args as { name: unknown }).name) &&
    (!('version' in args) || typeof (args as { version: unknown }).version === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('commitSha' in args) || typeof (args as { commitSha: unknown }).commitSha === 'string') &&
    (!('stageId' in args) || typeof (args as { stageId: unknown }).stageId === 'string') &&
    (!('startDate' in args) || typeof (args as { startDate: unknown }).startDate === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: unknown }).targetDate === 'string') &&
    (!('createdAt' in args) || typeof (args as { createdAt: unknown }).createdAt === 'string') &&
    (!('startedAt' in args) || typeof (args as { startedAt: unknown }).startedAt === 'string') &&
    (!('completedAt' in args) || typeof (args as { completedAt: unknown }).completedAt === 'string')
  );
}

export function isUpdateReleaseArgs(args: unknown): args is {
  id: string;
  name?: string;
  version?: string;
  description?: string;
  commitSha?: string;
  pipelineId?: string;
  stageId?: string;
  startDate?: string;
  targetDate?: string;
  startedAt?: string;
  completedAt?: string;
  trashed?: boolean;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = [
    'name',
    'version',
    'description',
    'commitSha',
    'pipelineId',
    'stageId',
    'startDate',
    'targetDate',
    'startedAt',
    'completedAt',
    'trashed',
  ].some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('version' in args) || typeof (args as { version: unknown }).version === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('commitSha' in args) || typeof (args as { commitSha: unknown }).commitSha === 'string') &&
    (!('pipelineId' in args) || typeof (args as { pipelineId: unknown }).pipelineId === 'string') &&
    (!('stageId' in args) || typeof (args as { stageId: unknown }).stageId === 'string') &&
    (!('startDate' in args) || typeof (args as { startDate: unknown }).startDate === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: unknown }).targetDate === 'string') &&
    (!('startedAt' in args) || typeof (args as { startedAt: unknown }).startedAt === 'string') &&
    (!('completedAt' in args) || typeof (args as { completedAt: unknown }).completedAt === 'string') &&
    (!('trashed' in args) || typeof (args as { trashed: unknown }).trashed === 'boolean')
  );
}

export function isCompleteReleaseArgs(args: unknown): args is {
  pipelineId: string;
  version?: string;
} {
  return (
    isJsonObject(args) &&
    'pipelineId' in args &&
    typeof (args as { pipelineId: unknown }).pipelineId === 'string' &&
    (!('version' in args) || typeof (args as { version: unknown }).version === 'string')
  );
}

export function isArchiveReleaseArgs(args: unknown): args is { releaseId: string } {
  return (
    isJsonObject(args) &&
    'releaseId' in args &&
    typeof (args as { releaseId: unknown }).releaseId === 'string'
  );
}

export function isUnarchiveReleaseArgs(args: unknown): args is { releaseId: string } {
  return isArchiveReleaseArgs(args);
}

export function isAddIssueToReleaseArgs(args: unknown): args is {
  issueId: string;
  releaseId: string;
} {
  return (
    isJsonObject(args) &&
    'issueId' in args &&
    typeof (args as { issueId: unknown }).issueId === 'string' &&
    'releaseId' in args &&
    typeof (args as { releaseId: unknown }).releaseId === 'string'
  );
}

export function isRemoveIssueFromReleaseArgs(args: unknown): args is {
  issueId: string;
  releaseId: string;
} {
  return isAddIssueToReleaseArgs(args);
}

export function isCreateReleaseNoteArgs(args: unknown): args is {
  pipelineId: string;
  content?: string;
  releaseIds?: string[];
  rangeFromReleaseId?: string;
  rangeToReleaseId?: string;
} {
  return (
    isJsonObject(args) &&
    'pipelineId' in args &&
    typeof (args as { pipelineId: unknown }).pipelineId === 'string' &&
    (!('content' in args) || typeof (args as { content: unknown }).content === 'string') &&
    (!('releaseIds' in args) || isStringArray((args as { releaseIds: unknown }).releaseIds)) &&
    (!('rangeFromReleaseId' in args) ||
      typeof (args as { rangeFromReleaseId: unknown }).rangeFromReleaseId === 'string') &&
    (!('rangeToReleaseId' in args) ||
      typeof (args as { rangeToReleaseId: unknown }).rangeToReleaseId === 'string') &&
    hasExclusiveReleaseSelection(args)
  );
}

export function isUpdateReleaseNoteArgs(args: unknown): args is {
  id: string;
  content?: string;
  releaseIds?: string[];
  rangeFromReleaseId?: string;
  rangeToReleaseId?: string;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasContent = 'content' in args && typeof (args as { content: unknown }).content === 'string';
  const hasSelectionKeys =
    'releaseIds' in args || 'rangeFromReleaseId' in args || 'rangeToReleaseId' in args;
  const hasSelection = hasSelectionKeys && hasExclusiveReleaseSelection(args);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    (hasContent || hasSelection) &&
    (!('content' in args) || typeof (args as { content: unknown }).content === 'string') &&
    (!('releaseIds' in args) || isStringArray((args as { releaseIds: unknown }).releaseIds)) &&
    (!('rangeFromReleaseId' in args) ||
      typeof (args as { rangeFromReleaseId: unknown }).rangeFromReleaseId === 'string') &&
    (!('rangeToReleaseId' in args) ||
      typeof (args as { rangeToReleaseId: unknown }).rangeToReleaseId === 'string')
  );
}

export function isDeleteReleaseNoteArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

/**
 * Type guard for linear_getMilestones tool arguments
 */
export function isGetMilestonesArgs(args: unknown): args is {
  includeArchived?: boolean;
  limit?: number;
  projectId?: string;
  teamId?: string;
  status?: 'done' | 'next' | 'overdue' | 'unstarted';
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: number }).limit)) &&
    (!('projectId' in args) || typeof (args as { projectId: string }).projectId === 'string') &&
    (!('teamId' in args) || typeof (args as { teamId: string }).teamId === 'string') &&
    (!('status' in args) || isMilestoneStatus((args as { status: unknown }).status)) &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_getMilestoneById tool arguments
 */
export function isGetMilestoneByIdArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_createMilestone tool arguments
 */
export function isCreateMilestoneArgs(args: unknown): args is {
  name: string;
  projectId: string;
  description?: string;
  targetDate?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string' &&
    (!('description' in args) || typeof (args as { description: string }).description === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_updateMilestone tool arguments
 */
export function isUpdateMilestoneArgs(args: unknown): args is {
  id: string;
  name?: string;
  projectId?: string;
  description?: string;
  targetDate?: string;
  sortOrder?: number;
} {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('projectId' in args) || typeof (args as { projectId: string }).projectId === 'string') &&
    (!('description' in args) || typeof (args as { description: string }).description === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number') &&
    ('name' in args ||
      'projectId' in args ||
      'description' in args ||
      'targetDate' in args ||
      'sortOrder' in args)
  );
}

/**
 * Type guard for linear_archiveMilestone tool arguments
 */
export function isArchiveMilestoneArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_getInitiativeById tool arguments
 */
export function isGetInitiativeByIdArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_createInitiative tool arguments
 */
export function isCreateInitiativeArgs(args: unknown): args is {
  name: string;
  description?: string;
  content?: string;
  icon?: string;
  color?: string;
  status?: string;
  targetDate?: string;
  ownerId?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: string }).content === 'string') &&
    (!('icon' in args) || typeof (args as { icon: string }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string') &&
    (!('status' in args) || isInitiativeStatus((args as { status: unknown }).status)) &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_updateInitiative tool arguments
 */
export function isUpdateInitiativeArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string;
  content?: string;
  icon?: string;
  color?: string;
  status?: string;
  targetDate?: string;
  ownerId?: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: string }).content === 'string') &&
    (!('icon' in args) || typeof (args as { icon: string }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string') &&
    (!('status' in args) || isInitiativeStatus((args as { status: unknown }).status)) &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_archiveInitiative tool arguments
 */
export function isArchiveInitiativeArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_unarchiveInitiative tool arguments
 */
export function isUnarchiveInitiativeArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_deleteInitiative tool arguments
 */
export function isDeleteInitiativeArgs(args: unknown): args is {
  id: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_getInitiativeProjects tool arguments
 */
export function isGetInitiativeProjectsArgs(args: unknown): args is {
  initiativeId: string;
  limit?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
  );
}

/**
 * Type guard for linear_addProjectToInitiative tool arguments
 */
export function isAddProjectToInitiativeArgs(args: unknown): args is {
  projectId: string;
  initiativeId: string;
  sortOrder?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string' &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: number }).sortOrder === 'number')
  );
}

/**
 * Type guard for linear_removeProjectFromInitiative tool arguments
 */
export function isRemoveProjectFromInitiativeArgs(args: unknown): args is {
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

/**
 * Type guard for linear_getCycles tool arguments
 */
export function isGetCyclesArgs(args: unknown): args is {
  teamId?: string;
  limit?: number;
} {
  return (
    isJsonObject(args) &&
    (!('teamId' in args) || typeof (args as { teamId: string }).teamId === 'string') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit))
  );
}

export function isGetCycleByIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isCreateCycleArgs(args: unknown): args is {
  teamId: string;
  startsAt: string;
  endsAt: string;
  name?: string;
  description?: string;
  completedAt?: string;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'startsAt' in args && typeof (args as { startsAt: unknown }).startsAt === 'string' &&
    'endsAt' in args && typeof (args as { endsAt: unknown }).endsAt === 'string' &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('completedAt' in args) || typeof (args as { completedAt: unknown }).completedAt === 'string')
  );
}

export function isUpdateCycleArgs(args: unknown): args is {
  id: string;
  startsAt?: string;
  endsAt?: string;
  name?: string;
  description?: string;
  completedAt?: string;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = ['startsAt', 'endsAt', 'name', 'description', 'completedAt']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('startsAt' in args) || typeof (args as { startsAt: unknown }).startsAt === 'string') &&
    (!('endsAt' in args) || typeof (args as { endsAt: unknown }).endsAt === 'string') &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('completedAt' in args) || typeof (args as { completedAt: unknown }).completedAt === 'string')
  );
}

export function isCompleteCycleArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isGetCycleStatsArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isGetIssueTemplatesArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isGetIssueTemplateByIdArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isCreateIssueTemplateArgs(args: unknown): args is {
  name: string;
  description?: string;
  teamId?: string;
  templateData: Record<string, JSONGuardValue>;
  sortOrder?: number;
} {
  return (
    isJsonObject(args) &&
    'name' in args && typeof (args as { name: unknown }).name === 'string' &&
    'templateData' in args && isJsonObject((args as { templateData: unknown }).templateData) &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

export function isUpdateIssueTemplateArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string | null;
  teamId?: string | null;
  templateData?: Record<string, JSONGuardValue>;
  sortOrder?: number;
} {
  if (!isJsonObject(args)) {
    return false;
  }
  const hasUpdateField = ['name', 'description', 'teamId', 'templateData', 'sortOrder']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args && typeof (args as { id: unknown }).id === 'string' && hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('description' in args) || isNullableString((args as { description: unknown }).description)) &&
    (!('teamId' in args) || isNullableString((args as { teamId: unknown }).teamId)) &&
    (!('templateData' in args) || isJsonObject((args as { templateData: unknown }).templateData)) &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

export function isCreateIssueFromTemplateArgs(args: unknown): args is {
  teamId: string;
  templateId: string;
  title?: string;
  description?: string;
  priority?: number;
  projectId?: string;
  projectMilestoneId?: string;
  cycleId?: string;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'templateId' in args && typeof (args as { templateId: unknown }).templateId === 'string' &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('priority' in args) || typeof (args as { priority: unknown }).priority === 'number') &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string') &&
    (!('projectMilestoneId' in args) || typeof (args as { projectMilestoneId: unknown }).projectMilestoneId === 'string') &&
    (!('cycleId' in args) || typeof (args as { cycleId: unknown }).cycleId === 'string')
  );
}

export function isGetTeamTemplatesArgs(args: unknown): args is {
  teamId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isArchiveTemplateArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isGetWebhooksArgs(args: unknown): args is {
  teamId?: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isCreateWebhookArgs(args: unknown): args is {
  url: string;
  resourceTypes: string[];
  teamId?: string;
  enabled?: boolean;
  label?: string;
  secret?: string;
  allPublicTeams?: boolean;
} {
  return (
    isJsonObject(args) &&
    'url' in args && typeof (args as { url: unknown }).url === 'string' &&
    'resourceTypes' in args && isStringArray((args as { resourceTypes: unknown }).resourceTypes) &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('enabled' in args) || typeof (args as { enabled: unknown }).enabled === 'boolean') &&
    (!('label' in args) || typeof (args as { label: unknown }).label === 'string') &&
    (!('secret' in args) || typeof (args as { secret: unknown }).secret === 'string') &&
    (!('allPublicTeams' in args) || typeof (args as { allPublicTeams: unknown }).allPublicTeams === 'boolean')
  );
}

export function isDeleteWebhookArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isGetAttachmentsArgs(args: unknown): args is {
  issueId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'issueId' in args && typeof (args as { issueId: unknown }).issueId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isAddAttachmentArgs(args: unknown): args is {
  issueId: string;
  title: string;
  url: string;
  subtitle?: string;
  iconUrl?: string;
  metadata?: Record<string, JSONGuardValue>;
  commentBody?: string;
  groupBySource?: boolean;
} {
  return (
    isJsonObject(args) &&
    'issueId' in args && typeof (args as { issueId: unknown }).issueId === 'string' &&
    'title' in args && typeof (args as { title: unknown }).title === 'string' &&
    'url' in args && typeof (args as { url: unknown }).url === 'string' &&
    (!('subtitle' in args) || typeof (args as { subtitle: unknown }).subtitle === 'string') &&
    (!('iconUrl' in args) || typeof (args as { iconUrl: unknown }).iconUrl === 'string') &&
    (!('metadata' in args) || isJsonObject((args as { metadata: unknown }).metadata)) &&
    (!('commentBody' in args) || typeof (args as { commentBody: unknown }).commentBody === 'string') &&
    (!('groupBySource' in args) || typeof (args as { groupBySource: unknown }).groupBySource === 'boolean')
  );
}

export function isGetNotificationsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return isGetWebhooksArgs(args);
}

export function isMarkNotificationAsReadArgs(args: unknown): args is { id: string } {
  return isGetCycleByIdArgs(args);
}

export function isGetSubscriptionsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return isGetWebhooksArgs(args);
}

export function isMarkAllNotificationsAsReadArgs(args: unknown): args is { limit?: number } {
  return isJsonObject(args) && (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit));
}

export function isGetUnreadNotificationCountArgs(args: unknown): args is { limit?: number } {
  return isMarkAllNotificationsAsReadArgs(args);
}

export function isGetAuthenticationSessionsArgs(args: unknown): args is Record<string, never> | undefined {
  return args === undefined || (isJsonObject(args) && Object.keys(args).length === 0);
}

export function isLogoutSessionArgs(args: unknown): args is { sessionId: string } {
  return isJsonObject(args) && 'sessionId' in args && typeof (args as { sessionId: unknown }).sessionId === 'string';
}

export function isLogoutOtherSessionsArgs(args: unknown): args is Record<string, never> | undefined {
  return isGetAuthenticationSessionsArgs(args);
}

export function isLogoutAllSessionsArgs(args: unknown): args is Record<string, never> | undefined {
  return isGetAuthenticationSessionsArgs(args);
}

export function isGetOrganizationAuditEventsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return isGetWebhooksArgs(args);
}

export function isGetUserAuditEventsArgs(args: unknown): args is {
  userId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'userId' in args && typeof (args as { userId: unknown }).userId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isGetIntegrationsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return isGetWebhooksArgs(args);
}

/**
 * Type guard for linear_getCycleIssues tool arguments
 */
export function isGetCycleIssuesArgs(args: unknown): args is {
  cycleId: string;
  limit?: number;
  states?: string[];
  assigneeId?: string;
  labelIds?: string[];
  includeCompleted?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'cycleId' in args &&
    typeof (args as { cycleId: string }).cycleId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('states' in args) || isStringArray((args as { states: unknown }).states)) &&
    (!('assigneeId' in args) || typeof (args as { assigneeId: string }).assigneeId === 'string') &&
    (!('labelIds' in args) || isStringArray((args as { labelIds: unknown }).labelIds)) &&
    (!('includeCompleted' in args) ||
      typeof (args as { includeCompleted: boolean }).includeCompleted === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_getActiveCycle tool arguments
 */
export function isGetActiveCycleArgs(args: unknown): args is {
  teamId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'teamId' in args &&
    typeof (args as { teamId: string }).teamId === 'string'
  );
}

/**
 * Type guard for linear_addIssueToCycle tool arguments
 */
export function isAddIssueToCycleArgs(args: unknown): args is {
  issueId: string;
  cycleId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'cycleId' in args &&
    typeof (args as { cycleId: string }).cycleId === 'string'
  );
}

/**
 * Type guard for linear_removeIssueFromCycle tool arguments
 */
export function isRemoveIssueFromCycleArgs(args: unknown): args is {
  issueId: string;
  cycleId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'cycleId' in args &&
    typeof (args as { cycleId: string }).cycleId === 'string'
  );
}

/**
 * Type guard for linear_getWorkflowStates tool arguments
 */
export function isGetWorkflowStatesArgs(args: unknown): args is {
  teamId: string;
  includeArchived?: boolean;
} {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('teamId' in args) ||
    typeof (args as { teamId: string }).teamId !== 'string'
  ) {
    return false;
  }

  if (
    'includeArchived' in args &&
    typeof (args as { includeArchived: boolean }).includeArchived !== 'boolean'
  ) {
    return false;
  }

  return true;
}

/**
 * Type guard for linear_getInitiatives tool arguments
 */
export function isGetInitiativesInput(args: unknown): args is {
  includeArchived?: boolean;
  limit?: number;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean') &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
  );
}

export function isCreateWorkflowStateArgs(args: unknown): args is {
  name: string;
  teamId: string;
  type: string;
  color: string;
  description?: string;
  position?: number;
} {
  return (
    isJsonObject(args) &&
    'name' in args && typeof (args as { name: unknown }).name === 'string' &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'type' in args && typeof (args as { type: unknown }).type === 'string' &&
    'color' in args && typeof (args as { color: unknown }).color === 'string' &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('position' in args) || typeof (args as { position: unknown }).position === 'number')
  );
}

export function isUpdateWorkflowStateArgs(args: unknown): args is {
  id: string;
  name?: string;
  color?: string;
  description?: string;
  position?: number;
} {
  if (!isJsonObject(args)) {
    return false;
  }
  const hasUpdateField = ['name', 'color', 'description', 'position']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);
  return (
    'id' in args && typeof (args as { id: unknown }).id === 'string' && hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('position' in args) || typeof (args as { position: unknown }).position === 'number')
  );
}

export function isUpdateTeamArgs(args: unknown): args is {
  id: string;
  name?: string;
  key?: string;
  description?: string;
  color?: string;
  icon?: string;
  timezone?: string;
  parentId?: string;
  private?: boolean;
  visibility?: 'public' | 'private';
} {
  if (!isJsonObject(args)) {
    return false;
  }
  const hasUpdateField = ['name', 'key', 'description', 'color', 'icon', 'timezone', 'parentId', 'private', 'visibility']
    .some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);
  return (
    'id' in args && typeof (args as { id: unknown }).id === 'string' && hasUpdateField &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('key' in args) || typeof (args as { key: unknown }).key === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('icon' in args) || typeof (args as { icon: unknown }).icon === 'string') &&
    (!('timezone' in args) || typeof (args as { timezone: unknown }).timezone === 'string') &&
    (!('parentId' in args) || typeof (args as { parentId: unknown }).parentId === 'string') &&
    (!('private' in args) || typeof (args as { private: unknown }).private === 'boolean') &&
    (!('visibility' in args) ||
      (args as { visibility: unknown }).visibility === 'public' ||
      (args as { visibility: unknown }).visibility === 'private')
  );
}

export function isGetTeamMembershipsArgs(args: unknown): args is {
  teamId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isCreateTeamArgs(args: unknown): args is {
  name: string;
  key?: string;
  description?: string;
  color?: string;
  icon?: string;
  timezone?: string;
  parentId?: string;
  private?: boolean;
  visibility?: 'public' | 'private';
} {
  return (
    isJsonObject(args) &&
    'name' in args && typeof (args as { name: unknown }).name === 'string' &&
    (!('key' in args) || typeof (args as { key: unknown }).key === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('icon' in args) || typeof (args as { icon: unknown }).icon === 'string') &&
    (!('timezone' in args) || typeof (args as { timezone: unknown }).timezone === 'string') &&
    (!('parentId' in args) || typeof (args as { parentId: unknown }).parentId === 'string') &&
    (!('private' in args) || typeof (args as { private: unknown }).private === 'boolean') &&
    (!('visibility' in args) ||
      (args as { visibility: unknown }).visibility === 'public' ||
      (args as { visibility: unknown }).visibility === 'private')
  );
}

export function isArchiveTeamArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

export function isAddUserToTeamArgs(args: unknown): args is {
  teamId: string;
  userId: string;
  owner?: boolean;
  sortOrder?: number;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'userId' in args && typeof (args as { userId: unknown }).userId === 'string' &&
    (!('owner' in args) || typeof (args as { owner: unknown }).owner === 'boolean') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

export function isRemoveUserFromTeamArgs(args: unknown): args is {
  teamId: string;
  userId: string;
  alsoLeaveParentTeams?: boolean;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'userId' in args && typeof (args as { userId: unknown }).userId === 'string' &&
    (!('alsoLeaveParentTeams' in args) ||
      typeof (args as { alsoLeaveParentTeams: unknown }).alsoLeaveParentTeams === 'boolean')
  );
}

export function isUpdateTeamMembershipArgs(args: unknown): args is {
  id: string;
  owner?: boolean;
  sortOrder?: number;
} {
  if (!isJsonObject(args)) {
    return false;
  }
  const hasUpdateField = ['owner', 'sortOrder'].some(
    (key) => key in args && (args as Record<string, unknown>)[key] !== undefined,
  );
  return (
    'id' in args && typeof (args as { id: unknown }).id === 'string' && hasUpdateField &&
    (!('owner' in args) || typeof (args as { owner: unknown }).owner === 'boolean') &&
    (!('sortOrder' in args) || typeof (args as { sortOrder: unknown }).sortOrder === 'number')
  );
}

export function isGetTeamLabelsArgs(args: unknown): args is {
  teamId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

export function isCreateTeamLabelArgs(args: unknown): args is {
  teamId: string;
  name: string;
  color?: string;
  description?: string;
  parentId?: string;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args && typeof (args as { teamId: unknown }).teamId === 'string' &&
    'name' in args && typeof (args as { name: unknown }).name === 'string' &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('description' in args) || typeof (args as { description: unknown }).description === 'string') &&
    (!('parentId' in args) || typeof (args as { parentId: unknown }).parentId === 'string')
  );
}

/**
 * Type guard for linear_getInitiativeById tool arguments
 */
export function isGetInitiativeByIdInput(args: unknown): args is {
  initiativeId: string;
  includeProjects?: boolean;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    (!('includeProjects' in args) ||
      typeof (args as { includeProjects: boolean }).includeProjects === 'boolean')
  );
}

/**
 * Type guard for linear_createInitiative tool arguments
 */
export function isCreateInitiativeInput(args: unknown): args is {
  name: string;
  description?: string;
  content?: string;
  ownerId?: string;
  targetDate?: string;
  status?: string;
  icon?: string;
  color?: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: string }).content === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('status' in args) || isInitiativeStatus((args as { status: unknown }).status)) &&
    (!('icon' in args) || typeof (args as { icon: string }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string')
  );
}

/**
 * Type guard for linear_updateInitiative tool arguments
 */
export function isUpdateInitiativeInput(args: unknown): args is {
  initiativeId: string;
  name?: string;
  description?: string;
  content?: string;
  ownerId?: string;
  targetDate?: string;
  status?: string;
  icon?: string;
  color?: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('description' in args) ||
      typeof (args as { description: string }).description === 'string') &&
    (!('content' in args) || typeof (args as { content: string }).content === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('targetDate' in args) || typeof (args as { targetDate: string }).targetDate === 'string') &&
    (!('status' in args) || isInitiativeStatus((args as { status: unknown }).status)) &&
    (!('icon' in args) || typeof (args as { icon: string }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string')
  );
}

/**
 * Type guard for linear_archiveInitiative tool arguments
 */
export function isArchiveInitiativeInput(args: unknown): args is {
  initiativeId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string'
  );
}

/**
 * Type guard for linear_deleteInitiative tool arguments
 */
export function isDeleteInitiativeInput(args: unknown): args is {
  initiativeId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string'
  );
}

/**
 * Type guard for linear_getInitiativeProjects tool arguments
 */
export function isGetInitiativeProjectsInput(args: unknown): args is {
  initiativeId: string;
  includeArchived?: boolean;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean')
  );
}

/**
 * Type guard for linear_addProjectToInitiative tool arguments
 */
export function isAddProjectToInitiativeInput(args: unknown): args is {
  initiativeId: string;
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

/**
 * Type guard for linear_removeProjectFromInitiative tool arguments
 */
export function isRemoveProjectFromInitiativeInput(args: unknown): args is {
  initiativeId: string;
  projectId: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'initiativeId' in args &&
    typeof (args as { initiativeId: string }).initiativeId === 'string' &&
    'projectId' in args &&
    typeof (args as { projectId: string }).projectId === 'string'
  );
}

export function isCustomerListArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  name?: string;
  domain?: string;
  statusId?: string;
  tierId?: string;
  ownerId?: string;
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('name' in args) || typeof (args as { name: unknown }).name === 'string') &&
    (!('domain' in args) || typeof (args as { domain: unknown }).domain === 'string') &&
    (!('statusId' in args) || typeof (args as { statusId: unknown }).statusId === 'string') &&
    (!('tierId' in args) || typeof (args as { tierId: unknown }).tierId === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: unknown }).ownerId === 'string')
  );
}

export function isCustomerIdArgs(args: unknown): args is { id: string } {
  return isJsonObject(args) && 'id' in args && typeof (args as { id: unknown }).id === 'string';
}

function hasCustomerFields(args: Record<string, unknown>) {
  return [
    'name',
    'domains',
    'externalIds',
    'logoUrl',
    'mainSourceId',
    'ownerId',
    'revenue',
    'size',
    'slackChannelId',
    'statusId',
    'tierId',
  ].some((key) => key in args && args[key] !== undefined);
}

function hasValidCustomerFields(args: Record<string, unknown>) {
  return (
    (!('name' in args) || typeof args.name === 'string') &&
    (!('domains' in args) || isStringArray(args.domains)) &&
    (!('externalIds' in args) || isStringArray(args.externalIds)) &&
    (!('logoUrl' in args) || typeof args.logoUrl === 'string') &&
    (!('mainSourceId' in args) || typeof args.mainSourceId === 'string') &&
    (!('ownerId' in args) || typeof args.ownerId === 'string') &&
    (!('revenue' in args) || isFiniteNumber(args.revenue)) &&
    (!('size' in args) || isFiniteNumber(args.size)) &&
    (!('slackChannelId' in args) || typeof args.slackChannelId === 'string') &&
    (!('statusId' in args) || typeof args.statusId === 'string') &&
    (!('tierId' in args) || typeof args.tierId === 'string')
  );
}

export function isCreateCustomerArgs(args: unknown): args is {
  name: string;
  domains?: string[];
  externalIds?: string[];
  logoUrl?: string;
  mainSourceId?: string;
  ownerId?: string;
  revenue?: number;
  size?: number;
  slackChannelId?: string;
  statusId?: string;
  tierId?: string;
} {
  return (
    isJsonObject(args) &&
    'name' in args &&
    isNonEmptyString((args as { name: unknown }).name) &&
    hasValidCustomerFields(args)
  );
}

export function isUpdateCustomerArgs(args: unknown): args is {
  id: string;
  name?: string;
  domains?: string[];
  externalIds?: string[];
  logoUrl?: string;
  mainSourceId?: string;
  ownerId?: string;
  revenue?: number;
  size?: number;
  slackChannelId?: string;
  statusId?: string;
  tierId?: string;
} {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasCustomerFields(args) &&
    hasValidCustomerFields(args)
  );
}

export function isCustomerNeedListArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  customerId?: string;
  issueId?: string;
  projectId?: string;
  priority?: number;
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('customerId' in args) || typeof (args as { customerId: unknown }).customerId === 'string') &&
    (!('issueId' in args) || typeof (args as { issueId: unknown }).issueId === 'string') &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string') &&
    (!('priority' in args) || isFiniteNumber((args as { priority: unknown }).priority))
  );
}

export function isCreateCustomerNeedArgs(args: unknown): args is {
  attachmentId?: string;
  attachmentUrl?: string;
  body?: string;
  commentId?: string;
  createdAt?: string;
  customerExternalId?: string;
  customerId?: string;
  issueId?: string;
  priority?: number;
  projectId?: string;
} {
  return (
    isJsonObject(args) &&
    (!('attachmentId' in args) || typeof (args as { attachmentId: unknown }).attachmentId === 'string') &&
    (!('attachmentUrl' in args) || typeof (args as { attachmentUrl: unknown }).attachmentUrl === 'string') &&
    (!('body' in args) || typeof (args as { body: unknown }).body === 'string') &&
    (!('commentId' in args) || typeof (args as { commentId: unknown }).commentId === 'string') &&
    (!('createdAt' in args) || typeof (args as { createdAt: unknown }).createdAt === 'string') &&
    (!('customerExternalId' in args) || typeof (args as { customerExternalId: unknown }).customerExternalId === 'string') &&
    (!('customerId' in args) || typeof (args as { customerId: unknown }).customerId === 'string') &&
    (!('issueId' in args) || typeof (args as { issueId: unknown }).issueId === 'string') &&
    (!('priority' in args) || isFiniteNumber((args as { priority: unknown }).priority)) &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string')
  );
}

export function isCreateCustomerNeedFromAttachmentArgs(args: unknown): args is {
  attachmentId: string;
  customerId?: string;
  customerExternalId?: string;
  priority?: number;
} {
  return (
    isJsonObject(args) &&
    'attachmentId' in args &&
    typeof (args as { attachmentId: unknown }).attachmentId === 'string' &&
    (!('customerId' in args) || typeof (args as { customerId: unknown }).customerId === 'string') &&
    (!('customerExternalId' in args) || typeof (args as { customerExternalId: unknown }).customerExternalId === 'string') &&
    (!('priority' in args) || isFiniteNumber((args as { priority: unknown }).priority))
  );
}

export function isUpdateCustomerNeedArgs(args: unknown): args is {
  id: string;
  applyPriorityToRelatedNeeds?: boolean;
  attachmentUrl?: string;
  body?: string;
  customerExternalId?: string;
  customerId?: string;
  issueId?: string;
  priority?: number;
  projectId?: string;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = [
    'applyPriorityToRelatedNeeds',
    'attachmentUrl',
    'body',
    'customerExternalId',
    'customerId',
    'issueId',
    'priority',
    'projectId',
  ].some((key) => key in args && args[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('applyPriorityToRelatedNeeds' in args) ||
      typeof (args as { applyPriorityToRelatedNeeds: unknown }).applyPriorityToRelatedNeeds === 'boolean') &&
    (!('attachmentUrl' in args) || typeof (args as { attachmentUrl: unknown }).attachmentUrl === 'string') &&
    (!('body' in args) || typeof (args as { body: unknown }).body === 'string') &&
    (!('customerExternalId' in args) || typeof (args as { customerExternalId: unknown }).customerExternalId === 'string') &&
    (!('customerId' in args) || typeof (args as { customerId: unknown }).customerId === 'string') &&
    (!('issueId' in args) || typeof (args as { issueId: unknown }).issueId === 'string') &&
    (!('priority' in args) || isFiniteNumber((args as { priority: unknown }).priority)) &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string')
  );
}

export function isCustomerMetadataListArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) || typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isPaginationOrderBy(value: unknown): value is 'createdAt' | 'updatedAt' {
  return value === 'createdAt' || value === 'updatedAt';
}

function isMilestoneStatus(value: unknown): value is 'done' | 'next' | 'overdue' | 'unstarted' {
  return value === 'done' || value === 'next' || value === 'overdue' || value === 'unstarted';
}

function isReleasePipelineType(value: unknown): value is 'continuous' | 'scheduled' {
  return value === 'continuous' || value === 'scheduled';
}

function isReleaseStageType(value: unknown): value is 'planned' | 'started' | 'completed' | 'canceled' {
  return value === 'planned' || value === 'started' || value === 'completed' || value === 'canceled';
}

/**
 * Type guard for linear_getDocuments tool arguments
 */
export function isGetDocumentsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  projectId?: string;
  initiativeId?: string;
  teamId?: string;
  issueId?: string;
  releaseId?: string;
  cycleId?: string;
  title?: string;
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string') &&
    (!('initiativeId' in args) ||
      typeof (args as { initiativeId: unknown }).initiativeId === 'string') &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('issueId' in args) || typeof (args as { issueId: unknown }).issueId === 'string') &&
    (!('releaseId' in args) || typeof (args as { releaseId: unknown }).releaseId === 'string') &&
    (!('cycleId' in args) || typeof (args as { cycleId: unknown }).cycleId === 'string') &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string')
  );
}

/**
 * Type guard for linear_getDocumentById tool arguments
 */
export function isGetDocumentByIdArgs(args: unknown): args is { id: string } {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string'
  );
}

/**
 * Type guard for linear_getProjectDocuments tool arguments
 */
export function isGetProjectDocumentsArgs(args: unknown): args is {
  projectId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return (
    isJsonObject(args) &&
    'projectId' in args &&
    typeof (args as { projectId: unknown }).projectId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string')
  );
}

function isParentDocumentsArgs(args: unknown, idKey: string): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} & Record<string, string> {
  return (
    isJsonObject(args) &&
    idKey in args &&
    typeof (args as Record<string, unknown>)[idKey] === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string')
  );
}

/**
 * Type guard for linear_getInitiativeDocuments tool arguments
 */
export function isGetInitiativeDocumentsArgs(args: unknown): args is {
  initiativeId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return isParentDocumentsArgs(args, 'initiativeId');
}

/**
 * Type guard for linear_getTeamDocuments tool arguments
 */
export function isGetTeamDocumentsArgs(args: unknown): args is {
  teamId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return (
    isJsonObject(args) &&
    'teamId' in args &&
    typeof (args as { teamId: unknown }).teamId === 'string' &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string')
  );
}

/**
 * Type guard for linear_getIssueDocuments tool arguments
 */
export function isGetIssueDocumentsArgs(args: unknown): args is {
  issueId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return isParentDocumentsArgs(args, 'issueId');
}

/**
 * Type guard for linear_getReleaseDocuments tool arguments
 */
export function isGetReleaseDocumentsArgs(args: unknown): args is {
  releaseId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return isParentDocumentsArgs(args, 'releaseId');
}

/**
 * Type guard for linear_getCycleDocuments tool arguments
 */
export function isGetCycleDocumentsArgs(args: unknown): args is {
  cycleId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  title?: string;
} {
  return isParentDocumentsArgs(args, 'cycleId');
}

/**
 * Type guard for linear_getTeamResources tool arguments
 */
export function isGetTeamResourcesArgs(args: unknown): args is { teamId: string } {
  return (
    isJsonObject(args) &&
    'teamId' in args &&
    typeof (args as { teamId: unknown }).teamId === 'string'
  );
}

/**
 * Type guard for linear_searchDocuments tool arguments
 */
export function isSearchDocumentsArgs(args: unknown): args is {
  term: string;
  teamId?: string;
  includeComments?: boolean;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
  snippetSize?: number;
} {
  return (
    isJsonObject(args) &&
    'term' in args &&
    isNonEmptyString((args as { term: unknown }).term) &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('includeComments' in args) ||
      typeof (args as { includeComments: unknown }).includeComments === 'boolean') &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: unknown }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy)) &&
    (!('snippetSize' in args) || isFiniteNumber((args as { snippetSize: unknown }).snippetSize))
  );
}

/**
 * Type guard for linear_getDocumentContentHistory tool arguments
 */
export function isGetDocumentContentHistoryArgs(args: unknown): args is { id: string } {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string'
  );
}

/**
 * Type guard for linear_createDocument tool arguments
 */
export function isCreateDocumentArgs(args: unknown): args is {
  title: string;
  content?: string;
  icon?: string;
  color?: string;
  projectId?: string;
  initiativeId?: string;
  teamId?: string;
  issueId?: string;
  releaseId?: string;
  cycleId?: string;
  resourceFolderId?: string;
  lastAppliedTemplateId?: string;
  sortOrder?: number;
} {
  return (
    isJsonObject(args) &&
    'title' in args &&
    isNonEmptyString((args as { title: unknown }).title) &&
    (!('content' in args) || typeof (args as { content: unknown }).content === 'string') &&
    (!('icon' in args) || typeof (args as { icon: unknown }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: unknown }).color === 'string') &&
    (!('projectId' in args) || typeof (args as { projectId: unknown }).projectId === 'string') &&
    (!('initiativeId' in args) ||
      typeof (args as { initiativeId: unknown }).initiativeId === 'string') &&
    (!('teamId' in args) || typeof (args as { teamId: unknown }).teamId === 'string') &&
    (!('issueId' in args) || typeof (args as { issueId: unknown }).issueId === 'string') &&
    (!('releaseId' in args) || typeof (args as { releaseId: unknown }).releaseId === 'string') &&
    (!('cycleId' in args) || typeof (args as { cycleId: unknown }).cycleId === 'string') &&
    (!('resourceFolderId' in args) ||
      typeof (args as { resourceFolderId: unknown }).resourceFolderId === 'string') &&
    (!('lastAppliedTemplateId' in args) ||
      typeof (args as { lastAppliedTemplateId: unknown }).lastAppliedTemplateId === 'string') &&
    (!('sortOrder' in args) || isFiniteNumber((args as { sortOrder: unknown }).sortOrder))
  );
}

/**
 * Type guard for linear_updateDocument tool arguments
 */
export function isUpdateDocumentArgs(args: unknown): args is {
  id: string;
  title?: string;
  content?: string | null;
  icon?: string | null;
  color?: string | null;
  hiddenAt?: string | null;
  projectId?: string | null;
  initiativeId?: string | null;
  teamId?: string | null;
  issueId?: string | null;
  releaseId?: string | null;
  cycleId?: string | null;
  resourceFolderId?: string | null;
  lastAppliedTemplateId?: string | null;
  sortOrder?: number;
  trashed?: boolean;
} {
  if (!isJsonObject(args)) {
    return false;
  }

  const hasUpdateField = [
    'title',
    'content',
    'icon',
    'color',
    'hiddenAt',
    'projectId',
    'initiativeId',
    'teamId',
    'issueId',
    'releaseId',
    'cycleId',
    'resourceFolderId',
    'lastAppliedTemplateId',
    'sortOrder',
    'trashed',
  ].some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string' &&
    hasUpdateField &&
    (!('title' in args) || typeof (args as { title: unknown }).title === 'string') &&
    (!('content' in args) || isNullableString((args as { content: unknown }).content)) &&
    (!('icon' in args) || isNullableString((args as { icon: unknown }).icon)) &&
    (!('color' in args) || isNullableString((args as { color: unknown }).color)) &&
    (!('hiddenAt' in args) || isNullableString((args as { hiddenAt: unknown }).hiddenAt)) &&
    (!('projectId' in args) || isNullableString((args as { projectId: unknown }).projectId)) &&
    (!('initiativeId' in args) || isNullableString((args as { initiativeId: unknown }).initiativeId)) &&
    (!('teamId' in args) || isNullableString((args as { teamId: unknown }).teamId)) &&
    (!('issueId' in args) || isNullableString((args as { issueId: unknown }).issueId)) &&
    (!('releaseId' in args) || isNullableString((args as { releaseId: unknown }).releaseId)) &&
    (!('cycleId' in args) || isNullableString((args as { cycleId: unknown }).cycleId)) &&
    (!('resourceFolderId' in args) ||
      isNullableString((args as { resourceFolderId: unknown }).resourceFolderId)) &&
    (!('lastAppliedTemplateId' in args) ||
      isNullableString((args as { lastAppliedTemplateId: unknown }).lastAppliedTemplateId)) &&
    (!('sortOrder' in args) || isFiniteNumber((args as { sortOrder: unknown }).sortOrder)) &&
    (!('trashed' in args) || typeof (args as { trashed: unknown }).trashed === 'boolean')
  );
}

/**
 * Type guard for linear_archiveDocument tool arguments
 */
export function isArchiveDocumentArgs(args: unknown): args is { id: string } {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string'
  );
}

/**
 * Type guard for linear_unarchiveDocument tool arguments
 */
export function isUnarchiveDocumentArgs(args: unknown): args is { id: string } {
  return (
    isJsonObject(args) &&
    'id' in args &&
    typeof (args as { id: unknown }).id === 'string'
  );
}

/**
 * Type guard for linear_getSavedViews tool arguments
 */
export function isGetSavedViewsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_createSavedView tool arguments
 */
export function isCreateSavedViewArgs(args: unknown): args is {
  name: string;
  description?: string;
  shared?: boolean;
  icon?: string;
  color?: string;
  teamId?: string;
  projectId?: string;
  ownerId?: string;
  filters?: Record<string, unknown>;
  filterData?: Record<string, unknown>;
  projectFilterData?: Record<string, unknown>;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    (!('description' in args) || typeof (args as { description: string }).description === 'string') &&
    (!('shared' in args) || typeof (args as { shared: boolean }).shared === 'boolean') &&
    (!('icon' in args) || typeof (args as { icon: string }).icon === 'string') &&
    (!('color' in args) || typeof (args as { color: string }).color === 'string') &&
    (!('teamId' in args) || typeof (args as { teamId: string }).teamId === 'string') &&
    (!('projectId' in args) || typeof (args as { projectId: string }).projectId === 'string') &&
    (!('ownerId' in args) || typeof (args as { ownerId: string }).ownerId === 'string') &&
    (!('filters' in args) || isJsonObject((args as { filters: unknown }).filters)) &&
    (!('filterData' in args) || isJsonObject((args as { filterData: unknown }).filterData)) &&
    (!('projectFilterData' in args) ||
      isJsonObject((args as { projectFilterData: unknown }).projectFilterData))
  );
}

/**
 * Type guard for linear_updateSavedView tool arguments
 */
export function isUpdateSavedViewArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string | null;
  shared?: boolean;
  icon?: string | null;
  color?: string | null;
  teamId?: string | null;
  projectId?: string | null;
  ownerId?: string | null;
  filters?: Record<string, unknown> | null;
  filterData?: Record<string, unknown> | null;
  projectFilterData?: Record<string, unknown> | null;
} {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const hasUpdateField = [
    'name',
    'description',
    'shared',
    'icon',
    'color',
    'teamId',
    'projectId',
    'ownerId',
    'filters',
    'filterData',
    'projectFilterData',
  ].some((key) => key in args && (args as Record<string, unknown>)[key] !== undefined);

  return (
    'id' in args &&
    typeof (args as { id: string }).id === 'string' &&
    hasUpdateField &&
    (!('name' in args) || typeof (args as { name: string }).name === 'string') &&
    (!('description' in args) || isNullableString((args as { description: unknown }).description)) &&
    (!('shared' in args) || typeof (args as { shared: boolean }).shared === 'boolean') &&
    (!('icon' in args) || isNullableString((args as { icon: unknown }).icon)) &&
    (!('color' in args) || isNullableString((args as { color: unknown }).color)) &&
    (!('teamId' in args) || isNullableString((args as { teamId: unknown }).teamId)) &&
    (!('projectId' in args) || isNullableString((args as { projectId: unknown }).projectId)) &&
    (!('ownerId' in args) || isNullableString((args as { ownerId: unknown }).ownerId)) &&
    (!('filters' in args) ||
      (args as { filters: unknown }).filters === null || isJsonObject((args as { filters: unknown }).filters)) &&
    (!('filterData' in args) ||
      (args as { filterData: unknown }).filterData === null ||
      isJsonObject((args as { filterData: unknown }).filterData)) &&
    (!('projectFilterData' in args) ||
      (args as { projectFilterData: unknown }).projectFilterData === null ||
      isJsonObject((args as { projectFilterData: unknown }).projectFilterData))
  );
}

/**
 * Type guard for linear_deleteSavedView tool arguments
 */
export function isDeleteSavedViewArgs(args: unknown): args is { id: string } {
  return (
    typeof args === 'object' &&
    args !== null &&
    'id' in args &&
    typeof (args as { id: string }).id === 'string'
  );
}

/**
 * Type guard for linear_getFavoriteViews tool arguments
 */
export function isGetFavoriteViewsArgs(args: unknown): args is {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: 'createdAt' | 'updatedAt';
} {
  return (
    isJsonObject(args) &&
    (!('limit' in args) || isPositiveInteger((args as { limit: unknown }).limit)) &&
    (!('includeArchived' in args) ||
      typeof (args as { includeArchived: boolean }).includeArchived === 'boolean') &&
    (!('orderBy' in args) || isPaginationOrderBy((args as { orderBy: unknown }).orderBy))
  );
}

/**
 * Type guard for linear_addToFavorites tool arguments
 */
export function isAddToFavoritesArgs(args: unknown): args is { entityId: string } {
  return (
    isJsonObject(args) &&
    'entityId' in args &&
    typeof (args as { entityId: unknown }).entityId === 'string'
  );
}

/**
 * Type guard for linear_removeFromFavorites tool arguments
 */
export function isRemoveFromFavoritesArgs(args: unknown): args is {
  favoriteId?: string;
  entityId?: string;
} {
  return (
    isJsonObject(args) &&
    (typeof (args as { favoriteId?: unknown }).favoriteId === 'string' ||
      typeof (args as { entityId?: unknown }).entityId === 'string') &&
    (!('favoriteId' in args) || typeof (args as { favoriteId: unknown }).favoriteId === 'string') &&
    (!('entityId' in args) || typeof (args as { entityId: unknown }).entityId === 'string')
  );
}
