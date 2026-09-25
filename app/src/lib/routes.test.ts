import { describe, expect, it } from "vitest";
import { ROUTES, categoryRoute, itemRoute } from "@/lib/routes";

describe("itemRoute", () => {
  it("nests the item id under the menu route", () => {
    expect(itemRoute("classic-cakes-pineapple")).toBe("/menu/classic-cakes-pineapple");
  });
});

describe("categoryRoute", () => {
  it("points at the menu with the category id as the hash", () => {
    expect(categoryRoute("exotic-premium-cakes")).toBe(`${ROUTES.menu}#exotic-premium-cakes`);
  });
});
