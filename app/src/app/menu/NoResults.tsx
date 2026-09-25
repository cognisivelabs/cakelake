import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./menu.module.css";

// What a search or filter that matches nothing shows — with a way to ask
// the bakery for it, since they take custom bakes most weeks.
export function NoResults({ variant, query }: { variant: "mobile" | "desktop"; query: string }) {
  const topic = query.trim();
  const title = topic ? `No ${topic} — yet` : "Nothing here — yet";
  const askLabel = topic ? `ASK US ABOUT ${topic.toUpperCase()}` : "ASK US ON WHATSAPP";

  if (variant === "desktop") {
    return (
      <div className={styles.desktopNoResults}>
        <div className={styles.desktopNoResultsText}>
          <div className={styles.desktopNoResultsTitle}>{title}</div>
          <p>
            Nothing in the menu matches that. We bake to order though, so if you want it, ask — we take on
            custom bakes most weeks.
          </p>
        </div>
        <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.desktopNoResultsAsk}>
          {askLabel}
        </a>
      </div>
    );
  }

  return (
    <div className={styles.noResults}>
      <div className={styles.noResultsTitle}>{title}</div>
      <p className={styles.noResultsText}>
        We bake to order, so if you want it, ask. We take on custom bakes most weeks.
      </p>
      <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} className={styles.askButton}>
        {askLabel}
      </a>
    </div>
  );
}
