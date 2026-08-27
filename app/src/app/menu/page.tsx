"use client";

import Link from "next/link";
import { getCatalog, getCategories } from "@/lib/catalog";
import { ItemCard } from "@/components/ItemCard";
import { useCart } from "@/context/CartContext";
import { orderTotal, formatAed } from "@/lib/pricing";
import styles from "./menu.module.css";

export default function MenuPage() {
  const catalog = getCatalog();
  const categories = getCategories();
  const { order } = useCart();

  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);
  const total = orderTotal(order, catalog);

  return (
    <div>
      <div className={styles.intro}>
        <h1>Menu</h1>
        <p>
          We only take cake orders through the website — for anything else
          (cupcakes, cookies, pastries), message us on WhatsApp directly.
        </p>
      </div>

      {categories.map((category) => {
        const items = catalog.filter((item) => item.categoryId === category.id);
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
  );
}
