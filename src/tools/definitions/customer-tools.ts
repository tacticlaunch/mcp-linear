import { MCPToolDefinition } from '../../types.js';

const positiveLimitSchema = { type: 'integer', minimum: 1 };
const orderBySchema = { type: 'string', enum: ['createdAt', 'updatedAt'] };

const customerStatusOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    displayName: { type: ['string', 'null'] },
    type: { type: ['string', 'null'] },
    color: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    position: { type: ['number', 'null'] },
    createdAt: { type: ['string', 'null'] },
    updatedAt: { type: ['string', 'null'] },
    archivedAt: { type: ['string', 'null'] },
  },
};

const customerTierOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    displayName: { type: ['string', 'null'] },
    color: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    position: { type: ['number', 'null'] },
    createdAt: { type: ['string', 'null'] },
    updatedAt: { type: ['string', 'null'] },
    archivedAt: { type: ['string', 'null'] },
  },
};

const customerOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    slugId: { type: ['string', 'null'] },
    domains: { type: 'array', items: { type: 'string' } },
    externalIds: { type: 'array', items: { type: 'string' } },
    logoUrl: { type: ['string', 'null'] },
    mainSourceId: { type: ['string', 'null'] },
    revenue: { type: ['number', 'null'] },
    size: { type: ['number', 'null'] },
    slackChannelId: { type: ['string', 'null'] },
    approximateNeedCount: { type: ['number', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    archivedAt: { type: ['string', 'null'] },
    url: { type: ['string', 'null'] },
    owner: { type: ['object', 'null'] },
    status: { type: ['object', 'null'] },
    tier: { type: ['object', 'null'] },
  },
};

const customerNeedOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    body: { type: ['string', 'null'] },
    content: { type: ['string', 'null'] },
    priority: { type: ['number', 'null'] },
    url: { type: ['string', 'null'] },
    attachmentId: { type: ['string', 'null'] },
    commentId: { type: ['string', 'null'] },
    customerId: { type: ['string', 'null'] },
    issueId: { type: ['string', 'null'] },
    originalIssueId: { type: ['string', 'null'] },
    projectId: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    archivedAt: { type: ['string', 'null'] },
    customer: { type: ['object', 'null'] },
    issue: { type: ['object', 'null'] },
    originalIssue: { type: ['object', 'null'] },
    project: { type: ['object', 'null'] },
    creator: { type: ['object', 'null'] },
    projectAttachment: { type: ['object', 'null'] },
    updatedRelatedNeeds: { type: 'array', items: { type: 'object' } },
  },
};

const deleteOutputSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    id: { type: 'string' },
  },
};

const customerInputProperties = {
  name: { type: 'string', description: 'Customer name' },
  domains: { type: 'array', items: { type: 'string' }, description: 'Customer email domains' },
  externalIds: { type: 'array', items: { type: 'string' }, description: 'External system IDs' },
  logoUrl: { type: 'string', description: 'Customer logo URL' },
  mainSourceId: { type: 'string', description: 'Primary external source ID' },
  ownerId: { type: 'string', description: 'Owner user ID' },
  revenue: { type: 'number', description: 'Annual customer revenue' },
  size: { type: 'number', description: 'Customer employee or seat count' },
  slackChannelId: { type: 'string', description: 'Linked Slack channel ID' },
  statusId: { type: 'string', description: 'Customer status ID' },
  tierId: { type: 'string', description: 'Customer tier ID' },
};

const customerNeedCreateProperties = {
  attachmentId: { type: 'string', description: 'Issue attachment ID associated with the need' },
  attachmentUrl: { type: 'string', description: 'Attachment URL for the need source' },
  body: { type: 'string', description: 'Need content in Markdown' },
  commentId: { type: 'string', description: 'Comment ID associated with the need' },
  createdAt: { type: 'string', description: 'Optional creation timestamp (ISO 8601)' },
  customerExternalId: { type: 'string', description: 'External customer ID' },
  customerId: { type: 'string', description: 'Linear customer ID' },
  issueId: { type: 'string', description: 'Issue ID linked to the need' },
  priority: { type: 'number', description: 'Need priority: 0 not important, 1 important' },
  projectId: { type: 'string', description: 'Project ID linked to the need' },
};

