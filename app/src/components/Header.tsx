"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { CONFIG } from "@/lib/config";
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

        <Link href="/" className={styles.brand} onClick={closeMenu}>
          Cake Lake
        </Link>

        <div className={styles.actions}>
          <a
            href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBadge}
            aria-label="Message us on WhatsApp"
          >
            <FaWhatsapp size={16} aria-hidden="true" />
          </a>
          <Link href="/cart" className={`${styles.cartPill} mono-tag`}>
            CART {itemCount}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.dropdown}>
          <Link href="/menu" onClick={closeMenu}>
            Menu
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            Find us
          </Link>
          {platform !== "none" &&
            (showInstallSteps ? (
              <div className={styles.installSteps}>
                <ol>
                  {platform === "android-manual" ? (
                    <>
                      <li>
                        Tap the <b>⋮</b> menu in your browser&apos;s toolbar.
                      </li>
                      <li>
                        Tap <b>Add to Home screen</b> (or <b>Install app</b>).
                      </li>
                      <li>Tap Add.</li>
                    </>
                  ) : (
                    <>
                      <li>
                        Tap the <b>Share</b> icon in Safari&apos;s toolbar.
                      </li>
                      <li>
                        Scroll down and tap <b>Add to Home Screen</b>.
                      </li>
                      <li>Tap Add.</li>
                    </>
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
