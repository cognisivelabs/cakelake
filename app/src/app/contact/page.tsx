import { CONFIG } from "@/lib/config";
import { PageHeader } from "@/components/PageHeader";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <div>
      <PageHeader title="Find us" backHref="/" backLabel="BACK" />
      <iframe
        className={styles.map}
        src={CONFIG.mapsEmbedSrc}
        title="Cake Lake Bakery location"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

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
          <div className={styles.mutedBox}>
            {CONFIG.openingHours.map((entry) => (
              <div key={entry.days} className={styles.hoursRow}>
                <span>{entry.days}</span>
                <span>{entry.hours}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.sectionLabel}>CALL OR MESSAGE</div>
          <div className={styles.row}>
            <span>Shop</span>
            <span>{CONFIG.shopPhone}</span>
          </div>
          <div className={styles.row}>
            <span>WhatsApp</span>
            <span>{formatDisplay(CONFIG.bakeryWhatsAppNumber)}</span>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <a
          href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.tealButton}
        >
          MESSAGE US ON WHATSAPP
        </a>
        <a
          href={CONFIG.mapsUrl}
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
