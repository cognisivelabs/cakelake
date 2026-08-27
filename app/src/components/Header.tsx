"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";

export function Header() {
  const { order } = useCart();
  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        Cake Lake Bakery
      </Link>
      <nav className={styles.nav}>
        <Link href="/menu">Menu</Link>
        <Link href="/cart">Cart{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
      </nav>
    </header>
  );
}
