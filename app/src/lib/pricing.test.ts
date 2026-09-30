import { describe, expect, it } from "vitest";
import {
  cheapestPrice,
  formatAed,
  hasUnpricedLines,
  lineTotal,
  orderTotal,
  unitPrice,
} from "@/lib/pricing";
import { item, line, order } from "@/test/fixtures";

describe("unitPrice", () => {
  it("returns the selected weight tier's price", () => {
    expect(unitPrice(item, line({ weightTierId: 2 }))).toBe(100);
  });

  it("returns undefined for an 'Ask us' tier", () => {
    expect(unitPrice(item, line({ weightTierId: 7 }))).toBeUndefined();
  });
});

describe("lineTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(lineTotal(item, line({ quantity: 3 }))).toBe(165);
  });

  it("is undefined when the tier has no fixed price", () => {
    expect(lineTotal(item, line({ weightTierId: 7, quantity: 2 }))).toBeUndefined();
  });
});

describe("hasUnpricedLines", () => {
  it("is false when every line resolves to a fixed price", () => {
    expect(hasUnpricedLines(order({ lines: [line()] }), [item])).toBe(false);
  });

  it("is true when any line has an 'Ask us' tier", () => {
    expect(hasUnpricedLines(order({ lines: [line({ weightTierId: 7 })] }), [item])).toBe(
      true
    );
  });

  it("ignores lines whose item is missing from the catalog", () => {
    expect(hasUnpricedLines(order({ lines: [line({ itemId: 9999 })] }), [item])).toBe(false);
  });
});

describe("orderTotal", () => {
  it("sums priced lines and skips unpriced ones", () => {
    const priced = line({ cartLineId: "a", quantity: 2 }); // 2 * 55 = 110
    const unpriced = line({ cartLineId: "b", weightTierId: 7 });
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

describe("cheapestPrice", () => {
  it("returns the lowest priced tier across a single item", () => {
    expect(cheapestPrice([item])).toBe(55);
  });

  it("returns the lowest priced tier across multiple items", () => {
    const pricier = {
      ...item,
      id: 4,
      weightTiers: [{ id: 1, label: "½ kg", kg: 0.5, price: 85 }],
    };
    expect(cheapestPrice([pricier, item])).toBe(55);
  });

  it("is undefined when every tier is 'Ask us'", () => {
    const unpriced = { ...item, weightTiers: [{ id: 7, label: "3 kg+", kg: 3 }] };
    expect(cheapestPrice([unpriced])).toBeUndefined();
  });

  it("is undefined for an empty list of items", () => {
    expect(cheapestPrice([])).toBeUndefined();
  });
});
