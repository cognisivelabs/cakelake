import { describe, expect, it } from "vitest";
import { CATEGORY_OCCASIONS, FLAVOUR_ITEMS, MOST_ORDERED } from "@/data/taxonomy";
import {
  getCatalog,
  getCategories,
  getCategoriesByKind,
  getCategory,
  getCategoryImage,
  getFlavourTagImage,
  getFlavourTags,
  getItemById,
  getMostOrdered,
  getOccasions,
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

describe("occasions, flavour tags and most ordered", () => {
  it("every occasion an item lists is a real occasion, and every item lists at least one", () => {
    const ids = new Set(getOccasions().map((o) => o.id));
    for (const item of getCatalog()) {
      expect(item.occasions?.length, item.id).toBeGreaterThan(0);
      for (const id of item.occasions ?? []) expect(ids.has(id), `${item.id} -> ${id}`).toBe(true);
    }
  });

  it("the per-category occasion map only names real categories", () => {
    const categoryIds = new Set(getCategories().map((c) => c.id));
    for (const id of Object.keys(CATEGORY_OCCASIONS)) expect(categoryIds.has(id), id).toBe(true);
  });

  it("every item id listed under a flavour tag exists, so a typo can't silently drop it", () => {
    for (const [tag, itemIds] of Object.entries(FLAVOUR_ITEMS)) {
      for (const id of itemIds) expect(getItemById(id), `${tag} -> ${id}`).toBeDefined();
    }
  });

  it("every flavour tag has at least one item", () => {
    for (const tag of getFlavourTags()) {
      expect(getCatalog().some((i) => i.flavours?.includes(tag.id)), tag.id).toBe(true);
    }
  });

  it("returns the most-ordered items in the configured order", () => {
    expect(getMostOrdered().map((i) => i.id)).toEqual(MOST_ORDERED);
    expect(getMostOrdered().map((i) => i.mostOrderedRank)).toEqual([1, 2, 3, 4]);
  });

  it("finds a tile photo from the items themselves", () => {
    expect(getCategoryImage("classic-cakes")).toBe("/images/classic-butterscotch.jpg");
    expect(getFlavourTagImage("indian-sweets")).toMatch(/^\/images\/indian-/);
  });

  it("Cheesecakes and Flavourful Indian cakes need 24 hours' notice", () => {
    for (const item of getCatalog().filter((i) => ["cheesecakes", "indian-cakes"].includes(i.categoryId))) {
      expect(item.leadTimeHours, item.id).toBe(24);
      expect(item.readyLabel, item.id).toBe("24 hours notice");
    }
  });
});

describe("getCategoriesByKind", () => {
  it("splits the categories into everyday, made-to-order and custom, in menu order", () => {
    const ids = (kind: Parameters<typeof getCategoriesByKind>[0]) => getCategoriesByKind(kind).map((c) => c.id);
    expect(ids("everyday")).toEqual([
      "classic-cakes",
      "premium-cakes",
      "exotic-cakes",
      "exotic-premium-cakes",
      "cheesecakes",
      "indian-cakes",
    ]);
    expect(ids("made-to-order")).toEqual(["pull-me-up-cakes", "hammer-cakes", "pinata-cakes"]);
    expect(ids("custom")).toEqual(["photo-cakes", "3d-cakes"]);
  });

  it("covers every category exactly once", () => {
    const kinds = ["everyday", "made-to-order", "custom"] as const;
    const total = kinds.flatMap((kind) => getCategoriesByKind(kind)).length;
    expect(total).toBe(getCategories().length);
  });
});
