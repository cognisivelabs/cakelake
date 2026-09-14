import { describe, expect, it } from "vitest";
import {
  getCatalog,
  getCategories,
  getCategory,
  getItemById,
  getSiblingItems,
  weightTierKg,
} from "@/lib/catalog";

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

  it("has no duplicate item ids — each flavour is its own flattened item since the Sep 2026 recategorisation", () => {
    const ids = getCatalog().map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
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

describe("getSiblingItems", () => {
  it("returns every other item in the same category, excluding itself", () => {
    const butterscotch = getItemById("classic-cakes-butterscotch")!;
    const siblings = getSiblingItems(butterscotch);
    expect(siblings.length).toBeGreaterThan(0);
    expect(siblings.every((s) => s.categoryId === "classic-cakes")).toBe(true);
    expect(siblings.some((s) => s.id === butterscotch.id)).toBe(false);
  });

  it("is empty for a category with only one item", () => {
    const photoCakes = getItemById("photo-cakes")!;
    expect(getSiblingItems(photoCakes)).toEqual([]);
  });
});
