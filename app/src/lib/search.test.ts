import { describe, expect, it } from "vitest";
import { getCatalog, getItemById } from "@/lib/catalog";
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
} from "@/lib/search";

const item = (id: string) => {
  const found = getItemById(id);
  if (!found) throw new Error(`missing test item ${id}`);
  return found;
};

describe("itemMatchesQuery", () => {
  it("matches everything for an empty or blank query", () => {
    expect(getCatalog().every((i) => itemMatchesQuery(i, "  "))).toBe(true);
  });

  it("matches by item name, case-insensitively", () => {
    expect(itemMatchesQuery(item("classic-cakes-butterscotch"), "BUTTER")).toBe(true);
    expect(itemMatchesQuery(item("classic-cakes-butterscotch"), "pineapple")).toBe(false);
  });

  it("matches by category name, since flavour items are named just 'Oreo' etc.", () => {
    expect(itemMatchesQuery(item("cheesecakes-oreo"), "cheesecake")).toBe(true);
    expect(itemMatchesQuery(item("classic-cakes-butterscotch"), "cheesecake")).toBe(false);
  });

  it("matches by flavour tag label", () => {
    expect(itemMatchesQuery(item("indian-cakes-gulkand"), "indian sweets")).toBe(true);
    expect(itemMatchesQuery(item("cheesecakes-lotus-biscoff"), "biscoff")).toBe(true);
  });
});

const none = { query: "", priceRange: null, flavourId: "", occasionId: "" };

describe("price range", () => {
  const bounds = getPriceBounds();

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
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), range(55, 55))).toBe(true);
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), range(60, 100))).toBe(false);
    expect(itemMatchesFilters(item("indian-cakes-gulkand"), range(100, 150))).toBe(true);
    expect(itemMatchesFilters(item("hammer-cakes-heart-shape-hammer-cake"), range(55, 100))).toBe(false);
    expect(itemMatchesFilters(item("hammer-cakes-heart-shape-hammer-cake"), range(150, 190))).toBe(true);
  });

  it("leaves every cake when the range is null", () => {
    expect(getCatalog().every((i) => itemMatchesFilters(i, { ...none, priceRange: null }))).toBe(true);
  });
});

describe("itemMatchesFilters", () => {
  it("matches everything with no filters", () => {
    expect(getCatalog().every((i) => itemMatchesFilters(i, none))).toBe(true);
  });

  it("filters by flavour tag and by occasion", () => {
    expect(itemMatchesFilters(item("cheesecakes-lotus-biscoff"), { ...none, flavourId: "biscoff" })).toBe(true);
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), { ...none, flavourId: "biscoff" })).toBe(false);
    expect(itemMatchesFilters(item("pinata-cakes-chocolate"), { ...none, occasionId: "graduation" })).toBe(true);
    expect(itemMatchesFilters(item("pinata-cakes-chocolate"), { ...none, occasionId: "anniversary" })).toBe(false);
  });

  it("requires every active filter together", () => {
    const filters = { ...none, flavourId: "biscoff", priceRange: { min: 55, max: 99 } };
    expect(itemMatchesFilters(item("exotic-premium-cakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(item("cheesecakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(item("pull-me-up-cakes-biscoff"), filters)).toBe(false);
  });
});

describe("getFilterGroups", () => {
  it("offers price, flavour and occasion, and marks the current pick", () => {
    const groups = getFilterGroups({ ...none, flavourId: "biscoff" });
    expect(groups.map((g) => g.key)).toEqual(["priceRange", "flavourId", "occasionId"]);
    const flavour = groups.find((g) => g.key === "flavourId");
    expect(flavour?.kind === "checkbox" && flavour.selected).toEqual(["biscoff"]);
  });

  it("gives the slider the bounds, the current range and the matching cake count", () => {
    const price = (filters: Parameters<typeof getFilterGroups>[0]) => {
      const group = getFilterGroups(filters).find((g) => g.key === "priceRange");
      if (group?.kind !== "range") throw new Error("no slider");
      return group;
    };
    expect(price(none)).toMatchObject({ bounds: { min: 55, max: 190 }, value: { min: 55, max: 190 }, count: getCatalog().length });
    expect(price({ ...none, priceRange: { min: 60, max: 100 } })).toMatchObject({ value: { min: 60, max: 100 } });
    // Biscoff cakes under AED 100: the Lotus Biscoff (85) and the cheesecake (95).
    expect(price({ ...none, flavourId: "biscoff", priceRange: { min: 55, max: 99 } }).count).toBe(2);
  });

  it("counts flavour and occasion options inside the chosen price range", () => {
    const groups = getFilterGroups({ ...none, priceRange: { min: 150, max: 190 } });
    const flavour = groups.find((g) => g.key === "flavourId");
    if (flavour?.kind !== "checkbox") throw new Error("no flavour group");
    // Only the AED 180 Pull Me Up cakes are Biscoff and this dear.
    expect(flavour.options.find((o) => o.id === "biscoff")?.count).toBe(1);
    expect(flavour.options.find((o) => o.id === "butterscotch")?.count).toBe(0);
  });
});

