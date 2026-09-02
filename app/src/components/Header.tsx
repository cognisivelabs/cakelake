"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { INSTALL_STEPS } from "@/components/installSteps";
import { orderItemCount } from "@/lib/order";
import { orderTotal, formatAed } from "@/lib/pricing";
import { getCatalog } from "@/lib/catalog";
import styles from "./Header.module.css";

type HeaderProps = {
  /** Replaces the default WhatsApp button + cart pill in the desktop nav
   * bar — Menu — desktop uses this slot for its search field instead
   * (the persistent order panel there already covers the cart). Mobile
   * is unaffected; it always keeps its own hamburger/actions. */
  desktopRight?: ReactNode;
};

export function Header({ desktopRight }: HeaderProps = {}) {
  const { order } = useCart();
  const { platform, triggerInstall } = useInstallPrompt();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstallSteps, setShowInstallSteps] = useState(false);
  const itemCount = orderItemCount(order);
  // Desktop's cart button shows a running total too (mobile's doesn't —
  // no room). Cheap either way: both are pure reads over the in-memory
  // catalog, not worth gating behind the desktop breakpoint in JS.
  const total = orderTotal(order, getCatalog());

  function closeMenu() {
    setMenuOpen(false);
    setShowInstallSteps(false);
  }

  async function handleInstallClick() {
    if (platform === "android") {
      await triggerInstall();
      closeMenu();
      return;
    }
    setShowInstallSteps(true);
  }

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

        <Link href={ROUTES.home} className={styles.brand} onClick={closeMenu}>
          Cake Lake
        </Link>

        {/* Desktop only (hidden <1024px) — mobile keeps the hamburger
            dropdown below instead, per ADR-003's corrected breakpoint. */}
        <nav className={styles.desktopNav}>
          <Link href={ROUTES.menu} className={styles.navLink}>
            Menu
          </Link>
          {/* Custom cakes has no route of its own — it's a category on
              the same Menu page, not a separate screen. */}
          <Link href={ROUTES.menu} className={styles.navLink}>
            Custom cakes
          </Link>
          <Link href={ROUTES.contact} className={styles.navLink}>
            Find us
          </Link>
        </nav>

        <div className={styles.actions}>
          <a
            href={buildWhatsAppUrl()}
            {...EXTERNAL_LINK_PROPS}
            className={styles.waBadge}
            aria-label="Message us on WhatsApp"
          >
            <FaWhatsapp size={16} aria-hidden="true" />
          </a>
          <Link href={ROUTES.cart} className={`${styles.cartPill} mono-tag`}>
            CART {itemCount}
          </Link>
        </div>

        <div className={styles.desktopActions}>
          {desktopRight ?? (
            <>
              <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={`${styles.waButton} mono-tag`}>
                WhatsApp
              </a>
              <Link href={ROUTES.cart} className={`${styles.desktopCartPill} mono-tag`}>
                Cart · {itemCount} · {formatAed(total)}
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.dropdown}>
          <Link href={ROUTES.menu} onClick={closeMenu}>
            Menu
          </Link>
          <Link href={ROUTES.contact} onClick={closeMenu}>
            Find us
          </Link>
          {platform !== "none" &&
            (showInstallSteps ? (
              <div className={styles.installSteps}>
                <ol>
                  {INSTALL_STEPS[platform === "android-manual" ? "android-manual" : "ios"].map(
                    (step, i) => (
                      <li key={i}>{step}</li>
                    )
                  )}
                </ol>
                <button type="button" onClick={closeMenu}>
                  Got it
                </button>
              </div>
            ) : (
              <button type="button" className={styles.installItem} onClick={handleInstallClick}>
                Add to Home Screen
              </button>
            ))}
        </nav>
      )}
    </header>
  );
}
