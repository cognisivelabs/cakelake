import Link from "next/link";
import { getCatalog, getCategories } from "@/lib/catalog";
import { CONFIG } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatAed } from "@/lib/pricing";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { Header } from "@/components/Header";
import { InstallPrompt } from "@/components/InstallPrompt";
import type { CatalogItem } from "@/types/catalog";
import styles from "./home.module.css";

// Desktop's category card shows a starting price (mobile's doesn't —
// see docs/design/CLB-Hi-Fi-Screens.dc.html's desktop Home screen).
function priceFrom(items: CatalogItem[]): string | null {
  const prices = items
    .flatMap((item) => item.weightTiers)
    .map((tier) => tier.price)
    .filter((price): price is number => price !== undefined);
  return prices.length === 0 ? null : formatAed(Math.min(...prices));
}

export default function HomePage() {
  const categories = getCategories();
  const catalog = getCatalog();

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.logoPlaceholder}>logo</div>
            <h1>Cake Lake Bakery</h1>
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
            {categories.map((category) => {
              const items = catalog.filter((item) => item.categoryId === category.id);
              // Cakes get a starting price; Custom Cakes is priced per kg
              // across the board (up to "Ask us" for the largest sizes),
              // so a single "from" price is less honest there — matches
              // the Hi-Fi's per-category treatment, not a generic formula.
              const from = category.id === "custom-cakes" ? null : priceFrom(items);
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
                    {items.length} ranges
                    {from && <span className={styles.categoryPriceFrom}> · from {from}</span>}
                    {category.id === "custom-cakes" && (
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

        <div className={styles.footer}>
          <div className={`${styles.footerLabel} mono-tag`}>HOURS &amp; LOCATION</div>
          <p className={styles.footerText}>
            {CONFIG.address.line1}
            <br />
            {CONFIG.address.line2}
          </p>
          <p className={styles.footerText}>
            {CONFIG.openingHours.map((entry) => (
              <span key={entry.days} className={styles.footerMuted}>
                {entry.days}: {entry.hours}
                <br />
              </span>
            ))}
          </p>
          <a
            href={buildWhatsAppUrl()}
            {...EXTERNAL_LINK_PROPS}
            className={styles.footerLink}
          >
            MESSAGE US ON WHATSAPP →
          </a>
        </div>

        {/* Desktop only — the Hi-Fi's 3-column footer (location / ordering
            / a standalone WhatsApp button) is different enough in shape
            from mobile's stacked version that reflowing one DOM tree
            between the two got fighting-the-grid awkward; kept separate,
            toggled by the same 1024px breakpoint as everything else here. */}
        <div className={styles.desktopFooter}>
          <div className={styles.desktopFooterInner}>
            <div className={styles.desktopFooterColumn}>
              <div className={`${styles.footerLabel} mono-tag`}>WHERE TO FIND US</div>
              <p className={styles.footerText}>
                {CONFIG.address.line1}
                <br />
                {CONFIG.address.line2}, {CONFIG.address.line3}
                <br />
                {CONFIG.shopPhone}
              </p>
            </div>
            <div className={styles.desktopFooterColumn}>
              <div className={`${styles.footerLabel} mono-tag`}>ORDERING</div>
              <p className={styles.footerText}>Orders are confirmed in WhatsApp.</p>
            </div>
            <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.desktopWaButton}>
              MESSAGE US ON WHATSAPP
            </a>
          </div>
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
}
