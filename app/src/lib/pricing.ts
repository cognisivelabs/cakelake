import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";
import { CONFIG } from "@/lib/config";

/** Base price plus any selected options' price deltas, for one unit. */
export function unitPrice(item: CatalogItem, line: CartLine): number {
  let price = item.price;
  for (const group of item.optionGroups) {
    const chosenId = line.selectedOptions[group.id];
    const choice = group.choices.find((c) => c.id === chosenId);
    if (choice?.priceDelta) price += choice.priceDelta;
  }
  return price;
}

export function lineTotal(item: CatalogItem, line: CartLine): number {
  return unitPrice(item, line) * line.quantity;
}

export function subtotal(order: Order, catalog: CatalogItem[]): number {
  return order.lines.reduce((sum, line) => {
    const item = catalog.find((c) => c.id === line.itemId);
    return item ? sum + lineTotal(item, line) : sum;
  }, 0);
}

export function deliveryFee(order: Order): number {
  return order.fulfillment === "delivery" ? CONFIG.deliveryFeeAed : 0;
}

export function orderTotal(order: Order, catalog: CatalogItem[]): number {
  return subtotal(order, catalog) + deliveryFee(order);
}

export function formatAed(amount: number): string {
  return `${CONFIG.currency} ${amount}`;
}
