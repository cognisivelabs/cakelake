"use client";

import { ItemCard } from "@/components/ItemCard";
import { categoryShortLabel } from "@/lib/catalog";
import type { CatalogItem, Category } from "@/types/catalog";
import { ActiveFilters } from "./ActiveFilters";
import { FilterPanel } from "./FilterPanel";
import { SearchField } from "./SearchField";
import type { MenuFilterState } from "./useMenuFilters";
import type { useScrollSpy } from "./useScrollSpy";
import styles from "./menu.module.css";

// Mobile lists every category in one long scroll — see docs CLB Menu
// Recategorised's "1a": a sticky rail of chips jumps between sections
// (it isn't a filter — that's the Filters block above it) and highlights
// the section in view.
export function MobileMenu({
  filters,
  categories,
  visibleCatalog,
  spy,
}: {
  filters: MenuFilterState;
  categories: Category[];
  visibleCatalog: CatalogItem[];
  spy: ReturnType<typeof useScrollSpy>;
}) {
  // Only categories with something to jump to right now get a chip or a
  // section — the same "skip if empty" rule for both.
  const sections = categories
    .map((category) => ({ category, items: visibleCatalog.filter((item) => item.categoryId === category.id) }))
    .filter(({ items }) => items.length > 0);

  return (
    <div className={styles.mobileOnly}>
      <div className={styles.intro}>
        <p>
          We only take cake orders through the website — for anything else (cupcakes, cookies, pastries),
          message us on WhatsApp directly.
        </p>
      </div>

      <SearchField variant="mobile" value={filters.values.query} onChange={filters.setQuery} />

      <details className={styles.mobileFilters}>
        <summary>Filters{filters.chips.length > 0 ? ` (${filters.chips.length})` : ""}</summary>
        <FilterPanel groups={filters.groups} onToggle={filters.toggle} onPriceChange={filters.setPriceRange} />
      </details>
      <ActiveFilters chips={filters.chips} onRemove={filters.clear} />

      {sections.length > 0 && (
        <div className={styles.railChips}>
          <div className={styles.railChipsScroll}>
            {sections.map(({ category }) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                ref={spy.chipRef(category.id)}
                className={styles.railChip}
                style={
                  category.id === spy.activeId
                    ? { background: category.accent, borderColor: category.accent, color: "#fff" }
                    : undefined
                }
              >
                {categoryShortLabel(category)}
              </a>
            ))}
          </div>
          <p className={styles.railChipsHint}>← {sections.length} categories, scrolls sideways</p>
        </div>
      )}

      {sections.map(({ category, items }) => (
        <section key={category.id} id={category.id} ref={spy.sectionRef(category.id)} className={styles.section}>
          <h2 className={styles.categoryHeading} style={{ borderColor: category.accent, color: category.accent }}>
            {category.label}
            <span className={styles.count}>{items.length} ranges</span>
          </h2>
          <div className={styles.grid}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
