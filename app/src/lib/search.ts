import type { CatalogItem } from "@/types/catalog";
import { getCategory, getFlavourTag } from "@/lib/catalog";
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
