import { describe, expect, it } from "vitest";
import { getCatalog, getItemById } from "@/lib/catalog";
import {
  PRICE_BANDS,
  CATEGORY_GROUP_KEY,
  getActiveFilterChips,
  getCategoryFilterGroup,
  getFilterGroups,
  getPriceBand,
  itemMatchesFilters,
  itemMatchesQuery,
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

const none = { query: "", priceBandId: "", flavourId: "", occasionId: "" };

describe("PRICE_BANDS", () => {
  it("put every priced item in exactly one band", () => {
    for (const item of getCatalog()) {
      const hits = PRICE_BANDS.filter((band) => itemMatchesFilters(item, { ...none, priceBandId: band.id }));
      expect(hits.length, item.id).toBe(1);
    }
  });

  it("judges an item by its starting price", () => {
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), { ...none, priceBandId: "under-100" })).toBe(true);
    expect(itemMatchesFilters(item("indian-cakes-gulkand"), { ...none, priceBandId: "100-150" })).toBe(true);
    expect(itemMatchesFilters(item("hammer-cakes-heart-shape-hammer-cake"), { ...none, priceBandId: "over-150" })).toBe(true);
    expect(itemMatchesFilters(item("hammer-cakes-heart-shape-hammer-cake"), { ...none, priceBandId: "under-100" })).toBe(false);
  });

  it("ignores an unknown band id rather than hiding everything", () => {
    expect(getPriceBand("nope")).toBeUndefined();
    expect(itemMatchesFilters(item("classic-cakes-butterscotch"), { ...none, priceBandId: "nope" })).toBe(true);
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
    const filters = { ...none, flavourId: "biscoff", priceBandId: "under-100" };
    expect(itemMatchesFilters(item("exotic-premium-cakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(item("cheesecakes-lotus-biscoff"), filters)).toBe(true);
    expect(itemMatchesFilters(item("pull-me-up-cakes-biscoff"), filters)).toBe(false);
  });
});

describe("getFilterGroups", () => {
  it("offers price, flavour and occasion, and marks the current pick", () => {
    const groups = getFilterGroups({ ...none, flavourId: "biscoff" });
    expect(groups.map((g) => g.key)).toEqual(["priceBandId", "flavourId", "occasionId"]);
    expect(groups.find((g) => g.key === "flavourId")?.selected).toEqual(["biscoff"]);
    expect(groups.find((g) => g.key === "priceBandId")?.selected).toEqual([]);
  });

  it("counts each option against every other filter, not its own group's", () => {
    const groups = getFilterGroups({ ...none, flavourId: "biscoff" });
    const flavour = groups.find((g) => g.key === "flavourId")!;
    // Other flavours stay countable while one is picked (the group is single-choice).
    expect(flavour.options.find((o) => o.id === "red-velvet")?.count).toBe(2);
    // Price is narrowed to Biscoff cakes: two under AED 100, one over 150.
    const price = groups.find((g) => g.key === "priceBandId")!;
    expect(price.options.map((o) => o.count)).toEqual([2, 0, 1]);
  });

  it("splits the whole menu across the price bands when nothing is picked", () => {
    const price = getFilterGroups(none).find((g) => g.key === "priceBandId")!;
    expect(price.options.reduce((sum, o) => sum + o.count, 0)).toBe(getCatalog().length);
  });
});

describe("getActiveFilterChips", () => {
  it("has no chips without filters", () => {
    expect(getActiveFilterChips(none)).toEqual([]);
  });

  it("labels each active filter, in price / flavour / occasion order", () => {
    expect(getActiveFilterChips({ query: "x", priceBandId: "under-100", flavourId: "biscoff", occasionId: "birthday" })).toEqual([
      { key: "priceBandId", label: "Price: Under AED 100" },
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
