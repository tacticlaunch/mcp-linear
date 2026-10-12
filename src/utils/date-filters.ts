/**
 * Helpers for translating `{ after, before, on }` date ranges into Linear
 * date comparator filters.
 *
 * Accepted inputs:
 * - Calendar date (`YYYY-MM-DD`).
 * - ISO 8601 date-time with timezone (e.g. `2026-10-01T15:30:00Z`), only for
 *   timestamp fields; timeless fields such as dueDate have no time component.
 * - ISO 8601 duration relative to now (e.g. `-P2W`), passed through to Linear.
 *   Only for after/before, since "on" needs a concrete day.
 */

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const DURATION_PATTERN =
  /^-?P(?=\d|T\d)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;

/**
 * `dateTime` fields use Linear's (Nullable)DateComparator over timestamps.
 * `timeless` fields use NullableTimelessDateComparator over calendar dates.
 */
export type DateFieldKind = 'dateTime' | 'timeless';

export interface DateRangeArgs {
  after?: string | null;
  before?: string | null;
  on?: string | null;
}

export interface DateComparatorFilter {
  eq?: string;
  gte?: string;
  lt?: string;
}

/** Public `dates` keys for issue filters, mapped to their Linear IssueFilter field. */
export const ISSUE_DATE_FILTER_FIELDS = {
  due: { filterKey: 'dueDate', kind: 'timeless', label: 'due date' },
  created: { filterKey: 'createdAt', kind: 'dateTime', label: 'creation date' },
  updated: { filterKey: 'updatedAt', kind: 'dateTime', label: 'last update date' },
  started: { filterKey: 'startedAt', kind: 'dateTime', label: 'start date' },
  completed: { filterKey: 'completedAt', kind: 'dateTime', label: 'completion date' },
  autoClosed: { filterKey: 'autoClosedAt', kind: 'dateTime', label: 'auto-close date' },
  triaged: { filterKey: 'triagedAt', kind: 'dateTime', label: 'triage date' },
} as const satisfies Record<string, { filterKey: string; kind: DateFieldKind; label: string }>;

export type IssueDateField = keyof typeof ISSUE_DATE_FILTER_FIELDS;
export type IssueDateFilters = Partial<Record<IssueDateField, DateRangeArgs>>;

const DATE_RANGE_KEYS = ['after', 'before', 'on'] as const;

/**
 * MCP clients (e.g. the Inspector form) often send unfilled fields as `""` or
 * `null`. Treat those as not provided so blank bounds don't fail validation.
 */
function isBlank(value: unknown): boolean {
  return (
    value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
  );
}

function omitBlankBounds<T extends Record<string, unknown>>(range: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(range).filter(([, value]) => !isBlank(value)),
  ) as Partial<T>;
}

export function isDateOnly(value: string): boolean {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }
  // Reject impossible dates such as 2026-02-30, which Date would roll over.
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

function isDateTime(value: string): boolean {
  return (
    DATE_TIME_PATTERN.test(value) &&
    isDateOnly(value.slice(0, 10)) &&
    !Number.isNaN(Date.parse(value))
  );
}

function isDuration(value: string): boolean {
  return DURATION_PATTERN.test(value);
}

/** Valid value for an after/before bound on a field of the given kind. */
export function isDateBoundValue(value: unknown, kind: DateFieldKind): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  return isDateOnly(value) || isDuration(value) || (kind === 'dateTime' && isDateTime(value));
}

/** Valid value for an "on" filter: a calendar date only. */
export function isDateOnValue(value: unknown): value is string {
  return typeof value === 'string' && isDateOnly(value);
}

/**
 * Validate a single `{ after, before, on }` object. Returns an error message,
 * or undefined when valid.
 */
export function validateDateRange(value: unknown, kind: DateFieldKind): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'must be an object with after, before, or on';
  }

  const unknownKeys = Object.keys(value).filter(
    (key) => !(DATE_RANGE_KEYS as readonly string[]).includes(key),
  );
  if (unknownKeys.length > 0) {
    return `has unknown key(s): ${unknownKeys.join(', ')}`;
  }

  const range = omitBlankBounds(value as Record<string, unknown>);

  for (const key of ['after', 'before'] as const) {
    if (key in range && !isDateBoundValue(range[key], kind)) {
      return kind === 'timeless'
        ? `${key} must be a YYYY-MM-DD date or ISO 8601 duration`
        : `${key} must be a YYYY-MM-DD date, ISO 8601 date-time, or ISO 8601 duration`;
    }
  }

  if ('on' in range) {
    if (!isDateOnValue(range.on)) {
      return 'on must be a YYYY-MM-DD date';
    }
    if ('after' in range || 'before' in range) {
      return 'on cannot be combined with after or before';
    }
  }

  return undefined;
}

