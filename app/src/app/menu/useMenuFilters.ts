"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFlavourTag, getOccasion } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";
import {
  getActiveFilterChips,
  getFilterGroups,
  getPriceBand,
  type FilterKey,
  type MenuFilters,
} from "@/lib/search";
import type { MenuUrlParams } from "./UrlParamsSync";

/**
 * The menu's search text and its Price / Flavour / Occasion filters.
 * The three filters live in the URL too (?price= ?flavour= ?occasion=),
 * so a filtered menu can be linked to and the back button undoes a
 * change; the search text is local, unless a link brings a ?q=.
 */
export function useMenuFilters() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [priceBandId, setPriceBandId] = useState("");
  const [flavourId, setFlavourId] = useState("");
  const [occasionId, setOccasionId] = useState("");

  const values: MenuFilters = { query, priceBandId, flavourId, occasionId };

  /** Takes the filters from the URL — unknown ids are ignored. */
  function applyParams(params: MenuUrlParams) {
    // Only a ?q= replaces what's typed — a link without one (a category
    // link, a filter change) shouldn't wipe the shopper's own search.
    if (params.q) setQuery(params.q);
    setPriceBandId(getPriceBand(params.price) ? params.price : "");
    setFlavourId(getFlavourTag(params.flavour) ? params.flavour : "");
    setOccasionId(getOccasion(params.occasion) ? params.occasion : "");
  }

  function setFilter(key: FilterKey, value: string) {
    const next = { priceBandId, flavourId, occasionId, [key]: value };
    setPriceBandId(next.priceBandId);
    setFlavourId(next.flavourId);
    setOccasionId(next.occasionId);
    const params = new URLSearchParams();
    if (next.priceBandId) params.set("price", next.priceBandId);
    if (next.flavourId) params.set("flavour", next.flavourId);
    if (next.occasionId) params.set("occasion", next.occasionId);
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.menu}?${qs}` : ROUTES.menu, { scroll: false });
  }

  return {
    values,
    setQuery,
    setFilter,
    applyParams,
    groups: getFilterGroups(values),
    chips: getActiveFilterChips(values),
    anyFilterActive: Boolean(priceBandId || flavourId || occasionId),
  };
}

export type MenuFilterState = ReturnType<typeof useMenuFilters>;
