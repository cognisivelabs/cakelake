import type { CatalogItem, WeightTier } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";

/** The item's weight tier matching `ids.weightTierId`, or undefined. */
export function resolveSelection(
  item: CatalogItem,
  ids: { weightTierId: string }
): { tier: WeightTier | undefined } {
  return { tier: item.weightTiers.find((t) => t.id === ids.weightTierId) };
}

/** "Item Name, Tier", or just the item name when the tier isn't found. */
export function describeLine(item: CatalogItem, line: CartLine): string {
  const { tier } = resolveSelection(item, line);
  return tier ? `${item.name}, ${tier.label}` : item.name;
}

/** Each cart line paired with its catalog item; lines whose item isn't
 * in the catalog are left out. */
export function resolveOrderLines(
  order: Order,
  catalog: CatalogItem[]
): { item: CatalogItem; line: CartLine }[] {
  return order.lines
    .map((line) => {
      const item = catalog.find((c) => c.id === line.itemId);
      return item ? { item, line } : null;
    })
    .filter((x): x is { item: CatalogItem; line: CartLine } => x !== null);
}

/** The longest leadTimeHours among the order's items; 0 for an empty or
 * all-same-day order. */
export function orderLeadTimeHours(order: Order, catalog: CatalogItem[]): number {
  return Math.max(0, ...resolveOrderLines(order, catalog).map(({ item }) => item.leadTimeHours));
}

/** Total quantity across every line. */
export function orderItemCount(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** The order without lines whose item isn't in the catalog; the same
 * object when nothing was removed. */
export function dropDiscontinuedLines(order: Order, catalog: CatalogItem[]): Order {
  const catalogIds = new Set(catalog.map((item) => item.id));
  const lines = order.lines.filter((line) => catalogIds.has(line.itemId));
  return lines.length === order.lines.length ? order : { ...order, lines };
}
