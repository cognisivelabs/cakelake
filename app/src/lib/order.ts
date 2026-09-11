import type { CatalogItem, Flavour, WeightTier } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";

/**
 * The selected weight tier and flavour for a line — or, on the item
 * detail screen before a line exists yet, the picker's current raw
 * weightTierId/flavourId state. Both shapes satisfy this signature, so
 * this covers every "what did they pick" lookup in the app.
 */
export function resolveSelection(
  item: CatalogItem,
  ids: { weightTierId: string; flavourId: string }
): { tier: WeightTier | undefined; flavour: Flavour | undefined } {
  return {
    tier: item.weightTiers.find((t) => t.id === ids.weightTierId),
    flavour: item.flavours.find((f) => f.id === ids.flavourId),
  };
}

/** "Item Name, Tier, Flavour" (only the parts that exist) — the line
 * description used in both the WhatsApp order message and the
 * order-sent recap shown after confirming. */
export function describeLine(item: CatalogItem, line: CartLine): string {
  const { tier, flavour } = resolveSelection(item, line);
  const descriptors = [tier?.label, flavour?.label].filter(Boolean).join(", ");
  return descriptors ? `${item.name}, ${descriptors}` : item.name;
}

/** Joins each cart line to its catalog item, dropping any line whose
 * item no longer exists in the catalog (e.g. removed after the cart
 * was saved). */
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

/** Total quantity across every line — the number shown on the cart pill. */
export function orderItemCount(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Strips any line whose item no longer exists in the catalog — a cart
 * can sit in localStorage for weeks, long enough for an item it
 * references to be discontinued or renamed in a later deploy. Without
 * this the line lingers forever: it drops out of resolveOrderLines()'s
 * item/price rendering (so the cart page and total look right) but
 * still counts toward orderItemCount()'s "CART N" badge, since that only
 * reads order.lines — the two would silently disagree. */
export function dropDiscontinuedLines(order: Order, catalog: CatalogItem[]): Order {
  const catalogIds = new Set(catalog.map((item) => item.id));
  const lines = order.lines.filter((line) => catalogIds.has(line.itemId));
  return lines.length === order.lines.length ? order : { ...order, lines };
}
