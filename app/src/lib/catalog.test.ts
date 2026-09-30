import { describe, expect, it } from "vitest";
import {
  categoriesByKind,
  categoryImage,
  categoryShortLabel,
  findCategory,
  findCategoryBySlug,
  flavourTagImage,
  mostOrderedItems,
  readyBadge,
  readyLabel,
  siblingItems,
} from "@/lib/catalog";
import { testCatalog } from "@/test/fixtures";

describe("catalogue data", () => {
  it("returns a non-empty catalogue and category list", () => {
    expect(testCatalog.items.length).toBeGreaterThan(0);
    expect(testCatalog.categories.length).toBeGreaterThan(0);
  });

  it("every item references a category that actually exists", () => {
    const categoryIds = new Set(testCatalog.categories.map((c) => c.id));
    for (const item of testCatalog.items) {
      expect(categoryIds.has(item.categoryId)).toBe(true);
    }
  });

  it("every item has at least one weight tier", () => {
    for (const item of testCatalog.items) {
      expect(item.weightTiers.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate item ids or slugs", () => {
    const ids = testCatalog.items.map((item) => item.id);
    const slugs = testCatalog.items.map((item) => item.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has no duplicate category ids or slugs", () => {
    const ids = testCatalog.categories.map((c) => c.id);
    const slugs = testCatalog.categories.map((c) => c.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("findCategory / findCategoryBySlug", () => {
  it("finds a category by id", () => {
    const [first] = testCatalog.categories;
    expect(findCategory(testCatalog, first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(findCategory(testCatalog, 9999)).toBeUndefined();
  });

  it("finds a category by slug", () => {
    expect(findCategoryBySlug(testCatalog, "cheesecakes")?.label).toBe("Cheesecakes");
    expect(findCategoryBySlug(testCatalog, "does-not-exist")).toBeUndefined();
  });
});


describe("weight tiers", () => {
  const sizesOf = (slug: string) =>
    testCatalog.items.find((i) => i.categoryId === findCategoryBySlug(testCatalog, slug)?.id)!.weightTiers.map((t) => t.label);

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
    for (const item of testCatalog.items) {
      const ids = item.weightTiers.map((t) => t.id);
      expect(new Set(ids).size, item.slug).toBe(ids.length);
      for (const tier of item.weightTiers) expect(tier.kg, `${item.slug} ${tier.label}`).toBeGreaterThan(0);
    }
  });

  it("gives every item a description", () => {
    for (const item of testCatalog.items) expect(item.description, item.slug).toBeTruthy();
  });

  it("gives every tier a label and a serves count", () => {
    for (const item of testCatalog.items) {
      for (const tier of item.weightTiers) {
        expect(tier.label, `${item.slug} ${tier.id}`).toBeTruthy();
        expect(tier.serves, `${item.slug} ${tier.id}`).toBeTruthy();
      }
    }
  });
});

describe("getSiblingItems", () => {
  it("returns every other item in the same category, excluding itself", () => {
    const butterscotch = testCatalog.items.find((i) => i.slug === "classic-cakes-butterscotch")!;
    const siblings = siblingItems(testCatalog, butterscotch);
    expect(siblings.length).toBeGreaterThan(0);
    expect(siblings.every((s) => s.categoryId === butterscotch.categoryId)).toBe(true);
    expect(siblings.some((s) => s.id === butterscotch.id)).toBe(false);
  });

  it("is empty for a category with only one item", () => {
    const customCakes = testCatalog.items.find((i) => i.slug === "custom-cakes")!;
    expect(siblingItems(testCatalog, customCakes)).toEqual([]);
  });
});

describe("occasions, flavour tags and most ordered", () => {
  it("every occasion an item lists is a real occasion, and every item lists at least one", () => {
    const ids = new Set(testCatalog.occasions.map((o) => o.id));
    for (const item of testCatalog.items) {
      expect(item.occasions?.length, item.slug).toBeGreaterThan(0);
      for (const id of item.occasions ?? []) expect(ids.has(id), `${item.slug} -> ${id}`).toBe(true);
    }
  });

  it("every flavour tag id an item lists is a real flavour tag", () => {
    const ids = new Set(testCatalog.flavourTags.map((t) => t.id));
    for (const item of testCatalog.items) {
      for (const id of item.flavours ?? []) expect(ids.has(id), `${item.slug} -> ${id}`).toBe(true);
    }
  });

  it("every flavour tag has at least one item", () => {
    for (const tag of testCatalog.flavourTags) {
      expect(testCatalog.items.some((i) => i.flavours?.includes(tag.id)), tag.slug).toBe(true);
    }
  });

  it("returns the most-ordered items in rank order", () => {
    expect(mostOrderedItems(testCatalog).map((i) => i.slug)).toEqual([
      "exotic-premium-cakes-nutella-rocher",
      "classic-cakes-butterscotch",
      "exotic-premium-cakes-lotus-biscoff",
      "premium-cakes-dark-chocolate-truffle",
    ]);
    expect(mostOrderedItems(testCatalog).map((i) => i.mostOrderedRank)).toEqual([1, 2, 3, 4]);
  });

  it("finds a tile photo from the items themselves", () => {
    expect(categoryImage(testCatalog, findCategoryBySlug(testCatalog, "classic-cakes")!.id)).toBe("/images/classic-butterscotch.jpg");
    const indianSweets = testCatalog.flavourTags.find((t) => t.slug === "indian-sweets")!;
    expect(flavourTagImage(testCatalog, indianSweets.id)).toMatch(/^\/images\/indian-/);
  });

  it("Cheesecakes and Flavourful Indian cakes need 24 hours' notice", () => {
    const ids = ["cheesecakes", "indian-cakes"].map((slug) => findCategoryBySlug(testCatalog, slug)!.id);
    for (const item of testCatalog.items.filter((i) => ids.includes(i.categoryId))) {
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

describe("categoryShortLabel", () => {
  const label = (slug: string) => categoryShortLabel(findCategoryBySlug(testCatalog, slug)!);

  it("strips the ' Cakes' suffix", () => {
    expect(label("classic-cakes")).toBe("Classic");
    expect(label("custom-cakes")).toBe("Custom");
    expect(label("photo-cakes")).toBe("Photo");
  });

  it("strips a leading 'Flavourful ' as well as the suffix", () => {
    expect(label("indian-cakes")).toBe("Indian");
  });

  it("leaves a label with neither the prefix nor the suffix unchanged", () => {
    expect(label("cheesecakes")).toBe("Cheesecakes");
  });
});

describe("getCategoriesByKind", () => {
  it("splits the categories into everyday, made-to-order and custom, in menu order", () => {
    const ids = (kind: Parameters<typeof categoriesByKind>[1]) => categoriesByKind(testCatalog, kind).map((c) => c.slug);
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
    const total = kinds.flatMap((kind) => categoriesByKind(testCatalog, kind)).length;
    expect(total).toBe(testCatalog.categories.length);
  });
});
