import { describe, expect, it } from "vitest";
import { describeLine, orderItemCount, resolveOrderLines, resolveSelection } from "@/lib/order";
import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order } from "@/types/order";

const item: CatalogItem = {
  id: "classic-cakes",
  name: "Classic Cakes",
  categoryId: "cakes",
  description: "",
  weightTiers: [
    { id: "half-kg", label: "½ kg", price: 55 },
    { id: "1kg", label: "1 kg", price: 100 },
  ],
  flavours: [{ id: "butterscotch", label: "Butterscotch" }],
  readyLabel: "Ready in 1 hour",
  leadTimeHours: 0,
  cakeMessageMaxLength: 40,
  needsCustomDescription: false,
  available: true,
  requiresDelivery: false,
};

const noFlavourItem: CatalogItem = { ...item, id: "photo-cakes", flavours: [] };

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    lineId: "l1",
    itemId: item.id,
    quantity: 1,
    weightTierId: "half-kg",
    flavourId: "butterscotch",
    ...overrides,
  };
}

function order(lines: CartLine[]): Order {
  return {
    lines,
    fulfillment: "pickup",
    whenNeeded: { kind: "today" },
    customerName: "",
    pendingHandoff: false,
  };
}

describe("resolveSelection", () => {
  it("resolves the matching tier and flavour", () => {
    const { tier, flavour } = resolveSelection(item, {
      weightTierId: "1kg",
      flavourId: "butterscotch",
    });
    expect(tier?.label).toBe("1 kg");
    expect(flavour?.label).toBe("Butterscotch");
  });

  it("returns undefined for ids that don't match any option", () => {
    const { tier, flavour } = resolveSelection(item, { weightTierId: "nope", flavourId: "" });
    expect(tier).toBeUndefined();
    expect(flavour).toBeUndefined();
  });
});

describe("describeLine", () => {
  it("joins the tier and flavour labels onto the item name", () => {
    expect(describeLine(item, line())).toBe("Classic Cakes, ½ kg, Butterscotch");
  });

  it("omits the flavour segment when the item has none", () => {
    expect(describeLine(noFlavourItem, line({ itemId: noFlavourItem.id, flavourId: "" }))).toBe(
      "Classic Cakes, ½ kg"
    );
  });

  it("falls back to just the item name when nothing resolves", () => {
    expect(describeLine(item, line({ weightTierId: "nope", flavourId: "nope" }))).toBe(
      "Classic Cakes"
    );
  });
});

describe("resolveOrderLines", () => {
  it("pairs each cart line with its catalog item", () => {
    const resolved = resolveOrderLines(order([line()]), [item]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].item).toBe(item);
    expect(resolved[0].line.lineId).toBe("l1");
  });

  it("drops lines whose item no longer exists in the catalog", () => {
    const resolved = resolveOrderLines(order([line({ itemId: "discontinued" })]), [item]);
    expect(resolved).toHaveLength(0);
  });
});

describe("orderItemCount", () => {
  it("sums quantities across all lines", () => {
    const count = orderItemCount(
      order([line({ lineId: "a", quantity: 2 }), line({ lineId: "b", quantity: 3 })])
    );
    expect(count).toBe(5);
  });

  it("is 0 for an empty order", () => {
    expect(orderItemCount(order([]))).toBe(0);
  });
});
