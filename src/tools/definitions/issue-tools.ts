import { MCPToolDefinition } from '../../types.js';

const jsonValueSchema = {
  anyOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean' },
    { type: 'null' },
    { type: 'array', items: {} },
    { type: 'object', additionalProperties: true },
  ],
};

const customFieldDefinitionSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    type: { type: 'string' },
    required: { type: 'boolean' },
    team: { type: 'object' },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          color: { type: 'string' },
          raw: { type: 'object', additionalProperties: true },
        },
      },
    },
    raw: { type: 'object', additionalProperties: true },
  },
};

const issueCustomFieldValueSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    customFieldId: { type: 'string' },
    name: { type: 'string' },
    type: { type: 'string' },
    value: jsonValueSchema,
    displayValue: { type: 'string' },
    customField: customFieldDefinitionSchema,
    raw: { type: 'object', additionalProperties: true },
  },
};

/**
 * Tool definition for getting issues
 */
export const getIssuesToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssues',
  description: 'Get a list of recent issues from Linear',
  input_schema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of issues to return (default: 10)',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        identifier: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        state: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            color: { type: 'string' },
            type: { type: 'string' },
          },
        },
        priority: { type: 'number' },
        estimate: { type: 'number' },
        dueDate: { type: 'string' },
        team: { type: 'object' },
        assignee: { type: 'object' },
        project: { type: 'object' },
        cycle: { type: 'object' },
        projectMilestone: { type: 'object' },
        parent: { type: 'object' },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' },
            },
          },
        },
        sortOrder: { type: 'number' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        url: { type: 'string' },
      },
    },
  },
};

/**
 * Tool definition for getting issue by ID
 */
export const getIssueByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssueById',
  description: 'Get a specific issue by ID or identifier (e.g., ABC-123)',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID or identifier of the issue (e.g., ABC-123)',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      identifier: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      state: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          color: { type: 'string' },
          type: { type: 'string' },
        },
      },
      priority: { type: 'number' },
      estimate: { type: 'number' },
      dueDate: { type: 'string' },
      team: { type: 'object' },
      assignee: { type: 'object' },
      project: { type: 'object' },
      cycle: { type: 'object' },
      projectMilestone: { type: 'object' },
      parent: { type: 'object' },
      labels: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            color: { type: 'string' },
          },
        },
      },
      sortOrder: { type: 'number' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      url: { type: 'string' },
      comments: { type: 'array' },
    },
  },
};

/**
 * Tool definition for getting custom field definitions
 */
export const getCustomFieldsToolDefinition: MCPToolDefinition = {
  name: 'linear_getCustomFields',
  description: 'Get the custom field definitions available in the authenticated Linear workspace',
  input_schema: {
    type: 'object',
    properties: {},
    required: [],
  },
  output_schema: {
    type: 'array',
    items: customFieldDefinitionSchema,
  },
};

/**
 * Tool definition for getting custom field values for an issue
 */
export const getIssueCustomFieldsToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssueCustomFields',
  description: 'Get the custom field values that are currently set on a specific issue',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue (e.g., ABC-123)',
      },
    },
    required: ['issueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      issueId: { type: 'string' },
      identifier: { type: 'string' },
      customFields: {
        type: 'array',
        items: issueCustomFieldValueSchema,
      },
    },
  },
};

/**
 * Tool definition for updating a custom field value on an issue
 */
export const updateIssueCustomFieldToolDefinition: MCPToolDefinition = {
  name: 'linear_updateIssueCustomField',
  description: 'Set or clear a custom field value on an issue. Pass null as value to clear it.',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue whose custom field should be updated',
      },
      customFieldId: {
        type: 'string',
        description: 'ID of the custom field definition to update',
      },
      value: {
        ...jsonValueSchema,
        description:
          'JSON-compatible value to write. Use null to clear the field. Arrays and objects are passed through as-is when the Linear schema accepts them.',
      },
    },
    required: ['issueId', 'customFieldId', 'value'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issueId: { type: 'string' },
      customFieldId: { type: 'string' },
      value: jsonValueSchema,
      currentValue: issueCustomFieldValueSchema,
      raw: { type: 'object', additionalProperties: true },
    },
  },
};

/**
 * Tool definition for searching issues
 */
