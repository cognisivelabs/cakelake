import type { CatalogItem, Category, CategoryKind, FlavourTag, Occasion } from "@/types/catalog";
import { CATEGORIES } from "@/data/categories";
import { BASE_CATALOG } from "@/data/items";
import { CATEGORY_OCCASIONS, FLAVOUR_ITEMS, FLAVOUR_TAGS, MOST_ORDERED, OCCASIONS } from "@/data/taxonomy";

// The catalogue's content lives in src/data (categories, items, taxonomy);
// this module joins it up and answers questions about it. Every screen
// reads through these functions, so swapping in real data is a data
// change, not a code one.

/** Each item plus what the taxonomy says about it: its occasions, the
 * flavour tags it belongs to and its place in "Most ordered". */
const CATALOG: CatalogItem[] = BASE_CATALOG.map((item) => {
  const flavours = FLAVOUR_TAGS.filter((tag) => FLAVOUR_ITEMS[tag.id]?.includes(item.id)).map(
    (tag) => tag.id,
  );
  const rank = MOST_ORDERED.indexOf(item.id);
  return {
    ...item,
    occasions: CATEGORY_OCCASIONS[item.categoryId] ?? [],
    ...(flavours.length > 0 ? { flavours } : {}),
    ...(rank >= 0 ? { mostOrderedRank: rank + 1 } : {}),
  };
});

export function getCatalog(): CatalogItem[] {
  return CATALOG;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

/** The categories sold a given way (see Category.kind), in menu order. */
export function getCategoriesByKind(kind: CategoryKind): Category[] {
  return CATEGORIES.filter((c) => c.kind === kind);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}

/** Every other item in the same category — for the "OTHER FLAVOURS IN
 * [category]" strip on an item's detail page, since flavour is no
 * longer a picker on that same page (Sep 2026 recategorisation). */
export function getSiblingItems(item: CatalogItem): CatalogItem[] {
  return CATALOG.filter((c) => c.categoryId === item.categoryId && c.id !== item.id);
}

// Weight tier ids are our own naming convention, assigned above
// ("half-kg", "1kg", "2kg", "3kg-plus", …) — parsed here once for the
// Menu — desktop "1kg or larger" filter rather than adding a parallel
// numeric field to every tier for a single filter's sake.
export function weightTierKg(tier: { id: string }): number {
  if (tier.id.startsWith("half")) return 0.5;
  const match = tier.id.match(/^(\d+(?:\.\d+)?)kg/);
  return match ? Number(match[1]) : 0;
}

export function getOccasions(): Occasion[] {
  return OCCASIONS;
}

export function getOccasion(id: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.id === id);
}

export function getFlavourTags(): FlavourTag[] {
  return FLAVOUR_TAGS;
}

export function getFlavourTag(id: string): FlavourTag | undefined {
  return FLAVOUR_TAGS.find((t) => t.id === id);
}

/** Home's "Most ordered" items, in display order. */
export function getMostOrdered(): CatalogItem[] {
  return CATALOG.filter((item) => item.mostOrderedRank !== undefined).sort(
    (a, b) => (a.mostOrderedRank ?? 0) - (b.mostOrderedRank ?? 0),
  );
}

/** The first photo among a category's items — a tile image for that
 * category without keeping a second photo field in sync. */
export function getCategoryImage(categoryId: string): string | undefined {
  return CATALOG.find((item) => item.categoryId === categoryId && item.imageUrl)?.imageUrl;
}

/** Same idea for a flavour tag: the first tagged item that has a photo. */
export function getFlavourTagImage(tagId: string): string | undefined {
  return CATALOG.find((item) => item.flavours?.includes(tagId) && item.imageUrl)?.imageUrl;
}

/** A short tile/chip label for a category — "Exotic Premium" rather than
 * "Exotic Premium Cakes", "Indian" rather than "Flavourful Indian Cakes". */
export function categoryShortLabel(category: Category): string {
  return category.label.replace(/^Flavourful /, "").replace(/ Cakes$/, "");
}
