"use client";

import { useState } from "react";
import Link from "next/link";
import { getCatalog, getCategories, weightTierKg } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";
import { useCart } from "@/context/CartContext";
import { orderTotal, lineTotal, formatAed } from "@/lib/pricing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { PageHeader } from "@/components/PageHeader";
import { Header } from "@/components/Header";
import { orderItemCount, resolveOrderLines, describeLine } from "@/lib/order";
import type { CatalogItem } from "@/types/catalog";
import styles from "./menu.module.css";

function matches(query: string, item: CatalogItem): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.name.toLowerCase().includes(q)) return true;
  return item.flavours.some((f) => f.label.toLowerCase().includes(q));
}

type Filters = { readyToday: boolean; oneKgPlus: boolean; canCarryMessage: boolean };

const FILTER_OPTIONS: { key: keyof Filters; label: string }[] = [
  { key: "readyToday", label: "Ready today" },
  { key: "oneKgPlus", label: "1kg or larger" },
  { key: "canCarryMessage", label: "Can carry a message" },
];

function passesFilters(item: CatalogItem, filters: Filters): boolean {
  if (filters.readyToday && item.leadTimeHours !== 0) return false;
  if (filters.oneKgPlus && !item.weightTiers.some((t) => weightTierKg(t) >= 1)) return false;
  if (filters.canCarryMessage && item.cakeMessageMaxLength <= 0) return false;
  return true;
}

