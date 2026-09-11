"use client";

import { useState } from "react";
import { getCatalog, getCategories, weightTierKg } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { Footer } from "@/components/Footer";
import type { CatalogItem } from "@/types/catalog";
import styles from "./menu.module.css";

function matches(query: string, item: CatalogItem): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.name.toLowerCase().includes(q)) return true;
  return item.flavours.some((f) => f.label.toLowerCase().includes(q));
}

type Filters = {
  readyToday: boolean;
  oneKgPlus: boolean;
  canCarryMessage: boolean;
};

const FILTER_OPTIONS: { key: keyof Filters; label: string }[] = [
  { key: "readyToday", label: "Ready today" },
  { key: "oneKgPlus", label: "1kg or larger" },
  { key: "canCarryMessage", label: "Can carry a message" },
];

function passesFilters(item: CatalogItem, filters: Filters): boolean {
  if (filters.readyToday && item.leadTimeHours !== 0) return false;
  if (filters.oneKgPlus && !item.weightTiers.some((t) => weightTierKg(t) >= 1))
    return false;
  if (filters.canCarryMessage && item.cakeMessageMaxLength <= 0) return false;
  return true;
}

export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const [query, setQuery] = useState("");
  // Desktop only, see docs/design/CLB-Hi-Fi-Screens.dc.html's "Menu —
  // desktop" screen — a category rail + filter panel with no mobile
  // equivalent (mobile lists every category in one scroll instead), so
  // this state never touches the unchanged mobile render below.
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [filters, setFilters] = useState<Filters>({
    readyToday: false,
    oneKgPlus: false,
    canCarryMessage: false,
  });

  const visibleCatalog = catalog.filter((item) => matches(query, item));
  const hasResults = visibleCatalog.length > 0;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const desktopItems = visibleCatalog.filter(
    (item) =>
      item.categoryId === selectedCategoryId && passesFilters(item, filters),
  );
  const anyFilterActive =
    filters.readyToday || filters.oneKgPlus || filters.canCarryMessage;

  function toggleFilter(key: keyof Filters) {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }

  // Desktop — see docs/design/CLB-Hi-Fi-Screens.dc.html's "Menu — desktop"
  // screen: the search field now sits at the top of the main column
  // (above the category heading), not in the header — the header keeps
  // just the cart icon, same as every other desktop header.
  const desktopSearchBar = (
    <div className={styles.desktopSearchField} data-active={query.length > 0}>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={styles.desktopSearchIcon}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </svg>
      <input
        type="text"
        className={`${styles.desktopSearchInput} no-focus-ring`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cakes…"
      />
      {query && (
        <button
          type="button"
          className={styles.desktopClearButton}
          onClick={() => setQuery("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Mobile keeps the back-link header; desktop gets the shared nav
          header with just the cart icon, same as every other desktop
          header — the search field lives in the main column instead
          (see desktopSearchBar below). */}
      <ResponsiveHeader title="Menu" backHref={ROUTES.home} backLabel="BACK" />

      <div className={styles.body}>
        <div className={styles.mobileOnly}>
          <div className={styles.intro}>
            <p>
              We only take cake orders through the website — for anything else
              (cupcakes, cookies, pastries), message us on WhatsApp directly.
            </p>
          </div>

          <div className={styles.searchRow}>
            <div className={styles.searchField}>
              <input
                type="text"
                className={`${styles.searchInput} no-focus-ring`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {categories.map((category) => {
            const items = visibleCatalog.filter(
              (item) => item.categoryId === category.id,
            );
            if (items.length === 0) return null;
            return (
              <section key={category.id} className={styles.section}>
                <h2
                  className={styles.categoryHeading}
                  style={{
                    borderColor: category.accent,
                    color: category.accent,
                  }}
                >
                  {category.label}
                  <span className={styles.count}>{items.length} ranges</span>
                </h2>
                <div className={styles.grid}>
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {!hasResults && (
          <div className={styles.noResults}>
            <div className={styles.noResultsTitle}>No {query.trim()} — yet</div>
            <p className={styles.noResultsText}>
              We bake to order, so if you want it, ask. We take on custom bakes
              most weeks.
            </p>
            <a
              href={buildWhatsAppUrl()}
              {...EXTERNAL_LINK_PROPS}
              className={styles.askButton}
            >
              ASK US ABOUT {query.trim().toUpperCase()}
            </a>
          </div>
        )}

        {/* Desktop — see docs/design/CLB-Hi-Fi-Screens.dc.html's "Menu —
            desktop" and "Search, no results — desktop" screens: the rail
            stays in place even with no search results, so a search that
            comes up empty doesn't strand the shopper on a bare page —
            only the main column's content swaps to the no-results
            card. */}
        <div className={styles.desktopLayout}>
          <aside className={styles.rail}>
            <div className={`${styles.railLabel} mono-tag`}>CATEGORIES</div>
            <div className={styles.railList}>
              {categories.map((category) => {
                const count = visibleCatalog.filter(
                  (item) => item.categoryId === category.id,
                ).length;
                const selected = category.id === selectedCategoryId;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={styles.railItem}
                    style={
                      selected
                        ? { background: category.accent, color: "#fff" }
                        : undefined
                    }
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <span>{category.label}</span>
                    <span className={styles.railCount}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className={`${styles.railLabel} mono-tag`}>FILTER</div>
            <div className={styles.filterList}>
              {FILTER_OPTIONS.map((option) => (
                <label key={option.key} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters[option.key]}
                    onChange={() => toggleFilter(option.key)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </aside>

          <section className={styles.mainColumn}>
            {desktopSearchBar}

            {hasResults ? (
              <>
                {selectedCategory && (
                  <h2
                    className={styles.desktopCategoryHeading}
                    style={{
                      borderColor: selectedCategory.accent,
                      color: selectedCategory.accent,
                    }}
                  >
                    {selectedCategory.label}
                    <span className={styles.count}>
                      {desktopItems.length} ranges
                    </span>
                  </h2>
                )}
                {desktopItems.length === 0 ? (
                  <p className={styles.desktopEmpty}>
                    Nothing here{anyFilterActive ? " with these filters" : ""} —
                    try{" "}
                    {anyFilterActive ? "clearing a filter" : "another category"}
                    .
                  </p>
                ) : (
                  <div className={styles.desktopGrid}>
                    {desktopItems.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.desktopNoResults}>
                <div className={styles.desktopNoResultsText}>
                  <div className={styles.desktopNoResultsTitle}>
                    No {query.trim()} — yet
                  </div>
                  <p>
                    Nothing in the menu matches that. We bake to order though,
                    so if you want it, ask — we take on custom bakes most weeks.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl()}
                  {...EXTERNAL_LINK_PROPS}
                  className={styles.desktopNoResultsAsk}
                >
                  ASK US ABOUT {query.trim().toUpperCase()}
                </a>
              </div>
            )}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}
