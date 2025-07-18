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
  issueId: string;
  body: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'issueId' in args &&
    typeof (args as { issueId: string }).issueId === 'string' &&
    'body' in args &&
    typeof (args as { body: string }).body === 'string'
  );
}

/**
 * Type guard for linear_createProject tool arguments
 */
export function isCreateProjectArgs(args: unknown): args is {
  name: string;
  description?: string;
  content?: string;
  teamIds: string[];
  state?: string;
} {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: string }).name === 'string' &&
    'teamIds' in args &&
    Array.isArray((args as { teamIds: string[] }).teamIds)
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
 * Type guard for linear_updateProject tool arguments
 */
export function isUpdateProjectArgs(args: unknown): args is {
  id: string;
  name?: string;
  description?: string;
  content?: string;
  state?: string;
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
    (!('state' in args) || typeof (args as { state: string }).state === 'string')
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
 * Type guard for linear_getProjectIssues tool arguments
 */
export function isGetProjectIssuesArgs(args: unknown): args is {
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
    (!('status' in args) || typeof (args as { status: string }).status === 'string') &&
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
    (!('status' in args) || typeof (args as { status: string }).status === 'string') &&
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
    typeof args === 'object' &&
    args !== null &&
    (!('teamId' in args) || typeof (args as { teamId: string }).teamId === 'string') &&
    (!('limit' in args) || typeof (args as { limit: number }).limit === 'number')
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
    (!('status' in args) || typeof (args as { status: string }).status === 'string') &&
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
    (!('status' in args) || typeof (args as { status: string }).status === 'string') &&
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