export const searchIssuesToolDefinition: MCPToolDefinition = {
  name: 'linear_searchIssues',
  description: 'Search for issues with various filters',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Text to search for in issue title or description',
      },
      teamId: {
        type: 'string',
        description: 'Filter issues by team ID',
      },
      assigneeId: {
        type: 'string',
        description: 'Filter issues by assignee ID',
      },
      projectId: {
        type: 'string',
        description: 'Filter issues by project ID',
      },
      states: {
        type: 'array',
        items: { type: 'string' },
        description: "Filter issues by state name (e.g., 'Todo', 'In Progress', 'Done')",
      },
      limit: {
        type: 'number',
        description: 'Maximum number of issues to return (default: 10)',
      },
    },
    required: [],
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        identifier: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        state: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            color: { type: 'string' },
            type: { type: 'string' },
          },
        },
        priority: { type: 'number' },
        estimate: { type: 'number' },
        dueDate: { type: 'string' },
        team: { type: 'object' },
        assignee: { type: 'object' },
        project: { type: 'object' },
        cycle: { type: 'object' },
        projectMilestone: { type: 'object' },
        parent: { type: 'object' },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' },
            },
          },
        },
        sortOrder: { type: 'number' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        url: { type: 'string' },
      },
    },
  },
};

/**
 * Tool definition for creating an issue
 */
export const createIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_createIssue',
  description: 'Create a new issue in Linear',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the issue',
      },
      description: {
        type: 'string',
        description: 'Description of the issue (Markdown supported)',
      },
      teamId: {
        type: 'string',
        description: 'ID of the team the issue belongs to',
      },
      assigneeId: {
        type: 'string',
        description: 'ID of the user to assign the issue to',
      },
      priority: {
        type: 'number',
        description:
          'Priority of the issue (0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low)',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project the issue belongs to',
      },
      projectMilestoneId: {
        type: 'string',
        description: 'ID of the project milestone the issue belongs to',
      },
      cycleId: {
        type: 'string',
        description: 'ID of the cycle to add the issue to',
      },
      estimate: {
        type: 'number',
        description: 'The estimated complexity/points for the issue',
      },
      dueDate: {
        type: 'string',
        description: 'The date at which the issue is due (YYYY-MM-DD format)',
      },
      labelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of the labels to attach to the issue',
      },
      parentId: {
        type: 'string',
        description: 'ID of the parent issue (to create as a sub-task)',
      },
      subscriberIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of the users to subscribe to the issue',
      },
      stateId: {
        type: 'string',
        description: 'ID of the workflow state for the issue',
      },
      templateId: {
        type: 'string',
        description: 'ID of a template to use for creating the issue',
      },
      sortOrder: {
        type: 'number',
        description: 'The position of the issue in relation to other issues',
      },
    },
    required: ['title', 'teamId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      identifier: { type: 'string' },
      title: { type: 'string' },
      url: { type: 'string' },
    },
  },
};

/**
 * Tool definition for updating an issue
 */
export const updateIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_updateIssue',
  description: 'Update an existing issue in Linear',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID or identifier of the issue to update (e.g., ABC-123)',
      },
      title: {
        type: 'string',
        description: 'New title for the issue',
      },
      description: {
        type: 'string',
        description: 'New description for the issue (Markdown supported)',
      },
      stateId: {
        type: 'string',
        description: 'ID of the new state for the issue',
      },
      priority: {
        type: 'number',
        description:
          'New priority for the issue (0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low)',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to move the issue to',
      },
      projectMilestoneId: {
        type: 'string',
        description: 'ID of the project milestone to assign to the issue',
      },
      assigneeId: {
        type: 'string',
        description: 'ID of the user to assign the issue to, or null to unassign',
      },
      cycleId: {
        type: 'string',
        description: 'ID of the cycle to move the issue to, or null to remove from current cycle',
      },
      estimate: {
        type: 'number',
        description: 'The estimated complexity/points for the issue',
      },
      dueDate: {
        type: 'string',
        description: 'The new due date for the issue (YYYY-MM-DD format), or null to remove',
      },
      labelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of the labels to set on the issue (replacing existing labels)',
      },
      addedLabelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of labels to add to the issue (without removing existing ones)',
      },
      removedLabelIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of labels to remove from the issue',
      },
      parentId: {
        type: 'string',
        description: 'ID of the parent issue, or null to convert to a regular issue',
      },
      subscriberIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'IDs of the users to subscribe to the issue (replacing existing subscribers)',
      },
      teamId: {
        type: 'string',
        description: 'ID of the team to move the issue to',
      },
      sortOrder: {
        type: 'number',
        description: 'The position of the issue in relation to other issues',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      identifier: { type: 'string' },
      title: { type: 'string' },
      url: { type: 'string' },
    },
  },
};

/**
 * Tool definition for creating a comment
 */
