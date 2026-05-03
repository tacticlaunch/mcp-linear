import {
  isAddToFavoritesArgs,
  isGetFavoriteViewsArgs,
  isGetSavedViewsArgs,
  isRemoveFromFavoritesArgs,
  isUpdateSavedViewArgs,
} from '../tools/type-guards.js';

describe('saved view type guards', () => {
  it('accepts valid saved view list args', () => {
    expect(
      isGetSavedViewsArgs({
        limit: 10,
        includeArchived: true,
        orderBy: 'createdAt',
      }),
    ).toBe(true);
  });

  it('rejects invalid pagination args for saved view tools', () => {
    expect(isGetSavedViewsArgs([])).toBe(false);
    expect(isGetSavedViewsArgs({ limit: 0 })).toBe(false);
    expect(isGetSavedViewsArgs({ limit: 1.5 })).toBe(false);
    expect(isGetSavedViewsArgs({ orderBy: 'name' })).toBe(false);

    expect(isGetFavoriteViewsArgs([])).toBe(false);
    expect(isGetFavoriteViewsArgs({ limit: -1 })).toBe(false);
    expect(isGetFavoriteViewsArgs({ orderBy: 'name' })).toBe(false);
  });

  it('requires at least one mutable field for saved view updates', () => {
    expect(isUpdateSavedViewArgs({ id: 'view-1' })).toBe(false);
    expect(
      isUpdateSavedViewArgs({
        id: 'view-1',
        description: null,
      }),
    ).toBe(true);
  });

  it('validates favorite mutation arguments', () => {
    expect(isAddToFavoritesArgs({ entityId: 'view-1' })).toBe(true);
    expect(isAddToFavoritesArgs({})).toBe(false);
    expect(isAddToFavoritesArgs({ entityId: 1 })).toBe(false);

    expect(isRemoveFromFavoritesArgs({ favoriteId: 'favorite-1' })).toBe(true);
    expect(isRemoveFromFavoritesArgs({ entityId: 'view-1' })).toBe(true);
    expect(isRemoveFromFavoritesArgs({ favoriteId: 'favorite-1', entityId: 'view-1' })).toBe(true);
    expect(isRemoveFromFavoritesArgs({})).toBe(false);
    expect(isRemoveFromFavoritesArgs({ favoriteId: 1 })).toBe(false);
  });
});
