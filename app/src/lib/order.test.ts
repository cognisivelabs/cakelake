import { describe, expect, it } from "vitest";
import {
  describeLine,
  dropDiscontinuedLines,
  isSameLine,
  orderItemCount,
  orderLeadTimeHours,
  resolveOrderLines,
  resolveSelection,
} from "@/lib/order";
import { item, line, order } from "@/test/fixtures";
import type { Order } from "@/types/order";

describe("resolveSelection", () => {
  it("resolves the matching tier", () => {
    const { tier } = resolveSelection(item, { weightTierId: 2 });
    expect(tier?.label).toBe("1 kg");
  });

  it("returns undefined for an id that doesn't match any tier", () => {
    const { tier } = resolveSelection(item, { weightTierId: 9999 });
    expect(tier).toBeUndefined();
  });
});

describe("describeLine", () => {
  it("joins the tier label onto the item name", () => {
    expect(describeLine(item, line())).toBe("Butterscotch, ½ kg");
  });

  it("falls back to just the item name when the tier doesn't resolve", () => {
    expect(describeLine(item, line({ weightTierId: 9999 }))).toBe("Butterscotch");
  });
});

describe("resolveOrderLines", () => {
  it("pairs each cart line with its catalog item", () => {
    const resolved = resolveOrderLines(order({ lines: [line()] }), [item]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].item).toBe(item);
    expect(resolved[0].line.id).toBe("l1");
  });

  it("drops lines whose item no longer exists in the catalog", () => {
    const resolved = resolveOrderLines(order({ lines: [line({ itemId: 9999 })] }), [
      item,
    ]);
    expect(resolved).toHaveLength(0);
  });
});

describe("orderItemCount", () => {
  it("sums quantities across all lines", () => {
    const count = orderItemCount(
      order({
        lines: [line({ id: "a", quantity: 2 }), line({ id: "b", quantity: 3 })],
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
      lines: [line({ id: "a" }), line({ id: "b", itemId: 9999 })],
    });
    const result = dropDiscontinuedLines(original, [item]);
    expect(result.lines.map((l) => l.id)).toEqual(["a"]);
  });

  it("returns the same order reference when nothing was dropped", () => {
    const original = order({ lines: [line()] });
    expect(dropDiscontinuedLines(original, [item])).toBe(original);
  });

  it("preserves every other order field when lines are dropped", () => {
    const original: Order = order({
      lines: [line({ itemId: 9999 })],
      customerName: "Sam",
      fulfillment: "delivery",
    });
    const result = dropDiscontinuedLines(original, [item]);
    expect(result.lines).toEqual([]);
    expect(result.customerName).toBe("Sam");
    expect(result.fulfillment).toBe("delivery");
  });
});

describe("orderLeadTimeHours", () => {
  const notice = { ...item, id: 29, leadTimeHours: 24 };
  const catalog = [item, notice];

  it("is 0 for an empty or all-same-day order", () => {
    expect(orderLeadTimeHours(order({ lines: [] }), catalog)).toBe(0);
    expect(orderLeadTimeHours(order(), catalog)).toBe(0);
  });

  it("is the longest lead time among the order's items", () => {
    const lines = [line(), line({ id: "l2", itemId: notice.id })];
    expect(orderLeadTimeHours(order({ lines }), catalog)).toBe(24);
  });
});

describe("isSameLine", () => {
  const base = { itemId: 1, weightTierId: 2 };

  it("matches the same item, weight and message", () => {
    expect(isSameLine({ ...base, cakeMessage: "Hi" }, { ...base, cakeMessage: "Hi" })).toBe(true);
  });

  it("treats no message and an empty message as the same", () => {
    expect(isSameLine(base, { ...base, cakeMessage: "" })).toBe(true);
  });

  it("tells apart a different item, weight or message", () => {
    expect(isSameLine(base, { ...base, itemId: 3 })).toBe(false);
    expect(isSameLine(base, { ...base, weightTierId: 4 })).toBe(false);
    expect(isSameLine(base, { ...base, cakeMessage: "Hi" })).toBe(false);
  });
});
