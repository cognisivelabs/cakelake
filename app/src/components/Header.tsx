"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { getCustomCategoriesRoute } from "@/lib/menuGroups";
import { buildWhatsAppUrl, formatLocalPhone } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { CartButton } from "@/components/CartButton";
import { CakesMegaMenu, OccasionsMenu } from "@/components/MegaMenu";
import { HeaderSearch } from "@/components/HeaderSearch";
import { MobileMenuSheet } from "@/components/MobileMenuSheet";
import { UtilityBar } from "@/components/UtilityBar";
import styles from "./Header.module.css";

type OpenMenu = "cakes" | "occasions" | null;

function WhatsAppGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

// The site header: a utility strip, then the yellow bar. Mobile is a
// hamburger + centred wordmark whose menu is a full-screen sheet;
// desktop is a nav with hover mega-menus, search, WhatsApp and cart —
// see docs CLB Desktop Home / CLB Mobile Home.
export function Header() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const onMenuSection = pathname.startsWith(ROUTES.menu);
  // Only the menu listing has its own search field; item pages under
  // /menu/ don't.
  const onMenuListing = pathname.replace(/\/$/, "") === ROUTES.menu;
  const whatsappNumber = formatLocalPhone(CONFIG.bakeryWhatsAppNumber);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A menu opened by hovering shouldn't snap shut when the same trigger
  // is then clicked (the natural next move) — only a click on a menu
  // that a click opened closes it. Touch has no hover, so a tap opens
  // and a second tap closes.
  const openedByHover = useRef(false);

  function hoverOpen(menu: Exclude<OpenMenu, null>) {
    if (openMenu !== menu) openedByHover.current = true;
    setOpenMenu(menu);
  }

  function clickToggle(menu: Exclude<OpenMenu, null>) {
    if (openMenu === menu && !openedByHover.current) {
      setOpenMenu(null);
    } else {
      openedByHover.current = false;
      setOpenMenu(menu);
    }
  }

  return (
    <header className={styles.wrap} onMouseLeave={() => setOpenMenu(null)}>
      <UtilityBar />

      <div className={styles.bar}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.hamburger} ${styles.mobileOnly}`}
          aria-label="Menu"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link href={ROUTES.home} className={styles.brand} onClick={() => setOpenMenu(null)}>
          <span className={styles.brandName}>{CONFIG.shortName}</span>
          <span className={`${styles.brandSub} mono-tag`}>BAKERY · KARAMA</span>
        </Link>

        <nav className={`${styles.nav} ${styles.desktopOnly}`} aria-label="Main">
          <button
            type="button"
            className={styles.navItem}
            data-active={pathname === "/" || onMenuSection}
            aria-expanded={openMenu === "cakes"}
            onMouseEnter={() => hoverOpen("cakes")}
            onClick={() => clickToggle("cakes")}
          >
            Cakes <span className={styles.caret}>▾</span>
          </button>
          <button
            type="button"
            className={styles.navItem}
            aria-expanded={openMenu === "occasions"}
            onMouseEnter={() => hoverOpen("occasions")}
            onClick={() => clickToggle("occasions")}
          >
            Occasions <span className={styles.caret}>▾</span>
          </button>
          <Link
            href={getCustomCategoriesRoute()}
            className={styles.navItem}
            onMouseEnter={() => setOpenMenu(null)}
          >
            Photo &amp; 3D
          </Link>
          <Link
            href={ROUTES.contact}
            className={styles.navItem}
            data-active={pathname.startsWith(ROUTES.contact)}
            onMouseEnter={() => setOpenMenu(null)}
          >
            Find us
          </Link>
        </nav>

        {/* The menu page has its own search field — a second one here
            would be two boxes doing the same thing. */}
        {!onMenuListing && (
          <div className={`${styles.searchSlot} ${styles.desktopOnly}`}>
            <HeaderSearch variant="desktop" />
          </div>
        )}
        <div className={`${styles.spacer} ${styles.desktopOnly}`} />

        <a
          href={buildWhatsAppUrl()}
          {...EXTERNAL_LINK_PROPS}
          className={styles.whatsapp}
          aria-label={`WhatsApp us on ${whatsappNumber}`}
        >
          <WhatsAppGlyph size={20} />
          <span className={styles.whatsappNumber}>{whatsappNumber}</span>
        </a>
        <div className={styles.cart}>
          <CartButton />
        </div>
      </div>

      {openMenu && (
        <>
          <div className={styles.backdrop} onClick={() => setOpenMenu(null)} />
          <div className={styles.panel}>
            {openMenu === "cakes" ? (
              <CakesMegaMenu onNavigate={() => setOpenMenu(null)} />
            ) : (
              <OccasionsMenu onNavigate={() => setOpenMenu(null)} />
            )}
          </div>
        </>
      )}

      {sheetOpen && <MobileMenuSheet onClose={() => setSheetOpen(false)} />}
    </header>
  );
}
