import { describe, expect, it } from "vitest";
import { getCatalog, getCategories, getCategory, getItemById, weightTierKg } from "@/lib/catalog";

describe("getCatalog / getCategories", () => {
  it("returns a non-empty catalogue and category list", () => {
    expect(getCatalog().length).toBeGreaterThan(0);
    expect(getCategories().length).toBeGreaterThan(0);
  });

  it("every item references a category that actually exists", () => {
    const categoryIds = new Set(getCategories().map((c) => c.id));
    for (const item of getCatalog()) {
      expect(categoryIds.has(item.categoryId)).toBe(true);
    }
  });

  it("every item has at least one weight tier", () => {
    for (const item of getCatalog()) {
      expect(item.weightTiers.length).toBeGreaterThan(0);
    }
  });
});

describe("getCategory", () => {
  it("finds a category by id", () => {
    const [first] = getCategories();
    expect(getCategory(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getCategory("does-not-exist")).toBeUndefined();
  });
});

describe("getItemById", () => {
  it("finds an item by id", () => {
    const [first] = getCatalog();
    expect(getItemById(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getItemById("does-not-exist")).toBeUndefined();
  });
});

describe("weightTierKg", () => {
  it("reads every real weight tier id in the catalogue as a sane, non-negative number", () => {
    for (const item of getCatalog()) {
      for (const tier of item.weightTiers) {
        expect(weightTierKg(tier)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("treats a 'half' id as 0.5kg", () => {
    expect(weightTierKg({ id: "half-kg" })).toBe(0.5);
  });

  it("reads a leading integer id as whole kilograms", () => {
    expect(weightTierKg({ id: "1kg" })).toBe(1);
    expect(weightTierKg({ id: "2kg" })).toBe(2);
  });

  it("reads a leading decimal id as fractional kilograms", () => {
    expect(weightTierKg({ id: "1.5kg" })).toBe(1.5);
  });

  it("reads only the leading number, ignoring a trailing suffix", () => {
    expect(weightTierKg({ id: "3kg-plus" })).toBe(3);
  });

  it("falls back to 0 for an id with no recognizable weight", () => {
    expect(weightTierKg({ id: "custom" })).toBe(0);
    expect(weightTierKg({ id: "" })).toBe(0);
  });
});
