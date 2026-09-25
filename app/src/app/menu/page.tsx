"use client";

import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { getCatalog, getCategories } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";
import { itemMatchesFilters } from "@/lib/search";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { NoResults } from "./NoResults";
import { UrlParamsSync, type MenuUrlParams } from "./UrlParamsSync";
import { useMenuFilters } from "./useMenuFilters";
import { useScrollSpy } from "./useScrollSpy";
import styles from "./menu.module.css";

// The menu: mobile is one long scroll of every category; desktop lists the
// categories you tick (all, if none). Both are driven by the same search
// and filters, and by the URL (?q= ?price= ?flavour= ?occasion=
// ?category=), so links from Home, the header menus and item pages land
// on the right view.
export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const filters = useMenuFilters();

  const visibleCatalog = catalog.filter((item) => itemMatchesFilters(item, filters.values));
  const visibleCategoryIds = categories
    .filter((c) => visibleCatalog.some((item) => item.categoryId === c.id))
    .map((c) => c.id);
  const spy = useScrollSpy(visibleCategoryIds);

  function applyUrlParams(params: MenuUrlParams) {
    filters.applyParams(params);
    // Desktop ticks the category as a filter; mobile is one long scroll,
    // so jump to the (first) category's section.
    const first = params.category.split(",").find((id) => categories.some((c) => c.id === id));
    if (first) document.getElementById(first)?.scrollIntoView({ behavior: "instant" });
  }

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <UrlParamsSync onParams={applyUrlParams} />
      </Suspense>
      {/* Mobile keeps the back-link header; desktop gets the shared nav
          header — its search field lives in the main column instead. */}
      <ResponsiveHeader title="Menu" backHref={ROUTES.home} backLabel="BACK" />

      <div className={styles.body}>
        <MobileMenu filters={filters} categories={categories} visibleCatalog={visibleCatalog} spy={spy} />
        {visibleCatalog.length === 0 && <NoResults variant="mobile" query={filters.values.query} />}
        <DesktopMenu filters={filters} categories={categories} visibleCatalog={visibleCatalog} />
        <Footer />
      </div>
    </div>
  );
}
