import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import type { AckSummary } from "@/lib/orderSummary";
import { ROUTES } from "@/lib/routes";
import styles from "./cart.module.css";

// The "Order sent" screen: a recap of what went to WhatsApp, and a link
// back into that chat for anything to change.
export function AcknowledgedView({ summary, chatUrl }: { summary: AckSummary; chatUrl: string }) {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.centered}>
        <div className={styles.checkCircle}>✓</div>
        <h1 className={styles.ackHeading}>Order sent</h1>
        <p className={styles.muted}>
          We&apos;ll confirm the details and the price in WhatsApp, usually
          within the hour during opening times.
        </p>
        <div className={styles.recapCard}>
          <div className={styles.sectionLabel}>WHAT YOU SENT</div>
          <p className={styles.recapText}>
            {summary.lines}
            <br />
            Total: {summary.total}
          </p>
        </div>
        <div className={styles.stackedActions}>
          <Link href={ROUTES.menu} className={styles.primaryButton}>
            BACK TO MENU
          </Link>
          <a
            href={chatUrl}
            {...EXTERNAL_LINK_PROPS}
            className={styles.tealOutlineButton}
          >
            OPEN THE CHAT AGAIN
          </a>
        </div>
      </div>

      {/* Desktop — see docs/design/CLB-Hi-Fi-Screens.dc.html's "Order
          sent — desktop": "the order is now a conversation, so the page
          stops being a checkout" — an itemized recap and a dedicated
          "something to change?" panel instead of mobile's one-line
          summary, same dual-block pattern as the handoff/QR stage
          above. */}
      <div className={styles.desktopAcknowledged}>
        <div className={styles.desktopAckCard}>
          <div className={styles.checkCircle}>✓</div>
          <h1 className={styles.desktopAckHeading}>Order sent</h1>
          <p className={styles.desktopAckSubtitle}>
            We&apos;ll confirm the details and the price in WhatsApp,
            usually within the hour during opening times.
          </p>
        </div>

        <div className={styles.desktopAckRecap}>
          <div className={styles.desktopAckRecapLabel}>
            WHAT YOU SENT · {summary.sentAt}
          </div>
          <div className={styles.desktopAckLines}>
            {summary.itemizedLines.map((line, i) => (
              <div key={i} className={styles.desktopAckLine}>
                <div>
                  <div className={styles.desktopAckLineName}>
                    {line.quantity}× {line.name}
                  </div>
                  {line.descriptor && (
                    <div className={styles.desktopAckLineDetail}>{line.descriptor}</div>
                  )}
                  {line.message && (
                    <div className={styles.desktopAckLineDetail}>&ldquo;{line.message}&rdquo;</div>
                  )}
                </div>
                <div className={styles.desktopAckLinePrice}>{line.price}</div>
              </div>
            ))}
          </div>
          <div className={styles.desktopAckDivider} />
          <div className={styles.desktopAckTotalRow}>
            <span>Total, to be confirmed</span>
            <span className={styles.desktopAckTotalAmount}>{summary.total}</span>
          </div>
          <div className={styles.desktopAckInfoBox}>
            {summary.fulfillmentLine}
            <br />
            <span className={styles.desktopAckInfoMuted}>
              Nothing is charged here. We confirm the price with you in chat.
            </span>
          </div>
        </div>

        <div className={styles.desktopAckChangeCard}>
          <div className={styles.desktopAckChangeHeading}>Something to change?</div>
          <p className={styles.desktopAckChangeText}>
            Reply in the same WhatsApp chat — flavour, inscription, time,
            all of it. There&apos;s nothing to edit here.
          </p>
          <div className={styles.desktopAckChangeActions}>
            <a
              href={chatUrl}
              {...EXTERNAL_LINK_PROPS}
              className={styles.desktopAckOpenChat}
            >
              OPEN THE CHAT
            </a>
            <Link href={ROUTES.menu} className={styles.desktopAckBackToMenu}>
              BACK TO THE MENU
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
