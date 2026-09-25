"use client";

import { useState } from "react";
import Link from "next/link";
import { withBasePath } from "@/lib/assets";
import { ROUTES } from "@/lib/routes";
import styles from "./HomeSections.module.css";

export type MostOrderedCard = {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  imageUrl?: string;
  href: string;
  /** "1 HOUR" / "24 HOURS" */
  leadBadge: string;
  sameDay: boolean;
  price: string;
};

export type MostOrderedTab = { id: string; label: string };

// "Most ordered": All, plus a tab for each category that has one of the
// featured cakes — a tab with nothing under it would just be a dead end.
export function MostOrdered({ cards, tabs }: { cards: MostOrderedCard[]; tabs: MostOrderedTab[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const shown = activeTab === "all" ? cards : cards.filter((c) => c.categoryId === activeTab);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Most ordered</h2>
        <div className={styles.sectionMeta} style={{ flex: 1 }} />
        <Link href={ROUTES.menu} className={styles.viewAll}>
          View all <span className={styles.viewAllDesktop}>cakes </span>→
        </Link>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Most ordered by category">
        {[{ id: "all", label: "All" }, ...tabs].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={styles.tab}
            data-active={activeTab === tab.id}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`${styles.rail} ${styles.productRail}`}>
        {shown.map((card) => (
          <Link key={card.id} href={card.href} className={styles.product}>
            <div className={styles.productPhoto}>
              {card.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={withBasePath(card.imageUrl)} alt="" className={styles.coverImage} />
              )}
              <span className={`${styles.leadBadge} mono-tag`}>{card.leadBadge}</span>
            </div>
            <div className={styles.productBody}>
              <div className={styles.productName}>{card.name}</div>
              <div className={styles.productCategory}>{card.categoryLabel}</div>
              <div className={styles.productSpacer} />
              <div className={styles.productFooter}>
                <span className={styles.productPrice}>{card.price}</span>
                <span className={styles.addButton}>ADD</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
