"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { getFlavourTags, getOccasions } from "@/lib/catalog";
import { getMenuGroups } from "@/lib/menuGroups";
import { ROUTES, categoryRoute, flavourRoute, occasionRoute } from "@/lib/routes";
import { INSTALL_STEPS } from "@/components/installSteps";
import { HeaderSearch } from "@/components/HeaderSearch";
import styles from "./MobileMenuSheet.module.css";

// Mobile's mega-menu: a full-screen sheet grouped by lead time — the
// same groups as the desktop Cakes menu, plus occasions and Find us.
export function MobileMenuSheet({ onClose }: { onClose: () => void }) {
  const { platform, triggerInstall } = useInstallPrompt();
  const [showInstallSteps, setShowInstallSteps] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function handleInstallClick() {
    if (platform === "android") {
      await triggerInstall();
      onClose();
      return;
    }
    setShowInstallSteps(true);
  }

  return (
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="All cakes">
      <div className={styles.bar}>
        <div className={styles.title}>All cakes</div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.searchWrap}>
          <HeaderSearch variant="mobile" onSubmitted={onClose} />
        </div>

        {getMenuGroups().map((group) => (
          <div key={group.id} className={styles.group}>
            <div className={styles.label}>{group.label}</div>
            <div className={styles.card}>
              {group.entries.map(({ category, priceLabel }) => (
                <Link
                  key={category.id}
                  href={categoryRoute(category.id)}
                  className={styles.row}
                  onClick={onClose}
                >
                  <span className={styles.dot} style={{ background: category.accent }} />
                  <span className={styles.rowName}>{category.label}</span>
                  <span className={styles.rowMeta}>{priceLabel}</span>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.group}>
          <div className={styles.label}>OCCASIONS</div>
          <div className={styles.card}>
            {getOccasions().map((occasion) => (
              <Link key={occasion.id} href={occasionRoute(occasion.id)} className={styles.row} onClick={onClose}>
                <span className={styles.dot} style={{ background: "var(--color-pink)" }} />
                <span className={styles.rowName}>{occasion.label}</span>
                <span className={styles.chevron} aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.label}>BY FLAVOUR</div>
          <div className={styles.pills}>
            {getFlavourTags().map((tag) => (
              <Link key={tag.id} href={flavourRoute(tag.id)} className={styles.pill} onClick={onClose}>
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.card}>
            <Link href={ROUTES.contact} className={styles.row} onClick={onClose}>
              <span className={styles.rowName}>Find us</span>
              <span className={styles.chevron} aria-hidden="true">
                ›
              </span>
            </Link>
            {platform !== "none" &&
              (showInstallSteps ? (
                <div className={styles.installSteps}>
                  <ol>
                    {INSTALL_STEPS[platform === "android-manual" ? "android-manual" : "ios"].map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <button type="button" onClick={onClose}>
                    Got it
                  </button>
                </div>
              ) : (
                <button type="button" className={styles.row} onClick={handleInstallClick}>
                  <span className={styles.rowName}>Add to Home Screen</span>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
          </div>
        </div>

        <p className={styles.note}>
          Cupcakes, cookies and pastries are sold at the counter — ask us on WhatsApp.
        </p>
      </div>
    </div>
  );
}
