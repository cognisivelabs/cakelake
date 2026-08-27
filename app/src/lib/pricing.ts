import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";
import { CONFIG } from "@/lib/config";

/** The selected weight tier's price, or undefined if it's an "Ask us" tier. */
export function unitPrice(item: CatalogItem, line: CartLine): number | undefined {
  return item.weightTiers.find((t) => t.id === line.weightTierId)?.price;
}

/** Line total, or undefined if the selected weight tier has no fixed price. */
export function lineTotal(item: CatalogItem, line: CartLine): number | undefined {
  const price = unitPrice(item, line);
  return price === undefined ? undefined : price * line.quantity;
}

/** True if any line in the cart has an "Ask us" (unpriced) weight tier —
 * the total shown is a partial total, not the full order cost. */
export function hasUnpricedLines(order: Order, catalog: CatalogItem[]): boolean {
  return order.lines.some((line) => {
    const item = catalog.find((c) => c.id === line.itemId);
    return item ? unitPrice(item, line) === undefined : false;
  });
}

export function subtotal(order: Order, catalog: CatalogItem[]): number {
  return order.lines.reduce((sum, line) => {
    const item = catalog.find((c) => c.id === line.itemId);
    const total = item ? lineTotal(item, line) : undefined;
    return total === undefined ? sum : sum + total;
  }, 0);
}

// Delivery cost isn't priced on the site — see ADR-003: it's confirmed
// with the customer over WhatsApp, not shown as a line item here.
export function orderTotal(order: Order, catalog: CatalogItem[]): number {
  return subtotal(order, catalog);
}

export function formatAed(amount: number): string {
  return `${CONFIG.currency} ${amount}`;
}
