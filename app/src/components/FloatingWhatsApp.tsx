import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import styles from "./FloatingWhatsApp.module.css";

// Rendered by Footer, right before it, on every page — see Footer.tsx.
// Sticky, so it tracks the viewport like a fixed button while scrolling
// through everything above it, then simply runs out of room to stick
// once its normal-flow position (right before the footer) comes into
// view, settling there instead of overlapping the footer.
export function FloatingWhatsApp() {
  return (
    <div className={styles.dockedWrap}>
      <a
        href={buildWhatsAppUrl()}
        {...EXTERNAL_LINK_PROPS}
        className={styles.button}
        aria-label="Message us on WhatsApp"
      >
        <FaWhatsapp size={22} aria-hidden="true" />
      </a>
    </div>
  );
}
