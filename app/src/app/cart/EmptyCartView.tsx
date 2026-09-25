import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./cart.module.css";

export function EmptyCartView() {
  return (
    <div className={styles.page}>
      <ResponsiveHeader title="Your order" backHref={ROUTES.menu} backLabel="MENU" />
      {/* Desktop — see docs/design/CLB-Hi-Fi-Screens.dc.html's "Empty
          order — desktop": the page itself is the empty state (heading
          + actions in a wide left column, the ordering-works card in a
          right column) rather than the mobile block just centered and
          narrowed — hence its own layout classes instead of reusing
          .centered (kept for the acknowledged screen below). */}
      <div className={styles.emptyState}>
        <Link href={ROUTES.menu} className={styles.emptyBackLink}>
          ← Menu
        </Link>

        <div className={styles.emptyLayout}>
          <div className={styles.emptyIntro}>
            <h1 className={styles.emptyHeading}>Nothing in your order yet</h1>
            <p className={`${styles.muted} ${styles.emptySubtitleMobile}`}>
              Add a cake — ready in an hour — or start a custom one, and
              it&apos;ll show up here.
            </p>
            <p className={`${styles.muted} ${styles.emptySubtitleDesktop}`}>
              Add a cake — the four ranges are ready about an hour after we
              confirm — or start a custom one, and it&apos;ll show up here.
            </p>
            <div className={styles.emptyActions}>
              <Link href={ROUTES.menu} className={styles.primaryButton}>
                BROWSE MENU
              </Link>
              <a
                href={buildWhatsAppUrl()}
                {...EXTERNAL_LINK_PROPS}
                className={styles.tealOutlineButton}
              >
                ASK US FOR SOMETHING CUSTOM
              </a>
            </div>
          </div>

          <div className={styles.emptyCardCol}>
            <div className={styles.orderingStepsCard}>
              <div className={styles.orderingStepsLabel}>HOW ORDERING WORKS</div>
              <ol className={styles.orderingSteps}>
                <li>
                  <span className={styles.orderingStepNum}>1</span>
                  <span>Add your cakes and pick pickup or delivery.</span>
                </li>
                <li>
                  <span className={styles.orderingStepNum}>2</span>
                  <span>
                    Send the order to us on WhatsApp — one{" "}
                    <span className={styles.tapWord}>tap</span>
                    <span className={styles.clickWord}>click</span>, message
                    already written.
                  </span>
                </li>
                <li>
                  <span className={styles.orderingStepNum}>3</span>
                  <span>
                    We confirm price and time in the chat.{" "}
                    <strong>Nothing is charged in the app.</strong>
                  </span>
                </li>
              </ol>
              <p className={styles.orderingStepsNote}>
                Cakes are baked to order — most need 1 hour, custom cakes 24.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
