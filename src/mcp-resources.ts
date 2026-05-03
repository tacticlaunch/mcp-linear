import type { ReadResourceResult, Resource } from '@modelcontextprotocol/sdk/types.js';
import { LinearService } from './services/linear-service.js';
import type { LinearRateLimitSnapshot } from './utils/linear-rate-limit.js';

type ResourceDeps = {
  linearService: LinearService;
  getRateLimitSnapshot: () => LinearRateLimitSnapshot;
};

const JSON_MIME = 'application/json';
const MARKDOWN_MIME = 'text/markdown';

const staticResources: Resource[] = [
  {
    uri: 'linear://viewer',
    name: 'Linear Viewer',
    description: 'Authenticated Linear viewer profile for this MCP session',
    mimeType: JSON_MIME,
  },
  {
    uri: 'linear://organization',
    name: 'Linear Organization',
    description: 'Organization metadata for the connected Linear workspace',
    mimeType: JSON_MIME,
  },
  {
    uri: 'linear://teams',
    name: 'Linear Teams',
    description: 'All teams available in the connected Linear workspace',
    mimeType: JSON_MIME,
  },
  {
    uri: 'linear://projects',
    name: 'Linear Projects',
    description: 'Projects in the connected Linear workspace',
    mimeType: JSON_MIME,
  },
  {
    uri: 'linear://rate-limit',
    name: 'Linear Rate Limit Status',
    description: 'Shared MCP-side view of recent Linear rate-limit state and cooldown tracking',
    mimeType: JSON_MIME,
  },
  {
    uri: 'linear://resource-guide',
    name: 'Linear Resource Guide',
    description: 'Supported dynamic Linear resource URIs and query parameters',
    mimeType: MARKDOWN_MIME,
  },
];

function asJsonResource(uri: string, data: unknown): ReadResourceResult {
  return {
    contents: [
      {
        uri,
        mimeType: JSON_MIME,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function asTextResource(uri: string, mimeType: string, text: string): ReadResourceResult {
  return {
    contents: [
      {
        uri,
        mimeType,
        text,
      },
    ],
  };
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) {
    return fallback;
  }

  return value === 'true';
}

function parseStringArray(value: string | null): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : undefined;
}

function parseOrderBy(value: string | null): 'createdAt' | 'updatedAt' | undefined {
  return value === 'createdAt' || value === 'updatedAt' ? value : undefined;
}

function getGuideText() {
  return `# Linear MCP Resources

Static resources:

- linear://viewer
- linear://organization
- linear://teams
- linear://projects
- linear://rate-limit

Dynamic resources:

- linear://project/{id}
- linear://project/{id}/issues?limit=25&orderBy=updatedAt&includeCompleted=false&states=Todo,In%20Progress
- linear://project/{id}/documents?limit=10&orderBy=updatedAt&includeArchived=false&title=Spec
- linear://issue/{id}
- linear://document/{id}
- linear://roadmap/{id}
- linear://milestone/{id}

Use query parameters to narrow reads and reduce unnecessary API usage.`;
}

export function getLinearResourceDefinitions(): Resource[] {
  return staticResources;
}

export async function readLinearResource(uri: string, deps: ResourceDeps): Promise<ReadResourceResult> {
  const parsed = new URL(uri);
  const { linearService, getRateLimitSnapshot } = deps;
  const segments = parsed.pathname.split('/').filter(Boolean);

  if (parsed.protocol !== 'linear:') {
    throw new Error(`Unsupported resource URI: ${uri}`);
  }

  switch (parsed.hostname) {
    case 'viewer':
      return asJsonResource(uri, await linearService.getUserInfo());
    case 'organization':
      return asJsonResource(uri, await linearService.getOrganizationInfo());
    case 'teams':
      return asJsonResource(uri, await linearService.getTeams());
    case 'projects':
      return asJsonResource(uri, await linearService.getProjects());
    case 'rate-limit':
      return asJsonResource(uri, getRateLimitSnapshot());
    case 'resource-guide':
      return asTextResource(uri, MARKDOWN_MIME, getGuideText());
    case 'project': {
      const projectId = segments[0];
      if (!projectId) {
        throw new Error('Project resource URI requires a project ID');
      }

      if (segments[1] === 'issues') {
        return asJsonResource(
          uri,
          await linearService.getProjectIssues({
            projectId,
            limit: parsePositiveInt(parsed.searchParams.get('limit'), 25),
            states: parseStringArray(parsed.searchParams.get('states')),
            assigneeId: parsed.searchParams.get('assigneeId') ?? undefined,
            labelIds: parseStringArray(parsed.searchParams.get('labelIds')),
            cycleId: parsed.searchParams.get('cycleId') ?? undefined,
            projectMilestoneId: parsed.searchParams.get('projectMilestoneId') ?? undefined,
            includeCompleted: parseBoolean(parsed.searchParams.get('includeCompleted'), true),
            orderBy: parseOrderBy(parsed.searchParams.get('orderBy')),
          }),
        );
      }

      if (segments[1] === 'documents') {
        return asJsonResource(
          uri,
          await linearService.getProjectDocuments({
            projectId,
            limit: parsePositiveInt(parsed.searchParams.get('limit'), 25),
            includeArchived: parseBoolean(parsed.searchParams.get('includeArchived'), false),
            orderBy: parseOrderBy(parsed.searchParams.get('orderBy')),
            title: parsed.searchParams.get('title') ?? undefined,
          }),
        );
      }

      return asJsonResource(uri, await linearService.getProjectById(projectId));
    }
    case 'issue': {
      const issueId = segments[0];
      if (!issueId) {
        throw new Error('Issue resource URI requires an issue ID');
      }
      return asJsonResource(uri, await linearService.getIssueById(issueId));
    }
    case 'document': {
      const documentId = segments[0];
      if (!documentId) {
        throw new Error('Document resource URI requires a document ID');
      }
      return asJsonResource(uri, await linearService.getDocumentById(documentId));
    }
    case 'roadmap': {
      const roadmapId = segments[0];
      if (!roadmapId) {
        throw new Error('Roadmap resource URI requires a roadmap ID');
      }
      return asJsonResource(uri, await linearService.getRoadmapById(roadmapId));
    }
    case 'milestone': {
      const milestoneId = segments[0];
      if (!milestoneId) {
        throw new Error('Milestone resource URI requires a milestone ID');
      }
      return asJsonResource(uri, await linearService.getMilestoneById(milestoneId));
    }
    default:
      throw new Error(`Unsupported Linear resource URI: ${uri}`);
  }
}
