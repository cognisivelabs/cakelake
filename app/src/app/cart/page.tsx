"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { deliveryFee, orderTotal, subtotal, formatAed } from "@/lib/pricing";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { CartLineItem } from "@/components/CartLineItem";
import type { WhenNeeded } from "@/types/order";
import styles from "./cart.module.css";

export default function CartPage() {
  const { order, setFulfillment, setWhenNeeded, clearCart } = useCart();
  const catalog = getCatalog();
  const [handoff, setHandoff] = useState<{ message: string; url: string } | null>(
    null,
  );

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

  function handlePlaceOrder() {
    const message = buildOrderMessage(order, catalog);
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setHandoff({ message, url });
  }

  if (handoff) {
    return (
      <div>
        <h1>Sending your order to WhatsApp</h1>
        <p>
          We&apos;ve opened WhatsApp with your order ready to send. Your
          order is only confirmed once you actually send that message.
        </p>
        <pre className={styles.preview}>{handoff.message}</pre>
        <p>
          Didn&apos;t open?{" "}
          <a href={handoff.url} target="_blank" rel="noopener noreferrer">
            Open WhatsApp
          </a>
        </p>
        <div className={styles.handoffActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              clearCart();
              setHandoff(null);
            }}
          >
            Yes, sent it
          </button>
          <button type="button" onClick={() => setHandoff(null)}>
            No, take me back to my cart
          </button>
        </div>
      </div>
    );
  }

  if (resolvedLines.length === 0) {
    return (
      <div>
        <h1>Your cart</h1>
        <p>Your cart is empty. Head to the menu to add something.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your cart</h1>

      <div>
        {resolvedLines.map(({ item, line }) => (
          <CartLineItem key={line.lineId} item={item} line={line} />
        ))}
      </div>

      <section className={styles.section}>
        <h2>Pickup or delivery?</h2>
        <label className={styles.radioRow}>
          <input
            type="radio"
            name="fulfillment"
            checked={order.fulfillment === "pickup"}
            onChange={() => setFulfillment("pickup")}
          />
          Pickup — free
        </label>
        <label className={styles.radioRow}>
          <input
            type="radio"
            name="fulfillment"
            checked={order.fulfillment === "delivery"}
            onChange={() => setFulfillment("delivery")}
          />
          Delivery — {formatAed(25)}
        </label>
      </section>

      <section className={styles.section}>
        <h2>When do you need this?</h2>
        <select
          value={whenNeededValue}
          onChange={(e) => handleWhenNeededChange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="unsure">Not sure yet — I&apos;ll confirm on WhatsApp</option>
        </select>
      </section>

      <section className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>{formatAed(subtotal(order, catalog))}</span>
        </div>
        {order.fulfillment === "delivery" && (
          <div className={styles.totalRow}>
            <span>Delivery</span>
            <span>{formatAed(deliveryFee(order))}</span>
          </div>
        )}
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total</span>
          <span>{formatAed(orderTotal(order, catalog))}</span>
        </div>
        <p className={styles.disclaimer}>
          Prices reflect the menu as shown. If you add a cake message or
          request changes, the bakery will confirm final pricing with you on
          WhatsApp.
        </p>
      </section>

      <button
        type="button"
        className={styles.placeOrderButton}
        onClick={handlePlaceOrder}
      >
        Place Order via WhatsApp
      </button>
    </div>
  );
}
