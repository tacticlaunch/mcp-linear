import {
  isArchiveRoadmapArgs,
  isCreateRoadmapArgs,
  isGetRoadmapByIdArgs,
  isGetRoadmapsArgs,
  isUpdateRoadmapArgs,
} from '../tools/type-guards.js';

describe('roadmap type guards', () => {
  it('accepts valid roadmap list arguments', () => {
    expect(
      isGetRoadmapsArgs({
        limit: 25,
        includeArchived: true,
        orderBy: 'createdAt',
      }),
    ).toBe(true);
  });

  it('rejects invalid roadmap list arguments', () => {
    expect(isGetRoadmapsArgs([])).toBe(false);
    expect(isGetRoadmapsArgs({ limit: 0 })).toBe(false);
    expect(isGetRoadmapsArgs({ orderBy: 'name' })).toBe(false);
  });

  it('validates roadmap CRUD argument shapes', () => {
    expect(isGetRoadmapByIdArgs({ id: 'roadmap-1' })).toBe(true);
    expect(isCreateRoadmapArgs({ name: 'Platform Roadmap', sortOrder: 1 })).toBe(true);
    expect(isUpdateRoadmapArgs({ id: 'roadmap-1', description: 'Updated' })).toBe(true);
    expect(isArchiveRoadmapArgs({ roadmapId: 'roadmap-1' })).toBe(true);

    expect(isGetRoadmapByIdArgs({})).toBe(false);
    expect(isCreateRoadmapArgs({ description: 'Missing name' })).toBe(false);
    expect(isUpdateRoadmapArgs({ id: 'roadmap-1' })).toBe(false);
    expect(isArchiveRoadmapArgs({ id: 'roadmap-1' })).toBe(false);
  });
});
