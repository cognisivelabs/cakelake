"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategory, getFlavourTag, getOccasion } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";
import {
  CATEGORY_GROUP_KEY,
  formatPriceRange,
  getActiveFilterChips,
  getCategoryFilterGroup,
  getFilterGroups,
  getPriceBounds,
  normalizePriceRange,
  parsePriceRange,
  type FilterGroup,
  type FilterKey,
  type MenuFilters,
  type PriceRange,
} from "@/lib/search";
import type { MenuUrlParams } from "./UrlParamsSync";

type Selection = {
  categoryIds: string[];
  priceRange: PriceRange | null;
  flavourId: string;
  occasionId: string;
};

const NO_SELECTION: Selection = { categoryIds: [], priceRange: null, flavourId: "", occasionId: "" };

/** How long the slider rests before the URL follows it — the results
 * update as it moves, but the address shouldn't be rewritten per pixel. */
const URL_DEBOUNCE_MS = 250;

/**
 * The menu's search text and its filters: Price (a range slider), Flavour
 * and Occasion (one choice each) and — on desktop — Category (any number
 * ticked). The choices live in the URL too (?category= ?price= ?flavour=
 * ?occasion=), so a filtered menu can be linked to and the back button
 * undoes a change; the search text is local, unless a link brings a ?q=.
 *
 * `values` is what filters the *items* (search, price, flavour,
 * occasion). Categories are kept apart: desktop narrows to the ticked
 * ones, while mobile lists every category and uses ?category= only to
 * jump to a section.
 */
export function useMenuFilters() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>(NO_SELECTION);
  const urlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (urlTimer.current) clearTimeout(urlTimer.current);
    },
    [],
  );

  const values: MenuFilters = {
    query,
    priceRange: selection.priceRange,
    flavourId: selection.flavourId,
    occasionId: selection.occasionId,
  };
  // Desktop also narrows to the ticked categories, so its filter counts
  // are for the cakes inside them ("Under AED 100" can't say 33 when only
  // Classic is ticked). Mobile lists every category and uses `values`.
  const desktopValues: MenuFilters = { ...values, categoryIds: selection.categoryIds };

  /** Takes the filters from the URL — unknown ids are ignored. */
  function applyParams(params: MenuUrlParams) {
    // Only a ?q= replaces what's typed — a link without one (a category
    // link, a filter change) shouldn't wipe the shopper's own search.
    if (params.q) setQuery(params.q);
    setSelection((current) => ({
      categoryIds: params.category.split(",").filter((id) => getCategory(id)),
      // The slider is mid-drag while a URL update is pending, and this
      // echo would be stale — keep what's on screen.
      priceRange: urlTimer.current ? current.priceRange : parsePriceRange(params.price),
      flavourId: getFlavourTag(params.flavour) ? params.flavour : "",
      occasionId: getOccasion(params.occasion) ? params.occasion : "",
    }));
  }

  function syncUrl(next: Selection) {
    const params = new URLSearchParams();
    if (next.categoryIds.length > 0) params.set("category", next.categoryIds.join(","));
    if (next.priceRange) params.set("price", formatPriceRange(next.priceRange));
    if (next.flavourId) params.set("flavour", next.flavourId);
    if (next.occasionId) params.set("occasion", next.occasionId);
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.menu}?${qs}` : ROUTES.menu, { scroll: false });
  }

  function commit(next: Selection) {
    if (urlTimer.current) {
      clearTimeout(urlTimer.current);
      urlTimer.current = null;
    }
    setSelection(next);
    syncUrl(next);
  }

  /** The slider moved (or was reset to full width, which clears it). */
  function setPriceRange(range: PriceRange) {
    const next = { ...selection, priceRange: normalizePriceRange(range, getPriceBounds()) };
    setSelection(next);
    if (urlTimer.current) clearTimeout(urlTimer.current);
    urlTimer.current = setTimeout(() => {
      urlTimer.current = null;
      syncUrl(next);
    }, URL_DEBOUNCE_MS);
  }

  /** Clears one filter (a chip's ×). */
  function clear(key: FilterKey) {
    commit({ ...selection, [key]: NO_SELECTION[key] });
  }

  /** A checkbox was toggled: categories add or drop, the others replace. */
  function toggle(key: Exclude<FilterGroup["key"], "priceRange">, optionId: string) {
    if (key === CATEGORY_GROUP_KEY) {
      const ticked = selection.categoryIds.includes(optionId);
      commit({
        ...selection,
        categoryIds: ticked
          ? selection.categoryIds.filter((id) => id !== optionId)
          : [...selection.categoryIds, optionId],
      });
    } else {
      commit({ ...selection, [key]: selection[key] === optionId ? "" : optionId });
    }
  }

  return {
    values,
    categoryIds: selection.categoryIds,
    setQuery,
    setPriceRange,
    clear,
    toggle,
    applyParams,
    groups: getFilterGroups(values),
    desktopGroups: getFilterGroups(desktopValues),
    categoryGroup: getCategoryFilterGroup(selection.categoryIds, values),
    chips: getActiveFilterChips(values),
    anyFilterActive: Boolean(selection.priceRange || selection.flavourId || selection.occasionId),
  };
}

export type MenuFilterState = ReturnType<typeof useMenuFilters>;
