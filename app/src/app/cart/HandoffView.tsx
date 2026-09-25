import { PageHeader } from "@/components/PageHeader";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { QrCode } from "@/components/QrCode";
import { Footer } from "@/components/Footer";
import styles from "./cart.module.css";

// "This is the message we'll send" — then, once WhatsApp has been
// opened, "did you send it?". Desktop swaps the open-WhatsApp button
// for a QR code to scan on a phone.
export function HandoffView({
  stage,
  message,
  chatUrl,
  onOpenWhatsApp,
  onConfirmSent,
  onBack,
}: {
  stage: "handoff" | "confirming";
  message: string;
  chatUrl: string;
  onOpenWhatsApp: () => void;
  onConfirmSent: () => void;
  onBack: () => void;
}) {
  const waUrl = chatUrl || buildWhatsAppUrl(message);
  return (
    <div className={styles.page}>
      <PageHeader title="Send order" backLabel="CART" onBack={onBack} />
      <div className={styles.handoffWrap}>
        <div className={stage === "confirming" ? styles.dimmed : undefined}>
          <h1>This is the message we&apos;ll send</h1>
          <p className={styles.muted}>
            WhatsApp opens with it already typed. You still press send.
          </p>
          <pre className={styles.preview}>{message}</pre>
          <div className={styles.infoNote}>
            Your order opens in WhatsApp. Come back here and confirm you sent
            it.
          </div>
          {stage === "handoff" && (
            <button type="button" className={styles.tealButton} onClick={onOpenWhatsApp}>
              OPEN WHATSAPP
            </button>
          )}
        </div>

        {stage === "confirming" && (
          <div className={styles.confirmModal}>
            <h2>Did you send it?</h2>
            <p className={styles.muted}>
              We can&apos;t see your WhatsApp, so tell us and we&apos;ll clear
              your cart.
            </p>
            <div className={styles.stackedActions}>
              <button type="button" className={styles.primaryButton} onClick={onConfirmSent}>
                YES, SENT
              </button>
              <button type="button" className={styles.outlineButton} onClick={onBack}>
                NOT YET — BACK TO MY ORDER
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop — see docs/design/CLB-Hi-Fi-Screens.dc.html's
          "Handoff — desktop": a QR code to scan on a phone, since a
          desktop browser can't be sent to the WhatsApp app and back
          the way mobile can. Both actions are offered together from
          the start (no separate "open first" step to dim around) —
          scanning the code happens off this page entirely. */}
      <div className={styles.desktopHandoff}>
        <div className={styles.desktopHandoffMain}>
          <h1>Send this to us on WhatsApp</h1>
          <p className={styles.muted}>
            Scan the code with your phone and the message below opens
            already typed. You still press send.
          </p>
          <div className={styles.desktopMessageBox}>
            <div className={styles.sectionLabel}>THE MESSAGE</div>
            <pre className={styles.desktopPreview}>{message}</pre>
          </div>
          <div className={styles.infoNote}>
            We can&apos;t see your WhatsApp, so tell us once you&apos;ve sent
            it and we&apos;ll clear your order here.
          </div>
        </div>

        <div className={styles.qrPanel}>
          <div className={styles.qrTitle}>Scan with your phone</div>
          <QrCode value={waUrl} />
          <button type="button" className={styles.openWaLink} onClick={onOpenWhatsApp}>
            Or open WhatsApp Web in another tab — the message will be
            waiting
          </button>
          <div className={styles.stackedActions}>
            <button type="button" className={styles.primaryButton} onClick={onConfirmSent}>
              I&apos;VE SENT IT
            </button>
            <button type="button" className={styles.outlineButton} onClick={onBack}>
              BACK TO MY ORDER
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
