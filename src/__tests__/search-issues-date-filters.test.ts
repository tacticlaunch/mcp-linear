import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { isSearchIssuesArgs } from '../tools/type-guards.js';
import {
  ISSUE_DATE_FILTER_FIELDS,
  buildDateComparator,
  buildIssueDateFilter,
} from '../utils/date-filters.js';

describe('searchIssues date filters', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exposes every supported date field with after/before/on on the tool definition', () => {
    const tool = allToolDefinitions.find((definition) => definition.name === 'linear_searchIssues');
    const dates = tool?.input_schema.properties?.dates as {
      properties: Record<string, { properties: Record<string, unknown> }>;
    };

    expect(Object.keys(dates.properties)).toEqual([
      'due',
      'created',
      'updated',
      'started',
      'completed',
      'autoClosed',
      'triaged',
    ]);
    for (const field of Object.values(dates.properties)) {
      expect(Object.keys(field.properties)).toEqual(['after', 'before', 'on']);
    }
  });

  it('maps every date field to its Linear IssueFilter key', () => {
    const range = { on: '2026-10-01' };
    const filter = buildIssueDateFilter(
      Object.fromEntries(Object.keys(ISSUE_DATE_FILTER_FIELDS).map((field) => [field, range])),
    );

    expect(Object.keys(filter).sort()).toEqual(
      [
        'autoClosedAt',
        'completedAt',
        'createdAt',
        'dueDate',
        'startedAt',
        'triagedAt',
        'updatedAt',
      ].sort(),
    );
  });

  it('builds whole-day UTC comparators for date-only values on timestamp fields', () => {
    expect(buildDateComparator({ on: '2026-10-01' })).toEqual({
      gte: '2026-10-01T00:00:00.000Z',
      lt: '2026-10-02T00:00:00.000Z',
    });
    expect(buildDateComparator({ after: '2026-12-31', before: '2027-01-05' })).toEqual({
      gte: '2026-12-31T00:00:00.000Z',
      lt: '2027-01-05T00:00:00.000Z',
    });
  });

  it('matches Linear UI semantics: after is gte, before is lt', () => {
    expect(buildDateComparator({ after: '2026-10-04', before: '2026-10-06' })).toEqual({
      gte: '2026-10-04T00:00:00.000Z',
      lt: '2026-10-06T00:00:00.000Z',
    });
  });

  it('passes date-times and durations through unchanged', () => {
    expect(buildDateComparator({ after: '-P2W', before: '2026-10-01T15:30:00+02:00' })).toEqual({
      gte: '-P2W',
      lt: '2026-10-01T15:30:00+02:00',
    });
    expect(buildDateComparator({})).toBeUndefined();
  });

  it('compares calendar dates directly for the timeless due date', () => {
    expect(buildIssueDateFilter({ due: { on: '2026-10-01' } })).toEqual({
      dueDate: { eq: '2026-10-01' },
    });
    expect(buildIssueDateFilter({ due: { after: '2026-10-01', before: 'P1W' } })).toEqual({
      dueDate: { gte: '2026-10-01', lt: 'P1W' },
    });
  });

  it('validates the dates argument', () => {
    expect(isSearchIssuesArgs({ dates: {} })).toBe(true);
    expect(isSearchIssuesArgs({ dates: { updated: { after: '2026-10-01' } } })).toBe(true);
    expect(isSearchIssuesArgs({ dates: { created: { after: '2026-10-01T10:00:00Z' } } })).toBe(
      true,
    );
    expect(
      isSearchIssuesArgs({
        dates: { completed: { after: '-P1W', before: '2026-10-01' }, due: { on: '2026-10-10' } },
      }),
    ).toBe(true);

    expect(isSearchIssuesArgs({ dates: 'last week' })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { closed: { on: '2026-10-01' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: '2026-10-01' } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: { since: '2026-10-01' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: { after: 'yesterday' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: { after: '2026-02-30' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: { before: '2026-10-01T10:00:00' } } })).toBe(
      false,
    );
    expect(isSearchIssuesArgs({ dates: { updated: { before: 'P' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { updated: { on: '-P1D' } } })).toBe(false);
    expect(isSearchIssuesArgs({ dates: { due: { after: '2026-10-01T10:00:00Z' } } })).toBe(false);
    expect(
      isSearchIssuesArgs({ dates: { updated: { on: '2026-10-01', after: '2026-09-01' } } }),
    ).toBe(false);
  });

  it('treats blank or null bounds as not provided', () => {
    expect(
      isSearchIssuesArgs({
        dates: { updated: { after: '2026-10-01', before: '2026-10-07', on: '' } },
      }),
    ).toBe(true);
    expect(
      isSearchIssuesArgs({ dates: { due: { after: '  ', before: null, on: '2026-10-10' } } }),
    ).toBe(true);
    expect(isSearchIssuesArgs({ dates: { updated: { on: '', after: 'yesterday' } } })).toBe(false);

    expect(
      buildIssueDateFilter({
        updated: { after: '2026-10-01', before: '2026-10-07', on: '' },
        created: { after: '', before: '', on: '' },
      }),
    ).toEqual({
      updatedAt: { gte: '2026-10-01T00:00:00.000Z', lt: '2026-10-07T00:00:00.000Z' },
    });
  });

  it('sends date comparators in the issues filter', async () => {
    const issues = jest.fn().mockResolvedValue({ nodes: [] });
    const service = new LinearService({ issues } as never);

    await service.searchIssues({
      teamId: 'team-1',
      dates: {
        updated: { after: '2026-09-30', before: '2026-10-07T12:00:00Z' },
        due: { before: '2026-10-15' },
      },
      limit: 5,
    });

    expect(issues).toHaveBeenCalledWith({
      first: 5,
      filter: {
        updatedAt: { gte: '2026-09-30T00:00:00.000Z', lt: '2026-10-07T12:00:00Z' },
        dueDate: { lt: '2026-10-15' },
        team: { id: { eq: 'team-1' } },
      },
    });
  });

  it('omits date fields when no date filters are provided', async () => {
    const issues = jest.fn().mockResolvedValue({ nodes: [] });
    const service = new LinearService({ issues } as never);

    await service.searchIssues({ query: 'bug' });

    expect(Object.keys(issues.mock.calls[0][0].filter)).toEqual(['or']);
  });
});
