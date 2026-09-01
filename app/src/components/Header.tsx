"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { INSTALL_STEPS } from "@/components/installSteps";
import styles from "./Header.module.css";

export function Header() {
  const { order } = useCart();
  const { platform, triggerInstall } = useInstallPrompt();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstallSteps, setShowInstallSteps] = useState(false);
  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

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
