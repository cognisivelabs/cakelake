import type { CatalogItem } from "@/types/catalog";
import { getCatalog, getCategories, getCategory, getFlavourTag, getFlavourTags, getOccasion, getOccasions } from "@/lib/catalog";
import { cheapestPrice } from "@/lib/pricing";

/**
 * Whether a menu search query matches an item. Matches the item's name,
 * its category's name (so "cheesecake" finds the cheesecake flavours,
 * whose own names are just "Oreo", "New York"…) and any flavour tag it
 * belongs to (so "indian sweets" finds every mithai cake).
 */
export function itemMatchesQuery(item: CatalogItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    item.name,
    getCategory(item.categoryId)?.label ?? "",
    ...(item.flavours ?? []).map((id) => getFlavourTag(id)?.label ?? ""),
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
export function getPriceBounds(catalog: CatalogItem[] = getCatalog()): PriceRange {
  const prices = catalog.flatMap((item) => cheapestPrice([item]) ?? []);
  return {
    min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP,
  };
}

/** A chosen range kept inside the bounds and in order — or null when it
 * covers the whole slider, which means "no price filter". */
export function normalizePriceRange(range: PriceRange, bounds: PriceRange = getPriceBounds()): PriceRange | null {
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
export function parsePriceRange(text: string, bounds: PriceRange = getPriceBounds()): PriceRange | null {
  const match = /^(\d+)-(\d+)$/.exec(text);
  return match ? normalizePriceRange({ min: Number(match[1]), max: Number(match[2]) }, bounds) : null;
}

/** "AED 60 – 120", for a chip or a label. */
export function describePriceRange(range: PriceRange): string {
  return `AED ${range.min} – ${range.max}`;
}

/** The menu's filter selections — an empty string, or a null range, means
 * "no filter". */
export type MenuFilters = {
  /** Categories ticked on desktop — none (or omitted) means every category. */
  categoryIds?: string[];
  query: string;
  /** Starting-price range from the slider. */
  priceRange: PriceRange | null;
  flavourId: string;
  occasionId: string;
};

/** Whether an item passes every active menu filter (search text plus
 * category, price range, flavour tag and occasion). */
export function itemMatchesFilters(item: CatalogItem, filters: MenuFilters): boolean {
  if (!itemMatchesQuery(item, filters.query)) return false;
  if (filters.categoryIds?.length && !filters.categoryIds.includes(item.categoryId)) return false;
  if (filters.flavourId && !item.flavours?.includes(filters.flavourId)) return false;
  if (filters.occasionId && !item.occasions?.includes(filters.occasionId)) return false;
  if (filters.priceRange) {
    const price = cheapestPrice([item]);
    if (price === undefined || price < filters.priceRange.min || price > filters.priceRange.max) return false;
  }
  return true;
}

export type FilterKey = "priceRange" | "flavourId" | "occasionId";

/** A group of checkboxes in the filter panel, with how many cakes each
 * choice would leave (given every *other* filter already set). */
export type CheckboxGroup = {
  kind: "checkbox";
  /** A single-choice filter (FilterKey) or the multi-choice category list. */
  key: Exclude<FilterKey, "priceRange"> | typeof CATEGORY_GROUP_KEY;
  label: string;
  selected: string[];
  options: { id: string; label: string; count: number }[];
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
export function getFilterGroups(filters: MenuFilters, catalog: CatalogItem[] = getCatalog()): FilterGroup[] {
  const countWith = (key: "flavourId" | "occasionId", id: string) =>
    catalog.filter((item) => itemMatchesFilters(item, { ...filters, [key]: id })).length;
  const options = (key: "flavourId" | "occasionId", list: { id: string; label: string }[]) =>
    list.map(({ id, label }) => ({ id, label, count: countWith(key, id) }));
  const bounds = getPriceBounds(catalog);
  return [
    {
      kind: "range",
      key: "priceRange",
      label: "PRICE",
      bounds,
      value: filters.priceRange ?? bounds,
      count: catalog.filter((item) => itemMatchesFilters(item, filters)).length,
    },
    { kind: "checkbox", key: "flavourId", label: "FLAVOUR", selected: filters.flavourId ? [filters.flavourId] : [], options: options("flavourId", getFlavourTags()) },
    { kind: "checkbox", key: "occasionId", label: "OCCASION", selected: filters.occasionId ? [filters.occasionId] : [], options: options("occasionId", getOccasions()) },
  ];
}

/** The category checkboxes (desktop): each category with how many cakes it
 * has under the current search, price, flavour and occasion. Unlike the
 * single-choice filters, several can be ticked; none ticked means all. */
export function getCategoryFilterGroup(
  selectedIds: string[],
  filters: MenuFilters,
  catalog: CatalogItem[] = getCatalog(),
): CheckboxGroup {
  const matching = catalog.filter((item) => itemMatchesFilters(item, filters));
  return {
    kind: "checkbox",
    key: CATEGORY_GROUP_KEY,
    label: "CATEGORY",
    selected: selectedIds,
    options: getCategories().map(({ id, label }) => ({
      id,
      label,
      count: matching.filter((item) => item.categoryId === id).length,
    })),
  };
}

/** A removable "Price: AED 60 – 120" style chip for each active filter. */
export function getActiveFilterChips(filters: MenuFilters): { key: FilterKey; label: string }[] {
  const chips: { key: FilterKey; label: string }[] = [];
  if (filters.priceRange) {
    chips.push({ key: "priceRange", label: `Price: ${describePriceRange(filters.priceRange)}` });
  }
  if (filters.flavourId) {
    chips.push({ key: "flavourId", label: `Flavour: ${getFlavourTag(filters.flavourId)?.label ?? filters.flavourId}` });
  }
  if (filters.occasionId) {
    chips.push({ key: "occasionId", label: `Occasion: ${getOccasion(filters.occasionId)?.label ?? filters.occasionId}` });
  }
  return chips;
}
