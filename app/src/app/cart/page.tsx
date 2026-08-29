"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { orderTotal, hasUnpricedLines, formatAed } from "@/lib/pricing";
import { buildOrderMessage, buildWhatsAppUrl, openWhatsAppUrl } from "@/lib/whatsapp";
import { CartLineItem } from "@/components/CartLineItem";
import { CONFIG } from "@/lib/config";
import { Header } from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import type { WhenNeeded } from "@/types/order";
import styles from "./cart.module.css";

type Stage = "review" | "handoff" | "confirming" | "acknowledged";

export default function CartPage() {
  const { order, setFulfillment, setWhenNeeded, setCustomerName, setPendingHandoff, clearCart } =
    useCart();
  const catalog = getCatalog();
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
  const [ackSummary, setAckSummary] = useState<{ lines: string; total: string } | null>(null);
  const displayMessage = sentMessage || buildOrderMessage(order, catalog);

  const resolvedLines = order.lines
    .map((line) => {
      const item = catalog.find((c) => c.id === line.itemId);
      return item ? { item, line } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const whenNeededValue =
    order.whenNeeded.kind === "date" ? order.whenNeeded.date : order.whenNeeded.kind;

  function handleWhenNeededChange(value: string) {
    const next: WhenNeeded =
      value === "today"
        ? { kind: "today" }
        : value === "tomorrow"
          ? { kind: "tomorrow" }
          : value === "unsure"
            ? { kind: "unsure" }
            : { kind: "date", date: value };
    setWhenNeeded(next);
  }

  function goToHandoff() {
    setSentMessage(buildOrderMessage(order, catalog));
    setManualStage("handoff");
  }

  function openWhatsApp() {
    const url = buildWhatsAppUrl(displayMessage);
    setSentUrl(url);
    // Persist before navigating — see the pendingHandoff comment above.
    setPendingHandoff(true);
    openWhatsAppUrl(url);
    setManualStage("confirming");
  }

  function backToReview() {
    setPendingHandoff(false);
    setManualStage("review");
  }

  function confirmSent() {
    // Freeze the chat link before clearing — if we recovered straight into
    // "confirming" after a reload, openWhatsApp() (which normally sets
    // this) never ran this session.
    setSentUrl((current) => current || buildWhatsAppUrl(displayMessage));
    setAckSummary({
      lines: resolvedLines
        .map(({ item, line }) => {
          const tier = item.weightTiers.find((t) => t.id === line.weightTierId);
          const flavour = item.flavours.find((f) => f.id === line.flavourId);
          const descriptors = [tier?.label, flavour?.label].filter(Boolean).join(", ");
          return descriptors ? `${item.name}, ${descriptors}` : item.name;
        })
        .join(" · "),
      total: formatAed(orderTotal(order, catalog)),
    });
    clearCart();
    setManualStage("acknowledged");
  }

  // — Acknowledged —
  if (stage === "acknowledged" && ackSummary) {
    return (
      <div>
        <Header />
        <div className={styles.centered}>
          <div className={styles.checkCircle}>✓</div>
          <h1>Order sent</h1>
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
            <Link href="/menu" className={styles.primaryButton}>
              BACK TO MENU
            </Link>
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tealOutlineButton}
            >
              OPEN THE CHAT AGAIN
            </a>
          </div>
        </div>
      </div>
    );
  }

  // — Handoff review + "did you send it?" —
  if (stage === "handoff" || stage === "confirming") {
    return (
      <div>
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
      </div>
    );
  }

  // — Review (default cart) —
  if (resolvedLines.length === 0) {
    return (
      <div>
        <PageHeader title="Your order" backHref="/menu" backLabel="MENU" />
        <div className={styles.centered}>
          <div className={styles.emptyCircle}>0</div>
          <h1>Nothing in your order yet</h1>
          <p className={styles.muted}>Add a cake and it&apos;ll show up here.</p>
          <div className={styles.stackedActions}>
            <Link href="/menu" className={styles.primaryButton}>
              BROWSE MENU
            </Link>
            <a
              href={`https://wa.me/${CONFIG.bakeryWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tealOutlineButton}
            >
              ASK US FOR SOMETHING CUSTOM
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Your order" backHref="/menu" backLabel="MENU" />

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
            data-selected={whenNeededValue === "unsure"}
            onClick={() => handleWhenNeededChange("unsure")}
          >
            Not sure yet
          </button>
        </div>
      </section>

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
            We&apos;ll confirm the delivery fee with you on WhatsApp — it isn&apos;t
            priced on the site.
          </p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>YOUR NAME</div>
        <input
          type="text"
          className={styles.nameInput}
          value={order.customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Full Name"
        />
      </section>

      <section className={styles.totals}>
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
    </div>
  );
}
