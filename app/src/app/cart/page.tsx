"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { orderTotal, hasUnpricedLines, lineTotal, formatAed } from "@/lib/pricing";
import { buildOrderMessage, buildWhatsAppUrl, openWhatsAppUrl } from "@/lib/whatsapp";
import { CONFIG } from "@/lib/config";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";
import { ROUTES } from "@/lib/routes";
import { describeLine, resolveOrderLines, resolveSelection, orderItemCount } from "@/lib/order";
import {
  estimatedReadyTime,
  formatShortDate,
  formatTime,
  parseIsoDateLocal,
  todayIsoDate,
} from "@/lib/dates";
import { CartLineItem } from "@/components/CartLineItem";
import { Header } from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { QrCode } from "@/components/QrCode";
import { Footer } from "@/components/Footer";
import type { WhenNeeded } from "@/types/order";
import styles from "./cart.module.css";

type Stage = "review" | "handoff" | "confirming" | "acknowledged";

export default function CartPage() {
  const { order, setFulfillment, setWhenNeeded, setCustomerName, startHandoff, declineHandoff, clearCart } =
    useCart();
  const catalog = getCatalog();
  const readyTime = estimatedReadyTime();
  // Not plain local state: an installed PWA can navigate its one window
  // away to wa.me instead of opening a separate tab, wiping in-memory
  // state entirely. order.pendingHandoff is persisted, so a customer who
  // comes back to a blank/reloaded app still lands on "did you send it?"
  // instead of a reset cart. manualStage overrides it once the customer
  // takes an explicit action in this session.
  const [manualStage, setManualStage] = useState<Stage | null>(null);
  const stage: Stage = manualStage ?? (order.pendingHandoff ? "confirming" : "review");
  const [sentMessage, setSentMessage] = useState("");
  const [sentUrl, setSentUrl] = useState("");
  // itemizedLines/fulfillmentLine/sentAt only feed the desktop screen's
  // richer recap (see docs/design/CLB-Hi-Fi-Screens.dc.html's "Order sent
  // — desktop") — mobile keeps its existing flattened lines/total summary.
  const [ackSummary, setAckSummary] = useState<{
    lines: string;
    total: string;
    itemizedLines: {
      quantity: number;
      name: string;
      descriptor?: string;
      message?: string;
      detail?: string;
      price: string;
    }[];
    fulfillmentLine: string;
    sentAt: string;
  } | null>(null);
  const displayMessage = sentMessage || buildOrderMessage(order, catalog);

  const resolvedLines = resolveOrderLines(order, catalog);

  const whenNeededValue =
    order.whenNeeded.kind === "date" ? "date" : order.whenNeeded.kind;
  const itemCount = orderItemCount(order);

  function handleWhenNeededChange(value: string) {
    const next: WhenNeeded =
      value === "today"
        ? { kind: "today" }
        : value === "tomorrow"
          ? { kind: "tomorrow" }
          // Some browsers let a date be typed in rather than only picked
          // from the min-constrained widget — clamp rather than trust that.
          : { kind: "date", date: value < todayIsoDate() ? todayIsoDate() : value };
    setWhenNeeded(next);
  }

  function pickADate() {
    if (order.whenNeeded.kind === "date") return;
    setWhenNeeded({ kind: "date", date: todayIsoDate() });
  }

  function pickupSummary(): string {
    switch (order.whenNeeded.kind) {
      case "today":
        return `Today, from ${readyTime}`;
      case "tomorrow":
        return "Tomorrow";
      case "date":
        return formatShortDate(parseIsoDateLocal(order.whenNeeded.date));
      case "unsure":
        return "Not sure yet";
    }
  }

  function goToHandoff() {
    setSentMessage(buildOrderMessage(order, catalog));
    setManualStage("handoff");
  }

  function openWhatsApp() {
    const url = buildWhatsAppUrl(displayMessage);
    setSentUrl(url);
    // Persist before navigating — see the pendingHandoff comment above.
    startHandoff();
    openWhatsAppUrl(url);
    setManualStage("confirming");
  }

  function backToReview() {
    // Only an explicit decline from the "did you send it?" prompt counts
    // as ADR-003's 24-hour case — this same handler also runs for the
    // "Send order" screen's plain back button, before a handoff was ever
    // attempted, which shouldn't start any abandonment clock at all.
    if (order.pendingHandoff) declineHandoff();
    setManualStage("review");
  }

  function confirmSent() {
    // Freeze the chat link before clearing — if we recovered straight into
    // "confirming" after a reload, openWhatsApp() (which normally sets
    // this) never ran this session.
    setSentUrl((current) => current || buildWhatsAppUrl(displayMessage));
    setAckSummary({
      lines: resolvedLines
        .map(({ item, line }) => describeLine(item, line))
        .join(" · "),
      total: formatAed(orderTotal(order, catalog)),
      itemizedLines: resolvedLines.map(({ item, line }) => {
        const { tier, flavour } = resolveSelection(item, line);
        const price = lineTotal(item, line);
        return {
          quantity: line.quantity,
          name: item.name,
          descriptor: [tier?.label, flavour?.label].filter(Boolean).join(" · ") || undefined,
          message: line.cakeMessage,
          detail: line.customDescription,
          price: price === undefined ? "Ask us" : formatAed(price),
        };
      }),
      fulfillmentLine:
        order.fulfillment === "pickup"
          ? `Pickup · ${pickupSummary()} — ${CONFIG.address.line1}`
          : `Delivery · ${pickupSummary()}`,
      sentAt: formatTime(new Date()),
    });
    clearCart();
    setManualStage("acknowledged");
  }

  // — Acknowledged —
  if (stage === "acknowledged" && ackSummary) {
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
              {ackSummary.lines}
              <br />
              Total: {ackSummary.total}
            </p>
          </div>
          <div className={styles.stackedActions}>
            <Link href={ROUTES.menu} className={styles.primaryButton}>
              BACK TO MENU
            </Link>
            <a
              href={sentUrl}
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
              WHAT YOU SENT · {ackSummary.sentAt}
            </div>
            <div className={styles.desktopAckLines}>
              {ackSummary.itemizedLines.map((line, i) => (
                <div key={i} className={styles.desktopAckLine}>
                  <div>
                    <div className={styles.desktopAckLineName}>
                      {line.quantity}× {line.name}
                    </div>
                    {line.descriptor && (
                      <div className={styles.desktopAckLineDetail}>{line.descriptor}</div>
                    )}
                    {line.detail && (
                      <div className={styles.desktopAckLineDetail}>{line.detail}</div>
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
              <span className={styles.desktopAckTotalAmount}>{ackSummary.total}</span>
            </div>
            <div className={styles.desktopAckInfoBox}>
              {ackSummary.fulfillmentLine}
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
                href={sentUrl}
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

  // — Handoff review + "did you send it?" —
  if (stage === "handoff" || stage === "confirming") {
    const waUrl = sentUrl || buildWhatsAppUrl(displayMessage);
    return (
      <div className={styles.page}>
        <PageHeader title="Send order" backLabel="CART" onBack={backToReview} />
        <div className={styles.handoffWrap}>
          <div className={stage === "confirming" ? styles.dimmed : undefined}>
            <h1>This is the message we&apos;ll send</h1>
            <p className={styles.muted}>
              WhatsApp opens with it already typed. You still press send.
            </p>
            <pre className={styles.preview}>{displayMessage}</pre>
            <div className={styles.infoNote}>
              Your order opens in WhatsApp. Come back here and confirm you sent
              it.
            </div>
            {stage === "handoff" && (
              <button type="button" className={styles.tealButton} onClick={openWhatsApp}>
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
                <button type="button" className={styles.primaryButton} onClick={confirmSent}>
                  YES, SENT
                </button>
                <button type="button" className={styles.outlineButton} onClick={backToReview}>
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
              <pre className={styles.desktopPreview}>{displayMessage}</pre>
            </div>
            <div className={styles.infoNote}>
              We can&apos;t see your WhatsApp, so tell us once you&apos;ve sent
              it and we&apos;ll clear your order here.
            </div>
          </div>

          <div className={styles.qrPanel}>
            <div className={styles.qrTitle}>Scan with your phone</div>
            <QrCode value={waUrl} />
            <button type="button" className={styles.openWaLink} onClick={openWhatsApp}>
              Or open WhatsApp Web in another tab — the message will be
              waiting
            </button>
            <div className={styles.stackedActions}>
              <button type="button" className={styles.primaryButton} onClick={confirmSent}>
                I&apos;VE SENT IT
              </button>
              <button type="button" className={styles.outlineButton} onClick={backToReview}>
                BACK TO MY ORDER
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // — Review (default cart) —
  if (resolvedLines.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.mobileHeaderWrap}>
          <PageHeader title="Your order" backHref={ROUTES.menu} backLabel="MENU" />
        </div>
        <div className={styles.desktopHeaderWrap}>
          <Header />
        </div>
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

  return (
    <div className={styles.page}>
      <div className={styles.mobileHeaderWrap}>
        <PageHeader title="Your order" backHref={ROUTES.menu} backLabel="MENU" />
      </div>
      <div className={styles.desktopHeaderWrap}>
        <Header />
      </div>

      <div className={styles.desktopReview}>
        <div className={styles.mainColumn}>
          <h1 className={styles.desktopHeading}>Review your order</h1>

          <div className={styles.lineList}>
            {resolvedLines.map(({ item, line }) => (
              <CartLineItem key={line.lineId} item={item} line={line} />
            ))}
          </div>

          <section className={styles.section}>
            <div className={styles.sectionLabel}>WHEN DO YOU NEED IT?</div>
            <div className={styles.pillRow}>
              <button
                type="button"
                className={styles.pillOption}
                data-selected={whenNeededValue === "today"}
                onClick={() => handleWhenNeededChange("today")}
              >
                Today
                <span className={styles.pillSubtext}>from {readyTime}</span>
              </button>
              <button
                type="button"
                className={styles.pillOption}
                data-selected={whenNeededValue === "tomorrow"}
                onClick={() => handleWhenNeededChange("tomorrow")}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className={styles.pillOption}
                data-selected={whenNeededValue === "date"}
                onClick={pickADate}
              >
                Pick a date
              </button>
            </div>
            {order.whenNeeded.kind === "date" && (
              <input
                type="date"
                className={styles.dateInput}
                value={order.whenNeeded.date}
                min={todayIsoDate()}
                onChange={(e) => handleWhenNeededChange(e.target.value)}
              />
            )}
            <div className={styles.infoBox}>
              Everything here is ready within the hour. Pick a later slot if
              you&apos;d rather — delivery runs on top and is confirmed in chat.
            </div>
          </section>

          <div className={styles.sideBySide}>
            <section className={styles.section}>
              <div className={styles.sectionLabel}>PICKUP OR DELIVERY</div>
              <div className={styles.pillRow}>
                <button
                  type="button"
                  className={styles.pillOption}
                  data-selected={order.fulfillment === "pickup"}
                  onClick={() => setFulfillment("pickup")}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  className={styles.pillOption}
                  data-selected={order.fulfillment === "delivery"}
                  onClick={() => setFulfillment("delivery")}
                >
                  Delivery
                </button>
              </div>
              {order.fulfillment === "delivery" && (
                <p className={styles.deliveryNote}>
                  We&apos;ll confirm the delivery fee with you on WhatsApp — it
                  isn&apos;t priced on the site.
                </p>
              )}
              {/* Desktop only — mobile's pill row above already implies
                  the shop is the pickup point; this spells it out where
                  there's room, without changing mobile's copy. */}
              {order.fulfillment === "pickup" && (
                <p className={`${styles.deliveryNote} ${styles.desktopOnlyNote}`}>
                  Collect from {CONFIG.address.line1}, {CONFIG.address.line2}.
                </p>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionLabel}>YOUR NAME</div>
              <input
                type="text"
                className={`${styles.nameInput} no-focus-ring`}
                value={order.customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
              />
              <p className={`${styles.deliveryNote} ${styles.desktopOnlyNote}`}>
                So we know whose order it is when you message.
              </p>
            </section>
          </div>
        </div>

        {/* Desktop only — see docs/design/CLB-Hi-Fi-Screens.dc.html's
            "Review order — desktop": a persistent summary instead of
            mobile's totals-then-button-at-the-bottom flow. */}
        <aside className={styles.summaryColumn}>
          <div className={styles.summaryPanel}>
            <div className={styles.summaryTitle}>Summary</div>
            <div className={styles.summaryRow}>
              <span>Items ({itemCount})</span>
              <span>{formatAed(orderTotal(order, catalog))}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Collection</span>
              <span>{order.fulfillment === "pickup" ? pickupSummary() : "Not needed"}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>{order.fulfillment === "delivery" ? "Confirmed in chat" : "Not needed"}</span>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span>{formatAed(orderTotal(order, catalog))}</span>
            </div>
            {hasUnpricedLines(order, catalog) && (
              <p className={styles.disclaimer}>
                One or more items need a price confirmed with the bakery — the
                total above doesn&apos;t include those yet.
              </p>
            )}
            <button type="button" className={styles.tealButton} onClick={goToHandoff}>
              SEND ORDER ON WHATSAPP
            </button>
            <p className={styles.summaryNote}>
              Nothing is charged here. We confirm the price with you in chat.
            </p>
          </div>

          <div className={styles.howItWorksBox}>
            <div className={styles.sectionLabel}>HOW ORDERING WORKS</div>
            <p className={styles.disclaimer}>
              Your order opens as a message in WhatsApp. We reply to confirm
              the details, the price and the time — usually within the hour.
            </p>
          </div>
        </aside>
      </div>

      <section className={styles.totals}>
        <div className={`${styles.totalRow} ${styles.totalRowMuted}`}>
          <span>
            Items ({itemCount})
          </span>
          <span>{formatAed(orderTotal(order, catalog))}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.totalRowMuted}`}>
          <span>{order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</span>
          <span>{order.fulfillment === "delivery" ? "Confirmed in chat" : pickupSummary()}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total</span>
          <span>{formatAed(orderTotal(order, catalog))}</span>
        </div>
        {hasUnpricedLines(order, catalog) && (
          <p className={styles.disclaimer}>
            One or more items need a price confirmed with the bakery — the total
            above doesn&apos;t include those yet.
          </p>
        )}
        <p className={styles.disclaimer}>
          Prices reflect the menu as shown and don&apos;t include delivery. If you
          add a cake message, request changes, or choose delivery, the bakery
          will confirm final pricing with you on WhatsApp.
        </p>
      </section>

      <button type="button" className={styles.tealButtonBlock} onClick={goToHandoff}>
        SEND ORDER ON WHATSAPP
      </button>

      <Footer />
    </div>
  );
}
