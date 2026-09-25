"use client";

import { useEffect, useRef, useState } from "react";
import { getCatalog, getCategories, weightTierKg } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { Footer } from "@/components/Footer";
import type { CatalogItem } from "@/types/catalog";
import styles from "./menu.module.css";

// Sep 2026 recategorisation: flavour is the item now, so matching the
// item's own name already covers what used to be a separate "search
// each flavour inside this group" check.
function matches(query: string, item: CatalogItem): boolean {
  const q = query.trim().toLowerCase();
  return !q || item.name.toLowerCase().includes(q);
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
  // Item detail's category breadcrumb links to /menu#<categoryId> — pre-
  // select that category here (desktop) once mounted; mobile just
  // scrolls to the matching section anchor natively. Read in an effect,
  // not initial state, since the server render has no hash to match.
  useEffect(() => {
    function selectFromHash() {
      const id = window.location.hash.slice(1);
      if (categories.some((c) => c.id === id)) setSelectedCategoryId(id);
    }
    selectFromHash();
    // The prerendered anchor jump doesn't reliably survive hydration on
    // mobile's long scroll — redo it once now that the sections exist
    // (a no-op on desktop, where the mobile sections are display: none).
    document
      .getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ behavior: "instant" });
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
    // categories is a module-level constant (getCategories()), so this
    // only needs to run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filters, setFilters] = useState<Filters>({
    readyToday: false,
    oneKgPlus: false,
    canCarryMessage: false,
  });

  const visibleCatalog = catalog.filter((item) => matches(query, item));
  const hasResults = visibleCatalog.length > 0;
  // Mobile's sticky category rail (below) only lists categories that
  // actually have something to jump to right now — same "skip if empty"
  // rule the category sections themselves already use.
  const visibleCategories = categories.filter((category) =>
    visibleCatalog.some((item) => item.categoryId === category.id),
  );
  const visibleCategoryIds = visibleCategories.map((c) => c.id).join(",");

  // Mobile only — see docs/design/CLB Menu Recategorised.dc.html's "1a"
  // (chosen): a sticky horizontal chip rail for quick-jump navigation
  // within the one long scroll (not a filter — that's desktop's rail,
  // above). Tracks which section is currently in view so the matching
  // chip highlights, the same way a scroll-spy nav does.
  const [activeCategoryId, setActiveCategoryId] = useState(
    visibleCategories[0]?.id ?? "",
  );
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const chipRefs = useRef(new Map<string, HTMLAnchorElement>());

  // Keeps the highlighted chip inside the horizontally-scrolling strip —
  // otherwise a category several screens down highlights a chip that's
  // scrolled off to the right, out of view in its own row.
  useEffect(() => {
    chipRefs.current.get(activeCategoryId)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategoryId]);

  // One scroll listener, one straightforward rule — a position scan,
  // not IntersectionObserver's shrunk-viewport zone test. That approach
  // (tried first) used a second, independent listener just to patch the
  // case where a short last category could never scroll far enough to
  // register as "intersecting" its own trigger zone — but a second
  // listener races the first: whichever one's callback happens to run
  // last on a given scroll event wins, so the patch could get silently
  // overwritten right back to the wrong value. A single source of truth
  // avoids that entirely, and turns out simpler regardless: the current
  // category is just whichever section's heading has scrolled the
  // furthest up past the trigger line without going past it entirely.
  useEffect(() => {
    const TRIGGER_LINE = 110; // px from viewport top, just under the sticky rail

    function updateActiveCategory() {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const last = visibleCategories[visibleCategories.length - 1];
      if (atBottom && last) {
        setActiveCategoryId(last.id);
        return;
      }

      let bestId: string | undefined;
      let bestTop = -Infinity;
      sectionRefs.current.forEach((el, id) => {
        const top = el.getBoundingClientRect().top;
        if (top <= TRIGGER_LINE && top > bestTop) {
          bestTop = top;
          bestId = id;
        }
      });
      // Above the very first section (e.g. right at page top) — nothing
      // has crossed the trigger line yet, so default to the first one.
      setActiveCategoryId(bestId ?? visibleCategories[0]?.id ?? "");
    }

    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    updateActiveCategory();
    return () => window.removeEventListener("scroll", updateActiveCategory);
    // visibleCategoryIds is a stable stand-in for visibleCategories'
    // contents (same array, joined into one string) — re-running this
    // per that string's actual changes, not the array's reference
    // identity, avoids tearing the scroll listener down and rebuilding
    // it on every render for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCategoryIds]);

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

          {hasResults && (
            <div className={styles.railChips}>
              <div className={styles.railChipsScroll}>
                {visibleCategories.map((category) => {
                  const active = category.id === activeCategoryId;
                  return (
                    <a
                      key={category.id}
                      href={`#${category.id}`}
                      ref={(el) => {
                        if (el) chipRefs.current.set(category.id, el);
                        else chipRefs.current.delete(category.id);
                      }}
                      className={styles.railChip}
                      style={
                        active
                          ? { background: category.accent, borderColor: category.accent, color: "#fff" }
                          : undefined
                      }
                    >
                      {category.label.replace(/ Cakes$/, "")}
                    </a>
                  );
                })}
              </div>
              <p className={styles.railChipsHint}>
                ← {visibleCategories.length} categories, scrolls sideways
              </p>
            </div>
          )}

          {categories.map((category) => {
            const items = visibleCatalog.filter(
              (item) => item.categoryId === category.id,
            );
            if (items.length === 0) return null;
            return (
              <section
                key={category.id}
                id={category.id}
                ref={(el) => {
                  if (el) sectionRefs.current.set(category.id, el);
                  else sectionRefs.current.delete(category.id);
                }}
                className={styles.section}
              >
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