export const customerToolDefinitions: MCPToolDefinition[] = [
  {
    name: 'linear_getCustomers',
    description: 'Get customers from Linear',
    input_schema: {
      type: 'object',
      properties: {
        limit: { ...positiveLimitSchema, description: 'Maximum customers to return (default: 25)' },
        includeArchived: { type: 'boolean', description: 'Include archived customers' },
        orderBy: { ...orderBySchema, description: 'Sort customers by created or updated date' },
        name: { type: 'string', description: 'Filter customers by name' },
        domain: { type: 'string', description: 'Filter customers by domain' },
        statusId: { type: 'string', description: 'Filter customers by status ID' },
        tierId: { type: 'string', description: 'Filter customers by tier ID' },
        ownerId: { type: 'string', description: 'Filter customers by owner user ID' },
      },
    },
    output_schema: { type: 'array', items: customerOutputSchema },
  },
  {
    name: 'linear_getCustomerById',
    description: 'Get a customer by ID',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer ID' } },
      required: ['id'],
    },
    output_schema: customerOutputSchema,
  },
  {
    name: 'linear_createCustomer',
    description: 'Create a customer',
    input_schema: {
      type: 'object',
      properties: customerInputProperties,
      required: ['name'],
    },
    output_schema: customerOutputSchema,
  },
  {
    name: 'linear_updateCustomer',
    description: 'Update a customer',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        ...customerInputProperties,
      },
      required: ['id'],
    },
    output_schema: customerOutputSchema,
  },
  {
    name: 'linear_deleteCustomer',
    description: 'Delete a customer',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer ID' } },
      required: ['id'],
    },
    output_schema: deleteOutputSchema,
  },
  {
    name: 'linear_getCustomerNeeds',
    description: 'Get customer needs from Linear',
    input_schema: {
      type: 'object',
      properties: {
        limit: { ...positiveLimitSchema, description: 'Maximum needs to return (default: 25)' },
        includeArchived: { type: 'boolean', description: 'Include archived needs' },
        orderBy: { ...orderBySchema, description: 'Sort needs by created or updated date' },
        customerId: { type: 'string', description: 'Filter by customer ID' },
        issueId: { type: 'string', description: 'Filter by issue ID' },
        projectId: { type: 'string', description: 'Filter by project ID' },
        priority: { type: 'number', description: 'Filter by priority' },
      },
    },
    output_schema: { type: 'array', items: customerNeedOutputSchema },
  },
  {
    name: 'linear_getCustomerNeedById',
    description: 'Get a customer need by ID',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer need ID' } },
      required: ['id'],
    },
    output_schema: customerNeedOutputSchema,
  },
  {
    name: 'linear_createCustomerNeed',
    description: 'Create a customer need linked to an issue or project',
    input_schema: {
      type: 'object',
      properties: customerNeedCreateProperties,
    },
    output_schema: customerNeedOutputSchema,
  },
  {
    name: 'linear_createCustomerNeedFromAttachment',
    description: 'Create or unarchive a customer need from an existing attachment',
    input_schema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID to convert into a need' },
        customerId: { type: 'string', description: 'Linear customer ID' },
        customerExternalId: { type: 'string', description: 'External customer ID' },
        priority: { type: 'number', description: 'Need priority: 0 not important, 1 important' },
      },
      required: ['attachmentId'],
    },
    output_schema: customerNeedOutputSchema,
  },
  {
    name: 'linear_updateCustomerNeed',
    description: 'Update a customer need',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer need ID' },
        applyPriorityToRelatedNeeds: {
          type: 'boolean',
          description: 'Apply priority changes to related needs on the same issue or project',
        },
        attachmentUrl: { type: 'string', description: 'Updated attachment URL' },
        body: { type: 'string', description: 'Updated need content in Markdown' },
        customerExternalId: { type: 'string', description: 'External customer ID' },
        customerId: { type: 'string', description: 'Linear customer ID' },
        issueId: { type: 'string', description: 'Issue ID linked to the need' },
        priority: { type: 'number', description: 'Need priority: 0 not important, 1 important' },
        projectId: { type: 'string', description: 'Project ID linked to the need' },
      },
      required: ['id'],
    },
    output_schema: customerNeedOutputSchema,
  },
  {
    name: 'linear_archiveCustomerNeed',
    description: 'Archive a customer need',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer need ID' } },
      required: ['id'],
    },
    output_schema: deleteOutputSchema,
  },
  {
    name: 'linear_unarchiveCustomerNeed',
    description: 'Restore an archived customer need',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer need ID' } },
      required: ['id'],
    },
    output_schema: deleteOutputSchema,
  },
  {
    name: 'linear_deleteCustomerNeed',
    description: 'Delete a customer need',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Customer need ID' } },
      required: ['id'],
    },
    output_schema: deleteOutputSchema,
  },
  {
    name: 'linear_getCustomerStatuses',
    description: 'Get customer statuses from Linear',
    input_schema: {
      type: 'object',
      properties: {
        limit: { ...positiveLimitSchema, description: 'Maximum statuses to return (default: 25)' },
        includeArchived: { type: 'boolean', description: 'Include archived statuses' },
        orderBy: { ...orderBySchema, description: 'Sort statuses by created or updated date' },
      },
    },
    output_schema: { type: 'array', items: customerStatusOutputSchema },
  },
  {
    name: 'linear_getCustomerTiers',
    description: 'Get customer tiers from Linear',
    input_schema: {
      type: 'object',
      properties: {
        limit: { ...positiveLimitSchema, description: 'Maximum tiers to return (default: 25)' },
        includeArchived: { type: 'boolean', description: 'Include archived tiers' },
        orderBy: { ...orderBySchema, description: 'Sort tiers by created or updated date' },
      },
    },
    output_schema: { type: 'array', items: customerTierOutputSchema },
  },
];
