import { describe, expect, it } from "vitest";
import { findCategoryBySlug, findFlavourTag, findFlavourTagBySlug, findOccasionBySlug } from "@/lib/catalog";
import { testCatalog } from "@/test/fixtures";
import {
  CATEGORY_GROUP_KEY,
  describePriceRange,
  formatPriceRange,
  getActiveFilterChips,
  getCategoryFilterGroup,
  getFilterGroups,
  getPriceBounds,
  itemMatchesFilters,
  itemMatchesQuery,
  normalizePriceRange,
  parsePriceRange,
  type MenuFilters,
} from "@/lib/search";

const item = (slug: string) => {
  const found = testCatalog.items.find((i) => i.slug === slug);
  if (!found) throw new Error(`missing test item ${slug}`);
  return found;
};
const categoryIdOf = (slug: string) => findCategoryBySlug(testCatalog, slug)!.id;
const flavourIdOf = (slug: string) => findFlavourTagBySlug(testCatalog, slug)!.id;
const occasionIdOf = (slug: string) => findOccasionBySlug(testCatalog, slug)!.id;

describe("itemMatchesQuery", () => {
  it("matches everything for an empty or blank query", () => {
    expect(testCatalog.items.every((i) => itemMatchesQuery(testCatalog, i, "  "))).toBe(true);
  });

  it("matches by item name, case-insensitively", () => {
    expect(itemMatchesQuery(testCatalog, item("classic-cakes-butterscotch"), "BUTTER")).toBe(true);
    expect(itemMatchesQuery(testCatalog, item("classic-cakes-butterscotch"), "pineapple")).toBe(false);
  });

  it("matches by category name, since flavour items are named just 'Oreo' etc.", () => {
    expect(itemMatchesQuery(testCatalog, item("cheesecakes-oreo"), "cheesecake")).toBe(true);
    expect(itemMatchesQuery(testCatalog, item("classic-cakes-butterscotch"), "cheesecake")).toBe(false);
  });

  it("matches by flavour tag label", () => {
    expect(itemMatchesQuery(testCatalog, item("indian-cakes-gulkand"), "indian sweets")).toBe(true);
    expect(itemMatchesQuery(testCatalog, item("cheesecakes-lotus-biscoff"), "biscoff")).toBe(true);
  });
});

const none: MenuFilters = { query: "", priceRange: null, flavourId: null, occasionId: null };

describe("price range", () => {
  const bounds = getPriceBounds(testCatalog.items);

  it("spans the cheapest to the dearest starting price, in steps of 5", () => {
    expect(bounds).toEqual({ min: 55, max: 190 });
  });

  it("keeps a chosen range inside the bounds and in order", () => {
    expect(normalizePriceRange({ min: 120, max: 60 }, bounds)).toEqual({ min: 60, max: 120 });
    expect(normalizePriceRange({ min: 0, max: 100 }, bounds)).toEqual({ min: 55, max: 100 });
    expect(normalizePriceRange({ min: 100, max: 999 }, bounds)).toEqual({ min: 100, max: 190 });
  });

  it("treats a range covering the whole slider as no filter", () => {
    expect(normalizePriceRange({ min: 55, max: 190 }, bounds)).toBeNull();
    expect(normalizePriceRange({ min: 0, max: 500 }, bounds)).toBeNull();
  });

  it("round-trips through the URL form", () => {
    expect(formatPriceRange({ min: 60, max: 120 })).toBe("60-120");
    expect(parsePriceRange("60-120", bounds)).toEqual({ min: 60, max: 120 });
    expect(parsePriceRange("120-60", bounds)).toEqual({ min: 60, max: 120 });
  });

  it("ignores a malformed or full-width URL range", () => {
    for (const text of ["", "abc", "60", "60-", "-60", "55-190"]) expect(parsePriceRange(text, bounds), text).toBeNull();
  });

  it("describes a range for a chip", () => {
    expect(describePriceRange({ min: 60, max: 120 })).toBe("AED 60 – 120");
  });

  it("filters by starting price, both ends included", () => {
    const range = (min: number, max: number) => ({ ...none, priceRange: { min, max } });
    expect(itemMatchesFilters(testCatalog, item("classic-cakes-butterscotch"), range(55, 55))).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("classic-cakes-butterscotch"), range(60, 100))).toBe(false);
    expect(itemMatchesFilters(testCatalog, item("indian-cakes-gulkand"), range(100, 150))).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("hammer-cakes-heart-shape-hammer-cake"), range(55, 100))).toBe(false);
    expect(itemMatchesFilters(testCatalog, item("hammer-cakes-heart-shape-hammer-cake"), range(150, 190))).toBe(true);
  });

  it("leaves every cake when the range is null", () => {
    expect(testCatalog.items.every((i) => itemMatchesFilters(testCatalog, i, { ...none, priceRange: null }))).toBe(true);
  });
});

