import {
  CustomView,
  Document as LinearSdkDocument,
  LinearClient,
  LinearDocument,
  LinearFetch,
  ProjectMilestone,
  Roadmap,
  Template,
  Team,
  User,
} from '@linear/sdk';

type JsonObject = Record<string, unknown>;

type FavoriteViewNode = {
  id: string;
  type: string;
  sortOrder: number;
  customView?: {
    id: string;
    name: string;
    slugId?: string | null;
    shared: boolean;
  } | null;
  predefinedViewType?: string | null;
  predefinedViewTeam?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  url?: string | null;
};

type PMIssueQueryArgs = {
  limit?: number;
  states?: string[];
  assigneeId?: string;
  labelIds?: string[];
  cycleId?: string;
  projectMilestoneId?: string;
  includeCompleted?: boolean;
  orderBy?: string;
};

type ProjectIssueQueryArgs = PMIssueQueryArgs & {
  projectId: string;
};

type CycleIssueQueryArgs = PMIssueQueryArgs & {
  cycleId: string;
};

type MilestoneQueryArgs = {
  includeArchived?: boolean;
  limit?: number;
  projectId?: string;
  teamId?: string;
  status?: string;
  orderBy?: string;
};

type DocumentListArgs = {
  limit?: number;
  includeArchived?: boolean;
  orderBy?: string;
  projectId?: string;
  initiativeId?: string;
  title?: string;
};

type ProjectDocumentListArgs = {
  projectId: string;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: string;
  title?: string;
};

type SearchDocumentsArgs = {
  term: string;
  teamId?: string;
  includeComments?: boolean;
  limit?: number;
  includeArchived?: boolean;
  orderBy?: string;
  snippetSize?: number;
};

type DocumentCreateArgs = {
  title: string;
  content?: string;
  icon?: string;
  color?: string;
  projectId?: string;
  initiativeId?: string;
  lastAppliedTemplateId?: string;
  sortOrder?: number;
};

type DocumentUpdateArgs = {
  id: string;
  title?: string;
  content?: string | null;
  icon?: string | null;
  color?: string | null;
  hiddenAt?: string | null;
  projectId?: string | null;
  initiativeId?: string | null;
  lastAppliedTemplateId?: string | null;
  sortOrder?: number;
  trashed?: boolean;
};

const FAVORITE_VIEWS_QUERY = `
  query FavoriteViews($first: Int, $includeArchived: Boolean, $orderBy: PaginationOrderBy) {
    favorites(first: $first, includeArchived: $includeArchived, orderBy: $orderBy) {
      nodes {
        id
        type
        sortOrder
        predefinedViewType
        createdAt
        updatedAt
        url
        customView {
          id
          name
          slugId
          shared
        }
        predefinedViewTeam {
          id
          name
        }
      }
    }
  }
`;

const ISSUE_SUMMARY_FIELDS = `
  id
  identifier
  title
  description
  priority
  estimate
  dueDate
  sortOrder
  createdAt
  updatedAt
  url
  state {
    id
    name
    color
    type
  }
  team {
    id
    name
  }
  assignee {
    id
    name
  }
  cycle {
    id
    name
  }
  projectMilestone {
    id
    name
  }
  labels(first: 10) {
    nodes {
      id
      name
      color
    }
  }
`;

const ISSUE_SUMMARIES_QUERY = `
  query IssueSummaries($first: Int, $orderBy: PaginationOrderBy, $filter: IssueFilter) {
    issues(first: $first, orderBy: $orderBy, filter: $filter) {
      nodes {
        ${ISSUE_SUMMARY_FIELDS}
      }
    }
  }
`;

const NOTIFICATION_SUMMARY_QUERY = `
  query NotificationSummaries($first: Int, $includeArchived: Boolean, $orderBy: PaginationOrderBy) {
    notifications(first: $first, includeArchived: $includeArchived, orderBy: $orderBy) {
      nodes {
        id
        type
        title
        subtitle
        url
        readAt
        snoozedUntilAt
        createdAt
        updatedAt
        actor {
          id
          name
          email
        }
      }
    }
  }
`;

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

type GraphQLTypeKind =
  | 'SCALAR'
  | 'OBJECT'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL';

type GraphQLTypeRef = {
  kind: GraphQLTypeKind;
  name: string | null;
  ofType?: GraphQLTypeRef | null;
};

type GraphQLArgument = {
  name: string;
  description?: string | null;
  type: GraphQLTypeRef;
};

type GraphQLField = {
  name: string;
  description?: string | null;
  args: GraphQLArgument[];
  type: GraphQLTypeRef;
};

type GraphQLType = {
  kind: GraphQLTypeKind;
  name: string;
  description?: string | null;
  fields?: GraphQLField[] | null;
  inputFields?: GraphQLArgument[] | null;
  enumValues?: Array<{ name: string }> | null;
};

type GraphQLTypeQueryResult = {
  __type: GraphQLType | null;
};

type NormalizedCustomFieldOption = {
  id?: string;
  name?: string;
  color?: string;
  raw: Record<string, unknown>;
};

type NormalizedCustomFieldDefinition = {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  required?: boolean;
  team?: {
    id?: string;
    name?: string;
    key?: string;
  };
  options?: NormalizedCustomFieldOption[];
  raw: Record<string, unknown>;
};

type NormalizedIssueCustomFieldValue = {
  id?: string;
  customFieldId?: string;
  name?: string;
  type?: string;
  value?: JSONValue;
  displayValue?: string;
  customField?: NormalizedCustomFieldDefinition;
  raw: Record<string, unknown>;
};

type UpdateIssueCustomFieldPlan = {
  mutationField: GraphQLField;
  issueArgument?: GraphQLArgument;
  inputArgument?: GraphQLArgument;
  inputType?: GraphQLType | null;
  issueInputField?: GraphQLArgument;
  customFieldDirectCandidates: GraphQLArgument[];
  customFieldInputCandidates: GraphQLArgument[];
  valueDirectCandidates: GraphQLArgument[];
  valueInputCandidates: GraphQLArgument[];
};

type FavoriteMutationPlan = {
  mutationField: GraphQLField;
  inputArgument?: GraphQLArgument;
  inputType?: GraphQLType | null;
  entityArgument?: GraphQLArgument;
  entityInputField?: GraphQLArgument;
  favoriteArgument?: GraphQLArgument;
  favoriteInputField?: GraphQLArgument;
  directIdCandidates: GraphQLArgument[];
  inputIdCandidates: GraphQLArgument[];
};

const INTROSPECT_TYPE_QUERY = `
  query LinearCustomFieldType($name: String!) {
    __type(name: $name) {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        args {
          name
          description
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
      inputFields {
        name
        description
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
      enumValues(includeDeprecated: true) {
        name
      }
    }
  }
`;

const CUSTOM_FIELD_DEFINITION_PATTERNS = [
  /customfields?/i,
  /fielddefinitions?/i,
  /custom field/i,
  /field definition/i,
];

const ISSUE_CUSTOM_FIELD_VALUE_PATTERNS = [
  /customfieldvalues?/i,
  /fieldvalues?/i,
  /customfields?/i,
  /field value/i,
  /custom field/i,
];

const UPDATE_CUSTOM_FIELD_MUTATION_PATTERNS = [
  /updateissuecustomfield/i,
  /issuecustomfieldupdate/i,
  /updatecustomfieldvalue/i,
  /issuefieldvalueupdate/i,
  /issue.*custom.*field.*update/i,
  /issue.*field.*value.*update/i,
];

const ADD_FAVORITE_MUTATION_PATTERNS = [
  /addtofavorites?/i,
  /favorite.*add/i,
  /add.*favorite/i,
  /favorite.*create/i,
  /create.*favorite/i,
];

const REMOVE_FAVORITE_MUTATION_PATTERNS = [
  /removefromfavorites?/i,
  /favorite.*remove/i,
  /remove.*favorite/i,
  /favorite.*delete/i,
  /delete.*favorite/i,
];

const ISSUE_ARGUMENT_PATTERNS = [/^issueId$/i, /(^|[^a-z])issue([^a-z]|$)/i, /^id$/i];
const CUSTOM_FIELD_ARGUMENT_PATTERNS = [
  /^customFieldId$/i,
  /^fieldId$/i,
  /^definitionId$/i,
  /custom.*field/i,
  /field.*definition/i,
];
const FAVORITE_ENTITY_ARGUMENT_PATTERNS = [
  /^entityId$/i,
  /^targetId$/i,
  /^resourceId$/i,
  /^objectId$/i,
  /^customViewId$/i,
  /^viewId$/i,
  /^issueId$/i,
  /^projectId$/i,
  /^documentId$/i,
  /^roadmapId$/i,
  /^initiativeId$/i,
  /entity/i,
  /target/i,
  /resource/i,
  /custom.*view/i,
  /predefined.*view/i,
];
const FAVORITE_ID_ARGUMENT_PATTERNS = [/^favoriteId$/i, /^id$/i, /favorite/i];
const VALUE_ARGUMENT_PATTERNS = [
  /^value$/i,
  /fieldValue/i,
  /customFieldValue/i,
  /stringValue/i,
  /numberValue/i,
  /booleanValue/i,
  /dateValue/i,
  /optionIds?/i,
  /values?/i,
];

const DEFAULT_NESTED_FIELDS = ['id', 'name', 'key', 'identifier', 'title', 'color', 'label'];
const CUSTOM_FIELD_DEFINITION_FIELDS = [
  'id',
  'name',
  'description',
  'type',
  'required',
  'archivedAt',
  'createdAt',
  'updatedAt',
  'team',
  'options',
  'values',
];
const ISSUE_CUSTOM_FIELD_VALUE_FIELDS = [
  'id',
  'value',
  'displayValue',
  'stringValue',
  'numberValue',
  'booleanValue',
  'dateValue',
  'option',
  'options',
  'selectedOption',
  'selectedOptions',
  'customFieldId',
  'fieldId',
  'customField',
  'field',
  'definition',
  'name',
  'type',
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isJSONValue(value: unknown): value is JSONValue {
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

function unwrapTypeRef(typeRef: GraphQLTypeRef): GraphQLTypeRef {
  let current = typeRef;

  while ((current.kind === 'NON_NULL' || current.kind === 'LIST') && current.ofType) {
    current = current.ofType;
  }

  return current;
}

function isListType(typeRef: GraphQLTypeRef): boolean {
  if (typeRef.kind === 'LIST') {
    return true;
  }

  return typeRef.kind === 'NON_NULL' && typeRef.ofType ? isListType(typeRef.ofType) : false;
}

function isNonNullType(typeRef: GraphQLTypeRef): boolean {
  return typeRef.kind === 'NON_NULL';
}

function typeRefToGraphQL(typeRef: GraphQLTypeRef): string {
  if (typeRef.kind === 'NON_NULL') {
    return `${typeRefToGraphQL(typeRef.ofType as GraphQLTypeRef)}!`;
  }

  if (typeRef.kind === 'LIST') {
    return `[${typeRefToGraphQL(typeRef.ofType as GraphQLTypeRef)}]`;
  }

  return typeRef.name ?? 'String';
}

function hasRequiredArguments(field: GraphQLField): boolean {
  return field.args.some((arg) => isNonNullType(arg.type));
}

function fieldSearchText(field: GraphQLField | GraphQLArgument): string {
  const namedType = unwrapTypeRef(field.type);
  return `${field.name} ${field.description ?? ''} ${namedType.name ?? ''}`.toLowerCase();
}

function matchesPatterns(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function matchesArgumentPatterns(argument: GraphQLArgument, patterns: RegExp[]): boolean {
  return patterns.some(
    (pattern) => pattern.test(argument.name) || pattern.test(fieldSearchText(argument)),
  );
}

function scoreField(field: GraphQLField, patterns: RegExp[]): number {
  const searchable = fieldSearchText(field);
  let score = 0;

  for (const pattern of patterns) {
    if (pattern.test(searchable)) {
      score += 100;
    }
  }

  const name = field.name.toLowerCase();
  if (name.includes('custom')) {
    score += 25;
  }
  if (name.includes('field')) {
    score += 25;
  }
  if (name.includes('value')) {
    score += 15;
  }
  if (name.includes('update')) {
    score += 15;
  }

  return score;
}

function pickBestField(fields: GraphQLField[], patterns: RegExp[]): GraphQLField | undefined {
  return fields
    .map((field) => ({ field, score: scoreField(field, patterns) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.field;
}

function isIdLikeName(name: string): boolean {
  return /^id$/i.test(name) || /Id$/i.test(name);
}

function getFirstString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

function getFirstBoolean(record: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }

  return undefined;
}

function getFirstRecord(record: Record<string, unknown>, keys: string[]): Record<string, unknown> | undefined {
  for (const key of keys) {
    const value = record[key];
    if (isPlainObject(value)) {
      return value;
    }
  }

  return undefined;
}

function getFirstRecordArray(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown>[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is Record<string, unknown> => isPlainObject(item));
    }

    if (isPlainObject(value) && Array.isArray(value.nodes)) {
      return value.nodes.filter((item): item is Record<string, unknown> => isPlainObject(item));
    }
  }

  return undefined;
}

function extractListItems(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => isPlainObject(item));
  }

  if (!isPlainObject(value)) {
    return [];
  }

  if (Array.isArray(value.nodes)) {
    return value.nodes.filter((item): item is Record<string, unknown> => isPlainObject(item));
  }

  if (Array.isArray(value.edges)) {
    return value.edges
      .map((edge) => (isPlainObject(edge) && isPlainObject(edge.node) ? edge.node : undefined))
      .filter((item): item is Record<string, unknown> => item !== undefined);
  }

  return [value];
}

function normalizeCustomFieldOption(raw: Record<string, unknown>): NormalizedCustomFieldOption {
  return {
    id: getFirstString(raw, ['id']),
    name: getFirstString(raw, ['name', 'label']),
    color: getFirstString(raw, ['color']),
    raw,
  };
}

function normalizeCustomFieldDefinition(raw: Record<string, unknown>): NormalizedCustomFieldDefinition {
  const team = getFirstRecord(raw, ['team']);
  const options = getFirstRecordArray(raw, ['options', 'values']);

  return {
    id: getFirstString(raw, ['id', 'customFieldId', 'fieldId']),
    name: getFirstString(raw, ['name', 'label', 'displayName']),
    description: getFirstString(raw, ['description']),
    type: getFirstString(raw, ['type', 'dataType', 'fieldType']),
    required: getFirstBoolean(raw, ['required', 'isRequired']),
    team: team
      ? {
          id: getFirstString(team, ['id']),
          name: getFirstString(team, ['name']),
          key: getFirstString(team, ['key']),
        }
      : undefined,
    options: options?.map((option) => normalizeCustomFieldOption(option)),
    raw,
  };
}

function compactJSONRecord(record: Record<string, JSONValue | undefined>): { [key: string]: JSONValue } {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  ) as { [key: string]: JSONValue };
}

function extractCustomFieldValue(raw: Record<string, unknown>): JSONValue | undefined {
  for (const key of [
    'value',
    'fieldValue',
    'customFieldValue',
    'stringValue',
    'numberValue',
    'booleanValue',
    'dateValue',
  ]) {
    if (key in raw && isJSONValue(raw[key])) {
      return raw[key];
    }
  }

  const option = getFirstRecord(raw, ['option', 'selectedOption']);
  if (option) {
    return compactJSONRecord({
      id: getFirstString(option, ['id']),
      name: getFirstString(option, ['name', 'label']),
      color: getFirstString(option, ['color']),
    });
  }

  const options = getFirstRecordArray(raw, ['options', 'selectedOptions']);
  if (options) {
    return options.map((option) =>
      compactJSONRecord({
        id: getFirstString(option, ['id']),
        name: getFirstString(option, ['name', 'label']),
        color: getFirstString(option, ['color']),
      }),
    );
  }

  return undefined;
}

function normalizeIssueCustomFieldValue(raw: Record<string, unknown>): NormalizedIssueCustomFieldValue {
  const customFieldRecord = getFirstRecord(raw, ['customField', 'field', 'definition']);
  const customField = customFieldRecord ? normalizeCustomFieldDefinition(customFieldRecord) : undefined;

  return {
    id: getFirstString(raw, ['id']),
    customFieldId:
      getFirstString(raw, ['customFieldId', 'fieldId', 'definitionId']) ?? customField?.id,
    name: getFirstString(raw, ['name', 'label', 'displayName']) ?? customField?.name,
    type: getFirstString(raw, ['type', 'dataType', 'fieldType']) ?? customField?.type,
    value: extractCustomFieldValue(raw),
    displayValue: getFirstString(raw, ['displayValue', 'displayText', 'text']),
    customField,
    raw,
  };
}

function validateGraphQLValue(typeRef: GraphQLTypeRef, value: JSONValue): boolean {
  if (value === null) {
    return !isNonNullType(typeRef);
  }

  if (typeRef.kind === 'NON_NULL' && typeRef.ofType) {
    return validateGraphQLValue(typeRef.ofType, value);
  }

  if (typeRef.kind === 'LIST' && typeRef.ofType) {
    return Array.isArray(value) && value.every((item) => validateGraphQLValue(typeRef.ofType as GraphQLTypeRef, item));
  }

  if (typeRef.kind === 'ENUM') {
    return typeof value === 'string';
  }

  if (typeRef.kind !== 'SCALAR') {
    return isJSONValue(value);
  }

  switch (typeRef.name) {
    case 'String':
    case 'ID':
    case 'Date':
    case 'DateTime':
    case 'TimelessDate':
      return typeof value === 'string';
    case 'Int':
    case 'Float':
      return typeof value === 'number' && Number.isFinite(value);
    case 'Boolean':
      return typeof value === 'boolean';
    case 'JSON':
    case 'JSONObject':
      return isJSONValue(value);
    default:
      return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }
}

