import { CONFIG } from "@/lib/config";
import styles from "./contact.module.css";

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(
    `${CONFIG.address.line1}, ${CONFIG.address.line2}, ${CONFIG.address.line3}`,
  );

  return (
    <div>
      <h1 className={styles.pageTitle}>Find us</h1>
      <div className={styles.map}>map</div>

      <div className={styles.content}>
        <section>
          <div className={styles.sectionLabel}>WHERE</div>
          <p className={styles.text}>
            {CONFIG.address.line1}
            <br />
            {CONFIG.address.line2}
            <br />
            {CONFIG.address.line3}
          </p>
        </section>

        <section>
          <div className={styles.sectionLabel}>WHEN</div>
          <p className={styles.mutedBox}>{CONFIG.openingHours}</p>
        </section>

        <section>
          <div className={styles.sectionLabel}>CALL OR MESSAGE</div>
          <div className={styles.row}>
            <span>Shop</span>
            <span>{CONFIG.shopPhone}</span>
          </div>
          <div className={styles.row}>
            <span>WhatsApp</span>
            <span>{formatDisplay(CONFIG.contactWhatsAppNumber)}</span>
          </div>
          <div className={`${styles.row} ${styles.rowMuted}`}>
            <span>Orders</span>
            <span>{formatDisplay(CONFIG.bakeryWhatsAppNumber)}</span>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <a
          href={`https://wa.me/${CONFIG.contactWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.tealButton}
        >
          MESSAGE US ON WHATSAPP
        </a>
        <a
          href={`https://maps.google.com/?q=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.outlineButton}
        >
          OPEN IN MAPS
        </a>
      </div>
    </div>
  );
}

function formatDisplay(intlNumber: string): string {
  // "971529811358" -> "052 981 1358"
  const local = "0" + intlNumber.slice(3);
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}
