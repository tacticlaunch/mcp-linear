import { LinearService } from '../services/linear-service.js';

type IssueLike = { id: string; identifier: string };

function buildPayload(opts: {
  relationId: string;
  type: string;
  source: IssueLike;
  target: IssueLike;
  success?: boolean;
}) {
  return {
    success: opts.success ?? true,
    issueRelation: Promise.resolve({
      id: opts.relationId,
      type: opts.type,
      issue: Promise.resolve(opts.source),
      relatedIssue: Promise.resolve(opts.target),
    }),
  };
}

function makeClient(opts: {
  issuesById: Record<string, IssueLike>;
  capture?: (input: Record<string, unknown>) => void;
  payload: ReturnType<typeof buildPayload>;
}) {
  return {
    issue: jest.fn(async (id: string) => opts.issuesById[id] ?? null),
    createIssueRelation: jest.fn(async (input: Record<string, unknown>) => {
      opts.capture?.(input);
      return opts.payload;
    }),
  } as unknown as ConstructorParameters<typeof LinearService>[0];
}

describe('LinearService.createIssueRelation', () => {
  const sourceIssue: IssueLike = { id: 'issue-A', identifier: 'COCO-34' };
  const targetIssue: IssueLike = { id: 'issue-B', identifier: 'COCO-33' };

  it('returns a flat relation with the real id and identifiers for "blocks"', async () => {
    let captured: Record<string, unknown> | undefined;
    const service = new LinearService(
      makeClient({
        issuesById: { 'issue-A': sourceIssue, 'issue-B': targetIssue },
        capture: (input) => (captured = input),
        payload: buildPayload({
          relationId: 'rel-123',
          type: 'blocks',
          source: sourceIssue,
          target: targetIssue,
        }),
      }),
    );

    const result = await service.createIssueRelation('issue-A', 'issue-B', 'blocks');

    expect(captured).toEqual({ issueId: 'issue-A', relatedIssueId: 'issue-B', type: 'blocks' });
    expect(result).toEqual({
      success: true,
      relation: {
        id: 'rel-123',
        type: 'blocks',
        issueIdentifier: 'COCO-34',
        relatedIssueIdentifier: 'COCO-33',
      },
    });
    // Regression: must not return the legacy placeholder.
    expect(result.relation?.id).not.toBe('relation-id-would-go-here');
  });

  it('maps "blocked_by" to "blocks" with swapped issues', async () => {
    let captured: Record<string, unknown> | undefined;
    const service = new LinearService(
      makeClient({
        issuesById: { 'issue-A': sourceIssue, 'issue-B': targetIssue },
        capture: (input) => (captured = input),
        payload: buildPayload({
          relationId: 'rel-456',
          type: 'blocks',
          source: targetIssue,
          target: sourceIssue,
        }),
      }),
    );

    const result = await service.createIssueRelation('issue-A', 'issue-B', 'blocked_by');

    expect(captured).toEqual({ issueId: 'issue-B', relatedIssueId: 'issue-A', type: 'blocks' });
    expect(result.relation?.issueIdentifier).toBe('COCO-33');
    expect(result.relation?.relatedIssueIdentifier).toBe('COCO-34');
  });

  it('maps "duplicate_of" to "duplicate" with swapped issues', async () => {
    let captured: Record<string, unknown> | undefined;
    const service = new LinearService(
      makeClient({
        issuesById: { 'issue-A': sourceIssue, 'issue-B': targetIssue },
        capture: (input) => (captured = input),
        payload: buildPayload({
          relationId: 'rel-789',
          type: 'duplicate',
          source: targetIssue,
          target: sourceIssue,
        }),
      }),
    );

    await service.createIssueRelation('issue-A', 'issue-B', 'duplicate_of');

    expect(captured).toEqual({ issueId: 'issue-B', relatedIssueId: 'issue-A', type: 'duplicate' });
  });

  it('rejects unknown relation types', async () => {
    const service = new LinearService(
      makeClient({
        issuesById: { 'issue-A': sourceIssue, 'issue-B': targetIssue },
        payload: buildPayload({
          relationId: 'rel-x',
          type: 'blocks',
          source: sourceIssue,
          target: targetIssue,
        }),
      }),
    );

    await expect(
      service.createIssueRelation('issue-A', 'issue-B', 'cousin_of'),
    ).rejects.toThrow('cousin_of is not a valid relation type');
  });

  it('falls back to the looked-up identifiers when the SDK cannot resolve the related issues', async () => {
    const service = new LinearService(
      makeClient({
        issuesById: { 'issue-A': sourceIssue, 'issue-B': targetIssue },
        payload: {
          success: true,
          issueRelation: Promise.resolve({
            id: 'rel-fallback',
            type: 'related',
            issue: undefined,
            relatedIssue: undefined,
          }),
        } as unknown as ReturnType<typeof buildPayload>,
      }),
    );

    const result = await service.createIssueRelation('issue-A', 'issue-B', 'related');

    expect(result.relation).toEqual({
      id: 'rel-fallback',
      type: 'related',
      issueIdentifier: 'COCO-34',
      relatedIssueIdentifier: 'COCO-33',
    });
  });
});
