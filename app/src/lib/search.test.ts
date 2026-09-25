import { describe, expect, it } from "vitest";
import { getCatalog, getItemById } from "@/lib/catalog";
import { itemMatchesQuery } from "@/lib/search";

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