export const createCommentToolDefinition: MCPToolDefinition = {
  name: 'linear_createComment',
  description:
    'Add a comment to an issue, project, initiative, update, document content, or as a threaded reply',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to comment on (e.g., ABC-123)',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to comment on',
      },
      initiativeId: {
        type: 'string',
        description: 'ID of the initiative to comment on',
      },
      projectUpdateId: {
        type: 'string',
        description: 'ID of the project update to comment on',
      },
      initiativeUpdateId: {
        type: 'string',
        description: 'ID of the initiative update to comment on',
      },
      documentContentId: {
        type: 'string',
        description: 'ID of the document content to anchor an inline comment to',
      },
      postId: {
        type: 'string',
        description: 'ID of the post to comment on',
      },
      body: {
        type: 'string',
        description: 'Text of the comment (Markdown supported)',
      },
      parentId: {
        type: 'string',
        description: 'ID of the parent comment to reply to (for threaded comments)',
      },
      quotedText: {
        type: 'string',
        description: 'Optional quoted text for inline comments',
      },
      subscriberIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional user IDs to subscribe to the comment target',
      },
    },
    required: ['body'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      body: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      url: { type: 'string' },
      parentId: { type: 'string' },
      issue: { type: ['object', 'null'] },
      project: { type: ['object', 'null'] },
      initiative: { type: ['object', 'null'] },
      projectUpdate: { type: ['object', 'null'] },
      initiativeUpdate: { type: ['object', 'null'] },
      user: { type: ['object', 'null'] },
    },
  },
};

export const updateCommentToolDefinition: MCPToolDefinition = {
  name: 'linear_updateComment',
  description: 'Update an existing comment',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the comment to update' },
      body: { type: 'string', description: 'Updated comment body' },
      quotedText: { type: 'string', description: 'Optional quoted text for inline comments' },
      resolvingCommentId: { type: 'string', description: 'Optional resolving comment ID' },
      resolvingUserId: { type: 'string', description: 'Optional resolving user ID' },
      subscriberIds: { type: 'array', items: { type: 'string' }, description: 'Optional subscriber IDs' },
      doNotSubscribeToIssue: { type: 'boolean', description: 'Prevent auto subscription on update' },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      body: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      editedAt: { type: ['string', 'null'] },
      quotedText: { type: ['string', 'null'] },
      url: { type: 'string' },
      issue: { type: ['object', 'null'] },
      parent: { type: ['object', 'null'] },
      user: { type: ['object', 'null'] },
    },
  },
};

export const deleteCommentToolDefinition: MCPToolDefinition = {
  name: 'linear_deleteComment',
  description: 'Delete a comment',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the comment to delete' },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
    },
  },
};

/**
 * Tool definition for adding a label to an issue
 */
export const addIssueLabelToolDefinition: MCPToolDefinition = {
  name: 'linear_addIssueLabel',
  description: 'Add a label to an issue in Linear',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to add the label to (e.g., ABC-123)',
      },
      labelId: {
        type: 'string',
        description: 'ID of the label to add to the issue',
      },
    },
    required: ['issueId', 'labelId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issueId: { type: 'string' },
      labelId: { type: 'string' },
    },
  },
};

/**
 * Tool definition for removing a label from an issue
 */
export const removeIssueLabelToolDefinition: MCPToolDefinition = {
  name: 'linear_removeIssueLabel',
  description: 'Remove a label from an issue in Linear',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to remove the label from (e.g., ABC-123)',
      },
      labelId: {
        type: 'string',
        description: 'ID of the label to remove from the issue',
      },
    },
    required: ['issueId', 'labelId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issueId: { type: 'string' },
      labelId: { type: 'string' },
    },
  },
};

/**
 * Tool definition for assigning an issue to a user
 */
export const assignIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_assignIssue',
  description: 'Assign an issue to a user',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to assign (e.g., ABC-123)',
      },
      assigneeId: {
        type: 'string',
        description: 'ID of the user to assign the issue to, or null to unassign',
      },
    },
    required: ['issueId', 'assigneeId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          assignee: { type: 'object' },
          url: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for subscribing to issue updates
 */
export const subscribeToIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_subscribeToIssue',
  description: 'Subscribe to issue updates',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to subscribe to (e.g., ABC-123)',
      },
    },
    required: ['issueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
};

/**
 * Tool definition for converting an issue to a subtask
 */
