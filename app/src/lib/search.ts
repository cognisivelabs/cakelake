import type { Catalog, CatalogItem } from "@/types/catalog";
import { findCategory, findFlavourTag, findOccasion } from "@/lib/catalog";
import { cheapestPrice } from "@/lib/pricing";

/**
 * Whether a menu search query matches an item. Matches the item's name,
 * its category's name (so "cheesecake" finds the cheesecake flavours,
 * whose own names are just "Oreo", "New York"…) and any flavour tag it
 * belongs to (so "indian sweets" finds every mithai cake).
 */
function itemMatchesQuery(catalog: Catalog, item: CatalogItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    item.name,
    findCategory(catalog, item.categoryId)?.label ?? "",
    ...(item.flavours ?? []).map((id) => findFlavourTag(catalog, id)?.label ?? ""),
  ];
  return haystacks.some((text) => text.toLowerCase().includes(q));
}

/** A price range for the menu's Price slider, in AED — judged by an
 * item's starting price (its cheapest fixed-price size). */
export type PriceRange = { min: number; max: number };

/** How finely the price slider moves. */
export const PRICE_STEP = 5;

/** The slider's ends: the cheapest and dearest starting prices, rounded
 * out to the step. */
export function getPriceBounds(items: CatalogItem[]): PriceRange {
  const prices = items.flatMap((item) => cheapestPrice([item]) ?? []);
  return {
    min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP,
  };
}

/** A chosen range kept inside the bounds and in order — or null when it
 * covers the whole slider, which means "no price filter". */
export function normalizePriceRange(range: PriceRange, bounds: PriceRange): PriceRange | null {
  const clamp = (v: number) => Math.min(bounds.max, Math.max(bounds.min, v));
  const min = clamp(Math.min(range.min, range.max));
  const max = clamp(Math.max(range.min, range.max));
  return min <= bounds.min && max >= bounds.max ? null : { min, max };
}

/** The URL form of a range: "60-120". */
export function formatPriceRange(range: PriceRange): string {
  return `${range.min}-${range.max}`;
}

/** Reads a URL range back; anything malformed means no filter. */
export function parsePriceRange(text: string, bounds: PriceRange): PriceRange | null {
  const match = /^(\d+)-(\d+)$/.exec(text);
  return match ? normalizePriceRange({ min: Number(match[1]), max: Number(match[2]) }, bounds) : null;
}

/** "AED 60 – 120", for a chip or a label. */
function describePriceRange(range: PriceRange): string {
  return `AED ${range.min} – ${range.max}`;
}

/** The menu's filter selections — an empty query, or a null range or
 * id, means "no filter". */
export type MenuFilters = {
  /** Categories ticked on desktop — none (or omitted) means every category. */
  categoryIds?: number[];
  query: string;
  /** Starting-price range from the slider. */
  priceRange: PriceRange | null;
  flavourId: number | null;
  occasionId: number | null;
};

/** Whether an item passes every active menu filter (search text plus
 * category, price range, flavour tag and occasion). */
export function itemMatchesFilters(catalog: Catalog, item: CatalogItem, filters: MenuFilters): boolean {
  if (!itemMatchesQuery(catalog, item, filters.query)) return false;
  if (filters.categoryIds?.length && !filters.categoryIds.includes(item.categoryId)) return false;
  if (filters.flavourId !== null && !item.flavours?.includes(filters.flavourId)) return false;
  if (filters.occasionId !== null && !item.occasions?.includes(filters.occasionId)) return false;
  if (filters.priceRange) {
    const price = cheapestPrice([item]);
    if (price === undefined || price < filters.priceRange.min || price > filters.priceRange.max) return false;
  }
  return true;
}

export type FilterKey = "priceRange" | "flavourId" | "occasionId";

/** A group of checkboxes in the filter panel, with how many cakes each
 * choice would leave (given every *other* filter already set). */
type CheckboxGroup = {
  kind: "checkbox";
  /** A single-choice filter (FilterKey) or the multi-choice category list. */
  key: Exclude<FilterKey, "priceRange"> | typeof CATEGORY_GROUP_KEY;
  label: string;
  selected: number[];
  options: { id: number; label: string; count: number }[];
};

/** The price slider: its ends, the chosen range (the ends when unfiltered)
 * and how many cakes the whole current selection leaves. */
export type RangeGroup = {
  kind: "range";
  key: "priceRange";
  label: string;
  bounds: PriceRange;
  value: PriceRange;
  count: number;
};

export type FilterGroup = CheckboxGroup | RangeGroup;

/** Key of the category checkbox group — several categories can be ticked
 * at once, unlike the single-choice filters. */
export const CATEGORY_GROUP_KEY = "categoryIds";

/** The Price / Flavour / Occasion groups for the filter panel. */
export function getFilterGroups(catalog: Catalog, filters: MenuFilters): FilterGroup[] {
  const countWith = (key: "flavourId" | "occasionId", id: number) =>
    catalog.items.filter((item) => itemMatchesFilters(catalog, item, { ...filters, [key]: id })).length;
  const options = (key: "flavourId" | "occasionId", list: { id: number; label: string }[]) =>
    list.map(({ id, label }) => ({ id, label, count: countWith(key, id) }));
  const bounds = getPriceBounds(catalog.items);
  return [
    {
      kind: "range",
      key: "priceRange",
      label: "PRICE",
      bounds,
      value: filters.priceRange ?? bounds,
      count: catalog.items.filter((item) => itemMatchesFilters(catalog, item, filters)).length,
    },
    { kind: "checkbox", key: "flavourId", label: "FLAVOUR", selected: filters.flavourId !== null ? [filters.flavourId] : [], options: options("flavourId", catalog.flavourTags) },
    { kind: "checkbox", key: "occasionId", label: "OCCASION", selected: filters.occasionId !== null ? [filters.occasionId] : [], options: options("occasionId", catalog.occasions) },
  ];
}

/** The category checkboxes (desktop): each category with how many cakes it
 * has under the current search, price, flavour and occasion. Unlike the
 * single-choice filters, several can be ticked; none ticked means all. */
export function getCategoryFilterGroup(catalog: Catalog, selectedIds: number[], filters: MenuFilters): CheckboxGroup {
  const matching = catalog.items.filter((item) => itemMatchesFilters(catalog, item, filters));
  return {
    kind: "checkbox",
    key: CATEGORY_GROUP_KEY,
    label: "CATEGORY",
    selected: selectedIds,
    options: catalog.categories.map(({ id, label }) => ({
      id,
      label,
      count: matching.filter((item) => item.categoryId === id).length,
    })),
  };
}

/** A removable "Price: AED 60 – 120" style chip for each active filter. */
export function getActiveFilterChips(catalog: Catalog, filters: MenuFilters): { key: FilterKey; label: string }[] {
  const chips: { key: FilterKey; label: string }[] = [];
  if (filters.priceRange) {
    chips.push({ key: "priceRange", label: `Price: ${describePriceRange(filters.priceRange)}` });
  }
  if (filters.flavourId !== null) {
    chips.push({ key: "flavourId", label: `Flavour: ${findFlavourTag(catalog, filters.flavourId)?.label ?? filters.flavourId}` });
  }
  if (filters.occasionId !== null) {
    chips.push({ key: "occasionId", label: `Occasion: ${findOccasion(catalog, filters.occasionId)?.label ?? filters.occasionId}` });
  }
  return chips;
}
