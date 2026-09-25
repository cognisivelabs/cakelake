"use client";

import { ItemCard } from "@/components/ItemCard";
import type { CatalogItem, Category } from "@/types/catalog";
import { ActiveFilters } from "./ActiveFilters";
import { FilterPanel } from "./FilterPanel";
import { NoResults } from "./NoResults";
import { SearchField } from "./SearchField";
import type { MenuFilterState } from "./useMenuFilters";
import styles from "./menu.module.css";

// Desktop shows one category at a time, picked from a rail (with the
// filters beneath it), and the search box above the results — see docs
// CLB Hi-Fi Screens' "Menu — desktop". The rail stays in place even when
// a search matches nothing, so an empty search doesn't strand the
// shopper on a bare page; only the main column swaps to the no-results card.
export function DesktopMenu({
  filters,
  categories,
  visibleCatalog,
  selectedCategoryId,
  onSelectCategory,
}: {
  filters: MenuFilterState;
  categories: Category[];
  visibleCatalog: CatalogItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}) {
  const counts = new Map(
    categories.map((c) => [c.id, visibleCatalog.filter((item) => item.categoryId === c.id).length]),
  );

  // A search or filter can leave the picked category empty while others
  // match — show the first category that has results instead of a bare
  // "nothing here", and let the rail counts point the shopper at the rest.
  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId && (counts.get(c.id) ?? 0) > 0) ??
    categories.find((c) => (counts.get(c.id) ?? 0) > 0) ??
    categories.find((c) => c.id === selectedCategoryId);
  const items = visibleCatalog.filter((item) => item.categoryId === activeCategory?.id);

  return (
    <div className={styles.desktopLayout}>
      <aside className={styles.rail}>
        <div className={`${styles.railLabel} mono-tag`}>CATEGORIES</div>
        <div className={styles.railList}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={styles.railItem}
              style={category.id === activeCategory?.id ? { background: category.accent, color: "#fff" } : undefined}
              onClick={() => onSelectCategory(category.id)}
            >
              <span>{category.label}</span>
              <span className={styles.railCount}>{counts.get(category.id)}</span>
            </button>
          ))}
        </div>

        <FilterPanel groups={filters.groups} onChange={filters.setFilter} />
      </aside>

      <section className={styles.mainColumn}>
        <SearchField variant="desktop" value={filters.values.query} onChange={filters.setQuery} />
        <ActiveFilters chips={filters.chips} onRemove={(key) => filters.setFilter(key, "")} />

        {visibleCatalog.length === 0 ? (
          <NoResults variant="desktop" query={filters.values.query} />
        ) : (
          <>
            {activeCategory && (
              <h2
                className={styles.desktopCategoryHeading}
                style={{ borderColor: activeCategory.accent, color: activeCategory.accent }}
              >
                {activeCategory.label}
                <span className={styles.count}>{items.length} ranges</span>
              </h2>
            )}
            {items.length === 0 ? (
              <p className={styles.desktopEmpty}>
                Nothing here{filters.anyFilterActive ? " with these filters" : ""} — try{" "}
                {filters.anyFilterActive ? "clearing a filter" : "another category"}.
              </p>
            ) : (
              <div className={styles.desktopGrid}>
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
