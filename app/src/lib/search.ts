import type { CatalogItem } from "@/types/catalog";
import { getCategory, getFlavourTag } from "@/lib/catalog";

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
