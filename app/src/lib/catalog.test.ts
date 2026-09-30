import { describe, expect, it } from "vitest";
import {
  getCatalog,
  getCategories,
  getCategoriesByKind,
  getCategory,
  getCategoryBySlug,
  getCategoryImage,
  getFlavourTagImage,
  getFlavourTags,
  getItemById,
  getItemBySlug,
  getMostOrdered,
  getOccasions,
  getSiblingItems,
  readyBadge,
  readyLabel,
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

  it("has no duplicate item ids or slugs", () => {
    const ids = getCatalog().map((item) => item.id);
    const slugs = getCatalog().map((item) => item.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has no duplicate category ids or slugs", () => {
    const ids = getCategories().map((c) => c.id);
    const slugs = getCategories().map((c) => c.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getCategory", () => {
  it("finds a category by id", () => {
    const [first] = getCategories();
    expect(getCategory(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getCategory(9999)).toBeUndefined();
  });

  it("finds a category by slug", () => {
    expect(getCategoryBySlug("cheesecakes")?.label).toBe("Cheesecakes");
    expect(getCategoryBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getItemById", () => {
  it("finds an item by id", () => {
    const [first] = getCatalog();
    expect(getItemById(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getItemById(9999)).toBeUndefined();
  });

  it("finds an item by slug", () => {
    expect(getItemBySlug("classic-cakes-black-forest")?.name).toBe("Black Forest");
    expect(getItemBySlug("custom-cakes")?.name).toBe("Custom Cakes");
    expect(getItemBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("weight tiers", () => {
  const sizesOf = (slug: string) =>
    getCatalog().find((i) => i.categoryId === getCategoryBySlug(slug)?.id)!.weightTiers.map((t) => t.label);

  it("sells each category in its agreed sizes", () => {
    const halfTo3 = ["½ kg", "1 kg", "1½ kg", "2 kg", "2½ kg", "3 kg"];
    for (const slug of ["classic-cakes", "premium-cakes", "exotic-cakes", "exotic-premium-cakes", "cheesecakes", "indian-cakes", "photo-cakes", "pull-me-up-cakes"]) {
      expect(sizesOf(slug), slug).toEqual(halfTo3);
    }
    for (const slug of ["hammer-cakes", "pinata-cakes"]) {
      expect(sizesOf(slug), slug).toEqual(["½ kg", "1 kg", "1½ kg"]);
    }
    expect(sizesOf("custom-cakes")).toEqual(["1 kg", "1½ kg", "2 kg", "2½ kg", "3 kg+"]);
  });

  it("gives every tier a unique id within its item and a positive weight", () => {
    for (const item of getCatalog()) {
      const ids = item.weightTiers.map((t) => t.id);
      expect(new Set(ids).size, item.slug).toBe(ids.length);
      for (const tier of item.weightTiers) expect(tier.kg, `${item.slug} ${tier.label}`).toBeGreaterThan(0);
    }
  });

  it("gives every item a description", () => {
    for (const item of getCatalog()) expect(item.description, item.slug).toBeTruthy();
  });

  it("gives every tier a label and a serves count", () => {
    for (const item of getCatalog()) {
      for (const tier of item.weightTiers) {
        expect(tier.label, `${item.slug} ${tier.id}`).toBeTruthy();
        expect(tier.serves, `${item.slug} ${tier.id}`).toBeTruthy();
      }
    }
  });
});

describe("getSiblingItems", () => {
  it("returns every other item in the same category, excluding itself", () => {
    const butterscotch = getItemById(1)!;
    const siblings = getSiblingItems(butterscotch);
    expect(siblings.length).toBeGreaterThan(0);
    expect(siblings.every((s) => s.categoryId === butterscotch.categoryId)).toBe(true);
    expect(siblings.some((s) => s.id === butterscotch.id)).toBe(false);
  });

  it("is empty for a category with only one item", () => {
    const customCakes = getItemById(52)!;
    expect(getSiblingItems(customCakes)).toEqual([]);
  });
});

describe("occasions, flavour tags and most ordered", () => {
  it("every occasion an item lists is a real occasion, and every item lists at least one", () => {
    const ids = new Set(getOccasions().map((o) => o.id));
    for (const item of getCatalog()) {
      expect(item.occasions?.length, item.slug).toBeGreaterThan(0);
      for (const id of item.occasions ?? []) expect(ids.has(id), `${item.slug} -> ${id}`).toBe(true);
    }
  });

  it("every flavour tag id an item lists is a real flavour tag", () => {
    const ids = new Set(getFlavourTags().map((t) => t.id));
    for (const item of getCatalog()) {
      for (const id of item.flavours ?? []) expect(ids.has(id), `${item.slug} -> ${id}`).toBe(true);
    }
  });

  it("every flavour tag has at least one item", () => {
    for (const tag of getFlavourTags()) {
      expect(getCatalog().some((i) => i.flavours?.includes(tag.id)), tag.slug).toBe(true);
    }
  });

  it("returns the most-ordered items in rank order", () => {
    expect(getMostOrdered().map((i) => i.slug)).toEqual([
      "exotic-premium-cakes-nutella-rocher",
      "classic-cakes-butterscotch",
      "exotic-premium-cakes-lotus-biscoff",
      "premium-cakes-dark-chocolate-truffle",
    ]);
    expect(getMostOrdered().map((i) => i.mostOrderedRank)).toEqual([1, 2, 3, 4]);
  });

  it("finds a tile photo from the items themselves", () => {
    expect(getCategoryImage(getCategoryBySlug("classic-cakes")!.id)).toBe("/images/classic-butterscotch.jpg");
    const indianSweets = getFlavourTags().find((t) => t.slug === "indian-sweets")!;
    expect(getFlavourTagImage(indianSweets.id)).toMatch(/^\/images\/indian-/);
  });

  it("Cheesecakes and Flavourful Indian cakes need 24 hours' notice", () => {
    const ids = ["cheesecakes", "indian-cakes"].map((slug) => getCategoryBySlug(slug)!.id);
    for (const item of getCatalog().filter((i) => ids.includes(i.categoryId))) {
      expect(item.leadTimeHours, item.slug).toBe(24);
      expect(readyLabel(item), item.slug).toBe("24 hours notice");
    }
  });

  it("builds the ready text from leadTimeHours", () => {
    expect(readyLabel({ leadTimeHours: 0 })).toBe("Ready in 1 hour");
    expect(readyBadge({ leadTimeHours: 0 })).toBe("1 HOUR");
    expect(readyLabel({ leadTimeHours: 72 })).toBe("72 hours notice");
    expect(readyBadge({ leadTimeHours: 72 })).toBe("72 HOURS");
  });
});

describe("getCategoriesByKind", () => {
  it("splits the categories into everyday, made-to-order and custom, in menu order", () => {
    const ids = (kind: Parameters<typeof getCategoriesByKind>[0]) => getCategoriesByKind(kind).map((c) => c.slug);
    expect(ids("everyday")).toEqual([
      "classic-cakes",
      "premium-cakes",
      "exotic-cakes",
      "exotic-premium-cakes",
      "cheesecakes",
      "indian-cakes",
    ]);
    expect(ids("made-to-order")).toEqual(["pull-me-up-cakes", "hammer-cakes", "pinata-cakes"]);
    expect(ids("custom")).toEqual(["photo-cakes", "custom-cakes"]);
  });

  it("covers every category exactly once", () => {
    const kinds = ["everyday", "made-to-order", "custom"] as const;
    const total = kinds.flatMap((kind) => getCategoriesByKind(kind)).length;
    expect(total).toBe(getCategories().length);
  });
});
