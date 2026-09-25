"use client";

import { ItemCard } from "@/components/ItemCard";
import type { CatalogItem, Category } from "@/types/catalog";
import { ActiveFilters } from "./ActiveFilters";
import { FilterPanel } from "./FilterPanel";
import { NoResults } from "./NoResults";
import { SearchField } from "./SearchField";
import type { MenuFilterState } from "./useMenuFilters";
import styles from "./menu.module.css";

// Desktop: a filter panel on the left — Category checkboxes (tick as many
// as you like; none means all), then Price, Flavour and Occasion — and the
// matching cakes on the right, grouped under their category. See docs CLB
// Hi-Fi Screens' "Menu — desktop". The panel stays in place even when a
// search matches nothing, so an empty search doesn't strand the shopper on
// a bare page; only the main column swaps to the no-results card.
export function DesktopMenu({
  filters,
  categories,
  visibleCatalog,
}: {
  filters: MenuFilterState;
  categories: Category[];
  visibleCatalog: CatalogItem[];
}) {
  const ticked = filters.categoryIds;
  const sections = categories
    .filter((category) => ticked.length === 0 || ticked.includes(category.id))
    .map((category) => ({ category, items: visibleCatalog.filter((item) => item.categoryId === category.id) }))
    .filter(({ items }) => items.length > 0);

  return (
    <div className={styles.desktopLayout}>
      <aside className={styles.rail}>
        <FilterPanel
          groups={[filters.categoryGroup, ...filters.desktopGroups]}
          onToggle={filters.toggle}
          onPriceChange={filters.setPriceRange}
        />
      </aside>

      <section className={styles.mainColumn}>
        <SearchField variant="desktop" value={filters.values.query} onChange={filters.setQuery} />
        <ActiveFilters chips={filters.chips} onRemove={filters.clear} />

        {visibleCatalog.length === 0 ? (
          <NoResults variant="desktop" query={filters.values.query} />
        ) : sections.length === 0 ? (
          <p className={styles.desktopEmpty}>
            Nothing in {ticked.length === 1 ? "that category" : "those categories"} matches
            {filters.anyFilterActive ? " these filters" : ""} — try ticking another category.
          </p>
        ) : (
          sections.map(({ category, items }) => (
            <div key={category.id} className={styles.desktopSection}>
              <h2
                className={styles.desktopCategoryHeading}
                style={{ borderColor: category.accent, color: category.accent }}
              >
                {category.label}
                <span className={styles.count}>{items.length} ranges</span>
              </h2>
              <div className={styles.desktopGrid}>
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
