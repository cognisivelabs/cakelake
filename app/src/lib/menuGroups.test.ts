import { describe, expect, it } from "vitest";
import { getCategories } from "@/lib/catalog";
import { getMenuGroups } from "@/lib/menuGroups";
import { categoryPriceLabel } from "@/lib/pricing";
import { getCatalog } from "@/lib/catalog";

describe("getMenuGroups", () => {
  it("lists every category exactly once", () => {
    const listed = getMenuGroups().flatMap((g) => g.entries.map((e) => e.category.id));
    expect([...listed].sort()).toEqual(getCategories().map((c) => c.id).sort());
  });

  it("puts same-day ranges in the 1-hour group and the rest on 24 hours", () => {
    const groups = Object.fromEntries(
      getMenuGroups().map((g) => [g.id, g.entries.map((e) => e.category.id)]),
    );
    expect(groups["ready-1h"]).toEqual([
      "classic-cakes",
      "premium-cakes",
      "exotic-cakes",
      "exotic-premium-cakes",
    ]);
    expect(groups["notice-24h"]).toEqual([
      "cheesecakes",
      "indian-cakes",
      "pull-me-up-cakes",
      "hammer-cakes",
      "pinata-cakes",
    ]);
    expect(groups.custom).toEqual(["photo-cakes", "3d-cakes"]);
  });
});

describe("categoryPriceLabel", () => {
  const items = (categoryId: string) => getCatalog().filter((i) => i.categoryId === categoryId);
  it("says 'from N' for ranges sold by the cake", () => {
    expect(categoryPriceLabel(items("classic-cakes"))).toBe("from 55");
    expect(categoryPriceLabel(items("cheesecakes"))).toBe("from 95");
  });
  it("says 'N/kg' when the smallest size is a whole kilo", () => {
    expect(categoryPriceLabel(items("pull-me-up-cakes"))).toBe("180/kg");
    expect(categoryPriceLabel(items("photo-cakes"))).toBe("170/kg");
    expect(categoryPriceLabel(items("3d-cakes"))).toBe("190/kg");
  });
});
