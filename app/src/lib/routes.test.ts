import { describe, expect, it } from "vitest";
import { ROUTES, categoryRoute, flavourRoute, itemRoute, occasionRoute, searchRoute } from "@/lib/routes";

describe("itemRoute", () => {
  it("nests the item id under the menu route", () => {
    expect(itemRoute("classic-cakes-pineapple")).toBe("/menu/classic-cakes-pineapple");
  });
});

describe("categoryRoute", () => {
  it("points at the menu with the category id as a search param", () => {
    expect(categoryRoute("exotic-premium-cakes")).toBe(`${ROUTES.menu}?category=exotic-premium-cakes`);
  });
});

describe("flavourRoute / occasionRoute / searchRoute", () => {
  it("build menu URLs with the matching search param", () => {
    expect(flavourRoute("biscoff")).toBe("/menu?flavour=biscoff");
    expect(occasionRoute("new-baby")).toBe("/menu?occasion=new-baby");
    expect(searchRoute("red velvet")).toBe("/menu?q=red%20velvet");
  });
});
