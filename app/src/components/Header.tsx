"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { ROUTES } from "@/lib/routes";
import { CONFIG } from "@/lib/config";
import { INSTALL_STEPS } from "@/components/installSteps";
import { CartButton } from "@/components/CartButton";
import styles from "./Header.module.css";

type HeaderProps = {
  /** Replaces the default WhatsApp button + cart pill in the desktop nav
   * bar — Menu — desktop uses this slot for its search field instead
   * (the persistent order panel there already covers the cart). Mobile
   * is unaffected; it always keeps its own hamburger/actions. */
  desktopRight?: ReactNode;
};

export function Header({ desktopRight }: HeaderProps = {}) {
  const { platform, triggerInstall } = useInstallPrompt();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstallSteps, setShowInstallSteps] = useState(false);

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
          {CONFIG.shortName}
        </Link>

        {/* Desktop only (hidden <1024px) — mobile keeps the hamburger
            dropdown below instead, per ADR-003's corrected breakpoint. */}
        <nav className={styles.desktopNav}>
          <Link href={ROUTES.menu} className={styles.navLink}>
            Menu
          </Link>
          <Link href={ROUTES.contact} className={styles.navLink}>
            Find us
          </Link>
        </nav>

        <div className={styles.actions}>
          <CartButton />
        </div>

        <div className={styles.desktopActions}>{desktopRight ?? <CartButton />}</div>
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
