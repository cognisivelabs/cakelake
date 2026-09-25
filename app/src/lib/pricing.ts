import { weightTierKg } from "@/lib/catalog";
import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";
import { CONFIG } from "@/lib/config";
import { resolveOrderLines } from "@/lib/order";

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
  return resolveOrderLines(order, catalog).some(
    ({ item, line }) => unitPrice(item, line) === undefined
  );
}

// Delivery cost isn't priced on the site — see ADR-003: it's confirmed
// with the customer over WhatsApp, not shown as a line item here.
export function orderTotal(order: Order, catalog: CatalogItem[]): number {
  return resolveOrderLines(order, catalog).reduce((sum, { item, line }) => {
    const total = lineTotal(item, line);
    return total === undefined ? sum : sum + total;
  }, 0);
}

export function formatAed(amount: number): string {
  return `${CONFIG.currency} ${amount}`;
}

/** The lowest priced weight tier across the given items, or undefined if
 * none has a fixed price (every tier is "Ask us"). Used both for a
 * single item's card (ItemCard) and a whole category's "from" price
 * (Home). */
export function cheapestPrice(items: CatalogItem[]): number | undefined {
  const prices = items
    .flatMap((item) => item.weightTiers)
    .map((tier) => tier.price)
    .filter((price): price is number => price !== undefined);
  return prices.length === 0 ? undefined : Math.min(...prices);
}

/**
 * A category's price hint for menus: "from 55" for ranges sold by the
 * cake, "180/kg" where even the smallest size is a whole kilo (so the
 * price is per kg). "Ask us" when nothing has a fixed price.
 */
export function categoryPriceLabel(items: CatalogItem[]): string {
  let best: { price: number; kg: number } | undefined;
  for (const item of items) {
    for (const tier of item.weightTiers) {
      if (tier.price === undefined) continue;
      if (!best || tier.price < best.price) best = { price: tier.price, kg: weightTierKg(tier) };
    }
  }
  if (!best) return "Ask us";
  return best.kg >= 1 ? `${best.price}/kg` : `from ${best.price}`;
}
