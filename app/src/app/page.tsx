import Link from "next/link";
import { getCatalog, getCategories } from "@/lib/catalog";
import { CONFIG } from "@/lib/config";
import { Header } from "@/components/Header";
import styles from "./home.module.css";

export default function HomePage() {
  const categories = getCategories();
  const catalog = getCatalog();

  return (
    <div>
      <Header />
      <div className={styles.hero}>
        <div className={styles.logoPlaceholder}>logo</div>
        <h1>
          Fresh cakes,
          <br />
          ready in an hour
        </h1>
        <div className={styles.badges}>
          <span className={styles.badgeTeal}>EGGLESS ONLY</span>
          <span className={styles.badgeTeal}>PURE VEG</span>
          <span className={styles.badgeWarm}>LIVE BAKERY</span>
        </div>
        <p className={styles.tagline}>
          A live bakery in Karama — our cake ranges are baked to order and
          ready about an hour after you confirm. Custom cakes need a day.
        </p>
      </div>

      <div className={styles.ctas}>
        <Link href="/menu" className={styles.primaryCta}>
          BROWSE MENU
        </Link>
        {/* Secondary to Browse Menu — a PDF can't hold a cart, so it's
            not an equal, competing CTA. See requirements.md #6. */}
        <button type="button" className={styles.secondaryCta} disabled>
          DOWNLOAD MENU (PDF)
        </button>
      </div>

      <div className={styles.categorySection}>
        <div className={styles.sectionLabel}>SHOP BY CATEGORY</div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const count = catalog.filter((item) => item.categoryId === category.id).length;
            return (
              <Link
                key={category.id}
                href="/menu"
                className={styles.categoryCard}
                style={{ background: `${category.accent}1a` }}
              >
                <span className={styles.categoryBar} style={{ background: category.accent }} />
                <span className={styles.categoryName} style={{ color: category.accent }}>
                  {category.label}
                </span>
                <span className={styles.categoryCount}>{count} ranges</span>
              </Link>
            );
          })}
        </div>
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
          href={`https://wa.me/${CONFIG.contactWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          MESSAGE US ON WHATSAPP →
        </a>
      </div>
    </div>
  );
}
