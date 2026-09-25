import type { CatalogItem } from "@/types/catalog";
import { getCatalog, getCategory, getFlavourTag, getFlavourTags, getOccasion, getOccasions } from "@/lib/catalog";
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

/** A price range on the menu's Price filter, judged by an item's
 * starting price (its cheapest fixed-price size). */
export type PriceBand = { id: string; label: string; includes: (price: number) => boolean };

export const PRICE_BANDS: PriceBand[] = [
  { id: "under-100", label: "Under AED 100", includes: (p) => p < 100 },
  { id: "100-150", label: "AED 100 – 150", includes: (p) => p >= 100 && p <= 150 },
  { id: "over-150", label: "Over AED 150", includes: (p) => p > 150 },
];

export function getPriceBand(id: string): PriceBand | undefined {
  return PRICE_BANDS.find((band) => band.id === id);
}

/** The menu's filter selections — an empty string means "no filter". */
export type MenuFilters = {
  query: string;
  priceBandId: string;
  flavourId: string;
  occasionId: string;
};

/** Whether an item passes every active menu filter (search text plus
 * price band, flavour tag and occasion). */
export function itemMatchesFilters(item: CatalogItem, filters: MenuFilters): boolean {
  if (!itemMatchesQuery(item, filters.query)) return false;
  if (filters.flavourId && !item.flavours?.includes(filters.flavourId)) return false;
  if (filters.occasionId && !item.occasions?.includes(filters.occasionId)) return false;
  if (filters.priceBandId) {
    const band = getPriceBand(filters.priceBandId);
    const price = cheapestPrice([item]);
    if (band && (price === undefined || !band.includes(price))) return false;
  }
  return true;
}

export type FilterKey = "priceBandId" | "flavourId" | "occasionId";

/** One group of choices in the filter panel, with how many cakes each
 * choice would leave (given every *other* filter already set). */
export type FilterGroup = {
  key: FilterKey;
  label: string;
  selected: string;
  options: { id: string; label: string; count: number }[];
};

/** The Price / Flavour / Occasion groups for the filter panel. */
export function getFilterGroups(filters: MenuFilters, catalog: CatalogItem[] = getCatalog()): FilterGroup[] {
  const countWith = (key: FilterKey, id: string) =>
    catalog.filter((item) => itemMatchesFilters(item, { ...filters, [key]: id })).length;
  const options = (key: FilterKey, list: { id: string; label: string }[]) =>
    list.map(({ id, label }) => ({ id, label, count: countWith(key, id) }));
  return [
    { key: "priceBandId", label: "PRICE", selected: filters.priceBandId, options: options("priceBandId", PRICE_BANDS) },
    { key: "flavourId", label: "FLAVOUR", selected: filters.flavourId, options: options("flavourId", getFlavourTags()) },
    { key: "occasionId", label: "OCCASION", selected: filters.occasionId, options: options("occasionId", getOccasions()) },
  ];
}

/** A removable "Price: Under AED 100" style chip for each active filter. */
export function getActiveFilterChips(filters: MenuFilters): { key: FilterKey; label: string }[] {
  const chips: { key: FilterKey; label: string }[] = [];
  if (filters.priceBandId) {
    chips.push({ key: "priceBandId", label: `Price: ${getPriceBand(filters.priceBandId)?.label ?? filters.priceBandId}` });
  }
  if (filters.flavourId) {
    chips.push({ key: "flavourId", label: `Flavour: ${getFlavourTag(filters.flavourId)?.label ?? filters.flavourId}` });
  }
  if (filters.occasionId) {
    chips.push({ key: "occasionId", label: `Occasion: ${getOccasion(filters.occasionId)?.label ?? filters.occasionId}` });
  }
  return chips;
}
