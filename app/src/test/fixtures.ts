// Shared builders for lib/*.test.ts — order.test.ts, pricing.test.ts and
// whatsapp.test.ts each used to redefine near-identical item/line/order
// fixtures by hand. One shared copy means a CatalogItem/Order shape
// change only needs updating here. Lives under src/test/ (not src/lib/)
// since it's fixture data for tests, not production code — vitest.config
// only treats *.test.ts as test files, so this needed its own signal.
import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";
import { CONFIG } from "@/lib/config";

/** A realistic item with both a priced and an "Ask us" (unpriced) weight
 * tier, so tests needing either case can use the same fixture. */
export const item: CatalogItem = {
  id: 1,
  slug: "classic-cakes-butterscotch",
  name: "Butterscotch",
  categoryId: 1,
  description: "",
  weightTiers: [
    { id: 1, label: "½ kg", kg: 0.5, price: 55 },
    { id: 2, label: "1 kg", kg: 1, price: 100 },
    { id: 7, label: "3 kg+", kg: 3 }, // "Ask us" — no fixed price
  ],
  leadTimeHours: 0,
  cakeMessageMaxLength: CONFIG.cakeMessageMaxLength,
  available: true,
  requiresDelivery: false,
};

export function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    cartLineId: "l1",
    itemId: item.id,
    quantity: 1,
    weightTierId: 1,
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