function scoreValueCandidate(candidate: GraphQLArgument, value: JSONValue): number {
  if (!validateGraphQLValue(candidate.type, value)) {
    return -1;
  }

  const name = candidate.name.toLowerCase();
  const namedType = unwrapTypeRef(candidate.type);
  let score = matchesPatterns(name, VALUE_ARGUMENT_PATTERNS) ? 50 : 0;

  if (name === 'value') {
    score += 40;
  }

  if (value === null) {
    if (!isNonNullType(candidate.type)) {
      score += 25;
    }
    return score;
  }

  if (Array.isArray(value)) {
    if (isListType(candidate.type)) {
      score += 35;
    }
    if (namedType.name === 'JSON' || namedType.name === 'JSONObject') {
      score += 25;
    }
    if (name.includes('option') || name.includes('values')) {
      score += 15;
    }
    return score;
  }

  if (isPlainObject(value)) {
    if (namedType.name === 'JSON' || namedType.name === 'JSONObject') {
      score += 40;
    }
    return score;
  }

  if (typeof value === 'string') {
    if (namedType.name === 'String' || namedType.name === 'ID') {
      score += 35;
    }
    if (name.includes('string') || name.includes('text') || name.includes('date')) {
      score += 20;
    }
    return score;
  }

  if (typeof value === 'number') {
    if (namedType.name === 'Int' || namedType.name === 'Float') {
      score += 35;
    }
    if (name.includes('number') || name.includes('int') || name.includes('float')) {
      score += 20;
    }
    return score;
  }

  if (typeof value === 'boolean') {
    if (namedType.name === 'Boolean') {
      score += 35;
    }
    if (name.includes('boolean')) {
      score += 20;
    }
  }

  return score;
}

function pickValueCandidate(candidates: GraphQLArgument[], value: JSONValue): GraphQLArgument | undefined {
  return candidates
    .map((candidate) => ({ candidate, score: scoreValueCandidate(candidate, value) }))
    .filter((candidate) => candidate.score >= 0)
    .sort((left, right) => right.score - left.score)[0]?.candidate;
}

function scoreArgument(arg: GraphQLArgument, patterns: RegExp[]): number {
  const searchable = fieldSearchText(arg);
  const name = arg.name.toLowerCase();
  let score = 0;

  for (const pattern of patterns) {
    if (pattern.test(arg.name) || pattern.test(searchable)) {
      score += 100;
    }
  }

  if (name.includes('issue')) {
    score += 20;
  }
  if (name.includes('custom')) {
    score += 20;
  }
  if (name.includes('field')) {
    score += 20;
  }
  if (name.includes('value')) {
    score += 15;
  }

  return score;
}