export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const { order } = useCart();
  const [query, setQuery] = useState("");
  // Desktop only, see docs/design/CLB-Hi-Fi-Screens.dc.html's "Menu —
  // desktop" screen — a category rail + filter panel with no mobile
  // equivalent (mobile lists every category in one scroll instead), so
  // this state never touches the unchanged mobile render below.
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? "");
  const [filters, setFilters] = useState<Filters>({
    readyToday: false,
    oneKgPlus: false,
    canCarryMessage: false,
  });

  const itemCount = orderItemCount(order);
  const total = orderTotal(order, catalog);
  const resolvedLines = resolveOrderLines(order, catalog);

  const visibleCatalog = catalog.filter((item) => matches(query, item));
  const hasResults = visibleCatalog.length > 0;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const desktopItems = visibleCatalog.filter(
    (item) => item.categoryId === selectedCategoryId && passesFilters(item, filters)
  );
  const anyFilterActive = filters.readyToday || filters.oneKgPlus || filters.canCarryMessage;

  function toggleFilter(key: keyof Filters) {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }

  const searchField = (
    <div className={`${styles.desktopSearchField} ${query ? styles.desktopSearchFieldActive : ""}`}>
      <input
        type="text"
        className={styles.desktopSearchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items…"
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
          header with a search field where Home's WhatsApp/cart actions
          normally sit — the persistent order panel below already covers
          the cart on this screen. */}
      <div className={styles.mobileHeaderWrap}>
        <PageHeader title="Menu" backHref={ROUTES.home} backLabel="BACK" />
      </div>
      <div className={styles.desktopHeaderWrap}>
        <Header desktopRight={searchField} />
      </div>

      <div className={styles.body}>
        <div className={styles.mobileOnly}>
          <div className={styles.intro}>
            <p>
              We only take cake orders through the website — for anything else
              (cupcakes, cookies, pastries), message us on WhatsApp directly.
            </p>
          </div>

          <div className={styles.searchRow}>
            <div className={`${styles.searchField} ${query ? styles.searchFieldActive : ""}`}>
              <input
                type="text"
                className={styles.searchInput}
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
            const items = visibleCatalog.filter((item) => item.categoryId === category.id);
            if (items.length === 0) return null;
            return (
              <section key={category.id} className={styles.section}>
                <h2
                  className={styles.categoryHeading}
                  style={{ borderColor: category.accent, color: category.accent }}
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

          {itemCount > 0 && (
            <Link href={ROUTES.cart} className={styles.cartBar}>
              <span className={styles.cartBarInfo}>
                <span className={styles.cartBarCount}>
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </span>
                <span className={styles.cartBarTotal}>{formatAed(total)}</span>
              </span>
              <span className={styles.viewCartButton}>VIEW CART</span>
            </Link>
          )}
        </div>

        {!hasResults && (
          <div className={styles.noResults}>
            <div className={styles.noResultsTitle}>No {query.trim()} — yet</div>
            <p className={styles.noResultsText}>
              We bake to order, so if you want it, ask. We take on custom bakes
              most weeks.
            </p>
            <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.askButton}>
              ASK US ABOUT {query.trim().toUpperCase()}
            </a>
          </div>
        )}

        {hasResults && (
          <div className={styles.desktopLayout}>
            <aside className={styles.rail}>
              <div className={`${styles.railLabel} mono-tag`}>CATEGORIES</div>
              <div className={styles.railList}>
                {categories.map((category) => {
                  const count = visibleCatalog.filter((item) => item.categoryId === category.id).length;
                  const selected = category.id === selectedCategoryId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      className={styles.railItem}
                      style={selected ? { background: category.accent, color: "#fff" } : undefined}
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
              {selectedCategory && (
                <h2
                  className={styles.desktopCategoryHeading}
                  style={{ borderColor: selectedCategory.accent, color: selectedCategory.accent }}
                >
                  {selectedCategory.label}
                  <span className={styles.count}>{desktopItems.length} ranges</span>
                </h2>
              )}
              {desktopItems.length === 0 ? (
                <p className={styles.desktopEmpty}>
                  Nothing here{anyFilterActive ? " with these filters" : ""} — try{" "}
                  {anyFilterActive ? "clearing a filter" : "another category"}.
                </p>
              ) : (
                <div className={styles.desktopGrid}>
                  {desktopItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>

            <aside className={styles.cartColumn}>
              <div className={styles.cartPanel}>
                <div className={styles.cartPanelHeader}>
                  <span className={styles.cartPanelTitle}>Your order</span>
                  <span className={styles.cartPanelCount}>
                    {resolvedLines.length === 0
                      ? "EMPTY"
                      : `${itemCount} item${itemCount === 1 ? "" : "s"}`}
                  </span>
                </div>

                <div className={styles.cartPanelBody}>
                {resolvedLines.length === 0 ? (
                  <div className={styles.cartPanelEmpty}>
                    <p className={styles.cartPanelEmptyTitle}>Nothing added yet</p>
                    <p className={styles.cartPanelEmptyText}>
                      Open a range to pick flavour, size and any message on the
                      cake. Everything you add lands here.
                    </p>
                    <div className={styles.cartPanelStepsLabel}>HOW ORDERING WORKS</div>
                    <ol className={styles.cartPanelSteps}>
                      <li>
                        <span className={styles.cartPanelStepNum}>1</span>
                        <span>Add your cakes and pick pickup or delivery.</span>
                      </li>
                      <li>
                        <span className={styles.cartPanelStepNum}>2</span>
                        <span>
                          Send the order to us on WhatsApp — one tap, message
                          already written.
                        </span>
                      </li>
                      <li>
                        <span className={styles.cartPanelStepNum}>3</span>
                        <span>
                          We confirm price and time in the chat. Nothing is
                          charged in the app.
                        </span>
                      </li>
                    </ol>
                    <p className={styles.cartPanelNote}>
                      Cakes are baked to order — most need 1 hour, custom
                      cakes need 24 hours&apos; notice.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className={styles.cartPanelLines}>
                      {resolvedLines.map(({ item, line }) => {
                        const lt = lineTotal(item, line);
                        return (
                          <div key={line.lineId} className={styles.cartPanelLine}>
                            <div className={styles.cartPanelPhoto} />
                            <div className={styles.cartPanelInfo}>
                              <div className={styles.cartPanelName}>{describeLine(item, line)}</div>
                              {line.cakeMessage && (
                                <div className={styles.cartPanelDetail}>&ldquo;{line.cakeMessage}&rdquo;</div>
                              )}
                              <div className={styles.cartPanelFooter}>
                                <span>{lt === undefined ? "Price to confirm" : formatAed(lt)}</span>
                                <span className={styles.cartPanelQty}>Qty {line.quantity}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className={styles.cartPanelNote}>
                      Delivery time runs on top of any lead time and is
                      confirmed in chat.
                    </p>
                    <div className={styles.cartPanelTotalRow}>
                      <span>Total</span>
                      <span>{formatAed(total)}</span>
                    </div>
                    <Link href={ROUTES.cart} className={styles.reviewOrderButton}>
                      REVIEW ORDER
                    </Link>
                  </>
                )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