describe("itemMatchesFilters", () => {
  it("matches everything with no filters", () => {
    expect(testCatalog.items.every((i) => itemMatchesFilters(testCatalog, i, none))).toBe(true);
  });

  it("filters by flavour tag and by occasion", () => {
    expect(itemMatchesFilters(testCatalog, item("cheesecakes-lotus-biscoff"), { ...none, flavourId: flavourIdOf("biscoff") })).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("classic-cakes-butterscotch"), { ...none, flavourId: flavourIdOf("biscoff") })).toBe(false);
    expect(itemMatchesFilters(testCatalog, item("pinata-cakes-chocolate"), { ...none, occasionId: occasionIdOf("graduation") })).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("pinata-cakes-chocolate"), { ...none, occasionId: occasionIdOf("anniversary") })).toBe(false);
  });

  it("requires every active filter together", () => {
    const filters = { ...none, flavourId: flavourIdOf("biscoff"), priceRange: { min: 55, max: 99 } };
    expect(itemMatchesFilters(testCatalog, item("exotic-premium-cakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("cheesecakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("pull-me-up-cakes-biscoff"), filters)).toBe(false);
  });
});

describe("getFilterGroups", () => {
  it("offers price, flavour and occasion, and marks the current pick", () => {
    const groups = getFilterGroups(testCatalog, { ...none, flavourId: flavourIdOf("biscoff") });
    expect(groups.map((g) => g.key)).toEqual(["priceRange", "flavourId", "occasionId"]);
    const flavour = groups.find((g) => g.key === "flavourId");
    expect(flavour?.kind === "checkbox" && flavour.selected).toEqual([flavourIdOf("biscoff")]);
  });

  it("gives the slider the bounds, the current range and the matching cake count", () => {
    const price = (filters: Parameters<typeof getFilterGroups>[1]) => {
      const group = getFilterGroups(testCatalog, filters).find((g) => g.key === "priceRange");
      if (group?.kind !== "range") throw new Error("no slider");
      return group;
    };
    expect(price(none)).toMatchObject({ bounds: { min: 55, max: 190 }, value: { min: 55, max: 190 }, count: testCatalog.items.length });
    expect(price({ ...none, priceRange: { min: 60, max: 100 } })).toMatchObject({ value: { min: 60, max: 100 } });
    // Biscoff cakes under AED 100: the Lotus Biscoff (85) and the cheesecake (95).
    expect(price({ ...none, flavourId: flavourIdOf("biscoff"), priceRange: { min: 55, max: 99 } }).count).toBe(2);
  });

  it("counts flavour and occasion options inside the chosen price range", () => {
    const groups = getFilterGroups(testCatalog, { ...none, priceRange: { min: 150, max: 190 } });
    const flavour = groups.find((g) => g.key === "flavourId");
    if (flavour?.kind !== "checkbox") throw new Error("no flavour group");
    // Only the AED 180 Pull Me Up cakes are Biscoff and this dear.
    expect(flavour.options.find((o) => o.id === flavourIdOf("biscoff"))?.count).toBe(1);
    expect(flavour.options.find((o) => o.id === flavourIdOf("butterscotch"))?.count).toBe(0);
  });
});

