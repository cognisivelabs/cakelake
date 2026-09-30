import type { Catalog, CatalogItem, Category, CategoryKind, FlavourTag, Occasion } from "@/types/catalog";
import { CONFIG } from "@/lib/config";

// Lookups and labels over a Catalog loaded from the internal API (src/api).

export function findCategory(catalog: Catalog, id: number): Category | undefined {
  return catalog.categories.find((c) => c.id === id);
}

export function findCategoryBySlug(catalog: Catalog, slug: string): Category | undefined {
  return catalog.categories.find((c) => c.slug === slug);
}

/** The categories sold a given way (see Category.kind), in menu order. */
export function categoriesByKind(catalog: Catalog, kind: CategoryKind): Category[] {
  return catalog.categories.filter((c) => c.kind === kind);
}

/** Every other item in the same category — for the "OTHER FLAVOURS IN
 * [category]" strip on an item's detail page. */
export function siblingItems(catalog: Catalog, item: CatalogItem): CatalogItem[] {
  return catalog.items.filter((c) => c.categoryId === item.categoryId && c.id !== item.id);
}

export function findOccasion(catalog: Catalog, id: number): Occasion | undefined {
  return catalog.occasions.find((o) => o.id === id);
}

export function findOccasionBySlug(catalog: Catalog, slug: string): Occasion | undefined {
  return catalog.occasions.find((o) => o.slug === slug);
}

export function findFlavourTag(catalog: Catalog, id: number): FlavourTag | undefined {
  return catalog.flavourTags.find((t) => t.id === id);
}

export function findFlavourTagBySlug(catalog: Catalog, slug: string): FlavourTag | undefined {
  return catalog.flavourTags.find((t) => t.slug === slug);
}

/** Home's "Most ordered" items, in display order. */
export function mostOrderedItems(catalog: Catalog): CatalogItem[] {
  return catalog.items
    .filter((item) => item.mostOrderedRank !== undefined)
    .sort((a, b) => (a.mostOrderedRank ?? 0) - (b.mostOrderedRank ?? 0));
}

/** The first photo among a category's items — a tile image for that
 * category. */
export function categoryImage(catalog: Catalog, categoryId: number): string | undefined {
  return catalog.items.find((item) => item.categoryId === categoryId && item.imageUrl)?.imageUrl;
}

/** The first photo among a flavour tag's items. */
export function flavourTagImage(catalog: Catalog, tagId: number): string | undefined {
  return catalog.items.find((item) => item.flavours?.includes(tagId) && item.imageUrl)?.imageUrl;
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
