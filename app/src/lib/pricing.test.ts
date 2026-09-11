import { describe, expect, it } from "vitest";
import { formatAed, hasUnpricedLines, lineTotal, orderTotal, unitPrice } from "@/lib/pricing";
import { item, line, order } from "@/lib/testFixtures";

describe("unitPrice", () => {
  it("returns the selected weight tier's price", () => {
    expect(unitPrice(item, line({ weightTierId: "1kg" }))).toBe(100);
  });

  it("returns undefined for an 'Ask us' tier", () => {
    expect(unitPrice(item, line({ weightTierId: "3kg-plus" }))).toBeUndefined();
  });
});

describe("lineTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(lineTotal(item, line({ quantity: 3 }))).toBe(165);
  });

  it("is undefined when the tier has no fixed price", () => {
    expect(lineTotal(item, line({ weightTierId: "3kg-plus", quantity: 2 }))).toBeUndefined();
  });
});

describe("hasUnpricedLines", () => {
  it("is false when every line resolves to a fixed price", () => {
    expect(hasUnpricedLines(order({ lines: [line()] }), [item])).toBe(false);
  });

  it("is true when any line has an 'Ask us' tier", () => {
    expect(hasUnpricedLines(order({ lines: [line({ weightTierId: "3kg-plus" })] }), [item])).toBe(
      true
    );
  });

  it("ignores lines whose item is missing from the catalog", () => {
    expect(hasUnpricedLines(order({ lines: [line({ itemId: "gone" })] }), [item])).toBe(false);
  });
});

describe("orderTotal", () => {
  it("sums priced lines and skips unpriced ones", () => {
    const priced = line({ lineId: "a", quantity: 2 }); // 2 * 55 = 110
    const unpriced = line({ lineId: "b", weightTierId: "3kg-plus" });
    expect(orderTotal(order({ lines: [priced, unpriced] }), [item])).toBe(110);
  });

  it("is 0 for an empty order", () => {
    expect(orderTotal(order({ lines: [] }), [item])).toBe(0);
  });
});

describe("formatAed", () => {
  it("prefixes the amount with the currency code", () => {
    expect(formatAed(55)).toBe("AED 55");
  });
});