describe("getActiveFilterChips", () => {
  it("has no chips without filters", () => {
    expect(getActiveFilterChips(none)).toEqual([]);
  });

  it("labels each active filter, in price / flavour / occasion order", () => {
    expect(getActiveFilterChips({ query: "x", priceRange: { min: 60, max: 120 }, flavourId: "biscoff", occasionId: "birthday" })).toEqual([
      { key: "priceRange", label: "Price: AED 60 – 120" },
      { key: "flavourId", label: "Flavour: Biscoff" },
      { key: "occasionId", label: "Occasion: Birthday" },
    ]);
  });
});

describe("getCategoryFilterGroup", () => {
  it("lists every category with its cake count and the ticked ones", () => {
    const group = getCategoryFilterGroup(["cheesecakes"], none);
    expect(group.key).toBe(CATEGORY_GROUP_KEY);
    expect(group.selected).toEqual(["cheesecakes"]);
    expect(group.options).toHaveLength(11);
    expect(group.options.find((o) => o.id === "cheesecakes")?.count).toBe(5);
    expect(group.options.reduce((sum, o) => sum + o.count, 0)).toBe(getCatalog().length);
  });

  it("counts within the other filters, so an option that would be empty shows 0", () => {
    const group = getCategoryFilterGroup([], { ...none, flavourId: "biscoff" });
    const counts = Object.fromEntries(group.options.map((o) => [o.id, o.count]));
    expect(counts["exotic-premium-cakes"]).toBe(1);
    expect(counts["cheesecakes"]).toBe(1);
    expect(counts["classic-cakes"]).toBe(0);
  });

  it("doesn't let the ticked categories change the other categories' counts", () => {
    const withTick = getCategoryFilterGroup(["classic-cakes"], none);
    const without = getCategoryFilterGroup([], none);
    expect(withTick.options).toEqual(without.options);
  });
});

describe("category-aware filtering", () => {
  it("only matches cakes in the ticked categories", () => {
    const classic = { ...none, categoryIds: ["classic-cakes"] };
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), classic)).toBe(true);
    expect(itemMatchesFilters(item("premium-cakes-strawberry"), classic)).toBe(false);
    const several = { ...none, categoryIds: ["classic-cakes", "hammer-cakes"] };
    expect(itemMatchesFilters(item("hammer-cakes-heart-shape-hammer-cake"), several)).toBe(true);
  });

  it("treats no ticked categories as all of them", () => {
    expect(itemMatchesFilters(item("premium-cakes-strawberry"), { ...none, categoryIds: [] })).toBe(true);
  });

  it("counts the other filters inside the ticked categories", () => {
    // Classic has 3 cakes, so the slider counts 3 — not the whole menu.
    const groups = getFilterGroups({ ...none, categoryIds: ["classic-cakes"] });
    const price = groups.find((g) => g.key === "priceRange");
    expect(price?.kind === "range" && price.count).toBe(3);
    const flavour = groups.find((g) => g.key === "flavourId");
    if (flavour?.kind !== "checkbox") throw new Error("no flavour group");
    expect(flavour.options.filter((o) => o.count > 0).map((o) => o.id).sort()).toEqual(["black-forest", "butterscotch"]);
    const occasion = groups.find((g) => g.key === "occasionId");
    if (occasion?.kind !== "checkbox") throw new Error("no occasion group");
    expect(Math.max(...occasion.options.map((o) => o.count))).toBe(3);
  });

  it("adds up across several ticked categories", () => {
    const groups = getFilterGroups({ ...none, categoryIds: ["classic-cakes", "hammer-cakes"] });
    const price = groups.find((g) => g.key === "priceRange");
    expect(price?.kind === "range" && price.count).toBe(4);
  });
});