/**
 * Validate the issue `dates` object. Returns an error message, or undefined
 * when valid.
 */
export function validateIssueDateFilters(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'dates must be an object';
  }

  for (const [field, range] of Object.entries(value)) {
    if (!Object.prototype.hasOwnProperty.call(ISSUE_DATE_FILTER_FIELDS, field)) {
      return `dates has unknown field: ${field}`;
    }
    const error = validateDateRange(range, ISSUE_DATE_FILTER_FIELDS[field as IssueDateField].kind);
    if (error) {
      return `dates.${field} ${error}`;
    }
  }

  return undefined;
}

function startOfUtcDay(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

function startOfNextUtcDay(date: string): string {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}

/**
 * Build a Linear date comparator from after/before/on arguments.
 *
 * Matches Linear's UI filters: `after` maps to `gte` (inclusive) and `before`
 * maps to `lt` (exclusive). For timestamp fields a date-only value means the
 * start of that UTC day, so `after: 2026-10-04, before: 2026-10-06` covers
 * Oct 4 and Oct 5. `on` covers the whole UTC day.
 * Returns undefined when no bound is provided.
 */
export function buildDateComparator(
  args: DateRangeArgs,
  kind: DateFieldKind = 'dateTime',
): DateComparatorFilter | undefined {
  args = omitBlankBounds({ ...args });
  const comparator: DateComparatorFilter = {};

  if (kind === 'timeless') {
    // Timeless comparators compare calendar dates directly.
    if (args.on) {
      comparator.eq = args.on;
    }
    if (args.after) {
      comparator.gte = args.after;
    }
    if (args.before) {
      comparator.lt = args.before;
    }
  } else {
    if (args.on) {
      comparator.gte = startOfUtcDay(args.on);
      comparator.lt = startOfNextUtcDay(args.on);
    }
    if (args.after) {
      comparator.gte = isDateOnly(args.after) ? startOfUtcDay(args.after) : args.after;
    }
    if (args.before) {
      comparator.lt = isDateOnly(args.before) ? startOfUtcDay(args.before) : args.before;
    }
  }

  return Object.keys(comparator).length > 0 ? comparator : undefined;
}

/** Translate the issue `dates` object into IssueFilter date fields. */
export function buildIssueDateFilter(
  dates: IssueDateFilters,
): Record<string, DateComparatorFilter> {
  const filter: Record<string, DateComparatorFilter> = {};

  for (const [field, config] of Object.entries(ISSUE_DATE_FILTER_FIELDS)) {
    const range = dates[field as IssueDateField];
    if (!range) {
      continue;
    }
    const comparator = buildDateComparator(range, config.kind);
    if (comparator) {
      filter[config.filterKey] = comparator;
    }
  }

  return filter;
}

/** JSON schema for the issue `dates` input, generated from ISSUE_DATE_FILTER_FIELDS. */
export function issueDateFiltersInputSchema() {
  const properties: Record<string, unknown> = {};

  for (const [field, config] of Object.entries(ISSUE_DATE_FILTER_FIELDS)) {
    const timeless = config.kind === 'timeless';
    const boundFormats = timeless
      ? "a YYYY-MM-DD date or an ISO 8601 duration relative to today (e.g., 'P1W')"
      : "a YYYY-MM-DD date (whole UTC day), an ISO 8601 date-time (e.g., '2026-10-01T15:00:00Z'), or an ISO 8601 duration relative to now (e.g., '-P2W')";

    properties[field] = {
      type: 'object',
      description: `Filter by ${config.label}. 'after' is inclusive and 'before' is exclusive; 'on' cannot be combined with 'after' or 'before'`,
      properties: {
        after: {
          type: ['string', 'null'],
          description: `On or after (inclusive): ${boundFormats}`,
        },
        before: { type: ['string', 'null'], description: `Before (exclusive): ${boundFormats}` },
        on: {
          type: ['string', 'null'],
          description: timeless
            ? 'On this calendar day (YYYY-MM-DD)'
            : 'On this calendar day (YYYY-MM-DD, UTC)',
        },
      },
      additionalProperties: false,
    };
  }

  return {
    type: 'object',
    description:
      'Date filters. Each key takes { after, before, on }; all provided filters must match',
    properties,
    additionalProperties: false,
  };
}
