// Shared builders for lib/*.test.ts — order.test.ts, pricing.test.ts and
// whatsapp.test.ts each used to redefine near-identical item/line/order
// fixtures by hand. One shared copy means a CatalogItem/Order shape
// change only needs updating here.
import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";
import { CONFIG } from "@/lib/config";

/** A realistic item with both a priced and an "Ask us" (unpriced) weight
 * tier, so tests needing either case can use the same fixture. */
export const item: CatalogItem = {
  id: "classic-cakes",
  name: "Classic Cakes",
  categoryId: "cakes",
  description: "",
  weightTiers: [
    { id: "half-kg", label: "½ kg", price: 55 },
    { id: "1kg", label: "1 kg", price: 100 },
    { id: "3kg-plus", label: "3 kg+" }, // "Ask us" — no fixed price
  ],
  flavours: [{ id: "butterscotch", label: "Butterscotch" }],
  readyLabel: "Ready in 1 hour",
  leadTimeHours: 0,
  cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
  needsCustomDescription: false,
  available: true,
  requiresDelivery: false,
};

export function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    lineId: "l1",
    itemId: item.id,
    quantity: 1,
    weightTierId: "half-kg",
    flavourId: "butterscotch",
    ...overrides,
  };
}

export function order(overrides: Partial<Order> = {}): Order {
  return {
    lines: [line()],
    fulfillment: "pickup",
    whenNeeded: { kind: "today" },
    customerName: "",
    pendingHandoff: false,
    ...overrides,
  };
}
