import { describe, expect, it } from "vitest";
import {
  describeLine,
  dropDiscontinuedLines,
  orderItemCount,
  resolveOrderLines,
  resolveSelection,
} from "@/lib/order";
import { item, line, order } from "@/lib/testFixtures";
import type { CatalogItem } from "@/types/catalog";
import type { Order } from "@/types/order";

const noFlavourItem: CatalogItem = { ...item, id: "photo-cakes", flavours: [] };

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
    const resolved = resolveOrderLines(order({ lines: [line()] }), [item]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].item).toBe(item);
    expect(resolved[0].line.lineId).toBe("l1");
  });

  it("drops lines whose item no longer exists in the catalog", () => {
    const resolved = resolveOrderLines(order({ lines: [line({ itemId: "discontinued" })] }), [
      item,
    ]);
    expect(resolved).toHaveLength(0);
  });
});

describe("orderItemCount", () => {
  it("sums quantities across all lines", () => {
    const count = orderItemCount(
      order({
        lines: [line({ lineId: "a", quantity: 2 }), line({ lineId: "b", quantity: 3 })],
      })
    );
    expect(count).toBe(5);
  });

  it("is 0 for an empty order", () => {
    expect(orderItemCount(order({ lines: [] }))).toBe(0);
  });
});

describe("dropDiscontinuedLines", () => {
  it("removes lines whose item id is no longer in the catalog", () => {
    const original = order({
      lines: [line({ lineId: "a" }), line({ lineId: "b", itemId: "discontinued" })],
    });
    const result = dropDiscontinuedLines(original, [item]);
    expect(result.lines.map((l) => l.lineId)).toEqual(["a"]);
  });

  it("returns the same order reference when nothing was dropped", () => {
    const original = order({ lines: [line()] });
    expect(dropDiscontinuedLines(original, [item])).toBe(original);
  });

  it("preserves every other order field when lines are dropped", () => {
    const original: Order = order({
      lines: [line({ itemId: "discontinued" })],
      customerName: "Sam",
      fulfillment: "delivery",
    });
    const result = dropDiscontinuedLines(original, [item]);
    expect(result.lines).toEqual([]);
    expect(result.customerName).toBe("Sam");
    expect(result.fulfillment).toBe("delivery");
  });
});
