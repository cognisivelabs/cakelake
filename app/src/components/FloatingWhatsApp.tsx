import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import styles from "./FloatingWhatsApp.module.css";

// Rendered once in the root layout so it's present on every page, per
// ADR-003's WhatsApp-first ordering model — the header's own WhatsApp
// link/button was removed in favour of this, since the header isn't
// sticky and scrolls out of reach on longer pages. Pages with their own
// fixed/sticky bottom bar (Menu's cart bar, Item detail's add bar,
// Cart's "did you send it?" prompt) sit on top of this in z-index and
// are opaque, so this is hidden behind them rather than overlapping.
export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl()}
      {...EXTERNAL_LINK_PROPS}
      className={styles.button}
      aria-label="Message us on WhatsApp"
    >
      <FaWhatsapp size={24} aria-hidden="true" />
    </a>
  );
}
