import { CONFIG } from "@/lib/config";
import styles from "./UtilityBar.module.css";

// The thin brown strip above the header — the shop's location, what it
// stands for, and its phone number, so they're on every screen without
// taking a page section.
export function UtilityBar() {
  const phoneHref = `tel:+971${CONFIG.shopPhone.replace(/\D/g, "").replace(/^0/, "")}`;
  return (
    <div className={styles.bar}>
      <span className={styles.place}>
        Karama, Dubai
        <span className={styles.placeDetail}> — {CONFIG.address.line1}</span>
      </span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.tag}>
        Eggless · pure veg
        <span className={styles.tagExtra}> · live bakery</span>
      </span>
      <span className={styles.spacer} />
      <a href={phoneHref} className={styles.phone}>
        {CONFIG.shopPhone}
      </a>
    </div>
  );
}
