import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { groupOpeningHours } from "@/lib/hours";
import { getCategories, getOccasions } from "@/lib/catalog";
import { categoryRoute, occasionRoute } from "@/lib/routes";
import styles from "./Footer.module.css";

// Made to order = the categories that need notice or a brief; the rest
// are the everyday ranges. Same split as the Hi-Fi's footer columns.
const MADE_TO_ORDER_IDS = ["photo-cakes", "3d-cakes", "pull-me-up-cakes", "hammer-cakes", "pinata-cakes"];
const COUNTER_ONLY = ["Cupcakes & minis", "Cookies & bites", "Pastries & desserts"];

// Rendered as the last element on every page.
export function Footer() {
  const groupedHours = groupOpeningHours(CONFIG.openingHoursByDay);
  const categories = getCategories();
  const everyday = categories.filter((c) => !MADE_TO_ORDER_IDS.includes(c.id));
  const madeToOrder = categories.filter((c) => MADE_TO_ORDER_IDS.includes(c.id));
  const occasions = getOccasions();

  const categoryLinks = (list: typeof categories) =>
    list.map((c) => (
      <Link key={c.id} href={categoryRoute(c.id)} className={styles.link}>
        {c.label}
      </Link>
    ));
  const occasionLinks = occasions.map((o) => (
    <Link key={o.id} href={occasionRoute(o.id)} className={styles.link}>
      {o.label}
    </Link>
  ));
  const counterItems = COUNTER_ONLY.map((name) => <span key={name}>{name}</span>);

  const hours = (
    <p className={styles.text}>
      {groupedHours.map((entry) => (
        <span key={entry.days} className={styles.muted}>
          {entry.days}: {entry.hours}
          <br />
        </span>
      ))}
    </p>
  );
  const findUs = (
    <>
      <p className={styles.text}>
        {CONFIG.address.line1}
        <br />
        {CONFIG.address.line2}, {CONFIG.address.line3}
      </p>
      {hours}
    </>
  );

  return (
    <footer className={styles.footer}>
      {/* Mobile — the five columns collapse to accordions. */}
      <div className={styles.mobile}>
        <div className={styles.brand}>{CONFIG.name}</div>
        <div className={styles.accordions}>
          <details className={styles.accordion}>
            <summary>Categories</summary>
            <div className={styles.linkList}>{categoryLinks(categories)}</div>
          </details>
          <details className={styles.accordion}>
            <summary>Occasions</summary>
            <div className={styles.linkList}>{occasionLinks}</div>
          </details>
          <details className={styles.accordion} open>
            <summary>At the counter</summary>
            <div className={styles.linkList}>{counterItems}</div>
            <p className={styles.smallNote}>Not online — ask us on WhatsApp.</p>
          </details>
          <details className={styles.accordion}>
            <summary>Opening hours</summary>
            {hours}
          </details>
        </div>
        <p className={styles.text}>
          {CONFIG.address.line1}, {CONFIG.address.line2}, {CONFIG.address.line3} · {CONFIG.shopPhone}
        </p>
        <div className={styles.payment}>{CONFIG.paymentNote}</div>
      </div>

      {/* Desktop */}
      <div className={styles.desktop}>
        <div className={styles.desktopColumns}>
          <div className={styles.brandColumn}>
            <div className={styles.brand}>{CONFIG.name}</div>
            <p className={styles.text}>
              Eggless, pure veg, baked to order in Karama since {CONFIG.establishedYear}.
            </p>
            <div className={styles.phones}>{CONFIG.shopPhone}</div>
            {findUs}
          </div>
          <div className={styles.column}>
            <div className={`${styles.columnLabel} mono-tag`}>CATEGORIES</div>
            <div className={styles.linkList}>{categoryLinks(everyday)}</div>
          </div>
          <div className={styles.column}>
            <div className={`${styles.columnLabel} mono-tag`}>MADE TO ORDER</div>
            <div className={styles.linkList}>{categoryLinks(madeToOrder)}</div>
          </div>
          <div className={styles.column}>
            <div className={`${styles.columnLabel} mono-tag`}>OCCASIONS</div>
            <div className={styles.linkList}>{occasionLinks}</div>
          </div>
          <div className={styles.column}>
            <div className={`${styles.columnLabel} mono-tag`}>AT THE COUNTER</div>
            <div className={styles.linkList}>{counterItems}</div>
            <p className={styles.smallNote}>Not online — ask us on WhatsApp.</p>
          </div>
        </div>
        <div className={styles.rule} />
        <div className={styles.bottomRow}>
          <span className={styles.text}>
            © {new Date().getFullYear()} {CONFIG.name} · Karama, Dubai
          </span>
          <span className={styles.spacer} />
          <span className={styles.payment}>{CONFIG.paymentNote}</span>
        </div>
      </div>
    </footer>
  );
}
