"use client";

import { useState } from "react";
import Link from "next/link";
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
            href={`https://wa.me/${CONFIG.contactWhatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBadge}
            aria-label="Message us on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.61 14.11c-.24.67-1.4 1.28-1.93 1.36-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.43.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.17-.2.73-.85.93-1.14.2-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.75-.17 1.42z" />
            </svg>
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