export const convertIssueToSubtaskToolDefinition: MCPToolDefinition = {
  name: 'linear_convertIssueToSubtask',
  description: 'Convert an issue to a subtask',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to convert (e.g., ABC-123)',
      },
      parentIssueId: {
        type: 'string',
        description: 'ID or identifier of the parent issue (e.g., ABC-456)',
      },
    },
    required: ['issueId', 'parentIssueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          parent: { type: 'object' },
          url: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for creating issue relations
 */
export const createIssueRelationToolDefinition: MCPToolDefinition = {
  name: 'linear_createIssueRelation',
  description: 'Create relations between issues (blocks, is blocked by, etc.)',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the first issue (e.g., ABC-123)',
      },
      relatedIssueId: {
        type: 'string',
        description: 'ID or identifier of the second issue (e.g., ABC-456)',
      },
      type: {
        type: 'string',
        description:
          "Type of relation: 'blocks', 'blocked_by', 'related', 'duplicate', 'duplicate_of'",
        enum: ['blocks', 'blocked_by', 'related', 'duplicate', 'duplicate_of'],
      },
    },
    required: ['issueId', 'relatedIssueId', 'type'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      relation: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          issueIdentifier: { type: 'string' },
          relatedIssueIdentifier: { type: 'string' },
        },
      },
    },
  },
};

export const deleteIssueRelationToolDefinition: MCPToolDefinition = {
  name: 'linear_deleteIssueRelation',
  description: 'Delete an issue relation by ID',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the issue relation to delete',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      id: { type: 'string' },
    },
  },
};

/**
 * Tool definition for archiving an issue
 */
export const archiveIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveIssue',
  description: 'Archive an issue',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to archive (e.g., ABC-123)',
      },
    },
    required: ['issueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
};

/**
 * Tool definition for setting issue priority
 */
export const setIssuePriorityToolDefinition: MCPToolDefinition = {
  name: 'linear_setIssuePriority',
  description: 'Set the priority of an issue',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue (e.g., ABC-123)',
      },
      priority: {
        type: 'number',
        description: 'Priority level (0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low)',
        enum: [0, 1, 2, 3, 4],
      },
    },
    required: ['issueId', 'priority'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          priority: { type: 'number' },
          url: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for transferring an issue to another team
 */
export const transferIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_transferIssue',
  description: 'Transfer an issue to another team',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to transfer (e.g., ABC-123)',
      },
      teamId: {
        type: 'string',
        description: 'ID of the team to transfer the issue to',
      },
    },
    required: ['issueId', 'teamId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      issue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          team: { type: 'object' },
          url: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for duplicating an issue
 */
export const duplicateIssueToolDefinition: MCPToolDefinition = {
  name: 'linear_duplicateIssue',
  description: 'Duplicate an issue',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to duplicate (e.g., ABC-123)',
      },
    },
    required: ['issueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      originalIssue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
        },
      },
      duplicatedIssue: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          identifier: { type: 'string' },
          title: { type: 'string' },
          url: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Tool definition for getting issue history
 */
export const getIssueHistoryToolDefinition: MCPToolDefinition = {
  name: 'linear_getIssueHistory',
  description: 'Get the history of changes made to an issue',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue (e.g., ABC-123)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of history events to return (default: 10)',
      },
    },
    required: ['issueId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      issueId: { type: 'string' },
      identifier: { type: 'string' },
      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            createdAt: { type: 'string' },
            actor: { type: 'object' },
            type: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' },
          },
        },
      },
    },
  },
};

/**
 * Tool definition for getting comments for an issue
 */
export const getCommentsToolDefinition: MCPToolDefinition = {
  name: 'linear_getComments',
  description: 'Get comments for an issue, project, initiative, update, or document content',
  input_schema: {
    type: 'object',
    properties: {
      issueId: {
        type: 'string',
        description: 'ID or identifier of the issue to get comments from (e.g., ABC-123)',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to get comments from',
      },
      initiativeId: {
        type: 'string',
        description: 'ID of the initiative to get comments from',
      },
      projectUpdateId: {
        type: 'string',
        description: 'ID of the project update to get comments from',
      },
      initiativeUpdateId: {
        type: 'string',
        description: 'ID of the initiative update to get comments from',
      },
      documentContentId: {
        type: 'string',
        description: 'ID of the document content to get inline comments from',
      },
      postId: {
        type: 'string',
        description: 'ID of the post to get comments from',
      },
      limit: {
        type: 'integer',
        minimum: 1,
        description: 'Maximum number of comments to return (default: 25)',
      },
      cursor: {
        type: 'string',
        description: 'Pagination cursor returned by Linear',
      },
      orderBy: {
        type: 'string',
        enum: ['createdAt', 'updatedAt'],
        description: 'Sort comments by created or updated date',
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        body: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        quotedText: { type: ['string', 'null'] },
        issue: { type: ['object', 'null'] },
        project: { type: ['object', 'null'] },
        initiative: { type: ['object', 'null'] },
        projectUpdate: { type: ['object', 'null'] },
        initiativeUpdate: { type: ['object', 'null'] },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        url: { type: 'string' },
      },
    },
  },
};
