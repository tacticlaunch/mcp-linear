import type { GetPromptResult, Prompt } from '@modelcontextprotocol/sdk/types.js';

const prompts: Prompt[] = [
  {
    name: 'summarize-project-status',
    description: 'Summarize project status using Linear project, issue, and document resources',
    arguments: [
      { name: 'projectId', description: 'Linear project ID to summarize', required: true },
      { name: 'focus', description: 'Optional focus area such as risks, scope, or delivery' },
    ],
  },
  {
    name: 'draft-project-update',
    description: 'Draft a project update using current project issues and documents',
    arguments: [
      { name: 'projectId', description: 'Linear project ID to use for the update', required: true },
      { name: 'audience', description: 'Optional audience such as execs, eng, or customers' },
    ],
  },
  {
    name: 'triage-issue',
    description: 'Triage a Linear issue using the canonical issue resource',
    arguments: [{ name: 'issueId', description: 'Linear issue ID or identifier', required: true }],
  },
  {
    name: 'summarize-document',
    description: 'Summarize a Linear document and connect it to the surrounding project context',
    arguments: [{ name: 'documentId', description: 'Linear document ID', required: true }],
  },
];

export function getLinearPromptDefinitions(): Prompt[] {
  return prompts;
}

export function getLinearPrompt(
  name: string,
  args: Record<string, string> = {},
): GetPromptResult {
  switch (name) {
    case 'summarize-project-status': {
      const projectId = args.projectId;
      if (!projectId) {
        throw new Error('summarize-project-status requires projectId');
      }
      const focus = args.focus ? `Pay extra attention to ${args.focus}.` : '';
      return {
        description: 'Summarize the status of a Linear project using project, issue, and document resources.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Summarize the current status of Linear project ${projectId}. ` +
                `Use these resources:\n` +
                `- linear://project/${projectId}\n` +
                `- linear://project/${projectId}/issues?limit=25&orderBy=updatedAt&includeCompleted=false\n` +
                `- linear://project/${projectId}/documents?limit=10&orderBy=updatedAt\n` +
                `Call out progress, blockers, risks, and next steps. ${focus}`,
            },
          },
        ],
      };
    }
    case 'draft-project-update': {
      const projectId = args.projectId;
      if (!projectId) {
        throw new Error('draft-project-update requires projectId');
      }
      const audience = args.audience ? `Write it for ${args.audience}.` : '';
      return {
        description: 'Draft a project update from current project state, issues, and documents.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Draft a concise project update for Linear project ${projectId}. ` +
                `Use these resources first:\n` +
                `- linear://project/${projectId}\n` +
                `- linear://project/${projectId}/issues?limit=25&orderBy=updatedAt&includeCompleted=false\n` +
                `- linear://project/${projectId}/documents?limit=10&orderBy=updatedAt\n` +
                `Return a short summary, key wins, risks, and asks. ${audience}`,
            },
          },
        ],
      };
    }
    case 'triage-issue': {
      const issueId = args.issueId;
      if (!issueId) {
        throw new Error('triage-issue requires issueId');
      }
      return {
        description: 'Triage a Linear issue for priority, scope, and next actions.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Triage Linear issue ${issueId}. Use resource linear://issue/${issueId}. ` +
                `Summarize the problem, identify missing information, suggest priority, and propose next actions.`,
            },
          },
        ],
      };
    }
    case 'summarize-document': {
      const documentId = args.documentId;
      if (!documentId) {
        throw new Error('summarize-document requires documentId');
      }
      return {
        description: 'Summarize a Linear document and relate it to the broader project context.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Summarize Linear document ${documentId}. Use resource linear://document/${documentId}. ` +
                `If the document is attached to a project, also use the linked project and recent project documents to explain why it matters.`,
            },
          },
        ],
      };
    }
    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
}
