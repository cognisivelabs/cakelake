"use client";

import { useState } from "react";
import Link from "next/link";
import { getCatalog, getCategories } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";
import { useCart } from "@/context/CartContext";
import { orderTotal, formatAed } from "@/lib/pricing";
import { CONFIG } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import styles from "./menu.module.css";

function matches(query: string, item: ReturnType<typeof getCatalog>[number]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.name.toLowerCase().includes(q)) return true;
  return item.flavours.some((f) => f.label.toLowerCase().includes(q));
}

export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const { order } = useCart();
  const [query, setQuery] = useState("");

  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);
  const total = orderTotal(order, catalog);

  const visibleCatalog = catalog.filter((item) => matches(query, item));
  const hasResults = visibleCatalog.length > 0;

  return (
    <div className={styles.page}>
      <PageHeader title="Menu" backHref="/" backLabel="BACK" />

      <div className={styles.body}>
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

        {!hasResults && (
          <div className={styles.noResults}>
            <div className={styles.noResultsTitle}>No {query.trim()} — yet</div>
            <p className={styles.noResultsText}>
              We bake to order, so if you want it, ask. We take on custom bakes
              most weeks.
            </p>
            <a
              href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.askButton}
            >
              ASK US ABOUT {query.trim().toUpperCase()}
            </a>
          </div>
        )}

        {categories.map((category) => {
          const items = visibleCatalog.filter((item) => item.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <section key={category.id} className={styles.section}>
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
          );
        })}

        {itemCount > 0 && (
          <Link href="/cart" className={styles.cartBar}>
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
    </div>
  );
}
