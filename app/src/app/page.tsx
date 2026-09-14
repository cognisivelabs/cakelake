import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { cheapestPrice, formatAed } from "@/lib/pricing";
import { ROUTES } from "@/lib/routes";
import { withBasePath } from "@/lib/assets";
import { CONFIG } from "@/lib/config";
import { Header } from "@/components/Header";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Footer } from "@/components/Footer";
import type { CatalogItem } from "@/types/catalog";
import styles from "./home.module.css";

// Desktop's category card shows a starting price (mobile's doesn't —
// see docs/design/CLB-Hi-Fi-Screens.dc.html's desktop Home screen).
function priceFrom(items: CatalogItem[]): string | null {
  const price = cheapestPrice(items);
  return price === undefined ? null : formatAed(price);
}

export default function HomePage() {
  const catalog = getCatalog();
  // Sep 2026 recategorisation: the menu's 11 categories are all one
  // flavour-picking flow now, so Home keeps the same 2-tile shortcut the
  // client's updated design shows — "Cakes" (every standard category)
  // and "3D Cakes" (the one from-scratch, per-kg category) — rather
  // than listing all 11 individually, which would turn this into a
  // second copy of the Menu category rail.
  const cakeItems = catalog.filter((item) => item.categoryId !== "3d-cakes");
  const customItems = catalog.filter((item) => item.categoryId === "3d-cakes");
  const shopByCategory = [
    { id: "cakes", label: "Cakes", accent: "#CD346F", items: cakeItems, perKg: false },
    { id: "3d-cakes", label: "3D Cakes", accent: "#91134B", items: customItems, perKg: true },
  ];

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath("/images/logo.png")}
              alt={CONFIG.name}
              className={styles.logo}
            />
            <h1>{CONFIG.name}</h1>
            <p className={styles.heroSubtitle}>Fresh cakes, ready in an hour</p>
            <div className={styles.badges}>
              <span className={styles.badgeTeal}>EGGLESS ONLY</span>
              <span className={styles.badgeTeal}>PURE VEG</span>
              <span className={styles.badgeWarm}>LIVE BAKERY</span>
            </div>
            <p className={styles.tagline}>
              A live bakery in Karama — our cake ranges are baked to order and
              ready about an hour after you confirm. Custom cakes need a day.
            </p>
            {/* Desktop gets its own longer copy (more room) — see the
                Hi-Fi's desktop Home screen. */}
            <p className={styles.taglineDesktop}>
              A live bakery in Karama — everything eggless, everything pure
              veg. Our cake ranges are baked to order and ready about an hour
              after you confirm; custom cakes need a day&apos;s notice.
            </p>
            <div className={styles.ctas}>
              <Link href={ROUTES.menu} className={styles.primaryCta}>
                BROWSE MENU
              </Link>
              {/* Secondary to Browse Menu — a PDF can't hold a cart, so
                  it's not an equal, competing CTA. See requirements.md #6. */}
              <button type="button" className={styles.secondaryCta} disabled>
                DOWNLOAD MENU (PDF)
              </button>
            </div>
          </div>
          {/* Desktop only — mobile has no room for a hero photo, and none
              exists yet regardless (placeholder, same convention as
              catalog items with no photo). */}
          <div className={styles.heroPhoto} />
        </div>

        <div className={styles.categorySection}>
          <div className={styles.sectionLabel}>Shop by category</div>
          <div className={styles.categoryGrid}>
            {shopByCategory.map((category) => {
              // Cakes get a starting price; 3D Cakes is priced per kg
              // across the board (up to "Ask us" for the largest sizes),
              // so a single "from" price is less honest there — matches
              // the Hi-Fi's per-category treatment, not a generic formula.
              const from = category.perKg ? null : priceFrom(category.items);
              return (
                <Link
                  key={category.id}
                  href={ROUTES.menu}
                  className={styles.categoryCard}
                  style={{ background: `${category.accent}1a` }}
                >
                  <span className={styles.categoryBar} style={{ background: category.accent }} />
                  <span className={styles.categoryName} style={{ color: category.accent }}>
                    {category.label}
                  </span>
                  <span className={styles.categoryCount}>
                    {category.items.length} ranges
                    {from && <span className={styles.categoryPriceFrom}> · from {from}</span>}
                    {category.perKg && (
                      <span className={styles.categoryPriceFrom}> · per kg</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
          <p className={styles.counterOnlyNote}>
            Cupcakes, cookies and pastries are sold at the counter only —
            ask us on WhatsApp.
          </p>
        </div>

        <Footer />
      </div>

      <InstallPrompt />
    </div>
  );
}
