"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CONFIG } from "@/lib/config";
import styles from "./Header.module.css";

export function Header() {
  const { order } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className={styles.wrap}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuIcon} />
        </button>

        <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          Cake Lake
        </Link>

        <div className={styles.actions}>
          <a
            href={`https://wa.me/${CONFIG.contactWhatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBadge}
            aria-label="Message us on WhatsApp"
          >
            WA
          </a>
          <Link href="/cart" className={`${styles.cartPill} mono-tag`}>
            CART {itemCount}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.dropdown}>
          <Link href="/menu" onClick={() => setMenuOpen(false)}>
            Menu
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Find us
          </Link>
        </nav>
      )}
    </header>
  );
}