describe("getActiveFilterChips", () => {
  it("has no chips without filters", () => {
    expect(getActiveFilterChips(testCatalog, none)).toEqual([]);
  });

  it("labels each active filter, in price / flavour / occasion order", () => {
    expect(getActiveFilterChips(testCatalog, { query: "x", priceRange: { min: 60, max: 120 }, flavourId: flavourIdOf("biscoff"), occasionId: occasionIdOf("birthday") })).toEqual([
      { key: "priceRange", label: "Price: AED 60 – 120" },
      { key: "flavourId", label: "Flavour: Biscoff" },
      { key: "occasionId", label: "Occasion: Birthday" },
    ]);
  });
});

describe("getCategoryFilterGroup", () => {
  it("lists every category with its cake count and the ticked ones", () => {
    const group = getCategoryFilterGroup(testCatalog, [categoryIdOf("cheesecakes")], none);
    expect(group.key).toBe(CATEGORY_GROUP_KEY);
    expect(group.selected).toEqual([categoryIdOf("cheesecakes")]);
    expect(group.options).toHaveLength(11);
    expect(group.options.find((o) => o.id === categoryIdOf("cheesecakes"))?.count).toBe(5);
    expect(group.options.reduce((sum, o) => sum + o.count, 0)).toBe(testCatalog.items.length);
  });

  it("counts within the other filters, so an option that would be empty shows 0", () => {
    const group = getCategoryFilterGroup(testCatalog, [], { ...none, flavourId: flavourIdOf("biscoff") });
    const counts = Object.fromEntries(group.options.map((o) => [o.id, o.count]));
    expect(counts[categoryIdOf("exotic-premium-cakes")]).toBe(1);
    expect(counts[categoryIdOf("cheesecakes")]).toBe(1);
    expect(counts[categoryIdOf("classic-cakes")]).toBe(0);
  });

  it("doesn't let the ticked categories change the other categories' counts", () => {
    const withTick = getCategoryFilterGroup(testCatalog, [categoryIdOf("classic-cakes")], none);
    const without = getCategoryFilterGroup(testCatalog, [], none);
    expect(withTick.options).toEqual(without.options);
  });
});

describe("category-aware filtering", () => {
  it("only matches cakes in the ticked categories", () => {
    const classic = { ...none, categoryIds: [categoryIdOf("classic-cakes")] };
    expect(itemMatchesFilters(testCatalog, item("classic-cakes-butterscotch"), classic)).toBe(true);
    expect(itemMatchesFilters(testCatalog, item("premium-cakes-strawberry"), classic)).toBe(false);
    const several = { ...none, categoryIds: [categoryIdOf("classic-cakes"), categoryIdOf("hammer-cakes")] };
    expect(itemMatchesFilters(testCatalog, item("hammer-cakes-heart-shape-hammer-cake"), several)).toBe(true);
  });

  it("treats no ticked categories as all of them", () => {
    expect(itemMatchesFilters(testCatalog, item("premium-cakes-strawberry"), { ...none, categoryIds: [] })).toBe(true);
  });

  it("counts the other filters inside the ticked categories", () => {
    // Classic has 3 cakes, so the slider counts 3 — not the whole menu.
    const groups = getFilterGroups(testCatalog, { ...none, categoryIds: [categoryIdOf("classic-cakes")] });
    const price = groups.find((g) => g.key === "priceRange");
    expect(price?.kind === "range" && price.count).toBe(3);
    const flavour = groups.find((g) => g.key === "flavourId");
    if (flavour?.kind !== "checkbox") throw new Error("no flavour group");
    expect(flavour.options.filter((o) => o.count > 0).map((o) => findFlavourTag(testCatalog, o.id)?.slug).sort()).toEqual(["black-forest", "butterscotch"]);
    const occasion = groups.find((g) => g.key === "occasionId");
    if (occasion?.kind !== "checkbox") throw new Error("no occasion group");
    expect(Math.max(...occasion.options.map((o) => o.count))).toBe(3);
  });

  it("adds up across several ticked categories", () => {
    const groups = getFilterGroups(testCatalog, { ...none, categoryIds: [categoryIdOf("classic-cakes"), categoryIdOf("hammer-cakes")] });
    const price = groups.find((g) => g.key === "priceRange");
    expect(price?.kind === "range" && price.count).toBe(4);
  });
});
