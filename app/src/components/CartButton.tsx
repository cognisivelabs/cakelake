"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { orderItemCount } from "@/lib/order";
import { ROUTES } from "@/lib/routes";
import styles from "./CartButton.module.css";

// See docs/design/CLB-Cart-Icon.dc.html's "1a — corner badge" — bare
// glyph (no button box), a pink count badge, and a dimmed glyph with no
// badge once the cart is empty. Shared by Header (mobile + desktop nav)
// and PageHeader (mobile back-link header) so both stay in sync.
export function CartButton() {
  const { order } = useCart();
  const itemCount = orderItemCount(order);
  const isEmpty = itemCount === 0;

  return (
    <Link
      href={ROUTES.cart}
      className={styles.button}
      data-empty={isEmpty}
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.glyph}
      >
        <circle cx="9.5" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.6 12.2h11L21 7H6.2" />
      </svg>
      {!isEmpty && <span className={`${styles.badge} mono-tag`}>{itemCount}</span>}
    </Link>
  );
}
