import { describe, expect, it } from "vitest";
import {
  fetchCatalog,
  fetchCategories,
  fetchFlavourTags,
  fetchItem,
  fetchItems,
  fetchOccasions,
  searchItems,
} from "@/api/catalog";
import { fetchBanners } from "@/api/banners";

describe("internal catalogue API", () => {
  it("returns each list", async () => {
    expect((await fetchCategories()).length).toBe(11);
    expect((await fetchItems()).length).toBe(52);
    expect((await fetchOccasions()).length).toBeGreaterThan(0);
    expect((await fetchFlavourTags()).length).toBeGreaterThan(0);
  });

  it("returns the whole catalogue from the same lists", async () => {
    expect(await fetchCatalog()).toEqual({
      categories: await fetchCategories(),
      items: await fetchItems(),
      occasions: await fetchOccasions(),
      flavourTags: await fetchFlavourTags(),
    });
  });

  it("finds an item by slug", async () => {
    expect((await fetchItem("classic-cakes-black-forest"))?.name).toBe("Black Forest");
    expect((await fetchItem("custom-cakes"))?.name).toBe("Custom Cakes");
    expect(await fetchItem("does-not-exist")).toBeUndefined();
  });
});

describe("searchItems", () => {
  const none = { query: "", priceRange: null, flavourId: null, occasionId: null };
  const slugs = async (filters: Parameters<typeof searchItems>[0]) => (await searchItems(filters)).map((i) => i.slug);

  it("returns every item, in menu order, with no filters", async () => {
    expect(await slugs(none)).toEqual((await fetchItems()).map((i) => i.slug));
  });

  it("matches the search text against item, category and flavour tag names", async () => {
    expect(await slugs({ ...none, query: "black forest" })).toEqual(["classic-cakes-black-forest"]);
    expect((await searchItems({ ...none, query: "cheesecake" })).length).toBe(5);
    expect((await searchItems({ ...none, query: "indian sweets" })).length).toBe(5);
  });

  it("applies the filters together", async () => {
    const biscoff = (await fetchFlavourTags()).find((t) => t.slug === "biscoff")!.id;
    expect(await slugs({ ...none, flavourId: biscoff, priceRange: { min: 55, max: 99 } })).toEqual([
      "exotic-premium-cakes-lotus-biscoff",
      "cheesecakes-lotus-biscoff",
    ]);
  });

  it("returns nothing when nothing matches", async () => {
    expect(await searchItems({ ...none, query: "no such cake" })).toEqual([]);
  });
});

describe("internal banner API", () => {
  it("returns the hero banners", async () => {
    expect((await fetchBanners()).length).toBeGreaterThan(0);
  });
});
