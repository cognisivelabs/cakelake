import { CONFIG } from "@/lib/config";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import styles from "./Footer.module.css";

// Rendered as the last element on every page. FloatingWhatsApp relies on
// being this component's (and so the page's) last flex child for its
// sticky/margin-top:auto "dock above the footer" behaviour to work — see
// FloatingWhatsApp.module.css.
export function Footer() {
  return (
    <>
      <FloatingWhatsApp />

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
      </div>

      {/* Desktop only — the Hi-Fi's 3-column footer (location / ordering)
          is different enough in shape from mobile's stacked version that
          reflowing one DOM tree between the two got fighting-the-grid
          awkward; kept separate, toggled by the same 1024px breakpoint
          as everything else here. */}
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
        </div>
      </div>
    </>
  );
}
