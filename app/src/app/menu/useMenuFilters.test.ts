import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useMenuFilters } from "@/app/menu/useMenuFilters";
import { CatalogProvider } from "@/context/CatalogContext";
import { testCatalog } from "@/test/fixtures";
import { findCategoryBySlug, findFlavourTag } from "@/lib/catalog";
import { getPriceBounds } from "@/lib/search";
import type { MenuUrlParams } from "@/app/menu/UrlParamsSync";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const NO_PARAMS: MenuUrlParams = { q: "", flavour: "", occasion: "", price: "", category: "" };

const BOUNDS = getPriceBounds(testCatalog.items);
const CLASSIC = findCategoryBySlug(testCatalog, "classic-cakes")!;
const PREMIUM = findCategoryBySlug(testCatalog, "premium-cakes")!;

let container: HTMLDivElement;
let root: Root;
let state: ReturnType<typeof useMenuFilters>;

function Probe() {
  state = useMenuFilters();
  return null;
}

function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(createElement(CatalogProvider, { catalog: testCatalog }, createElement(Probe)));
  });
}

function unmount() {
  act(() => root.unmount());
  container.remove();
}

/** Lets the real searchItems() Promise (a microtask, unaffected by fake
 * timers) settle and its .then() re-render land. */
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("useMenuFilters", () => {
  beforeEach(() => {
    replace.mockClear();
    mount();
  });

  afterEach(() => {
    unmount();
  });

  it("starts with no filters active and every item as the initial results", async () => {
    expect(state.values).toEqual({ query: "", priceRange: null, flavourId: null, occasionId: null });
    expect(state.categoryIds).toEqual([]);
    expect(state.anyFilterActive).toBe(false);
    expect(state.results).toEqual(testCatalog.items);
    await flush();
  });

  it("setQuery updates values.query and narrows results, without touching the URL", async () => {
    act(() => {
      state.setQuery("butterscotch");
    });
    expect(state.values.query).toBe("butterscotch");
    await flush();
    expect(state.results.length).toBeGreaterThan(0);
    expect(state.results.every((item) => item.name.toLowerCase().includes("butterscotch"))).toBe(true);
    expect(replace).not.toHaveBeenCalled();
  });

  it("toggle adds and removes category ids without replacing the others", async () => {
    act(() => {
      state.toggle("categoryIds", CLASSIC.id);
    });
    expect(state.categoryIds).toEqual([CLASSIC.id]);

    act(() => {
      state.toggle("categoryIds", PREMIUM.id);
    });
    expect(state.categoryIds).toEqual([CLASSIC.id, PREMIUM.id]);

    act(() => {
      state.toggle("categoryIds", CLASSIC.id);
    });
    expect(state.categoryIds).toEqual([PREMIUM.id]);

    expect(replace).toHaveBeenLastCalledWith(
      `/menu?category=${PREMIUM.slug}`,
      { scroll: false },
    );
    await flush();
  });

  it("toggle on a single-choice filter (flavourId) replaces, and toggling the same id again clears it", async () => {
    const flavour = testCatalog.flavourTags[0];
    act(() => {
      state.toggle("flavourId", flavour.id);
    });
    expect(state.values.flavourId).toBe(flavour.id);
    expect(state.anyFilterActive).toBe(true);
    expect(replace).toHaveBeenLastCalledWith(`/menu?flavour=${flavour.slug}`, { scroll: false });

    act(() => {
      state.toggle("flavourId", flavour.id);
    });
    expect(state.values.flavourId).toBeNull();
    expect(state.anyFilterActive).toBe(false);
    expect(replace).toHaveBeenLastCalledWith("/menu", { scroll: false });
    await flush();
  });

  it("clear(key) resets just that one filter and updates the URL", async () => {
    const occasion = testCatalog.occasions[0];
    act(() => {
      state.toggle("occasionId", occasion.id);
      state.toggle("flavourId", testCatalog.flavourTags[0].id);
    });
    act(() => {
      state.clear("occasionId");
    });
    expect(state.values.occasionId).toBeNull();
    expect(state.values.flavourId).toBe(testCatalog.flavourTags[0].id);
    await flush();
  });

  it("chips list an entry per active filter, in the order price/flavour/occasion", async () => {
    const flavour = testCatalog.flavourTags[0];
    act(() => {
      state.toggle("flavourId", flavour.id);
    });
    expect(state.chips).toEqual([{ key: "flavourId", label: `Flavour: ${flavour.label}` }]);
    await flush();
  });

  it("setPriceRange updates values immediately but debounces the URL sync", async () => {
    vi.useFakeTimers();
    try {
      const range = { min: BOUNDS.min, max: Math.floor((BOUNDS.min + BOUNDS.max) / 2) };
      act(() => {
        state.setPriceRange(range);
      });
      // Immediate: the slider and result count already reflect it.
      expect(state.values.priceRange).toEqual(range);
      expect(replace).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(249);
      });
      expect(replace).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(replace).toHaveBeenCalledWith(
        `/menu?price=${range.min}-${range.max}`,
        { scroll: false },
      );
    } finally {
      vi.useRealTimers();
    }
    await flush();
  });

  it("setPriceRange back to the full bounds clears the filter (drops the price param)", async () => {
    vi.useFakeTimers();
    try {
      act(() => {
        state.setPriceRange({ min: BOUNDS.min, max: BOUNDS.max });
        vi.advanceTimersByTime(250);
      });
      expect(state.values.priceRange).toBeNull();
      expect(replace).toHaveBeenCalledWith("/menu", { scroll: false });
    } finally {
      vi.useRealTimers();
    }
    await flush();
  });

  it("a second setPriceRange call before the debounce fires resets the timer (only the final value syncs)", async () => {
    vi.useFakeTimers();
    try {
      const mid = Math.floor((BOUNDS.min + BOUNDS.max) / 2);
      act(() => {
        state.setPriceRange({ min: BOUNDS.min, max: mid });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      act(() => {
        state.setPriceRange({ min: BOUNDS.min, max: mid - 5 });
        vi.advanceTimersByTime(200);
      });
      expect(replace).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(replace).toHaveBeenCalledOnce();
      expect(replace).toHaveBeenCalledWith(`/menu?price=${BOUNDS.min}-${mid - 5}`, { scroll: false });
    } finally {
      vi.useRealTimers();
    }
    await flush();
  });

  it("applyParams reads category slugs, price and flavour/occasion slugs from the URL", async () => {
    const flavour = testCatalog.flavourTags[0];
    const occasion = testCatalog.occasions[0];
    act(() => {
      state.applyParams({
        q: "cake",
        category: `${CLASSIC.slug},${PREMIUM.slug}`,
        price: `${BOUNDS.min}-${BOUNDS.max}`,
        flavour: flavour.slug,
        occasion: occasion.slug,
      });
    });
    expect(state.values.query).toBe("cake");
    expect(state.categoryIds).toEqual([CLASSIC.id, PREMIUM.id]);
    // Full-bounds price range normalizes to "no filter" — see setPriceRange test above.
    expect(state.values.priceRange).toBeNull();
    expect(state.values.flavourId).toBe(flavour.id);
    expect(state.values.occasionId).toBe(occasion.id);
    await flush();
  });

  it("applyParams ignores an unknown slug instead of throwing", async () => {
    act(() => {
      state.applyParams({ ...NO_PARAMS, category: "not-a-real-category", flavour: "not-a-real-flavour" });
    });
    expect(state.categoryIds).toEqual([]);
    expect(state.values.flavourId).toBeNull();
    await flush();
  });

  it("applyParams without a q leaves an already-typed search query alone", async () => {
    act(() => {
      state.setQuery("butterscotch");
    });
    act(() => {
      state.applyParams(NO_PARAMS);
    });
    expect(state.values.query).toBe("butterscotch");
    await flush();
  });

  it("applyParams keeps the on-screen price range while the slider is mid-drag, instead of echoing a stale URL", async () => {
    vi.useFakeTimers();
    try {
      const mid = Math.floor((BOUNDS.min + BOUNDS.max) / 2);
      act(() => {
        // Starts the debounce timer without letting it fire yet.
        state.setPriceRange({ min: BOUNDS.min, max: mid });
      });
      act(() => {
        // A soft-navigation echo of the *previous* URL landing mid-drag.
        state.applyParams({ ...NO_PARAMS, price: `${BOUNDS.min}-${BOUNDS.max}` });
      });
      expect(state.values.priceRange).toEqual({ min: BOUNDS.min, max: mid });
    } finally {
      vi.useRealTimers();
    }
    await flush();
  });

  it("desktopGroups narrows counts to the ticked categories; groups (mobile) does not", async () => {
    act(() => {
      state.toggle("categoryIds", CLASSIC.id);
    });
    const desktopPrice = state.desktopGroups.find((g) => g.key === "priceRange")!;
    const mobilePrice = state.groups.find((g) => g.key === "priceRange")!;
    const classicCount = testCatalog.items.filter((i) => i.categoryId === CLASSIC.id).length;
    expect(desktopPrice.count).toBe(classicCount);
    expect(mobilePrice.count).toBe(testCatalog.items.length);
    await flush();
  });

  it("categoryGroup lists every category with how many items match the other active filters", async () => {
    const flavour = findFlavourTag(testCatalog, testCatalog.items.find((i) => i.flavours?.length)!.flavours![0])!;
    act(() => {
      state.toggle("flavourId", flavour.id);
    });
    const group = state.categoryGroup;
    expect(group.options.length).toBe(testCatalog.categories.length);
    const total = group.options.reduce((sum, o) => sum + o.count, 0);
    const expectedTotal = testCatalog.items.filter((i) => i.flavours?.includes(flavour.id)).length;
    expect(total).toBe(expectedTotal);
    await flush();
  });
});
