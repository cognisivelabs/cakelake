import { describe, expect, it } from "vitest";
import { getCatalog, getCategories, getCategory, getItemById } from "@/lib/catalog";

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
