import type { CatalogItem, Category, CategoryKind, FlavourTag, Occasion } from "@/types/catalog";
import { CONFIG } from "@/lib/config";
import { CATEGORIES } from "@/data/categories";
import { CATALOG } from "@/data/items";
import { FLAVOUR_TAGS, OCCASIONS } from "@/data/taxonomy";

// The catalogue's content lives in src/data (categories, items, taxonomy);
// this module answers questions about it. Every screen
// reads through these functions, so swapping in real data is a data
// change, not a code one.

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

export function getCategory(id: number): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getItemById(id: number): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}

export function getItemBySlug(slug: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.slug === slug);
}

/** Every other item in the same category — for the "OTHER FLAVOURS IN
 * [category]" strip on an item's detail page, since flavour is no
 * longer a picker on that same page (Sep 2026 recategorisation). */
export function getSiblingItems(item: CatalogItem): CatalogItem[] {
  return CATALOG.filter((c) => c.categoryId === item.categoryId && c.id !== item.id);
}

export function getOccasions(): Occasion[] {
  return OCCASIONS;
}

export function getOccasion(id: number): Occasion | undefined {
  return OCCASIONS.find((o) => o.id === id);
}

export function getOccasionBySlug(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function getFlavourTags(): FlavourTag[] {
  return FLAVOUR_TAGS;
}

export function getFlavourTag(id: number): FlavourTag | undefined {
  return FLAVOUR_TAGS.find((t) => t.id === id);
}

export function getFlavourTagBySlug(slug: string): FlavourTag | undefined {
  return FLAVOUR_TAGS.find((t) => t.slug === slug);
}

/** Home's "Most ordered" items, in display order. */
export function getMostOrdered(): CatalogItem[] {
  return CATALOG.filter((item) => item.mostOrderedRank !== undefined).sort(
    (a, b) => (a.mostOrderedRank ?? 0) - (b.mostOrderedRank ?? 0),
  );
}

/** The first photo among a category's items — a tile image for that
 * category without keeping a second photo field in sync. */
export function getCategoryImage(categoryId: number): string | undefined {
  return CATALOG.find((item) => item.categoryId === categoryId && item.imageUrl)?.imageUrl;
}

/** Same idea for a flavour tag: the first tagged item that has a photo. */
export function getFlavourTagImage(tagId: number): string | undefined {
  return CATALOG.find((item) => item.flavours?.includes(tagId) && item.imageUrl)?.imageUrl;
}

/** Anything carrying a lead time — an item, or just `{ leadTimeHours }`. */
type LeadTime = Pick<CatalogItem, "leadTimeHours">;

/** "1 hour" / "24 hours". */
function hoursText(hours: number): string {
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/** Hours until an item can be ready: CONFIG.sameDayPrepHours for a
 * same-day item, otherwise its leadTimeHours. */
export function readyHours(item: LeadTime): number {
  return item.leadTimeHours === 0 ? CONFIG.sameDayPrepHours : item.leadTimeHours;
}

/** "Ready in 1 hour" for a same-day item, "24 hours notice" otherwise. */
export function readyLabel(item: LeadTime): string {
  return item.leadTimeHours === 0 ? `Ready in ${hoursText(readyHours(item))}` : `${hoursText(item.leadTimeHours)} notice`;
}

/** "1 HOUR" / "24 HOURS" — the short badge form of readyLabel. */
export function readyBadge(item: LeadTime): string {
  return hoursText(readyHours(item)).toUpperCase();
}

/** A short tile/chip label for a category — "Exotic Premium" rather than
 * "Exotic Premium Cakes", "Indian" rather than "Flavourful Indian Cakes". */
export function categoryShortLabel(category: Category): string {
  return category.label.replace(/^Flavourful /, "").replace(/ Cakes$/, "");
}