function pickArgument(args: GraphQLArgument[], patterns: RegExp[]): GraphQLArgument | undefined {
  return args
    .map((arg) => ({
      arg,
      score: matchesArgumentPatterns(arg, patterns) ? scoreArgument(arg, patterns) : 0,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.arg;
}

function pickIdLikeArgument(args: GraphQLArgument[]): GraphQLArgument | undefined {
  const idLikeArgs = args.filter((arg) => isIdLikeName(arg.name));

  if (idLikeArgs.length === 1) {
    return idLikeArgs[0];
  }

  return idLikeArgs.find((arg) => /^id$/i.test(arg.name));
}

// Define Linear API service
export class LinearService {
  private client: LinearClient;
  private typeCache = new Map<string, Promise<GraphQLType | null>>();

  constructor(client: LinearClient) {
    this.client = client;
  }

  private nonEmptyString(value: string | undefined): string | undefined {
    return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
  }

  private nonEmptyArray<T>(value: T[] | undefined): T[] | undefined {
    return Array.isArray(value) && value.length > 0 ? value : undefined;
  }

  private nonEmptyObject<T extends JsonObject>(value: T | undefined): T | undefined {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0
      ? value
      : undefined;
  }

  private nullableNonEmptyString(value: string | null | undefined): string | null | undefined {
    return value === null ? null : this.nonEmptyString(value);
  }

  private nullableNonEmptyObject<T extends JsonObject>(value: T | null | undefined): T | null | undefined {
    return value === null ? null : this.nonEmptyObject(value);
  }

  private compactObject<T extends Record<string, unknown>>(input: T): T {
    return Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as T;
  }

  private normalizePaginationOrderBy(
    value: string | undefined,
  ): LinearDocument.PaginationOrderBy | undefined {
    if (value === 'createdAt') {
      return LinearDocument.PaginationOrderBy.CreatedAt;
    }

    if (value === 'updatedAt') {
      return LinearDocument.PaginationOrderBy.UpdatedAt;
    }

    return undefined;
  }

  private async normalizeUserReference(userFetch: LinearFetch<User> | undefined) {
    const user = userFetch ? await userFetch : null;

    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      : null;
  }

  private async normalizeTeamReference(teamFetch: LinearFetch<Team> | undefined) {
    const team = teamFetch ? await teamFetch : null;

    return team
      ? {
          id: team.id,
          name: team.name,
        }
      : null;
  }

  private async normalizeNamedReference(
    entityFetch: LinearFetch<{ id: string; name: string }> | undefined,
  ) {
    const entity = entityFetch ? await entityFetch : null;

    return entity
      ? {
          id: entity.id,
          name: entity.name,
        }
      : null;
  }

  private normalizeSimpleUser(user: { id: string; name: string; email?: string | null; displayName?: string | null }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
    };
  }

  private async normalizeComment(comment: any) {
    const user = comment.user ? await comment.user : null;
    const issue = comment.issue ? await comment.issue : null;
    const parent = comment.parent ? await comment.parent : null;

    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ?? comment.createdAt,
      editedAt: comment.editedAt ?? null,
      quotedText: comment.quotedText ?? null,
      url: comment.url,
      issue: issue
        ? {
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
          }
        : null,
      parent: parent
        ? {
            id: parent.id,
          }
        : null,
      user: user
        ? {
            id: user.id,
            name: user.name,
            displayName: user.displayName,
            email: user.email,
          }
        : null,
    };
  }

  private async normalizeTeam(team: any) {
    return {
      id: team.id,
      name: team.name,
      key: team.key,
      description: team.description,
      color: team.color ?? null,
      icon: team.icon ?? null,
      private: team.private ?? false,
      timezone: team.timezone ?? null,
      archivedAt: team.archivedAt ?? null,
    };
  }

  private async normalizeCycle(cycle: any) {
    const team = cycle.team ? await cycle.team : null;

    return {
      id: cycle.id,
      number: cycle.number,
      name: cycle.name,
      description: cycle.description,
      startsAt: cycle.startsAt,
      endsAt: cycle.endsAt,
      completedAt: cycle.completedAt ?? null,
      progress: typeof cycle.progress === 'number' ? Math.round(cycle.progress * 100) / 100 : null,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
    };
  }

  private normalizeCycleStats(cycle: any, issueCount: number, completedIssueCount: number) {
    return {
      id: cycle.id,
      number: cycle.number,
      name: cycle.name,
      progress: issueCount > 0 ? Math.round((completedIssueCount / issueCount) * 10000) / 100 : 0,
      issueCount,
      completedIssueCount,
      scopeHistory: cycle.scopeHistory ?? [],
      completedScopeHistory: cycle.completedScopeHistory ?? [],
      completedIssueCountHistory: cycle.completedIssueCountHistory ?? [],
      issueCountHistory: cycle.issueCountHistory ?? [],
    };
  }

  private async normalizeTemplate(template: Template) {
    const team = template.team ? await template.team : null;
    const creator = template.creator ? await template.creator : null;

    return {
      id: template.id,
      name: template.name,
      description: template.description ?? null,
      sortOrder: template.sortOrder,
      type: template.type,
      archivedAt: template.archivedAt ?? null,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      templateData: template.templateData,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
      creator: creator
        ? {
            id: creator.id,
            name: creator.name,
            email: creator.email,
          }
        : null,
    };
  }

  private async normalizeTeamMembership(membership: any) {
    const [team, user] = await Promise.all([
      membership.team ? membership.team : Promise.resolve(null),
      membership.user ? membership.user : Promise.resolve(null),
    ]);

    return {
      id: membership.id,
      owner: membership.owner ?? false,
      sortOrder: membership.sortOrder ?? null,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
      user: user ? this.normalizeSimpleUser(user) : null,
    };
  }

  private async normalizeIssueLabel(label: any) {
    const [team, parent] = await Promise.all([
      label.team ? label.team : Promise.resolve(null),
      label.parent ? label.parent : Promise.resolve(null),
    ]);

    return {
      id: label.id,
      name: label.name,
      color: label.color,
      description: label.description ?? null,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
      parent: parent
        ? {
            id: parent.id,
            name: parent.name,
          }
        : null,
    };
  }

  private async normalizeWorkflowState(state: any) {
    const team = state.team ? await state.team : null;
    return {
      id: state.id,
      name: state.name,
      type: state.type,
      position: state.position,
      color: state.color,
      description: state.description ?? null,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
    };
  }

  private async normalizeWebhook(webhook: any) {
    const team = webhook.team ? await webhook.team : null;
    const creator = webhook.creator ? await webhook.creator : null;

    return {
      id: webhook.id,
      label: webhook.label ?? null,
      url: webhook.url ?? null,
      enabled: webhook.enabled,
      allPublicTeams: webhook.allPublicTeams,
      resourceTypes: webhook.resourceTypes,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
      archivedAt: webhook.archivedAt ?? null,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
      creator: creator
        ? {
            id: creator.id,
            name: creator.name,
            email: creator.email,
          }
        : null,
    };
  }

  private async normalizeAttachment(attachment: any) {
    const issue = attachment.issue ? await attachment.issue : null;

    return {
      id: attachment.id,
      title: attachment.title,
      subtitle: attachment.subtitle ?? null,
      url: attachment.url,
      metadata: attachment.metadata ?? {},
      sourceType: attachment.sourceType ?? null,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
      issue: issue
        ? {
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
          }
        : null,
    };
  }

  private async normalizeNotification(notification: any) {
    const actor = notification.actor ? await notification.actor : null;

    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      subtitle: notification.subtitle,
      url: notification.url,
      readAt: notification.readAt ?? null,
      snoozedUntilAt: notification.snoozedUntilAt ?? null,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      actor: actor
        ? {
            id: actor.id,
            name: actor.name,
            email: actor.email,
          }
        : null,
    };
  }

  private normalizeNotificationNode(notification: any) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      subtitle: notification.subtitle,
      url: notification.url,
      readAt: notification.readAt ?? null,
      snoozedUntilAt: notification.snoozedUntilAt ?? null,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      actor: notification.actor
        ? {
            id: notification.actor.id,
            name: notification.actor.name,
            email: notification.actor.email,
          }
        : null,
    };
  }

  private async normalizeNotificationSubscription(subscription: any) {
    const [team, project, cycle, label, initiative, customView, subscriber] = await Promise.all([
      this.normalizeTeamReference(subscription.team),
      this.normalizeNamedReference(subscription.project),
      this.normalizeNamedReference(subscription.cycle),
      this.normalizeNamedReference(subscription.label),
      this.normalizeNamedReference(subscription.initiative),
      this.normalizeNamedReference(subscription.customView),
      this.normalizeUserReference(subscription.subscriber ? Promise.resolve(subscription.subscriber) as any : undefined),
    ]);

    return {
      id: subscription.id,
      active: subscription.active,
      notificationSubscriptionTypes: subscription.notificationSubscriptionTypes ?? [],
      contextViewType: subscription.contextViewType ?? null,
      userContextViewType: subscription.userContextViewType ?? null,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      team,
      project,
      cycle,
      label,
      initiative,
      customView,
      subscriber,
    };
  }

  private normalizeAuthenticationSession(session: any) {
    return {
      id: session.id,
      name: session.name,
      client: session.client ?? null,
      browserType: session.browserType ?? null,
      operatingSystem: session.operatingSystem ?? null,
      ip: session.ip ?? null,
      location: session.location ?? null,
      isCurrentSession: session.isCurrentSession,
      countryCodes: session.countryCodes ?? [],
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastActiveAt: session.lastActiveAt ?? null,
      type: session.type,
    };
  }

  private async normalizeAuditEntry(entry: any) {
    const actor = entry.actor ? await entry.actor : null;

    return {
      id: entry.id,
      type: entry.type,
      actorId: entry.actorId ?? null,
      countryCode: entry.countryCode ?? null,
      ip: entry.ip ?? null,
      metadata: entry.metadata ?? null,
      requestInformation: entry.requestInformation ?? null,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      actor: actor
        ? {
            id: actor.id,
            name: actor.name,
            email: actor.email,
          }
        : null,
    };
  }

  private async normalizeIntegration(integration: any) {
    const [creator, team] = await Promise.all([
      integration.creator ? integration.creator : Promise.resolve(null),
      integration.team ? integration.team : Promise.resolve(null),
    ]);

    return {
      id: integration.id,
      service: integration.service,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
      archivedAt: integration.archivedAt ?? null,
      creator: creator
        ? {
            id: creator.id,
            name: creator.name,
            email: creator.email,
          }
        : null,
      team: team
        ? {
            id: team.id,
            name: team.name,
            key: team.key,
          }
        : null,
    };
  }

  private async assertRoadmapsEnabled() {
    const organization = await this.client.organization;

    if (!organization.roadmapEnabled) {
      throw new Error(`Roadmaps are not enabled for organization ${organization.name}`);
    }

    return organization;
  }

  private async normalizeRoadmap(roadmap: Roadmap, includeProjects = false) {
    const [owner, creator, projects] = await Promise.all([
      this.normalizeUserReference(roadmap.owner),
      this.normalizeUserReference(roadmap.creator),
      includeProjects
        ? roadmap.projects().then((connection) =>
            connection.nodes.map((project) => ({
              id: project.id,
              name: project.name,
              state: project.state,
              url: project.url,
            })),
          )
        : Promise.resolve(undefined),
    ]);

    return {
      id: roadmap.id,
      name: roadmap.name,
      description: roadmap.description,
      color: roadmap.color,
      slugId: roadmap.slugId,
      sortOrder: roadmap.sortOrder,
      owner,
      creator,
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
      archivedAt: roadmap.archivedAt,
      url: roadmap.url,
      ...(includeProjects ? { projects: projects ?? [] } : {}),
    };
  }

  // Linear calls these saved views in the product UI, but the SDK/API surface uses CustomView.
  private async normalizeSavedView(view: CustomView) {
    const [team, owner, creator] = await Promise.all([
      this.normalizeTeamReference(view.team),
      this.normalizeUserReference(view.owner),
      this.normalizeUserReference(view.creator),
    ]);

    return {
      id: view.id,
      name: view.name,
      description: view.description,
      shared: view.shared,
      icon: view.icon,
      color: view.color,
      slugId: view.slugId,
      filterData: view.filterData,
      filters: view.filters,
      projectFilterData: view.projectFilterData,
      team,
      owner,
      creator,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }

  private normalizeFavoriteNode(favorite: Record<string, unknown>) {
    const customView = getFirstRecord(favorite, ['customView']);
    const predefinedViewTeam = getFirstRecord(favorite, ['predefinedViewTeam']);
    const createdAt = getFirstString(favorite, ['createdAt']);
    const updatedAt = getFirstString(favorite, ['updatedAt']);

    return {
      id: getFirstString(favorite, ['id', 'favoriteId']) ?? '',
      type: getFirstString(favorite, ['type']) ?? 'unknown',
      sortOrder: typeof favorite.sortOrder === 'number' ? favorite.sortOrder : null,
      customView: customView
        ? {
            id: getFirstString(customView, ['id']) ?? '',
            name: getFirstString(customView, ['name']) ?? '',
            slugId: getFirstString(customView, ['slugId']) ?? null,
            shared: getFirstBoolean(customView, ['shared']) ?? false,
          }
        : null,
      predefinedViewType: getFirstString(favorite, ['predefinedViewType']) ?? null,
      predefinedViewTeam: predefinedViewTeam
        ? {
            id: getFirstString(predefinedViewTeam, ['id']) ?? '',
            name: getFirstString(predefinedViewTeam, ['name']) ?? '',
          }
        : null,
      createdAt: createdAt ? new Date(createdAt) : null,
      updatedAt: updatedAt ? new Date(updatedAt) : null,
      url: getFirstString(favorite, ['url']),
    };
  }

  private normalizeFavoriteViewNode(favorite: FavoriteViewNode) {
    const normalizedFavorite = this.normalizeFavoriteNode(favorite);

    if (!normalizedFavorite.customView && !normalizedFavorite.predefinedViewType) {
      return null;
    }

    return normalizedFavorite;
  }

  private normalizeFavoriteMutationPayload(payload: Record<string, unknown>) {
    const favoriteRecord = getFirstRecord(payload, ['favorite']);
    const hasInlineFavoriteFields =
      getFirstString(payload, ['id', 'favoriteId', 'type', 'url']) !== undefined ||
      'sortOrder' in payload;
    const normalizedFavorite = favoriteRecord
      ? this.normalizeFavoriteNode(favoriteRecord)
      : hasInlineFavoriteFields
        ? this.normalizeFavoriteNode(payload)
        : null;

    return {
      success: getFirstBoolean(payload, ['success']) ?? normalizedFavorite !== null,
      id: getFirstString(payload, ['id', 'favoriteId']) ?? normalizedFavorite?.id ?? null,
      entityId: getFirstString(payload, ['entityId', 'targetId', 'resourceId']) ?? null,
      favorite: normalizedFavorite,
    };
  }

  private async normalizeProjectMilestone(milestone: ProjectMilestone) {
    const project = milestone.project ? await milestone.project : null;

    return {
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      status: milestone.status,
      progress: milestone.progress,
      sortOrder: milestone.sortOrder,
      targetDate: milestone.targetDate,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
      archivedAt: milestone.archivedAt,
      project: project
        ? {
            id: project.id,
            name: project.name,
          }
        : null,
    };
  }

  private buildDocumentFilter(args: {
    projectId?: string;
    initiativeId?: string;
    title?: string;
  }) {
    return this.compactObject({
      project: args.projectId ? { id: { eq: args.projectId } } : undefined,
      initiative: args.initiativeId ? { id: { eq: args.initiativeId } } : undefined,
      title: this.nonEmptyString(args.title)
        ? { containsIgnoreCase: this.nonEmptyString(args.title) }
        : undefined,
    });
  }

  private async normalizeDocument(document: LinearSdkDocument | any) {
    const [creator, updatedBy, project, initiative, lastAppliedTemplate] = await Promise.all([
      this.normalizeUserReference(document.creator),
      this.normalizeUserReference(document.updatedBy),
      this.normalizeNamedReference(document.project),
      this.normalizeNamedReference(document.initiative),
      this.normalizeNamedReference(document.lastAppliedTemplate),
    ]);

    return {
      id: document.id,
      title: document.title,
      content: document.content ?? null,
      color: document.color ?? null,
      icon: document.icon ?? null,
      slugId: document.slugId,
      sortOrder: document.sortOrder,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      archivedAt: document.archivedAt ?? null,
      hiddenAt: document.hiddenAt ?? null,
      trashed: document.trashed ?? false,
      documentContentId: document.documentContentId ?? null,
      url: document.url,
      creator,
      updatedBy,
      project,
      initiative,
      lastAppliedTemplate,
    };
  }

  private async normalizeDocumentSearchResult(document: any) {
    return {
      ...(await this.normalizeDocument(document)),
      metadata: document.metadata ?? null,
    };
  }

  private buildPMIssueFilter(args: PMIssueQueryArgs) {
    const filter: Record<string, unknown> = {};

    if (args.assigneeId) {
      filter.assignee = { id: { eq: args.assigneeId } };
    }

    if (args.labelIds && args.labelIds.length > 0) {
      filter.labels = { some: { id: { in: args.labelIds } } };
    }

    if (args.cycleId) {
      filter.cycle = { id: { eq: args.cycleId } };
    }

    if (args.projectMilestoneId) {
      filter.projectMilestone = { id: { eq: args.projectMilestoneId } };
    }

    if (args.includeCompleted === false) {
      filter.completedAt = { null: true };
    }

    if (args.states && args.states.length > 0) {
      filter.state = { name: { in: args.states } };
    }

    return this.compactObject(filter);
  }

  private async normalizeIssueSummary(issue: any) {
    const [teamData, assigneeData, cycleData, projectMilestoneData, stateData] = await Promise.all([
      issue.team ? issue.team : Promise.resolve(null),
      issue.assignee ? issue.assignee : Promise.resolve(null),
      issue.cycle ? issue.cycle : Promise.resolve(null),
      issue.projectMilestone ? issue.projectMilestone : Promise.resolve(null),
      issue.state ? issue.state : Promise.resolve(null),
    ]);

    const labels = await issue.labels();
    const labelsList = labels.nodes.map((label: any) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    }));

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description,
      state: stateData
        ? {
            id: stateData.id,
            name: stateData.name,
            color: stateData.color,
            type: stateData.type,
          }
        : null,
      priority: issue.priority,
      estimate: issue.estimate,
      dueDate: issue.dueDate,
      team: teamData
        ? {
            id: teamData.id,
            name: teamData.name,
          }
        : null,
      assignee: assigneeData
        ? {
            id: assigneeData.id,
            name: assigneeData.name,
          }
        : null,
      cycle: cycleData
        ? {
            id: cycleData.id,
            name: cycleData.name,
          }
        : null,
      projectMilestone: projectMilestoneData
        ? {
            id: projectMilestoneData.id,
            name: projectMilestoneData.name,
          }
        : null,
      labels: labelsList,
      sortOrder: issue.sortOrder,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      url: issue.url,
    };
  }

  private normalizeIssueSummaryNode(issue: any) {
    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description,
      state: issue.state
        ? {
            id: issue.state.id,
            name: issue.state.name,
            color: issue.state.color,
            type: issue.state.type,
          }
        : null,
      priority: issue.priority,
      estimate: issue.estimate,
      dueDate: issue.dueDate,
      team: issue.team
        ? {
            id: issue.team.id,
            name: issue.team.name,
          }
        : null,
      assignee: issue.assignee
        ? {
            id: issue.assignee.id,
            name: issue.assignee.name,
          }
        : null,
      cycle: issue.cycle
        ? {
            id: issue.cycle.id,
            name: issue.cycle.name,
          }
        : null,
      projectMilestone: issue.projectMilestone
        ? {
            id: issue.projectMilestone.id,
            name: issue.projectMilestone.name,
          }
        : null,
      labels: (issue.labels?.nodes ?? []).map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
      sortOrder: issue.sortOrder,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      url: issue.url,
    };
  }

  private compactIssueInput<T extends {
    assigneeId?: string;
    projectId?: string;
    cycleId?: string;
    dueDate?: string;
    labelIds?: string[];
    addedLabelIds?: string[];
    removedLabelIds?: string[];
    parentId?: string;
    subscriberIds?: string[];
    stateId?: string;
    templateId?: string;
    teamId?: string;
  }>(input: T): T {
    const compacted = {
      ...input,
      assigneeId: this.nonEmptyString(input.assigneeId),
      projectId: this.nonEmptyString(input.projectId),
      cycleId: this.nonEmptyString(input.cycleId),
      dueDate: this.nonEmptyString(input.dueDate),
      parentId: this.nonEmptyString(input.parentId),
      subscriberIds: this.nonEmptyArray(input.subscriberIds),
      stateId: this.nonEmptyString(input.stateId),
      templateId: this.nonEmptyString(input.templateId),
      teamId: this.nonEmptyString(input.teamId),
    } as T;

    const addedLabelIds = this.nonEmptyArray(input.addedLabelIds);
    const removedLabelIds = this.nonEmptyArray(input.removedLabelIds);

    if (addedLabelIds || removedLabelIds) {
      compacted.addedLabelIds = addedLabelIds as T['addedLabelIds'];
      compacted.removedLabelIds = removedLabelIds as T['removedLabelIds'];
      compacted.labelIds = undefined;
    } else {
      compacted.labelIds = this.nonEmptyArray(input.labelIds) as T['labelIds'];
      compacted.addedLabelIds = undefined;
      compacted.removedLabelIds = undefined;
    }

    return Object.fromEntries(
      Object.entries(compacted).filter(([, value]) => value !== undefined),
    ) as T;
  }

  private async requestGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    return await this.client.client.request<T, Record<string, unknown>>(query, variables ?? {});
  }

  private async getType(typeName: string): Promise<GraphQLType | null> {
    const cached = this.typeCache.get(typeName);
    if (cached) {
      return await cached;
    }

    const pending = this.requestGraphQL<GraphQLTypeQueryResult>(INTROSPECT_TYPE_QUERY, {
      name: typeName,
    })
      .then((result) => result.__type)
      .catch((error) => {
        this.typeCache.delete(typeName);
        throw error;
      });

    this.typeCache.set(typeName, pending);
    return await pending;
  }

  private async requireType(typeName: string): Promise<GraphQLType> {
    const type = await this.getType(typeName);
    if (!type) {
      throw new Error(`Linear schema type ${typeName} is not available for this token`);
    }

    return type;
  }

  private async resolveCustomFieldDefinitionsField(): Promise<GraphQLField> {
    const queryType = await this.requireType('Query');
    const field = pickBestField(queryType.fields ?? [], CUSTOM_FIELD_DEFINITION_PATTERNS);

    if (!field) {
      throw new Error(
        'The authenticated Linear schema does not expose a custom field definitions query',
      );
    }

    return field;
  }

  private async resolveIssueCustomFieldValuesField(): Promise<GraphQLField> {
    const issueType = await this.requireType('Issue');
    const field = pickBestField(issueType.fields ?? [], ISSUE_CUSTOM_FIELD_VALUE_PATTERNS);

    if (!field) {
      throw new Error(
        'The authenticated Linear schema does not expose issue custom field values on Issue',
      );
    }

    return field;
  }

  private async resolveUpdateIssueCustomFieldPlan(): Promise<UpdateIssueCustomFieldPlan> {
    const mutationType = await this.requireType('Mutation');
    const mutationField = pickBestField(
      mutationType.fields ?? [],
      UPDATE_CUSTOM_FIELD_MUTATION_PATTERNS,
    );

    if (!mutationField) {
      throw new Error(
        'The authenticated Linear schema does not expose an issue custom field update mutation',
      );
    }

    const inputArgument = mutationField.args.find((arg) => {
      const namedType = unwrapTypeRef(arg.type);
      return namedType.kind === 'INPUT_OBJECT' || /input/i.test(arg.name);
    });

    const inputType = inputArgument
      ? await this.getType(unwrapTypeRef(inputArgument.type).name as string)
      : null;
    const directArgs = mutationField.args.filter((arg) => arg !== inputArgument);
    const inputFields = inputType?.inputFields ?? [];
    const issueArgument = pickArgument(directArgs, ISSUE_ARGUMENT_PATTERNS);
    const issueInputField = pickArgument(inputFields, ISSUE_ARGUMENT_PATTERNS);
    const directSkipNames = new Set(issueArgument ? [issueArgument.name] : []);
    const inputSkipNames = new Set(issueInputField ? [issueInputField.name] : []);

    return {
      mutationField,
      issueArgument,
      inputArgument,
      inputType,
      issueInputField,
      customFieldDirectCandidates: directArgs.filter(
        (arg) =>
          !directSkipNames.has(arg.name) &&
          matchesArgumentPatterns(arg, CUSTOM_FIELD_ARGUMENT_PATTERNS),
      ),
      customFieldInputCandidates: inputFields.filter(
        (arg) =>
          !inputSkipNames.has(arg.name) &&
          matchesArgumentPatterns(arg, CUSTOM_FIELD_ARGUMENT_PATTERNS),
      ),
      valueDirectCandidates: directArgs.filter(
        (arg) =>
          !directSkipNames.has(arg.name) &&
          !matchesArgumentPatterns(arg, CUSTOM_FIELD_ARGUMENT_PATTERNS) &&
          (matchesArgumentPatterns(arg, VALUE_ARGUMENT_PATTERNS) || !isIdLikeName(arg.name)),
      ),
      valueInputCandidates: inputFields.filter(
        (arg) =>
          !inputSkipNames.has(arg.name) &&
          !matchesArgumentPatterns(arg, CUSTOM_FIELD_ARGUMENT_PATTERNS) &&
          (matchesArgumentPatterns(arg, VALUE_ARGUMENT_PATTERNS) || !isIdLikeName(arg.name)),
      ),
    };
  }

  private async resolveFavoriteMutationPlan(kind: 'add' | 'remove'): Promise<FavoriteMutationPlan> {
    const mutationType = await this.requireType('Mutation');
    const mutationField = pickBestField(
      mutationType.fields ?? [],
      kind === 'add' ? ADD_FAVORITE_MUTATION_PATTERNS : REMOVE_FAVORITE_MUTATION_PATTERNS,
    );

    if (!mutationField) {
      throw new Error(
        `The authenticated Linear schema does not expose a ${kind} favorite mutation`,
      );
    }

    const inputArgument = mutationField.args.find((arg) => {
      const namedType = unwrapTypeRef(arg.type);
      return namedType.kind === 'INPUT_OBJECT' || /input/i.test(arg.name);
    });

    const inputType = inputArgument
      ? await this.getType(unwrapTypeRef(inputArgument.type).name as string)
      : null;
    const directArgs = mutationField.args.filter((arg) => arg !== inputArgument);
    const inputFields = inputType?.inputFields ?? [];

    return {
      mutationField,
      inputArgument,
      inputType,
      entityArgument: pickArgument(directArgs, FAVORITE_ENTITY_ARGUMENT_PATTERNS),
      entityInputField: pickArgument(inputFields, FAVORITE_ENTITY_ARGUMENT_PATTERNS),
      favoriteArgument:
        pickArgument(directArgs, FAVORITE_ID_ARGUMENT_PATTERNS) ?? pickIdLikeArgument(directArgs),
      favoriteInputField:
        pickArgument(inputFields, FAVORITE_ID_ARGUMENT_PATTERNS) ?? pickIdLikeArgument(inputFields),
      directIdCandidates: directArgs.filter((arg) => isIdLikeName(arg.name)),
      inputIdCandidates: inputFields.filter((arg) => isIdLikeName(arg.name)),
    };
  }

  private async buildSelectionSet(
    typeRef: GraphQLTypeRef,
    preferredFields: string[],
    depth = 2,
    visited = new Set<string>(),
    nestedFieldPreferences: Record<string, string[]> = {},
  ): Promise<string> {
    const namedType = unwrapTypeRef(typeRef);
    if (!namedType.name || depth < 0) {
      return '';
    }

    if (namedType.kind === 'SCALAR' || namedType.kind === 'ENUM') {
      return '';
    }

    if (visited.has(namedType.name)) {
      return '';
    }

    const type = await this.getType(namedType.name);
    if (!type?.fields || type.fields.length === 0) {
      return '';
    }

    if (namedType.name.endsWith('Connection')) {
      const nodesField = type.fields.find((field) => field.name === 'nodes');
      if (!nodesField) {
        return '';
      }

      const nodeSelection = await this.buildSelectionSet(
        nodesField.type,
        preferredFields,
        depth - 1,
        new Set([...visited, namedType.name]),
        nestedFieldPreferences,
      );

      return nodeSelection ? ` { nodes${nodeSelection} }` : '';
    }

    const orderedFields = [
      ...preferredFields
        .map((fieldName) => type.fields?.find((field) => field.name === fieldName))
        .filter((field): field is GraphQLField => field !== undefined),
      ...type.fields.filter(
        (field) =>
          !preferredFields.includes(field.name) &&
          !hasRequiredArguments(field) &&
          ['SCALAR', 'ENUM'].includes(unwrapTypeRef(field.type).kind),
      ),
    ];
    const selections: string[] = [];

    for (const field of orderedFields) {
      if (hasRequiredArguments(field)) {
        continue;
      }

      const childType = unwrapTypeRef(field.type);
      if (childType.kind === 'SCALAR' || childType.kind === 'ENUM') {
        selections.push(field.name);
        continue;
      }

      if (depth === 0) {
        continue;
      }

      const childSelection = await this.buildSelectionSet(
        field.type,
        nestedFieldPreferences[field.name] ?? DEFAULT_NESTED_FIELDS,
        depth - 1,
        new Set([...visited, namedType.name]),
        nestedFieldPreferences,
      );

      if (childSelection) {
        selections.push(`${field.name}${childSelection}`);
      }
    }

    return selections.length > 0 ? ` { ${selections.join(' ')} }` : '';
  }

  private buildUpdateIssueCustomFieldMutationRequest(
    plan: UpdateIssueCustomFieldPlan,
    args: {
      issueId: string;
      customFieldId: string;
      value: JSONValue;
    },
  ): { variableDefinitions: string[]; invocationArgs: string[]; variables: Record<string, unknown> } {
    const variableDefinitions: string[] = [];
    const invocationArgs: string[] = [];
    const variables: Record<string, unknown> = {};
    const inputValue: Record<string, unknown> = {};
    const customFieldInputField = pickArgument(
      plan.customFieldInputCandidates,
      CUSTOM_FIELD_ARGUMENT_PATTERNS,
    );
    const customFieldDirectArgument = customFieldInputField
      ? undefined
      : pickArgument(plan.customFieldDirectCandidates, CUSTOM_FIELD_ARGUMENT_PATTERNS);
    const valueInputField = pickValueCandidate(plan.valueInputCandidates, args.value);
    const valueDirectArgument = valueInputField
      ? undefined
      : pickValueCandidate(plan.valueDirectCandidates, args.value);

    if (plan.issueArgument) {
      variableDefinitions.push(`$${plan.issueArgument.name}: ${typeRefToGraphQL(plan.issueArgument.type)}`);
      invocationArgs.push(`${plan.issueArgument.name}: $${plan.issueArgument.name}`);
      variables[plan.issueArgument.name] = args.issueId;
    } else if (plan.issueInputField) {
      inputValue[plan.issueInputField.name] = args.issueId;
    } else {
      throw new Error('The custom field mutation does not expose an issue identifier argument');
    }

    if (customFieldDirectArgument) {
      variableDefinitions.push(
        `$${customFieldDirectArgument.name}: ${typeRefToGraphQL(customFieldDirectArgument.type)}`,
      );
      invocationArgs.push(`${customFieldDirectArgument.name}: $${customFieldDirectArgument.name}`);
      variables[customFieldDirectArgument.name] = args.customFieldId;
    } else if (customFieldInputField) {
      inputValue[customFieldInputField.name] = args.customFieldId;
    } else {
      throw new Error(
        'The custom field mutation does not expose a custom field identifier argument',
      );
    }

    if (valueDirectArgument) {
      variableDefinitions.push(
        `$${valueDirectArgument.name}: ${typeRefToGraphQL(valueDirectArgument.type)}`,
      );
      invocationArgs.push(`${valueDirectArgument.name}: $${valueDirectArgument.name}`);
      variables[valueDirectArgument.name] = args.value;
    } else if (valueInputField) {
      inputValue[valueInputField.name] = args.value;
    } else {
      throw new Error(
        'The custom field mutation does not expose a value argument that matches the provided data',
      );
    }

    if (plan.inputArgument) {
      variableDefinitions.push(`$${plan.inputArgument.name}: ${typeRefToGraphQL(plan.inputArgument.type)}`);
      invocationArgs.push(`${plan.inputArgument.name}: $${plan.inputArgument.name}`);
      variables[plan.inputArgument.name] = inputValue;
    }

    return {
      variableDefinitions,
      invocationArgs,
      variables,
    };
  }

  private buildFavoriteMutationRequest(
    plan: FavoriteMutationPlan,
    args: { entityId?: string; favoriteId?: string },
    kind: 'add' | 'remove',
  ): { variableDefinitions: string[]; invocationArgs: string[]; variables: Record<string, unknown> } {
    const variableDefinitions: string[] = [];
    const invocationArgs: string[] = [];
    const variables: Record<string, unknown> = {};
    const inputValue: Record<string, unknown> = {};

    const requestedValue = args.favoriteId ?? args.entityId;
    if (!requestedValue) {
      throw new Error('A favorite identifier must be provided');
    }

    const favoriteTarget = args.favoriteId
      ? plan.favoriteArgument ?? plan.favoriteInputField
      : undefined;
    const entityTarget = args.entityId ? plan.entityArgument ?? plan.entityInputField : undefined;
    const fallbackTarget =
      plan.directIdCandidates.length === 1
        ? plan.directIdCandidates[0]
        : plan.inputIdCandidates.length === 1
          ? plan.inputIdCandidates[0]
          : undefined;
    const removeEntityFallbackTarget =
      kind === 'remove' && args.entityId && !args.favoriteId && fallbackTarget
        ? matchesArgumentPatterns(fallbackTarget, FAVORITE_ENTITY_ARGUMENT_PATTERNS)
          ? fallbackTarget
          : undefined
        : undefined;
    const target =
      favoriteTarget ??
      entityTarget ??
      removeEntityFallbackTarget ??
      (kind === 'remove' && args.entityId && !args.favoriteId ? undefined : fallbackTarget);

    if (!target) {
      if (kind === 'remove' && args.entityId && !args.favoriteId) {
        throw new Error(
          'The favorite removal mutation does not expose an entity identifier argument; use favoriteId for this schema',
        );
      }
      throw new Error('The favorite mutation does not expose a compatible identifier argument');
    }

    if (target === plan.favoriteInputField || target === plan.entityInputField || plan.inputIdCandidates.includes(target)) {
      inputValue[target.name] = requestedValue;
    } else {
      variableDefinitions.push(`$${target.name}: ${typeRefToGraphQL(target.type)}`);
      invocationArgs.push(`${target.name}: $${target.name}`);
      variables[target.name] = requestedValue;
    }

    if (plan.inputArgument) {
      variableDefinitions.push(`$${plan.inputArgument.name}: ${typeRefToGraphQL(plan.inputArgument.type)}`);
      invocationArgs.push(`${plan.inputArgument.name}: $${plan.inputArgument.name}`);
      variables[plan.inputArgument.name] = inputValue;
    }

    return {
      variableDefinitions,
      invocationArgs,
      variables,
    };
  }

  async getUserInfo() {
    const viewer = await this.client.viewer;
    return {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      displayName: viewer.displayName,
      active: viewer.active,
    };
  }

  async getOrganizationInfo() {
    const organization = await this.client.organization;
    return {
      id: organization.id,
      name: organization.name,
      urlKey: organization.urlKey,
      logoUrl: organization.logoUrl,
      createdAt: organization.createdAt,
      // Include subscription details if available
      subscription: organization.subscription || null,
    };
  }

  async getAllUsers() {
    const users = await this.client.users();
    return users.nodes.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      displayName: user.displayName,
      active: user.active,
    }));
  }

  async getLabels() {
    const labels = await this.client.issueLabels();
    return Promise.all(
      labels.nodes.map(async (label) => {
        const teamData = label.team ? await label.team : null;

        return {
          id: label.id,
          name: label.name,
          color: label.color,
          description: label.description,
          team: teamData
            ? {
                id: teamData.id,
                name: teamData.name,
              }
            : null,
        };
      }),
    );
  }

  async getTeams() {
    const teams = await this.client.teams();
    return teams.nodes.map((team) => ({
      id: team.id,
      name: team.name,
      key: team.key,
      description: team.description,
    }));
  }

  async createTeam(args: {
    name: string;
    key?: string;
    description?: string;
    color?: string;
    icon?: string;
    timezone?: string;
    parentId?: string;
    private?: boolean;
  }) {
    const payload = await this.client.createTeam(this.compactObject({
      name: args.name,
      key: this.nonEmptyString(args.key),
      description: this.nonEmptyString(args.description),
      color: this.nonEmptyString(args.color),
      icon: this.nonEmptyString(args.icon),
      timezone: this.nonEmptyString(args.timezone),
      parentId: this.nonEmptyString(args.parentId),
      private: args.private,
    }));
    if (!payload.success || !payload.team) {
      throw new Error('Failed to create team');
    }

    return this.normalizeTeam(await payload.team);
  }

  async updateTeam(args: {
    id: string;
    name?: string;
    key?: string;
    description?: string;
    color?: string;
    icon?: string;
    timezone?: string;
    parentId?: string;
    private?: boolean;
  }) {
    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      key: this.nonEmptyString(args.key),
      description: this.nonEmptyString(args.description),
      color: this.nonEmptyString(args.color),
      icon: this.nonEmptyString(args.icon),
      timezone: this.nonEmptyString(args.timezone),
      parentId: this.nonEmptyString(args.parentId),
      private: args.private,
    });
    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one team field must be provided');
    }

    const payload = await this.client.updateTeam(args.id, updateInput);
    if (!payload.success || !payload.team) {
      throw new Error(`Failed to update team ${args.id}`);
    }

    return this.normalizeTeam(await payload.team);
  }

  async archiveTeam(id: string) {
    const payload = await this.client.deleteTeam(id);
    if (!payload.success) {
      throw new Error(`Failed to archive team ${id}`);
    }

    return { success: true, id: payload.entityId };
  }

  async getTeamMemberships(args: {
    teamId: string;
    limit?: number;
    includeArchived?: boolean;
    orderBy?: string;
  }) {
    const team = await this.client.team(args.teamId);
    if (!team) {
      throw new Error(`Team with ID ${args.teamId} not found`);
    }

    const memberships = await team.memberships(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    return Promise.all(memberships.nodes.map((membership) => this.normalizeTeamMembership(membership)));
  }

  async addUserToTeam(args: { teamId: string; userId: string; owner?: boolean; sortOrder?: number }) {
    const payload = await this.client.createTeamMembership(this.compactObject(args));
    if (!payload.success || !payload.teamMembership) {
      throw new Error(`Failed to add user ${args.userId} to team ${args.teamId}`);
    }

    return this.normalizeTeamMembership(await payload.teamMembership);
  }

  async removeUserFromTeam(args: { teamId: string; userId: string; alsoLeaveParentTeams?: boolean }) {
    const team = await this.client.team(args.teamId);
    if (!team) {
      throw new Error(`Team with ID ${args.teamId} not found`);
    }

    const memberships = await team.memberships({ first: 250 });
    const matchingMembership = await Promise.all(memberships.nodes.map(async (membership) => ({
      membership,
      user: membership.user ? await membership.user : null,
    }))).then((entries) => entries.find((entry) => entry.user?.id === args.userId)?.membership);

    if (!matchingMembership) {
      throw new Error(`User ${args.userId} is not a member of team ${args.teamId}`);
    }

    const payload = await this.client.deleteTeamMembership(
      matchingMembership.id,
      this.compactObject({ alsoLeaveParentTeams: args.alsoLeaveParentTeams }),
    );
    if (!payload.success) {
      throw new Error(`Failed to remove user ${args.userId} from team ${args.teamId}`);
    }

    return { success: true, teamId: args.teamId, userId: args.userId };
  }

  async updateTeamMembership(args: { id: string; owner?: boolean; sortOrder?: number }) {
    const updateInput = this.compactObject({ owner: args.owner, sortOrder: args.sortOrder });
    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one team membership field must be provided');
    }

    const payload = await this.client.updateTeamMembership(args.id, updateInput);
    if (!payload.success || !payload.teamMembership) {
      throw new Error(`Failed to update team membership ${args.id}`);
    }

    return this.normalizeTeamMembership(await payload.teamMembership);
  }

  async getTeamLabels(args: { teamId: string; limit?: number; includeArchived?: boolean; orderBy?: string }) {
    const team = await this.client.team(args.teamId);
    if (!team) {
      throw new Error(`Team with ID ${args.teamId} not found`);
    }

    const labels = await team.labels(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    return Promise.all(labels.nodes.map((label) => this.normalizeIssueLabel(label)));
  }

  async createTeamLabel(args: {
    teamId: string;
    name: string;
    color?: string;
    description?: string;
    parentId?: string;
  }) {
    const payload = await this.client.createIssueLabel(this.compactObject({
      teamId: args.teamId,
      name: args.name,
      color: this.nonEmptyString(args.color),
      description: this.nonEmptyString(args.description),
      parentId: this.nonEmptyString(args.parentId),
    }));
    if (!payload.success || !payload.issueLabel) {
      throw new Error(`Failed to create label ${args.name}`);
    }

    return this.normalizeIssueLabel(await payload.issueLabel);
  }

  async createWorkflowState(args: {
    name: string;
    teamId: string;
    type: string;
    color: string;
    description?: string;
    position?: number;
  }) {
    const payload = await this.client.createWorkflowState(this.compactObject({
      name: args.name,
      teamId: args.teamId,
      type: args.type,
      color: args.color,
      description: this.nonEmptyString(args.description),
      position: args.position,
    }));
    if (!payload.success || !payload.workflowState) {
      throw new Error(`Failed to create workflow state ${args.name}`);
    }

    return this.normalizeWorkflowState(await payload.workflowState);
  }

  async updateWorkflowState(args: {
    id: string;
    name?: string;
    color?: string;
    description?: string;
    position?: number;
  }) {
    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      color: this.nonEmptyString(args.color),
      description: this.nonEmptyString(args.description),
      position: args.position,
    });
    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one workflow state field must be provided');
    }

    const payload = await this.client.updateWorkflowState(args.id, updateInput);
    if (!payload.success || !payload.workflowState) {
      throw new Error(`Failed to update workflow state ${args.id}`);
    }

    return this.normalizeWorkflowState(await payload.workflowState);
  }

  async getProjects() {
    const projects = await this.client.projects();
    return Promise.all(
      projects.nodes.map(async (project) => {
        // We need to fetch teams using the relationship
        const teams = await project.teams();

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          content: project.content,
          state: project.state,
          teams: teams.nodes.map((team) => ({
            id: team.id,
            name: team.name,
          })),
        };
      }),
    );
  }

  async getProjectById(id: string) {
    const project = await this.client.project(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const teams = await project.teams();

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      content: project.content,
      state: project.state,
      url: project.url,
      teams: teams.nodes.map((team) => ({
        id: team.id,
        name: team.name,
      })),
    };
  }

  async getMilestones(args: MilestoneQueryArgs = {}) {
    const limit = args.limit ?? 50;
    const includeArchived = args.includeArchived ?? false;
    const orderBy = this.normalizePaginationOrderBy(args.orderBy);

    const milestoneSource = async () => {
      if (!args.projectId) {
        return await this.client.projectMilestones(
          this.compactObject({
            first: limit,
            includeArchived,
            orderBy,
          }),
        );
      }

      const project = await this.client.project(args.projectId);
      if (!project) {
        throw new Error(`Project with ID ${args.projectId} not found`);
      }

      if (args.teamId) {
        const projectTeams = await project.teams({ first: 50 });
        const teamMatches = projectTeams.nodes.some((team) => team.id === args.teamId);

        if (!teamMatches) {
          return { nodes: [] as ProjectMilestone[] };
        }
      }

      return await project.projectMilestones(
        this.compactObject({
          first: limit,
          includeArchived,
          orderBy,
        }),
      );
    };

    const milestones = await milestoneSource();
    const normalizedMilestones = await Promise.all(
      milestones.nodes.map((milestone) => this.normalizeProjectMilestone(milestone)),
    );

    return normalizedMilestones.filter((milestone) => {
      if (args.projectId && milestone.project?.id !== args.projectId) {
        return false;
      }

      if (args.status && milestone.status !== args.status) {
        return false;
      }

      return true;
    });
  }

  async getDocuments(args: DocumentListArgs = {}) {
    const documents = await this.client.documents(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter: this.buildDocumentFilter(args),
      }),
    );

    return await Promise.all(documents.nodes.map((document) => this.normalizeDocument(document)));
  }

  async getDocumentById(id: string) {
    const document = await this.client.document(id);

    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }

    return await this.normalizeDocument(document);
  }

  async getProjectDocuments(args: ProjectDocumentListArgs) {
    const project = await this.client.project(args.projectId);
    if (!project) {
      throw new Error(`Project with ID ${args.projectId} not found`);
    }

    const documents = await project.documents(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter: this.buildDocumentFilter({ title: args.title }),
      }),
    );

    return await Promise.all(documents.nodes.map((document) => this.normalizeDocument(document)));
  }

  async searchDocuments(args: SearchDocumentsArgs) {
    const payload = await this.client.searchDocuments(args.term, this.compactObject({
      teamId: this.nonEmptyString(args.teamId),
      includeComments: args.includeComments,
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
      snippetSize: args.snippetSize,
    }));

    return {
      totalCount: payload.totalCount,
      nodes: await Promise.all(payload.nodes.map((document) => this.normalizeDocumentSearchResult(document))),
    };
  }

  async getWebhooks(args: { teamId?: string; limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const source = async () => {
      if (!args.teamId) {
        return this.client.webhooks(this.compactObject({
          first: args.limit ?? 25,
          includeArchived: args.includeArchived ?? false,
          orderBy: this.normalizePaginationOrderBy(args.orderBy),
        }));
      }

      const team = await this.client.team(args.teamId);
      if (!team) {
        throw new Error(`Team with ID ${args.teamId} not found`);
      }

      return team.webhooks(this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }));
    };

    const webhooks = await source();
    return Promise.all(webhooks.nodes.map((webhook) => this.normalizeWebhook(webhook)));
  }

  async createWebhook(args: {
    url: string;
    resourceTypes: string[];
    teamId?: string;
    enabled?: boolean;
    label?: string;
    secret?: string;
    allPublicTeams?: boolean;
  }) {
    const payload = await this.client.createWebhook(this.compactObject({
      url: args.url,
      resourceTypes: args.resourceTypes,
      teamId: this.nonEmptyString(args.teamId),
      enabled: args.enabled,
      label: this.nonEmptyString(args.label),
      secret: this.nonEmptyString(args.secret),
      allPublicTeams: args.allPublicTeams,
    }));
    if (!payload.success || !payload.webhook) {
      throw new Error('Failed to create webhook');
    }

    return this.normalizeWebhook(await payload.webhook);
  }

  async deleteWebhook(id: string) {
    const payload = await this.client.deleteWebhook(id);
    if (!payload.success) {
      throw new Error(`Failed to delete webhook ${id}`);
    }

    return { success: true, id: payload.entityId };
  }

  async getAttachments(args: { issueId: string; limit?: number; includeArchived?: boolean; orderBy?: string }) {
    const issue = await this.client.issue(args.issueId);
    if (!issue) {
      throw new Error(`Issue with ID ${args.issueId} not found`);
    }

    const attachments = await issue.attachments(this.compactObject({
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
    }));
    return Promise.all(attachments.nodes.map((attachment) => this.normalizeAttachment(attachment)));
  }

  async addAttachment(args: {
    issueId: string;
    title: string;
    url: string;
    subtitle?: string;
    iconUrl?: string;
    metadata?: JsonObject;
    commentBody?: string;
    groupBySource?: boolean;
  }) {
    const payload = await this.client.createAttachment(this.compactObject({
      issueId: args.issueId,
      title: args.title,
      url: args.url,
      subtitle: this.nonEmptyString(args.subtitle),
      iconUrl: this.nonEmptyString(args.iconUrl),
      metadata: this.nonEmptyObject(args.metadata),
      commentBody: this.nonEmptyString(args.commentBody),
      groupBySource: args.groupBySource,
    }));
    if (!payload.success || !payload.attachment) {
      throw new Error('Failed to add attachment');
    }

    return this.normalizeAttachment(await payload.attachment);
  }

  async getNotifications(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const result = await this.requestGraphQL<{ notifications: { nodes: any[] } }>(NOTIFICATION_SUMMARY_QUERY, {
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
    });
    return result.notifications.nodes.map((notification) => this.normalizeNotificationNode(notification));
  }

  async markNotificationAsRead(id: string) {
    const payload = await this.client.updateNotification(id, { readAt: new Date() });
    if (!payload.success) {
      throw new Error(`Failed to mark notification ${id} as read`);
    }

    return { success: true, id };
  }

  async getSubscriptions(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const subscriptions = await this.client.notificationSubscriptions(this.compactObject({
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
    }));
    return Promise.all(subscriptions.nodes.map((subscription) => this.normalizeNotificationSubscription(subscription)));
  }

  async markAllNotificationsAsRead(limit = 100) {
    const notifications = await this.getNotifications({ limit });
    const unread = notifications.filter((notification) => !notification.readAt);
    await Promise.all(unread.map((notification) => this.client.updateNotification(notification.id, { readAt: new Date() })));
    return { success: true, count: unread.length };
  }

  async getUnreadNotificationCount(limit = 100) {
    const notifications = await this.getNotifications({ limit });
    return { count: notifications.filter((notification) => !notification.readAt).length };
  }

  async getAuthenticationSessions() {
    const sessions = await this.client.authenticationSessions;
    return sessions.map((session) => this.normalizeAuthenticationSession(session));
  }

  async logoutSession(sessionId: string) {
    const payload = await this.client.logoutSession(sessionId);
    return { success: payload.success };
  }

  async logoutOtherSessions() {
    const payload = await this.client.logoutOtherSessions();
    return { success: payload.success };
  }

  async logoutAllSessions() {
    const payload = await this.client.logoutAllSessions();
    return { success: payload.success };
  }

  async getOrganizationAuditEvents(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const entries = await this.client.auditEntries(this.compactObject({
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
    }));
    return Promise.all(entries.nodes.map((entry) => this.normalizeAuditEntry(entry)));
  }

  async getUserAuditEvents(args: { userId: string; limit?: number; includeArchived?: boolean; orderBy?: string }) {
    const entries = await this.client.auditEntries(this.compactObject({
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
      filter: { actor: { id: { eq: args.userId } } },
    }));
    return Promise.all(entries.nodes.map((entry) => this.normalizeAuditEntry(entry)));
  }

  async getIntegrations(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const organization = await this.client.organization;
    const integrations = await organization.integrations(this.compactObject({
      first: args.limit ?? 25,
      includeArchived: args.includeArchived ?? false,
      orderBy: this.normalizePaginationOrderBy(args.orderBy),
    }));
    return Promise.all(integrations.nodes.map((integration) => this.normalizeIntegration(integration)));
  }

  async getDocumentContentHistory(id: string) {
    const payload = await this.client.documentContentHistory(id);

    return {
      success: payload.success,
      history: payload.history.map((entry) => ({
        id: entry.id,
        actorIds: entry.actorIds ?? [],
        createdAt: entry.createdAt,
        contentDataSnapshotAt: entry.contentDataSnapshotAt,
      })),
    };
  }

  async createDocument(args: DocumentCreateArgs) {
    const title = this.nonEmptyString(args.title);
    if (!title) {
      throw new Error('Document title is required');
    }

    const createdDocument = await this.client.createDocument(this.compactObject({
      title,
      content: args.content,
      icon: this.nonEmptyString(args.icon),
      color: this.nonEmptyString(args.color),
      projectId: this.nonEmptyString(args.projectId),
      initiativeId: this.nonEmptyString(args.initiativeId),
      lastAppliedTemplateId: this.nonEmptyString(args.lastAppliedTemplateId),
      sortOrder: args.sortOrder,
    }));

    if (createdDocument.success && createdDocument.document) {
      return await this.normalizeDocument(await createdDocument.document);
    }

    throw new Error('Failed to create document');
  }

  async updateDocument(args: DocumentUpdateArgs) {
    const updateInput = this.compactObject({
      title: this.nonEmptyString(args.title),
      content: args.content,
      icon: this.nullableNonEmptyString(args.icon),
      color: this.nullableNonEmptyString(args.color),
      hiddenAt:
        args.hiddenAt === null
          ? null
          : this.nonEmptyString(args.hiddenAt)
            ? new Date(this.nonEmptyString(args.hiddenAt) as string)
            : undefined,
      projectId: this.nullableNonEmptyString(args.projectId),
      initiativeId: this.nullableNonEmptyString(args.initiativeId),
      lastAppliedTemplateId: this.nullableNonEmptyString(args.lastAppliedTemplateId),
      sortOrder: args.sortOrder,
      trashed: args.trashed,
    });

    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one document field must be provided');
    }

    const updatedDocument = await this.client.updateDocument(args.id, updateInput);
    if (updatedDocument.success && updatedDocument.document) {
      return await this.normalizeDocument(await updatedDocument.document);
    }

    throw new Error('Failed to update document');
  }

  async archiveDocument(id: string) {
    const payload = await this.client.deleteDocument(id);
    return { success: payload.success, id };
  }

  async unarchiveDocument(id: string) {
    const payload = await this.client.unarchiveDocument(id);
    return { success: payload.success, id };
  }

  async getMilestoneById(id: string) {
    const milestone = await this.client.projectMilestone(id);

    if (!milestone) {
      throw new Error(`Milestone with ID ${id} not found`);
    }

    return this.normalizeProjectMilestone(milestone);
  }
  async getRoadmaps(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    await this.assertRoadmapsEnabled();

    const roadmaps = await this.client.roadmaps(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    return Promise.all(roadmaps.nodes.map((roadmap) => this.normalizeRoadmap(roadmap)));
  }

  async getRoadmapById(id: string) {
    await this.assertRoadmapsEnabled();

    const roadmap = await this.client.roadmap(id);
    if (!roadmap) {
      throw new Error(`Roadmap with ID ${id} not found`);
    }

    return this.normalizeRoadmap(roadmap, true);
  }

  async createRoadmap(args: {
    name: string;
    description?: string;
    color?: string;
    ownerId?: string;
    sortOrder?: number;
  }) {
    await this.assertRoadmapsEnabled();

    const createdRoadmap = await this.client.createRoadmap(
      this.compactObject({
        name: args.name,
        description: this.nonEmptyString(args.description),
        color: this.nonEmptyString(args.color),
        ownerId: this.nonEmptyString(args.ownerId),
        sortOrder: args.sortOrder,
      }),
    );

    if (!createdRoadmap.success || !createdRoadmap.roadmap) {
      throw new Error('Failed to create roadmap');
    }

    return this.normalizeRoadmap(await createdRoadmap.roadmap, true);
  }

  async updateRoadmap(args: {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    ownerId?: string;
    sortOrder?: number;
  }) {
    await this.assertRoadmapsEnabled();

    const roadmap = await this.client.roadmap(args.id);
    if (!roadmap) {
      throw new Error(`Roadmap with ID ${args.id} not found`);
    }

    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      description: this.nonEmptyString(args.description),
      color: this.nonEmptyString(args.color),
      ownerId: this.nonEmptyString(args.ownerId),
      sortOrder: args.sortOrder,
    });

    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one roadmap field must be provided');
    }

    const updatedRoadmap = await this.client.updateRoadmap(args.id, updateInput);

    if (!updatedRoadmap.success || !updatedRoadmap.roadmap) {
      throw new Error(`Failed to update roadmap ${args.id}`);
    }

    return this.normalizeRoadmap(await updatedRoadmap.roadmap, true);
  }

  async archiveRoadmap(roadmapId: string) {
    await this.assertRoadmapsEnabled();

    const roadmap = await this.client.roadmap(roadmapId);
    if (!roadmap) {
      throw new Error(`Roadmap with ID ${roadmapId} not found`);
    }

    const archivePayload = await roadmap.archive();
    if (!archivePayload.success) {
      throw new Error(`Failed to archive roadmap ${roadmapId}`);
    }

    const archivedRoadmap = await this.client.roadmap(roadmapId);
    if (!archivedRoadmap) {
      throw new Error(`Failed to retrieve archived roadmap ${roadmapId}`);
    }

    return {
      success: true,
      roadmap: await this.normalizeRoadmap(archivedRoadmap),
    };
  }

  async getSavedViews(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const views = await this.client.customViews(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    return Promise.all(views.nodes.map((view) => this.normalizeSavedView(view)));
  }

  async createSavedView(args: {
    name: string;
    description?: string;
    shared?: boolean;
    icon?: string;
    color?: string;
    teamId?: string;
    projectId?: string;
    ownerId?: string;
    filters?: JsonObject;
    filterData?: JsonObject;
    projectFilterData?: JsonObject;
  }) {
    const createdView = await this.client.createCustomView(
      this.compactObject({
        name: args.name,
        description: this.nonEmptyString(args.description),
        shared: args.shared,
        icon: this.nonEmptyString(args.icon),
        color: this.nonEmptyString(args.color),
        teamId: this.nonEmptyString(args.teamId),
        projectId: this.nonEmptyString(args.projectId),
        ownerId: this.nonEmptyString(args.ownerId),
        filters: this.nonEmptyObject(args.filters),
        filterData: this.nonEmptyObject(args.filterData) as JsonObject | undefined,
        projectFilterData: this.nonEmptyObject(args.projectFilterData) as JsonObject | undefined,
      }),
    );

    if (!createdView.success || !createdView.customView) {
      throw new Error('Failed to create saved view');
    }

    return this.normalizeSavedView(await createdView.customView);
  }

  async updateSavedView(args: {
    id: string;
    name?: string;
    description?: string | null;
    shared?: boolean;
    icon?: string | null;
    color?: string | null;
    teamId?: string | null;
    projectId?: string | null;
    ownerId?: string | null;
    filters?: JsonObject | null;
    filterData?: JsonObject | null;
    projectFilterData?: JsonObject | null;
  }) {
    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      description: this.nullableNonEmptyString(args.description),
      shared: args.shared,
      icon: this.nullableNonEmptyString(args.icon),
      color: this.nullableNonEmptyString(args.color),
      teamId: this.nullableNonEmptyString(args.teamId),
      projectId: this.nullableNonEmptyString(args.projectId),
      ownerId: this.nullableNonEmptyString(args.ownerId),
      filters: this.nullableNonEmptyObject(args.filters),
      filterData: this.nullableNonEmptyObject(args.filterData) as JsonObject | null | undefined,
      projectFilterData: this.nullableNonEmptyObject(args.projectFilterData) as JsonObject | null | undefined,
    });

    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one saved view field must be provided');
    }

    const updatedView = await this.client.updateCustomView(
      args.id,
      updateInput,
    );

    if (!updatedView.success || !updatedView.customView) {
      throw new Error(`Failed to update saved view ${args.id}`);
    }

    return this.normalizeSavedView(await updatedView.customView);
  }

  async deleteSavedView(id: string) {
    const deletePayload = await this.client.deleteCustomView(id);

    if (!deletePayload.success) {
      throw new Error(`Failed to delete saved view ${id}`);
    }

    return {
      success: deletePayload.success,
      id: deletePayload.entityId,
    };
  }

  async getFavoriteViews(args: { limit?: number; includeArchived?: boolean; orderBy?: string } = {}) {
    const response = await this.client.client.request<
      { favorites: { nodes: FavoriteViewNode[] } },
      Record<string, unknown>
    >(
      FAVORITE_VIEWS_QUERY,
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    const normalizedFavorites = response.favorites.nodes.map((favorite) =>
      this.normalizeFavoriteViewNode(favorite),
    );

    return normalizedFavorites.filter(
      (favorite): favorite is NonNullable<typeof favorite> => favorite !== null,
    );
  }

  async addToFavorites(args: { entityId: string }) {
    const plan = await this.resolveFavoriteMutationPlan('add');
    const { variableDefinitions, invocationArgs, variables } = this.buildFavoriteMutationRequest(plan, {
      entityId: args.entityId,
    }, 'add');
    const selectionSet =
      (await this.buildSelectionSet(
        plan.mutationField.type,
        ['success', 'favorite', 'id', 'favoriteId', 'entityId', 'targetId', 'resourceId'],
        3,
        new Set(),
        {
          favorite: ['id', 'type', 'sortOrder', 'createdAt', 'updatedAt', 'url', 'customView', 'predefinedViewType', 'predefinedViewTeam'],
          customView: ['id', 'name', 'slugId', 'shared'],
          predefinedViewTeam: ['id', 'name'],
        },
      )) || ' { success }';
    const mutation = `mutation LinearAddToFavorites(${variableDefinitions.join(', ')}) { ${plan.mutationField.name}${invocationArgs.length > 0 ? `(${invocationArgs.join(', ')})` : ''}${selectionSet} }`;
    const response = await this.requestGraphQL<Record<string, Record<string, unknown>>>(mutation, variables);

    return this.normalizeFavoriteMutationPayload(response[plan.mutationField.name] ?? {});
  }

  async removeFromFavorites(args: { favoriteId?: string; entityId?: string }) {
    const plan = await this.resolveFavoriteMutationPlan('remove');
    const { variableDefinitions, invocationArgs, variables } = this.buildFavoriteMutationRequest(
      plan,
      args,
      'remove',
    );
    const selectionSet =
      (await this.buildSelectionSet(
        plan.mutationField.type,
        ['success', 'favorite', 'id', 'favoriteId', 'entityId', 'targetId', 'resourceId'],
        3,
        new Set(),
        {
          favorite: ['id', 'type', 'sortOrder', 'createdAt', 'updatedAt', 'url', 'customView', 'predefinedViewType', 'predefinedViewTeam'],
          customView: ['id', 'name', 'slugId', 'shared'],
          predefinedViewTeam: ['id', 'name'],
        },
      )) || ' { success }';
    const mutation = `mutation LinearRemoveFromFavorites(${variableDefinitions.join(', ')}) { ${plan.mutationField.name}${invocationArgs.length > 0 ? `(${invocationArgs.join(', ')})` : ''}${selectionSet} }`;
    const response = await this.requestGraphQL<Record<string, Record<string, unknown>>>(mutation, variables);

    return this.normalizeFavoriteMutationPayload(response[plan.mutationField.name] ?? {});
  }

  async getIssues(limit = 25) {
    const issues = await this.client.issues({ first: limit });
    return Promise.all(
      issues.nodes.map(async (issue) => {
        // For relations, we need to fetch the objects
        const teamData = issue.team ? await issue.team : null;
        const assigneeData = issue.assignee ? await issue.assignee : null;
        const projectData = issue.project ? await issue.project : null;
        const cycleData = issue.cycle ? await issue.cycle : null;
        const projectMilestoneData = issue.projectMilestone ? await issue.projectMilestone : null;
        const parentData = issue.parent ? await issue.parent : null;
        const stateData = issue.state ? await issue.state : null;

        // Get labels
        const labels = await issue.labels();
        const labelsList = labels.nodes.map((label) => ({
          id: label.id,
          name: label.name,
          color: label.color,
        }));

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          state: stateData
            ? {
                id: stateData.id,
                name: stateData.name,
                color: stateData.color,
                type: stateData.type,
              }
            : null,
          priority: issue.priority,
          estimate: issue.estimate,
          dueDate: issue.dueDate,
          team: teamData
            ? {
                id: teamData.id,
                name: teamData.name,
              }
            : null,
          assignee: assigneeData
            ? {
                id: assigneeData.id,
                name: assigneeData.name,
              }
            : null,
          project: projectData
            ? {
                id: projectData.id,
                name: projectData.name,
              }
            : null,
          cycle: cycleData
            ? {
                id: cycleData.id,
                name: cycleData.name,
              }
            : null,
          projectMilestone: projectMilestoneData
            ? {
                id: projectMilestoneData.id,
                name: projectMilestoneData.name,
              }
            : null,
          parent: parentData
            ? {
                id: parentData.id,
                title: parentData.title,
              }
            : null,
          labels: labelsList,
          sortOrder: issue.sortOrder,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          url: issue.url,
        };
      }),
    );
  }

  async getIssueById(id: string) {
    const issue = await this.client.issue(id);

    if (!issue) {
      throw new Error(`Issue with ID ${id} not found`);
    }

    // For relations, we need to fetch the objects
    const teamData = issue.team ? await issue.team : null;
    const assigneeData = issue.assignee ? await issue.assignee : null;
    const projectData = issue.project ? await issue.project : null;
    const cycleData = issue.cycle ? await issue.cycle : null;
    const projectMilestoneData = issue.projectMilestone ? await issue.projectMilestone : null;
    const parentData = issue.parent ? await issue.parent : null;
    const stateData = issue.state ? await issue.state : null;

    // Get comments
    const comments = await issue.comments();
    const commentsList = await Promise.all(
      comments.nodes.map(async (comment) => {
        const userData = comment.user ? await comment.user : null;

        return {
          id: comment.id,
          body: comment.body,
          createdAt: comment.createdAt,
          user: userData
            ? {
                id: userData.id,
                name: userData.name,
              }
            : null,
        };
      }),
    );

    // Get labels
    const labels = await issue.labels();
    const labelsList = labels.nodes.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    }));

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      state: stateData
        ? {
            id: stateData.id,
            name: stateData.name,
            color: stateData.color,
            type: stateData.type,
          }
        : null,
      priority: issue.priority,
      estimate: issue.estimate,
      dueDate: issue.dueDate,
      team: teamData
        ? {
            id: teamData.id,
            name: teamData.name,
          }
        : null,
      assignee: assigneeData
        ? {
            id: assigneeData.id,
            name: assigneeData.name,
          }
        : null,
      project: projectData
        ? {
            id: projectData.id,
            name: projectData.name,
          }
        : null,
      cycle: cycleData
        ? {
            id: cycleData.id,
            name: cycleData.name,
          }
        : null,
      projectMilestone: projectMilestoneData
        ? {
            id: projectMilestoneData.id,
            name: projectMilestoneData.name,
          }
        : null,
      parent: parentData
        ? {
            id: parentData.id,
            title: parentData.title,
          }
        : null,
      labels: labelsList,
      sortOrder: issue.sortOrder,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      url: issue.url,
      comments: commentsList,
    };
  }

  async searchIssues(args: {
    query?: string;
    teamId?: string;
    assigneeId?: string;
    projectId?: string;
    states?: string[];
    limit?: number;
  }) {
    try {
      // Build filter object
      const filter: any = {};

      if (args.teamId) {
        filter.team = { id: { eq: args.teamId } };
      }

      if (args.assigneeId) {
        filter.assignee = { id: { eq: args.assigneeId } };
      }

      if (args.projectId) {
        filter.project = { id: { eq: args.projectId } };
      }

      // Handle state filtering
      if (args.states && args.states.length > 0) {
        // First, get all workflow states to map names to IDs if needed
        let stateIds: string[] = [];

        if (args.teamId) {
          // If we have a teamId, get workflow states for that team
          const workflowStates = await this.getWorkflowStates(args.teamId);

          // Map state names to IDs
          for (const stateName of args.states) {
            const matchingState = workflowStates.find(
              (state) => state.name.toLowerCase() === stateName.toLowerCase(),
            );

            if (matchingState) {
              stateIds.push(matchingState.id);
            }
          }
        } else {
          // If no teamId, we need to get all teams and their workflow states
          const teams = await this.getTeams();

          for (const team of teams) {
            const workflowStates = await this.getWorkflowStates(team.id);

            // Map state names to IDs
            for (const stateName of args.states) {
              const matchingState = workflowStates.find(
                (state) => state.name.toLowerCase() === stateName.toLowerCase(),
              );

              if (matchingState) {
                stateIds.push(matchingState.id);
              }
            }
          }
        }

        // If we found matching state IDs, filter by them
        if (stateIds.length > 0) {
          filter.state = { id: { in: stateIds } };
        }
      }

      // Handle text search
      let searchFilter = filter;
      if (args.query) {
        searchFilter = {
          ...filter,
          or: [{ title: { contains: args.query } }, { description: { contains: args.query } }],
        };
      }

      // Execute the search
      const issues = await this.client.issues({
        first: args.limit || 10,
        filter: searchFilter,
      });

      // Process the results
      return Promise.all(
        issues.nodes.map(async (issue) => {
          // For relations, we need to fetch the objects
          const teamData = issue.team ? await issue.team : null;
          const assigneeData = issue.assignee ? await issue.assignee : null;
          const projectData = issue.project ? await issue.project : null;
          const cycleData = issue.cycle ? await issue.cycle : null;
          const projectMilestoneData = issue.projectMilestone ? await issue.projectMilestone : null;
          const parentData = issue.parent ? await issue.parent : null;

          // Get labels
          const labels = await issue.labels();
          const labelsList = labels.nodes.map((label) => ({
            id: label.id,
            name: label.name,
            color: label.color,
          }));

          // Get state data
          const stateData = issue.state ? await issue.state : null;

          return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            state: stateData
              ? {
                  id: stateData.id,
                  name: stateData.name,
                  color: stateData.color,
                  type: stateData.type,
                }
              : null,
            priority: issue.priority,
            estimate: issue.estimate,
            dueDate: issue.dueDate,
            team: teamData
              ? {
                  id: teamData.id,
                  name: teamData.name,
                }
              : null,
            assignee: assigneeData
              ? {
                  id: assigneeData.id,
                  name: assigneeData.name,
                }
              : null,
            project: projectData
              ? {
                  id: projectData.id,
                  name: projectData.name,
                }
              : null,
            cycle: cycleData
              ? {
                  id: cycleData.id,
                  name: cycleData.name,
                }
              : null,
            projectMilestone: projectMilestoneData
              ? {
                  id: projectMilestoneData.id,
                  name: projectMilestoneData.name,
                }
              : null,
            parent: parentData
              ? {
                  id: parentData.id,
                  title: parentData.title,
                }
              : null,
            labels: labelsList,
            sortOrder: issue.sortOrder,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
            url: issue.url,
          };
        }),
      );
    } catch (error) {
      console.error('Error searching issues:', error);
      throw error;
    }
  }

  async createIssue(args: {
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
  }) {
    const createdIssue = await this.client.createIssue(this.compactIssueInput({
      title: args.title,
      description: args.description,
      teamId: args.teamId,
      assigneeId: args.assigneeId,
      priority: args.priority,
      projectId: args.projectId,
      projectMilestoneId: args.projectMilestoneId,
      cycleId: args.cycleId,
      estimate: args.estimate,
      dueDate: args.dueDate,
      labelIds: args.labelIds,
      parentId: args.parentId,
      subscriberIds: args.subscriberIds,
      stateId: args.stateId,
      templateId: args.templateId,
      sortOrder: args.sortOrder,
    }));

    // Access the issue from the payload
    if (createdIssue.success && createdIssue.issue) {
      const issueData = await createdIssue.issue;
      return {
        id: issueData.id,
        title: issueData.title,
        description: issueData.description,
        url: issueData.url,
      };
    } else {
      throw new Error('Failed to create issue');
    }
  }

  async updateIssue(args: {
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
  }) {
    const updatedIssue = await this.client.updateIssue(args.id, this.compactIssueInput({
      title: args.title,
      description: args.description,
      stateId: args.stateId,
      priority: args.priority,
      projectId: args.projectId,
      projectMilestoneId: args.projectMilestoneId,
      assigneeId: args.assigneeId,
      cycleId: args.cycleId,
      estimate: args.estimate,
      dueDate: args.dueDate,
      labelIds: args.labelIds,
      addedLabelIds: args.addedLabelIds,
      removedLabelIds: args.removedLabelIds,
      parentId: args.parentId,
      subscriberIds: args.subscriberIds,
      teamId: args.teamId,
      sortOrder: args.sortOrder,
    }));

    if (updatedIssue.success && updatedIssue.issue) {
      const issueData = await updatedIssue.issue;
      return {
        id: issueData.id,
        title: issueData.title,
        description: issueData.description,
        url: issueData.url,
      };
    } else {
      throw new Error('Failed to update issue');
    }
  }

  async getCustomFields() {
    const field = await this.resolveCustomFieldDefinitionsField();
    const selectionSet = await this.buildSelectionSet(field.type, CUSTOM_FIELD_DEFINITION_FIELDS);
    const query = `query LinearGetCustomFields { ${field.name}${selectionSet} }`;
    const response = await this.requestGraphQL<Record<string, unknown>>(query);

    return extractListItems(response[field.name]).map((item) => normalizeCustomFieldDefinition(item));
  }

  async getIssueCustomFields(issueId: string) {
    const field = await this.resolveIssueCustomFieldValuesField();
    const selectionSet = await this.buildSelectionSet(field.type, ISSUE_CUSTOM_FIELD_VALUE_FIELDS);
    const query = `
      query LinearGetIssueCustomFields($id: String!) {
        issue(id: $id) {
          id
          identifier
          ${field.name}${selectionSet}
        }
      }
    `;
    const response = await this.requestGraphQL<{ issue: Record<string, unknown> | null }>(query, {
      id: issueId,
    });

    if (!response.issue) {
      throw new Error(`Issue with ID ${issueId} not found`);
    }

    return {
      issueId: getFirstString(response.issue, ['id']) ?? issueId,
      identifier: getFirstString(response.issue, ['identifier']),
      customFields: extractListItems(response.issue[field.name]).map((item) =>
        normalizeIssueCustomFieldValue(item),
      ),
    };
  }

  async updateIssueCustomField(args: {
    issueId: string;
    customFieldId: string;
    value: JSONValue;
  }) {
    if (!isJSONValue(args.value)) {
      throw new Error('Custom field values must be JSON-compatible; use null to clear the value');
    }

    const plan = await this.resolveUpdateIssueCustomFieldPlan();
    const selectionSet = await this.buildSelectionSet(plan.mutationField.type, [
      'success',
      'issue',
      'customFieldValue',
      'fieldValue',
      'issueCustomField',
      'customField',
      'value',
    ], 2, undefined, {
      issue: ['id'],
      customFieldValue: ISSUE_CUSTOM_FIELD_VALUE_FIELDS,
      fieldValue: ISSUE_CUSTOM_FIELD_VALUE_FIELDS,
      issueCustomField: ISSUE_CUSTOM_FIELD_VALUE_FIELDS,
      customField: ['id'],
    });
    const { variableDefinitions, invocationArgs, variables } =
      this.buildUpdateIssueCustomFieldMutationRequest(plan, args);
    const mutation = `
      mutation LinearUpdateIssueCustomField(${variableDefinitions.join(', ')}) {
        ${plan.mutationField.name}(${invocationArgs.join(', ')})${selectionSet}
      }
    `;
    const response = await this.requestGraphQL<Record<string, unknown>>(mutation, variables);
    const payload = response[plan.mutationField.name];
    const payloadRecord = isPlainObject(payload) ? payload : { value: payload };
    const currentValueRecord = getFirstRecord(payloadRecord, [
      'customFieldValue',
      'fieldValue',
      'issueCustomField',
    ]);
    const success = typeof payloadRecord.success === 'boolean' ? payloadRecord.success : true;

    if (!success) {
      throw new Error(`Linear mutation ${plan.mutationField.name} reported success=false`);
    }

    return {
      success,
      issueId: args.issueId,
      customFieldId: args.customFieldId,
      value: args.value,
      currentValue: currentValueRecord
        ? normalizeIssueCustomFieldValue(currentValueRecord)
        : undefined,
      raw: payload,
    };
  }

  async createComment(args: { issueId: string; body: string; parentId?: string }) {
    const createdComment = await this.client.createComment({
      issueId: args.issueId,
      body: args.body,
      ...(this.nonEmptyString(args.parentId) ? { parentId: this.nonEmptyString(args.parentId) } : {}),
    });

    if (createdComment.success && createdComment.comment) {
      const commentData = await createdComment.comment;
      const parent = commentData.parent ? await commentData.parent : null;
      return {
        id: commentData.id,
        body: commentData.body,
        url: commentData.url,
        parentId: parent?.id,
      };
    } else {
      throw new Error('Failed to create comment');
    }
  }

  async createProject(args: {
    name: string;
    description?: string;
    content?: string;
    teamIds: string[] | string;
    state?: string;
    startDate?: string;
    targetDate?: string;
    leadId?: string;
    memberIds?: string[] | string;
    sortOrder?: number;
    icon?: string;
    color?: string;
  }) {
    const teamIds = Array.isArray(args.teamIds) ? args.teamIds : [args.teamIds];
    const memberIds = args.memberIds
      ? Array.isArray(args.memberIds)
        ? args.memberIds
        : [args.memberIds]
      : undefined;

    const createdProject = await this.client.createProject({
      name: args.name,
      description: args.description,
      content: args.content,
      teamIds: teamIds,
      state: args.state,
      startDate: args.startDate ? new Date(args.startDate) : undefined,
      targetDate: args.targetDate ? new Date(args.targetDate) : undefined,
      leadId: args.leadId,
      memberIds: memberIds,
      sortOrder: args.sortOrder,
      icon: args.icon,
      color: args.color,
    });

    if (createdProject.success && createdProject.project) {
      const projectData = await createdProject.project;
      const leadData = projectData.lead ? await projectData.lead : null;

      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        content: projectData.content,
        state: projectData.state,
        startDate: projectData.startDate,
        targetDate: projectData.targetDate,
        lead: leadData
          ? {
              id: leadData.id,
              name: leadData.name,
            }
          : null,
        icon: projectData.icon,
        color: projectData.color,
        url: projectData.url,
      };
    } else {
      throw new Error('Failed to create project');
    }
  }

  async createMilestone(args: {
    name: string;
    projectId: string;
    description?: string;
    targetDate?: string;
    sortOrder?: number;
  }) {
    const createPayload = await this.client.createProjectMilestone(
      this.compactObject({
        name: args.name,
        projectId: args.projectId,
        description: this.nonEmptyString(args.description),
        targetDate: this.nonEmptyString(args.targetDate),
        sortOrder: args.sortOrder,
      }),
    );

    if (!createPayload.success || !createPayload.projectMilestone) {
      throw new Error('Failed to create milestone');
    }

    return this.normalizeProjectMilestone(await createPayload.projectMilestone);
  }

  /**
   * Adds a label to an issue
   * @param issueId The ID or identifier of the issue
   * @param labelId The ID of the label to add
   * @returns Success status and IDs
   */
  async addIssueLabel(issueId: string, labelId: string) {
    // Get the issue
    const issue = await this.client.issue(issueId);

    if (!issue) {
      throw new Error(`Issue not found: ${issueId}`);
    }

    // Get the current labels
    const currentLabels = await issue.labels();
    const currentLabelIds = currentLabels.nodes.map((label) => label.id);

    // Add the new label ID if it's not already present
    if (!currentLabelIds.includes(labelId)) {
      await issue.update({
        labelIds: [...currentLabelIds, labelId],
      });
    }

    return {
      success: true,
      issueId: issue.id,
      labelId,
    };
  }

  /**
   * Removes a label from an issue
   * @param issueId The ID or identifier of the issue
   * @param labelId The ID of the label to remove
   * @returns Success status and IDs
   */
  async removeIssueLabel(issueId: string, labelId: string) {
    // Get the issue
    const issue = await this.client.issue(issueId);

    if (!issue) {
      throw new Error(`Issue not found: ${issueId}`);
    }

    // Get the current labels
    const currentLabels = await issue.labels();
    const currentLabelIds = currentLabels.nodes.map((label) => label.id);

    // Filter out the label ID to remove
    const updatedLabelIds = currentLabelIds.filter((id) => id !== labelId);

    // Only update if the label was actually present
    if (currentLabelIds.length !== updatedLabelIds.length) {
      await issue.update({
        labelIds: updatedLabelIds,
      });
    }

    return {
      success: true,
      issueId: issue.id,
      labelId,
    };
  }

  /**
   * Assigns an issue to a user
   */
  async assignIssue(issueId: string, assigneeId: string) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get the user to assign
      const user = assigneeId ? await this.client.user(assigneeId) : null;

      // Update the issue with the new assignee
      const updatedIssue = await issue.update({
        assigneeId: assigneeId,
      });

      // Get the updated assignee data
      // We need to get the full issue record and its relationships
      const issueData = await this.client.issue(issue.id);
      const assigneeData = issueData && issueData.assignee ? await issueData.assignee : null;

      return {
        success: true,
        issue: {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          assignee: assigneeData
            ? {
                id: assigneeData.id,
                name: assigneeData.name,
                displayName: assigneeData.displayName,
              }
            : null,
          url: issue.url,
        },
      };
    } catch (error) {
      console.error('Error assigning issue:', error);
      throw error;
    }
  }

  /**
   * Subscribes to issue updates
   */
  async subscribeToIssue(issueId: string) {
    try {
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const viewer = await this.client.viewer;
      const subscribers = await issue.subscribers({ first: 250 });
      const subscriberIds = subscribers.nodes.map((subscriber) => subscriber.id);
      const nextSubscriberIds = subscriberIds.includes(viewer.id)
        ? subscriberIds
        : [...subscriberIds, viewer.id];

      await this.client.updateIssue(issue.id, { subscriberIds: nextSubscriberIds });

      return {
        success: true,
        message: `User ${viewer.name} (${viewer.id}) is subscribed to issue ${issue.identifier}.`,
      };
    } catch (error) {
      console.error('Error subscribing to issue:', error);
      throw error;
    }
  }

  /**
   * Converts an issue to a subtask of another issue
   */
  async convertIssueToSubtask(issueId: string, parentIssueId: string) {
    try {
      // Get both issues
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const parentIssue = await this.client.issue(parentIssueId);
      if (!parentIssue) {
        throw new Error(`Parent issue with ID ${parentIssueId} not found`);
      }

      // Convert the issue to a subtask
      const updatedIssue = await issue.update({
        parentId: parentIssueId,
      });

      // Get parent data - we need to fetch the updated issue to get relationships
      const updatedIssueData = await this.client.issue(issue.id);
      const parentData =
        updatedIssueData && updatedIssueData.parent ? await updatedIssueData.parent : null;

      return {
        success: true,
        issue: {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          parent: parentData
            ? {
                id: parentData.id,
                identifier: parentData.identifier,
                title: parentData.title,
              }
            : null,
          url: issue.url,
        },
      };
    } catch (error) {
      console.error('Error converting issue to subtask:', error);
      throw error;
    }
  }

  /**
   * Creates a relation between two issues
   */
  async createIssueRelation(issueId: string, relatedIssueId: string, relationType: string) {
    try {
      // Get both issues
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const relatedIssue = await this.client.issue(relatedIssueId);
      if (!relatedIssue) {
        throw new Error(`Related issue with ID ${relatedIssueId} not found`);
      }

      const validTypes = ["blocks", "duplicate", "related"];
      
      if (!validTypes.includes(relationType)) {
        throw new Error(`${relationType} is not a valid relation type`)
      }

      const relation = await this.client.createIssueRelation({
        issueId,
        relatedIssueId,
        // @ts-ignore
        type: relationType, 
      })

      // For now, we'll just acknowledge the request with a success message
      // The actual relation creation logic would need to be implemented based on the Linear SDK specifics
      // In a production environment, we should check the SDK documentation for the correct method

      return {
        success: true,
        relation,
      };
    } catch (error) {
      console.error('Error creating issue relation:', error);
      throw error;
    }
  }

  /**
   * Archives an issue
   */
  async archiveIssue(issueId: string) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Archive the issue
      await issue.archive();

      return {
        success: true,
        message: `Issue ${issue.identifier} has been archived`,
      };
    } catch (error) {
      console.error('Error archiving issue:', error);
      throw error;
    }
  }

  /**
   * Sets the priority of an issue
   */
  async setIssuePriority(issueId: string, priority: number) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Update the issue priority
      await issue.update({
        priority: priority,
      });

      // Get the updated issue
      const updatedIssue = await this.client.issue(issue.id);

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
          priority: updatedIssue.priority,
          url: updatedIssue.url,
        },
      };
    } catch (error) {
      console.error('Error setting issue priority:', error);
      throw error;
    }
  }

  /**
   * Transfers an issue to another team
   */
  async transferIssue(issueId: string, teamId: string) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get the team
      const team = await this.client.team(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }

      // Transfer the issue
      await issue.update({
        teamId: teamId,
      });

      // Get the updated issue
      const updatedIssue = await this.client.issue(issue.id);
      const teamData = updatedIssue.team ? await updatedIssue.team : null;

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
          team: teamData
            ? {
                id: teamData.id,
                name: teamData.name,
                key: teamData.key,
              }
            : null,
          url: updatedIssue.url,
        },
      };
    } catch (error) {
      console.error('Error transferring issue:', error);
      throw error;
    }
  }

  /**
   * Duplicates an issue
   */
  async duplicateIssue(issueId: string) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get all the relevant issue data
      const teamData = await issue.team;
      if (!teamData) {
        throw new Error('Could not retrieve team data for the issue');
      }

      // Create a new issue using the createIssue method of this service
      const newIssueData = await this.createIssue({
        title: `${issue.title} (Copy)`,
        description: issue.description,
        teamId: teamData.id,
        // We'll have to implement getting these properties in a production environment
        // For now, we'll just create a basic copy with title and description
      });

      // Get the full issue details with identifier
      const newIssue = await this.client.issue(newIssueData.id);

      return {
        success: true,
        originalIssue: {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
        },
        duplicatedIssue: {
          id: newIssue.id,
          identifier: newIssue.identifier,
          title: newIssue.title,
          url: newIssue.url,
        },
      };
    } catch (error) {
      console.error('Error duplicating issue:', error);
      throw error;
    }
  }

  /**
   * Gets the history of changes made to an issue
   */
  async getIssueHistory(issueId: string, limit = 10) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get the issue history
      const history = await issue.history({ first: limit });

      // Process and format each history event
      const historyEvents = await Promise.all(
        history.nodes.map(async (event) => {
          // Get the actor data if available
          const actorData = event.actor ? await event.actor : null;

          return {
            id: event.id,
            createdAt: event.createdAt,
            actor: actorData
              ? {
                  id: actorData.id,
                  name: actorData.name,
                  displayName: actorData.displayName,
                }
              : null,
            // Use optional chaining to safely access properties that may not exist
            type: (event as any).type || 'unknown',
            from: (event as any).from || null,
            to: (event as any).to || null,
          };
        }),
      );

      return {
        issueId: issue.id,
        identifier: issue.identifier,
        history: historyEvents,
      };
    } catch (error) {
      console.error('Error getting issue history:', error);
      throw error;
    }
  }

  /**
   * Get all comments for an issue
   * @param issueId The ID or identifier of the issue
   * @param limit Maximum number of comments to return
   * @returns List of comments
   */
  async getComments(issueId: string, limit = 25) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get comments
      const comments = await issue.comments({ first: limit });

      // Process comments
      return Promise.all(
        comments.nodes.map(async (comment) => {
          const userData = comment.user ? await comment.user : null;

          return {
            id: comment.id,
            body: comment.body,
            createdAt: comment.createdAt,
            user: userData
              ? {
                  id: userData.id,
                  name: userData.name,
                  displayName: userData.displayName,
                }
              : null,
            url: comment.url,
          };
        }),
      );
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  async updateComment(args: {
    id: string;
    body?: string;
    quotedText?: string;
    resolvingCommentId?: string;
    resolvingUserId?: string;
    subscriberIds?: string[];
    doNotSubscribeToIssue?: boolean;
  }) {
    const updateInput = this.compactObject({
      body: this.nonEmptyString(args.body),
      quotedText: this.nonEmptyString(args.quotedText),
      resolvingCommentId: this.nonEmptyString(args.resolvingCommentId),
      resolvingUserId: this.nonEmptyString(args.resolvingUserId),
      subscriberIds: this.nonEmptyArray(args.subscriberIds),
      doNotSubscribeToIssue: args.doNotSubscribeToIssue,
    });

    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one comment field must be provided');
    }

    const payload = await this.client.updateComment(args.id, updateInput);
    if (!payload.success || !payload.comment) {
      throw new Error(`Failed to update comment ${args.id}`);
    }

    return this.normalizeComment(await payload.comment);
  }

  async deleteComment(id: string) {
    const payload = await this.client.deleteComment(id);
    if (!payload.success) {
      throw new Error(`Failed to delete comment ${id}`);
    }

    return { success: true, id: payload.entityId };
  }

  /**
   * Update an existing project
   * @param args Project update data
   * @returns Updated project
   */
  async updateProject(args: {
    id: string;
    name?: string;
    description?: string;
    content?: string;
    state?: string;
    startDate?: string;
    targetDate?: string;
    leadId?: string;
    memberIds?: string[] | string;
    sortOrder?: number;
    icon?: string;
    color?: string;
  }) {
    try {
      // Get the project
      const project = await this.client.project(args.id);
      if (!project) {
        throw new Error(`Project with ID ${args.id} not found`);
      }

      // Process member IDs if provided
      const memberIds = args.memberIds
        ? Array.isArray(args.memberIds)
          ? args.memberIds
          : [args.memberIds]
        : undefined;

      // Update the project using client.updateProject
      const updatePayload = await this.client.updateProject(args.id, {
        name: args.name,
        description: args.description,
        content: args.content,
        state: args.state as any,
        startDate: args.startDate ? new Date(args.startDate) : undefined,
        targetDate: args.targetDate ? new Date(args.targetDate) : undefined,
        leadId: args.leadId,
        memberIds: memberIds,
        sortOrder: args.sortOrder,
        icon: args.icon,
        color: args.color,
      });

      if (updatePayload.success) {
        // Get the updated project data
        const updatedProject = await this.client.project(args.id);
        const leadData = updatedProject.lead ? await updatedProject.lead : null;

        // Return the updated project info
        return {
          id: updatedProject.id,
          name: updatedProject.name,
          description: updatedProject.description,
          content: updatedProject.content,
          state: updatedProject.state,
          startDate: updatedProject.startDate,
          targetDate: updatedProject.targetDate,
          lead: leadData
            ? {
                id: leadData.id,
                name: leadData.name,
              }
            : null,
          icon: updatedProject.icon,
          color: updatedProject.color,
          url: updatedProject.url,
        };
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async getProjectMembers(args: {
    projectId: string;
    limit?: number;
    includeArchived?: boolean;
    includeDisabled?: boolean;
    orderBy?: string;
  }) {
    const project = await this.client.project(args.projectId);
    if (!project) {
      throw new Error(`Project with ID ${args.projectId} not found`);
    }

    const members = await project.members(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        includeDisabled: args.includeDisabled ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
      }),
    );

    return members.nodes.map((user) => this.normalizeSimpleUser(user));
  }

  async addProjectMember(projectId: string, userId: string) {
    const project = await this.client.project(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const members = await project.members({ first: 250 });
    const existingIds = members.nodes.map((member) => member.id);
    const memberIds = existingIds.includes(userId) ? existingIds : [...existingIds, userId];
    await this.updateProject({ id: projectId, memberIds });

    return { success: true, projectId, userId };
  }

  async removeProjectMember(projectId: string, userId: string) {
    const project = await this.client.project(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const members = await project.members({ first: 250 });
    const existingIds = members.nodes.map((member) => member.id);
    const memberIds = existingIds.filter((id) => id !== userId);
    await this.updateProject({ id: projectId, memberIds });

    return { success: true, projectId, userId };
  }

  async updateMilestone(args: {
    id: string;
    name?: string;
    projectId?: string;
    description?: string;
    targetDate?: string;
    sortOrder?: number;
  }) {
    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      projectId: this.nonEmptyString(args.projectId),
      description: this.nonEmptyString(args.description),
      targetDate: this.nonEmptyString(args.targetDate),
      sortOrder: args.sortOrder,
    });

    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one milestone field must be provided');
    }

    const updatePayload = await this.client.updateProjectMilestone(args.id, updateInput);

    if (!updatePayload.success || !updatePayload.projectMilestone) {
      throw new Error(`Failed to update milestone ${args.id}`);
    }

    return this.normalizeProjectMilestone(await updatePayload.projectMilestone);
  }

  /**
   * Add an issue to a project
   * @param issueId ID of the issue to add
   * @param projectId ID of the project
   * @returns Success status and issue details
   */
  async addIssueToProject(issueId: string, projectId: string) {
    try {
      // Get the issue
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get the project
      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      // Update the issue with the project ID
      await issue.update({
        projectId: projectId,
      });

      // Get the updated issue data with project
      const updatedIssue = await this.client.issue(issueId);
      const projectData = updatedIssue.project ? await updatedIssue.project : null;

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
          project: projectData
            ? {
                id: projectData.id,
                name: projectData.name,
              }
            : null,
        },
      };
    } catch (error) {
      console.error('Error adding issue to project:', error);
      throw error;
    }
  }

  /**
   * Remove an issue from a project
   * @param issueId ID of the issue to remove
   * @param projectId ID of the project to remove the issue from
   * @returns Success status and issue/project details
   */
  async removeIssueFromProject(issueId: string, projectId: string) {
    try {
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const currentProject = issue.project ? await issue.project : null;
      if (!currentProject || currentProject.id !== projectId) {
        throw new Error(`Issue ${issue.identifier} is not associated with project ${projectId}`);
      }

      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      await this.client.updateIssue(issue.id, { projectId: null });

      const updatedIssue = await this.client.issue(issue.id);

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
        },
        project: {
          id: project.id,
          name: project.name,
        },
      };
    } catch (error) {
      console.error('Error removing issue from project:', error);
      throw error;
    }
  }

  /**
   * Get all issues associated with a project
   * @param projectId ID of the project
   * @param limit Maximum number of issues to return
   * @returns List of issues in the project
   */
  async getProjectIssues(args: ProjectIssueQueryArgs) {
    try {
      const filter = this.compactObject({
        ...this.buildPMIssueFilter(args),
        project: { id: { eq: args.projectId } },
      });

      const result = await this.requestGraphQL<{ issues: { nodes: any[] } }>(ISSUE_SUMMARIES_QUERY, {
        first: args.limit ?? 25,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter,
      });

      return result.issues.nodes.map((issue) => this.normalizeIssueSummaryNode(issue));
    } catch (error) {
      console.error('Error getting project issues:', error);
      throw error;
    }
  }

  /**
   * Gets a list of all cycles
   * @param teamId Optional team ID to filter cycles by team
   * @param limit Maximum number of cycles to return
   * @returns List of cycles
   */
  async getCycles(teamId?: string, limit = 25) {
    try {
      const filters: Record<string, any> = {};

      if (teamId) {
        filters.team = { id: { eq: teamId } };
      }

      const cycles = await this.client.cycles({
        filter: filters,
        first: limit,
      });

      const cyclesData = await cycles.nodes;

      return Promise.all(
        cyclesData.map(async (cycle) => {
          // Get team information
          const team = cycle.team ? await cycle.team : null;

          return {
            id: cycle.id,
            number: cycle.number,
            name: cycle.name,
            description: cycle.description,
            startsAt: cycle.startsAt,
            endsAt: cycle.endsAt,
            completedAt: cycle.completedAt,
            team: team
              ? {
                  id: team.id,
                  name: team.name,
                  key: team.key,
                }
              : null,
          };
        }),
      );
    } catch (error) {
      console.error('Error getting cycles:', error);
      throw error;
    }
  }

  async getCycleById(id: string) {
    const cycle = await this.client.cycle(id);
    if (!cycle) {
      throw new Error(`Cycle with ID ${id} not found`);
    }

    return this.normalizeCycle(cycle);
  }

  async createCycle(args: {
    teamId: string;
    startsAt: string;
    endsAt: string;
    name?: string;
    description?: string;
    completedAt?: string;
  }) {
    const payload = await this.client.createCycle(this.compactObject({
      teamId: args.teamId,
      startsAt: new Date(args.startsAt),
      endsAt: new Date(args.endsAt),
      name: this.nonEmptyString(args.name),
      description: this.nonEmptyString(args.description),
      completedAt: this.nonEmptyString(args.completedAt) ? new Date(args.completedAt!) : undefined,
    }));
    if (!payload.success || !payload.cycle) {
      throw new Error('Failed to create cycle');
    }

    return this.normalizeCycle(await payload.cycle);
  }

  async updateCycle(args: {
    id: string;
    startsAt?: string;
    endsAt?: string;
    name?: string;
    description?: string;
    completedAt?: string;
  }) {
    const updateInput = this.compactObject({
      startsAt: this.nonEmptyString(args.startsAt) ? new Date(args.startsAt!) : undefined,
      endsAt: this.nonEmptyString(args.endsAt) ? new Date(args.endsAt!) : undefined,
      name: this.nonEmptyString(args.name),
      description: this.nonEmptyString(args.description),
      completedAt: this.nonEmptyString(args.completedAt) ? new Date(args.completedAt!) : undefined,
    });
    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one cycle field must be provided');
    }

    const payload = await this.client.updateCycle(args.id, updateInput);
    if (!payload.success || !payload.cycle) {
      throw new Error(`Failed to update cycle ${args.id}`);
    }

    return this.normalizeCycle(await payload.cycle);
  }

  async completeCycle(id: string) {
    return this.updateCycle({ id, completedAt: new Date().toISOString() });
  }

  async getCycleStats(id: string) {
    const cycle = await this.client.cycle(id);
    if (!cycle) {
      throw new Error(`Cycle with ID ${id} not found`);
    }

    const issues = await this.client.issues({ filter: { cycle: { id: { eq: id } } }, first: 100 });
    const issueCount = issues.nodes.length;
    const completedIssueCount = issues.nodes.filter((issue) => issue.completedAt).length;
    return this.normalizeCycleStats(cycle, issueCount, completedIssueCount);
  }

  async getIssueTemplates(args: { limit?: number; includeArchived?: boolean; orderBy?: string }) {
    const organization = await this.client.organization;
    const templates = await organization.templates(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter: { type: { eq: 'issue' } },
      }),
    );

    return Promise.all(templates.nodes.map((template) => this.normalizeTemplate(template)));
  }

  async getIssueTemplateById(id: string) {
    const template = await this.client.template(id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }

    return this.normalizeTemplate(template);
  }

  async createIssueTemplate(args: {
    name: string;
    description?: string;
    teamId?: string;
    templateData: JsonObject;
    sortOrder?: number;
  }) {
    const payload = await this.client.createTemplate(this.compactObject({
      name: args.name,
      description: this.nonEmptyString(args.description),
      teamId: this.nonEmptyString(args.teamId),
      templateData: args.templateData,
      sortOrder: args.sortOrder,
      type: 'issue',
    }));
    if (!payload.success || !payload.template) {
      throw new Error('Failed to create issue template');
    }

    return this.normalizeTemplate(await payload.template);
  }

  async updateIssueTemplate(args: {
    id: string;
    name?: string;
    description?: string | null;
    teamId?: string | null;
    templateData?: JsonObject;
    sortOrder?: number;
  }) {
    const updateInput = this.compactObject({
      name: this.nonEmptyString(args.name),
      description: this.nullableNonEmptyString(args.description),
      teamId: this.nullableNonEmptyString(args.teamId),
      templateData: this.nonEmptyObject(args.templateData),
      sortOrder: args.sortOrder,
    });
    if (Object.keys(updateInput).length === 0) {
      throw new Error('At least one template field must be provided');
    }

    const payload = await this.client.updateTemplate(args.id, updateInput);
    if (!payload.success || !payload.template) {
      throw new Error(`Failed to update issue template ${args.id}`);
    }

    return this.normalizeTemplate(await payload.template);
  }

  async createIssueFromTemplate(args: {
    teamId: string;
    templateId: string;
    title?: string;
    description?: string;
    priority?: number;
    projectId?: string;
    projectMilestoneId?: string;
    cycleId?: string;
  }) {
    return this.createIssue({
      teamId: args.teamId,
      templateId: args.templateId,
      title: args.title ?? 'Template issue',
      description: args.description,
      priority: args.priority,
      projectId: args.projectId,
      projectMilestoneId: args.projectMilestoneId,
      cycleId: args.cycleId,
    });
  }

  async getTeamTemplates(args: { teamId: string; limit?: number; includeArchived?: boolean; orderBy?: string }) {
    const team = await this.client.team(args.teamId);
    if (!team) {
      throw new Error(`Team with ID ${args.teamId} not found`);
    }

    const templates = await team.templates(
      this.compactObject({
        first: args.limit ?? 25,
        includeArchived: args.includeArchived ?? false,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter: { type: { eq: 'issue' } },
      }),
    );

    return Promise.all(templates.nodes.map((template) => this.normalizeTemplate(template)));
  }

  async archiveTemplate(id: string) {
    const payload = await this.client.deleteTemplate(id);
    if (!payload.success) {
      throw new Error(`Failed to archive template ${id}`);
    }

    return { success: true, id: payload.entityId };
  }

  async getCycleIssues(args: CycleIssueQueryArgs) {
    try {
      const { cycleId, ...filterArgs } = args;
      const filter = this.compactObject({
        ...this.buildPMIssueFilter(filterArgs),
        cycle: { id: { eq: cycleId } },
      });

      const result = await this.requestGraphQL<{ issues: { nodes: any[] } }>(ISSUE_SUMMARIES_QUERY, {
        first: args.limit ?? 25,
        orderBy: this.normalizePaginationOrderBy(args.orderBy),
        filter,
      });

      return result.issues.nodes.map((issue) => this.normalizeIssueSummaryNode(issue));
    } catch (error) {
      console.error('Error getting cycle issues:', error);
      throw error;
    }
  }

  /**
   * Gets the currently active cycle for a team
   * @param teamId ID of the team
   * @returns Active cycle information with progress stats
   */
  async getActiveCycle(teamId: string) {
    try {
      // Get the team
      const team = await this.client.team(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }

      // Get the active cycle for the team
      const activeCycle = await team.activeCycle;
      if (!activeCycle) {
        throw new Error(`No active cycle found for team ${team.name}`);
      }

      // Get cycle issues for count and progress
      const cycleIssues = await this.client.issues({
        filter: {
          cycle: { id: { eq: activeCycle.id } },
        },
      });
      const issueNodes = await cycleIssues.nodes;

      // Calculate progress
      const totalIssues = issueNodes.length;
      const completedIssues = issueNodes.filter((issue) => issue.completedAt).length;
      const progress = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;

      return {
        id: activeCycle.id,
        number: activeCycle.number,
        name: activeCycle.name,
        description: activeCycle.description,
        startsAt: activeCycle.startsAt,
        endsAt: activeCycle.endsAt,
        team: {
          id: team.id,
          name: team.name,
          key: team.key,
        },
        progress: Math.round(progress * 100) / 100, // Round to 2 decimal places
        issueCount: totalIssues,
        completedIssueCount: completedIssues,
      };
    } catch (error) {
      console.error('Error getting active cycle:', error);
      throw error;
    }
  }

  /**
   * Adds an issue to a cycle
   * @param issueId ID or identifier of the issue
   * @param cycleId ID of the cycle
   * @returns Success status and updated issue information
   */
  async addIssueToCycle(issueId: string, cycleId: string) {
    try {
      // Get the issue
      const issueResult = await this.client.issue(issueId);
      if (!issueResult) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      // Get the cycle
      const cycleResult = await this.client.cycle(cycleId);
      if (!cycleResult) {
        throw new Error(`Cycle with ID ${cycleId} not found`);
      }

      // Update the issue with the cycle ID
      await this.client.updateIssue(issueResult.id, { cycleId: cycleId });

      // Get the updated issue data
      const updatedIssue = await this.client.issue(issueId);
      const cycleData = await this.client.cycle(cycleId);

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
          cycle: cycleData
            ? {
                id: cycleData.id,
                number: cycleData.number,
                name: cycleData.name,
              }
            : null,
        },
      };
    } catch (error) {
      console.error('Error adding issue to cycle:', error);
      throw error;
    }
  }

  /**
   * Removes an issue from a cycle
   * @param issueId ID or identifier of the issue
   * @param cycleId ID of the cycle
   * @returns Success status and updated issue information
   */
  async removeIssueFromCycle(issueId: string, cycleId: string) {
    try {
      const issue = await this.client.issue(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const currentCycle = issue.cycle ? await issue.cycle : null;
      if (!currentCycle || currentCycle.id !== cycleId) {
        throw new Error(`Issue ${issue.identifier} is not associated with cycle ${cycleId}`);
      }

      const cycle = await this.client.cycle(cycleId);
      if (!cycle) {
        throw new Error(`Cycle with ID ${cycleId} not found`);
      }

      await this.client.updateIssue(issue.id, { cycleId: null });

      const updatedIssue = await this.client.issue(issue.id);

      return {
        success: true,
        issue: {
          id: updatedIssue.id,
          identifier: updatedIssue.identifier,
          title: updatedIssue.title,
        },
        cycle: {
          id: cycle.id,
          number: cycle.number,
          name: cycle.name,
        },
      };
    } catch (error) {
      console.error('Error removing issue from cycle:', error);
      throw error;
    }
  }

  /**
   * Get workflow states for a team
   * @param teamId ID of the team to get workflow states for
   * @param includeArchived Whether to include archived states (default: false)
   * @returns Array of workflow states with their details
   */
  async getWorkflowStates(teamId: string, includeArchived = false) {
    try {
      // Use GraphQL to query workflow states for the team
      const response = await this.client.workflowStates({
        filter: {
          team: { id: { eq: teamId } },
        },
      });

      if (!response.nodes || response.nodes.length === 0) {
        return [];
      }

      // Filter out archived states if includeArchived is false
      let states = response.nodes;
      if (!includeArchived) {
        states = states.filter((state) => !state.archivedAt);
      }

      // Map the response to match our output schema
      return states.map((state) => ({
        id: state.id,
        name: state.name,
        type: state.type,
        position: state.position,
        color: state.color,
        description: state.description || '',
      }));
    } catch (error: unknown) {
      // Properly handle the unknown error type
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get workflow states: ${errorMessage}`);
    }
  }

  /**
   * Creates a project update
   * @param args Project update parameters
   * @returns Created project update details
   */
  async createProjectUpdate(args: {
    projectId: string;
    body: string;
    health?: 'onTrack' | 'atRisk' | 'offTrack';
  }) {
    try {
      // Get the project
      const project = await this.client.project(args.projectId);
      if (!project) {
        throw new Error(`Project with ID ${args.projectId} not found`);
      }

      // Create the project update
      const createPayload = await this.client.createProjectUpdate({
        projectId: args.projectId,
        body: args.body,
        health: args.health as any,
      });

      if (createPayload.success && createPayload.projectUpdate) {
        const updateData = await createPayload.projectUpdate;
        const userData = updateData.user ? await updateData.user : null;

        return {
          id: updateData.id,
          body: updateData.body,
          health: updateData.health,
          createdAt: updateData.createdAt,
          updatedAt: updateData.updatedAt,
          user: userData
            ? {
                id: userData.id,
                name: userData.name,
              }
            : null,
          project: {
            id: project.id,
            name: project.name,
          },
        };
      } else {
        throw new Error('Failed to create project update');
      }
    } catch (error) {
      console.error('Error creating project update:', error);
      throw error;
    }
  }

  /**
   * Updates an existing project update
   * @param args Update parameters
   * @returns Updated project update details
   */
  async updateProjectUpdate(args: {
    id: string;
    body?: string;
    health?: 'onTrack' | 'atRisk' | 'offTrack';
  }) {
    try {
      // Get the project update
      const projectUpdate = await this.client.projectUpdate(args.id);
      if (!projectUpdate) {
        throw new Error(`Project update with ID ${args.id} not found`);
      }

      // Get project info for the response
      const projectData = await projectUpdate.project;
      if (!projectData) {
        throw new Error(`Project not found for update with ID ${args.id}`);
      }

      // Update the project update
      const updatePayload = await this.client.updateProjectUpdate(args.id, {
        body: args.body,
        health: args.health as any,
      });

      if (updatePayload.success) {
        // Get the updated project update data
        const updatedProjectUpdate = await this.client.projectUpdate(args.id);
        const userData = updatedProjectUpdate.user ? await updatedProjectUpdate.user : null;

        // Return the updated project update info
        return {
          id: updatedProjectUpdate.id,
          body: updatedProjectUpdate.body,
          health: updatedProjectUpdate.health,
          createdAt: updatedProjectUpdate.createdAt,
          updatedAt: updatedProjectUpdate.updatedAt,
          user: userData
            ? {
                id: userData.id,
                name: userData.name,
              }
            : null,
          project: {
            id: projectData.id,
            name: projectData.name,
          },
        };
      } else {
        throw new Error('Failed to update project update');
      }
    } catch (error) {
      console.error('Error updating project update:', error);
      throw error;
    }
  }

  /**
   * Gets updates for a project
   * @param projectId ID of the project
   * @param limit Maximum number of updates to return
   * @returns List of project updates
   */
  async getProjectUpdates(projectId: string, limit = 25) {
    try {
      // Get the project
      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      // Get project updates
      const updates = await this.client.projectUpdates({
        first: limit,
        filter: {
          project: {
            id: { eq: projectId },
          },
        },
      });

      // Process and return the updates
      return Promise.all(
        updates.nodes.map(async (update) => {
          const userData = update.user ? await update.user : null;

          return {
            id: update.id,
            body: update.body,
            health: update.health,
            createdAt: update.createdAt,
            updatedAt: update.updatedAt,
            user: userData
              ? {
                  id: userData.id,
                  name: userData.name,
                }
              : null,
            project: {
              id: project.id,
              name: project.name,
            },
          };
        }),
      );
    } catch (error) {
      console.error('Error getting project updates:', error);
      throw error;
    }
  }

  /**
   * Archives a project
   * @param projectId ID of the project to archive
   * @returns Success status and archived project info
   */
  async archiveProject(projectId: string) {
    try {
      // Get the project
      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      // Archive the project
      const archivePayload = await project.archive();

      if (archivePayload.success) {
        // Get the archived project data
        const archivedProject = await this.client.project(projectId);

        return {
          success: true,
          project: {
            id: archivedProject.id,
            name: archivedProject.name,
            state: archivedProject.state,
            archivedAt: archivedProject.archivedAt,
          },
        };
      } else {
        throw new Error('Failed to archive project');
      }
    } catch (error) {
      console.error('Error archiving project:', error);
      throw error;
    }
  }

  async archiveMilestone(id: string) {
    const milestone = await this.client.projectMilestone(id);

    if (!milestone) {
      throw new Error(`Milestone with ID ${id} not found`);
    }

    const deletePayload = await this.client.deleteProjectMilestone(id);

    if (!deletePayload.success) {
      throw new Error(`Failed to archive milestone ${id}`);
    }

    return {
      success: true,
      milestone: {
        id: milestone.id,
        name: milestone.name,
      },
    };
  }

  /**
   * Get all initiatives
   * @returns List of all initiatives
   */
  async getInitiatives(args: { includeArchived?: boolean; limit?: number } = {}) {
    try {
      const initiatives = await this.client.initiatives({
        first: args.limit || 50,
        includeArchived: args.includeArchived || false,
      });
      return Promise.all(
        initiatives.nodes.map(async (initiative) => {
          // Fetch owner data if available
          const ownerData = initiative.owner ? await initiative.owner : null;

          return {
            id: initiative.id,
            name: initiative.name,
            description: initiative.description,
            content: initiative.content,
            icon: initiative.icon,
            color: initiative.color,
            status: initiative.status,
            targetDate: initiative.targetDate,
            sortOrder: initiative.sortOrder,
            owner: ownerData
              ? {
                  id: ownerData.id,
                  name: ownerData.name,
                  email: ownerData.email,
                }
              : null,
            url: initiative.url,
          };
        }),
      );
    } catch (error) {
      console.error('Error getting initiatives:', error);
      throw error;
    }
  }

  /**
   * Get a specific initiative by ID
   * @param id Initiative ID
   * @param includeProjects Whether to include associated projects
   * @returns Initiative details with optional projects
   */
  async getInitiativeById(id: string, includeProjects = true) {
    try {
      const initiative = await this.client.initiative(id);
      if (!initiative) {
        throw new Error(`Initiative with ID ${id} not found`);
      }

      // Fetch owner data if available
      const ownerData = initiative.owner ? await initiative.owner : null;

      // Fetch associated projects if requested
      let projectsData = undefined;
      if (includeProjects) {
        const projects = await initiative.projects();
        projectsData = await Promise.all(
          projects.nodes.map(async (project) => ({
            id: project.id,
            name: project.name,
            state: project.state,
          })),
        );
      }

      return {
        id: initiative.id,
        name: initiative.name,
        description: initiative.description,
        content: initiative.content,
        icon: initiative.icon,
        color: initiative.color,
        status: initiative.status,
        targetDate: initiative.targetDate,
        sortOrder: initiative.sortOrder,
        owner: ownerData
          ? {
              id: ownerData.id,
              name: ownerData.name,
              email: ownerData.email,
            }
          : null,
        ...(includeProjects && { projects: projectsData }),
        url: initiative.url,
      };
    } catch (error) {
      console.error('Error getting initiative by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new initiative
   * @param args Initiative creation arguments
   * @returns Created initiative details
   */
  async createInitiative(args: {
    name: string;
    description?: string;
    content?: string;
    icon?: string;
    color?: string;
    status?: string;
    targetDate?: string;
    ownerId?: string;
    sortOrder?: number;
  }) {
    try {
      const createPayload = await this.client.createInitiative({
        name: args.name,
        description: args.description,
        content: args.content,
        icon: args.icon,
        color: args.color,
        status: args.status as any,
        targetDate: args.targetDate,
        ownerId: args.ownerId,
        sortOrder: args.sortOrder,
      });

      if (createPayload.success && createPayload.initiative) {
        const initiative = await createPayload.initiative;
        return {
          id: initiative.id,
          name: initiative.name,
          description: initiative.description,
          status: initiative.status,
          url: initiative.url,
        };
      } else {
        throw new Error('Failed to create initiative');
      }
    } catch (error) {
      console.error('Error creating initiative:', error);
      throw error;
    }
  }

  /**
   * Update an existing initiative
   * @param initiativeId Initiative ID to update
   * @param updateData Update data
   * @returns Updated initiative details
   */
  async updateInitiative(
    initiativeId: string,
    updateData: {
      name?: string;
      description?: string;
      content?: string;
      icon?: string;
      color?: string;
      status?: string;
      targetDate?: string;
      ownerId?: string;
      sortOrder?: number;
    },
  ) {
    try {
      const updatePayload = await this.client.updateInitiative(initiativeId, {
        name: updateData.name,
        description: updateData.description,
        content: updateData.content,
        icon: updateData.icon,
        color: updateData.color,
        status: updateData.status as any,
        targetDate: updateData.targetDate,
        ownerId: updateData.ownerId,
        sortOrder: updateData.sortOrder,
      });

      if (updatePayload.success && updatePayload.initiative) {
        const initiative = await updatePayload.initiative;
        return {
          id: initiative.id,
          name: initiative.name,
          description: initiative.description,
          status: initiative.status,
          url: initiative.url,
        };
      } else {
        throw new Error('Failed to update initiative');
      }
    } catch (error) {
      console.error('Error updating initiative:', error);
      throw error;
    }
  }

  /**
   * Archive an initiative
   * @param id Initiative ID to archive
   * @returns Success status and archived initiative info
   */
  async archiveInitiative(id: string) {
    try {
      const archivePayload = await this.client.archiveInitiative(id);

      if (archivePayload.success) {
        const entity = archivePayload.entity ? await archivePayload.entity : null;
        return {
          success: true,
          entity: entity
            ? {
                id: entity.id,
                name: entity.name,
              }
            : null,
        };
      } else {
        throw new Error('Failed to archive initiative');
      }
    } catch (error) {
      console.error('Error archiving initiative:', error);
      throw error;
    }
  }

  /**
   * Unarchive an initiative
   * @param id Initiative ID to unarchive
   * @returns Success status and unarchived initiative info
   */
  async unarchiveInitiative(id: string) {
    try {
      const unarchivePayload = await this.client.unarchiveInitiative(id);

      if (unarchivePayload.success) {
        const entity = unarchivePayload.entity ? await unarchivePayload.entity : null;
        return {
          success: true,
          entity: entity
            ? {
                id: entity.id,
                name: entity.name,
              }
            : null,
        };
      } else {
        throw new Error('Failed to unarchive initiative');
      }
    } catch (error) {
      console.error('Error unarchiving initiative:', error);
      throw error;
    }
  }

  /**
   * Delete (trash) an initiative
   * @param id Initiative ID to delete
   * @returns Success status
   */
  async deleteInitiative(id: string) {
    try {
      const deletePayload = await this.client.deleteInitiative(id);

      return {
        success: deletePayload.success,
      };
    } catch (error) {
      console.error('Error deleting initiative:', error);
      throw error;
    }
  }

  /**
   * Get all projects associated with an initiative
   * @param initiativeId Initiative ID
   * @param includeArchived Whether to include archived projects
   * @returns List of projects in the initiative
   */
  async getInitiativeProjects(initiativeId: string, includeArchived = false) {
    try {
      const initiative = await this.client.initiative(initiativeId);
      if (!initiative) {
        throw new Error(`Initiative with ID ${initiativeId} not found`);
      }

      const projects = await initiative.projects({
        first: 50,
        includeArchived: includeArchived,
      });
      return Promise.all(
        projects.nodes.map(async (project) => {
          // Fetch teams data
          const teams = await project.teams();
          const teamsData = teams.nodes.map((team) => ({
            id: team.id,
            name: team.name,
          }));

          return {
            id: project.id,
            name: project.name,
            description: project.description,
            state: project.state,
            progress: project.progress,
            startDate: project.startDate,
            targetDate: project.targetDate,
            teams: teamsData,
            url: project.url,
          };
        }),
      );
    } catch (error) {
      console.error('Error getting initiative projects:', error);
      throw error;
    }
  }

  /**
   * Add a project to an initiative
   * @param initiativeId Initiative ID
   * @param projectId Project ID
   * @param sortOrder Sort order within the initiative
   * @returns Success status and project details
   */
  async addProjectToInitiative(initiativeId: string, projectId: string, sortOrder?: number) {
    try {
      // First, get the project to update it
      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      // Get the initiative to verify it exists
      const initiative = await this.client.initiative(initiativeId);
      if (!initiative) {
        throw new Error(`Initiative with ID ${initiativeId} not found`);
      }

      // Create an InitiativeToProject relation
      const createPayload = await this.client.createInitiativeToProject({
        projectId: projectId,
        initiativeId: initiativeId,
        sortOrder: sortOrder,
      });

      if (createPayload.success) {
        return {
          success: true,
          project: {
            id: project.id,
            name: project.name,
            initiative: {
              id: initiative.id,
              name: initiative.name,
            },
          },
        };
      } else {
        throw new Error('Failed to add project to initiative');
      }
    } catch (error) {
      console.error('Error adding project to initiative:', error);
      throw error;
    }
  }

  /**
   * Remove a project from an initiative
   * @param initiativeId Initiative ID
   * @param projectId Project ID
   * @returns Success status and project details
   */
  async removeProjectFromInitiative(initiativeId: string, projectId: string) {
    try {
      // Get the project
      const project = await this.client.project(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      // Get the initiative to verify it exists
      const initiative = await this.client.initiative(initiativeId);
      if (!initiative) {
        throw new Error(`Initiative with ID ${initiativeId} not found`);
      }

      // First, verify the project belongs to this initiative
      const projectInitiatives = await project.initiatives();
      const belongsToInitiative = projectInitiatives.nodes.some((init) => init.id === initiativeId);
      
      if (!belongsToInitiative) {
        throw new Error(`Project ${projectId} is not associated with initiative ${initiativeId}`);
      }

      // Query for InitiativeToProject relationships
      // Note: The API doesn't support filtering by initiative/project, so we need to search through all
      let targetRelationId: string | null = null;
      let hasMore = true;
      let cursor: string | undefined = undefined;
      
      // Paginate through all InitiativeToProject relationships to find the one we need
      while (hasMore && !targetRelationId) {
        const initiativeToProjects = await this.client.initiativeToProjects({
          first: 100,
          after: cursor,
          includeArchived: false,
        });

        // Search through this page of results
        for (const relation of initiativeToProjects.nodes) {
          const relInitiative = await relation.initiative;
          const relProject = await relation.project;
          if (relInitiative?.id === initiativeId && relProject?.id === projectId) {
            targetRelationId = relation.id;
            break;
          }
        }

        // Check if there are more pages
        hasMore = initiativeToProjects.pageInfo.hasNextPage;
        cursor = initiativeToProjects.pageInfo.endCursor || undefined;
      }

      if (!targetRelationId) {
        // This shouldn't happen if belongsToInitiative is true, but let's be defensive
        throw new Error(`Could not find InitiativeToProject relationship between initiative ${initiativeId} and project ${projectId}`);
      }

      // Delete the InitiativeToProject relationship
      const deletePayload = await this.client.deleteInitiativeToProject(targetRelationId);

      if (deletePayload.success) {
        return {
          success: true,
          project: {
            id: project.id,
            name: project.name,
          },
          initiative: {
            id: initiative.id,
            name: initiative.name,
          },
        };
      } else {
        throw new Error('Failed to remove project from initiative');
      }
    } catch (error) {
      console.error('Error removing project from initiative:', error);
      throw error;
    }
  }
}
