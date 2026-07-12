import { allToolDefinitions } from '../tools/definitions/index.js';
import { buildStructuredContent, convertToolDefinition } from '../tool-schema.js';
import { MCPToolDefinition } from '../types.js';

function getDefinition(name: string): MCPToolDefinition {
  const definition = allToolDefinitions.find((toolDefinition) => toolDefinition.name === name);
  if (!definition) {
    throw new Error(`Expected tool definition ${name} to be registered.`);
  }
  return definition;
}

describe('tool annotations', () => {
  it('declares explicit annotations on every tool definition', () => {
    expect(allToolDefinitions.length).toBeGreaterThanOrEqual(185);

    for (const toolDefinition of allToolDefinitions) {
      const annotations = toolDefinition.annotations;
      expect(annotations).toBeDefined();
      expect(typeof annotations.readOnlyHint).toBe('boolean');
      expect(typeof annotations.destructiveHint).toBe('boolean');
      expect(typeof annotations.idempotentHint).toBe('boolean');
      expect(typeof annotations.openWorldHint).toBe('boolean');
    }
  });

  it('keeps annotation combinations coherent', () => {
    for (const toolDefinition of allToolDefinitions) {
      const { readOnlyHint, destructiveHint, idempotentHint } = toolDefinition.annotations;

      // A read-only tool can never be destructive and is always idempotent.
      if (readOnlyHint) {
        expect(destructiveHint).toBe(false);
        expect(idempotentHint).toBe(true);
      }
    }
  });

  it('classifies reads, searches, and local generators as read-only and idempotent', () => {
    const readOnlyNames = allToolDefinitions
      .map((toolDefinition) => toolDefinition.name)
      .filter((name) => /^linear_(get|search)/.test(name));

    expect(readOnlyNames).toContain('linear_getIssues');

    for (const name of readOnlyNames) {
      expect({ name, annotations: getDefinition(name).annotations }).toEqual({
        name,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      });
    }
  });

  it('classifies deletes, archives, and logouts as destructive but idempotent', () => {
    const destructiveNames = allToolDefinitions
      .map((toolDefinition) => toolDefinition.name)
      .filter((name) => /^linear_(delete|archive|logout)/.test(name));

    expect(destructiveNames).toContain('linear_deleteWebhook');
    expect(destructiveNames).toContain('linear_archiveIssue');
    expect(destructiveNames).toContain('linear_logoutAllSessions');

    for (const name of destructiveNames) {
      expect({ name, annotations: getDefinition(name).annotations }).toEqual({
        name,
        annotations: {
          readOnlyHint: false,
          destructiveHint: true,
          idempotentHint: true,
          openWorldHint: false,
        },
      });
    }
  });

  it('classifies creators as additive and non-idempotent', () => {
    const creatorNames = allToolDefinitions
      .map((toolDefinition) => toolDefinition.name)
      .filter((name) => /^linear_create/.test(name));
    creatorNames.push('linear_duplicateIssue', 'linear_addAttachment');

    expect(creatorNames).toContain('linear_createIssue');

    for (const name of creatorNames) {
      expect({ name, annotations: getDefinition(name).annotations }).toEqual({
        name,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: false,
        },
      });
    }
  });

  it('classifies absolute setters and reversible membership changes as idempotent mutations', () => {
    for (const name of [
      'linear_updateIssue',
      'linear_assignIssue',
      'linear_setIssuePriority',
      'linear_markNotificationAsRead',
      'linear_addToFavorites',
      'linear_addIssueLabel',
      'linear_removeIssueLabel',
      'linear_unarchiveDocument',
      'linear_subscribeToIssue',
    ]) {
      expect({ name, annotations: getDefinition(name).annotations }).toEqual({
        name,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      });
    }
  });

  it('declares every tool as closed-world', () => {
    const openWorldNames = allToolDefinitions
      .filter((toolDefinition) => toolDefinition.annotations.openWorldHint)
      .map((toolDefinition) => toolDefinition.name);

    expect(openWorldNames).toEqual([]);
  });
});

describe('convertToolDefinition wire format', () => {
  it('emits annotations for every tool', () => {
    for (const toolDefinition of allToolDefinitions) {
      const converted = convertToolDefinition(toolDefinition);
      expect(converted.annotations).toEqual(toolDefinition.annotations);
    }
  });

  it('emits a top-level object outputSchema for every tool', () => {
    for (const toolDefinition of allToolDefinitions) {
      const converted = convertToolDefinition(toolDefinition);
      expect(converted.outputSchema).toBeDefined();
      expect(converted.outputSchema?.type).toBe('object');
    }
  });

  it('passes object output schemas through unchanged', () => {
    const toolDefinition = getDefinition('linear_getRateLimitStatus');
    const converted = convertToolDefinition(toolDefinition);

    expect(converted.outputSchema).toEqual({
      type: 'object',
      properties: toolDefinition.output_schema.properties,
    });
  });

  it('wraps array output schemas in a required items envelope', () => {
    const toolDefinition = getDefinition('linear_getIssues');
    expect(toolDefinition.output_schema.type).toBe('array');

    const converted = convertToolDefinition(toolDefinition);

    expect(converted.outputSchema).toEqual({
      type: 'object',
      properties: {
        items: toolDefinition.output_schema,
      },
      required: ['items'],
    });
  });
});

describe('buildStructuredContent', () => {
  it('returns object results as-is for object output schemas', () => {
    const toolDefinition = getDefinition('linear_getRateLimitStatus');
    const result = { blockedUntil: 0, isBlocked: false };

    expect(buildStructuredContent(toolDefinition, result)).toEqual(result);
  });

  it('wraps array results in an items envelope for array output schemas', () => {
    const toolDefinition = getDefinition('linear_getIssues');
    const result = [{ id: 'issue-1' }, { id: 'issue-2' }];

    expect(buildStructuredContent(toolDefinition, result)).toEqual({ items: result });
  });

  it('returns undefined when the result does not match the advertised shape', () => {
    expect(buildStructuredContent(getDefinition('linear_getIssues'), { id: 'x' })).toBeUndefined();
    expect(
      buildStructuredContent(getDefinition('linear_getRateLimitStatus'), null),
    ).toBeUndefined();
    expect(buildStructuredContent(getDefinition('linear_getRateLimitStatus'), [1])).toBeUndefined();
  });
});
