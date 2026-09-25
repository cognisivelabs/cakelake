"use client";

import { Suspense, useState } from "react";
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

// The menu: mobile is one long scroll of every category, desktop shows one
// category at a time. Both are driven by the same search and filters, and
// by the URL (?q= ?price= ?flavour= ?occasion= ?category=), so links from
// Home, the header menus and item pages land on the right view.
export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const filters = useMenuFilters();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? "");

  const visibleCatalog = catalog.filter((item) => itemMatchesFilters(item, filters.values));
  const visibleCategoryIds = categories
    .filter((c) => visibleCatalog.some((item) => item.categoryId === c.id))
    .map((c) => c.id);
  const spy = useScrollSpy(visibleCategoryIds);

  function applyUrlParams(params: MenuUrlParams) {
    filters.applyParams(params);
    if (categories.some((c) => c.id === params.category)) {
      // Desktop shows one category at a time; mobile is one long scroll,
      // so jump to that category's section.
      setSelectedCategoryId(params.category);
      document.getElementById(params.category)?.scrollIntoView({ behavior: "instant" });
    }
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
        <DesktopMenu
          filters={filters}
          categories={categories}
          visibleCatalog={visibleCatalog}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <Footer />
      </div>
    </div>
  );
}
