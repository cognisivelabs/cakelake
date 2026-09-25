"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCategory, getFlavourTag, getOccasion } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";
import {
  CATEGORY_GROUP_KEY,
  getActiveFilterChips,
  getCategoryFilterGroup,
  getFilterGroups,
  getPriceBand,
  type FilterGroup,
  type FilterKey,
  type MenuFilters,
} from "@/lib/search";
import type { MenuUrlParams } from "./UrlParamsSync";

type Selection = { categoryIds: string[]; priceBandId: string; flavourId: string; occasionId: string };

/**
 * The menu's search text and its filters: Price, Flavour and Occasion (one
 * choice each) and — on desktop — Category (any number ticked). The
 * choices live in the URL too (?category= ?price= ?flavour= ?occasion=),
 * so a filtered menu can be linked to and the back button undoes a
 * change; the search text is local, unless a link brings a ?q=.
 *
 * `values` is what filters the *items* (search, price, flavour,
 * occasion). Categories are kept apart: desktop narrows to the ticked
 * ones, while mobile lists every category and uses ?category= only to
 * jump to a section.
 */
export function useMenuFilters() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({
    categoryIds: [],
    priceBandId: "",
    flavourId: "",
    occasionId: "",
  });

  const values: MenuFilters = {
    query,
    priceBandId: selection.priceBandId,
    flavourId: selection.flavourId,
    occasionId: selection.occasionId,
  };

  /** Takes the filters from the URL — unknown ids are ignored. */
  function applyParams(params: MenuUrlParams) {
    // Only a ?q= replaces what's typed — a link without one (a category
    // link, a filter change) shouldn't wipe the shopper's own search.
    if (params.q) setQuery(params.q);
    setSelection({
      categoryIds: params.category.split(",").filter((id) => getCategory(id)),
      priceBandId: getPriceBand(params.price) ? params.price : "",
      flavourId: getFlavourTag(params.flavour) ? params.flavour : "",
      occasionId: getOccasion(params.occasion) ? params.occasion : "",
    });
  }

  function commit(next: Selection) {
    setSelection(next);
    const params = new URLSearchParams();
    if (next.categoryIds.length > 0) params.set("category", next.categoryIds.join(","));
    if (next.priceBandId) params.set("price", next.priceBandId);
    if (next.flavourId) params.set("flavour", next.flavourId);
    if (next.occasionId) params.set("occasion", next.occasionId);
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.menu}?${qs}` : ROUTES.menu, { scroll: false });
  }

  /** Sets (or, with "", clears) one of the single-choice filters. */
  function setFilter(key: FilterKey, value: string) {
    commit({ ...selection, [key]: value });
  }

  /** A checkbox was toggled: categories add or drop, the others replace. */
  function toggle(key: FilterGroup["key"], optionId: string) {
    if (key === CATEGORY_GROUP_KEY) {
      const ticked = selection.categoryIds.includes(optionId);
      commit({
        ...selection,
        categoryIds: ticked
          ? selection.categoryIds.filter((id) => id !== optionId)
          : [...selection.categoryIds, optionId],
      });
    } else {
      setFilter(key, selection[key] === optionId ? "" : optionId);
    }
  }

  return {
    values,
    categoryIds: selection.categoryIds,
    setQuery,
    setFilter,
    toggle,
    applyParams,
    groups: getFilterGroups(values),
    categoryGroup: getCategoryFilterGroup(selection.categoryIds, values),
    chips: getActiveFilterChips(values),
    anyFilterActive: Boolean(selection.priceBandId || selection.flavourId || selection.occasionId),
  };
}

export type MenuFilterState = ReturnType<typeof useMenuFilters>;
