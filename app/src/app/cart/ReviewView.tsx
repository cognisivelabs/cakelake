"use client";

import { CartLineItem } from "@/components/CartLineItem";
import { Footer } from "@/components/Footer";
import { ResponsiveHeader } from "@/components/ResponsiveHeader";
import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { CONFIG } from "@/lib/config";
import { estimatedReadyTime } from "@/lib/dates";
import { orderItemCount, resolveOrderLines } from "@/lib/order";
import { describeWhenNeeded } from "@/lib/orderSummary";
import { formatAed, hasUnpricedLines, orderTotal } from "@/lib/pricing";
import { ROUTES } from "@/lib/routes";
import { WhenNeededPicker } from "./WhenNeededPicker";
import styles from "./cart.module.css";

function UnpricedNote() {
  return (
    <p className={styles.disclaimer}>
      One or more items need a price confirmed with the bakery — the total above doesn&apos;t include those
      yet.
    </p>
  );
}

// The default cart: the lines, when and how the customer wants the order,
// their name, and the totals with the button that hands off to WhatsApp.
export function ReviewView({ onSend }: { onSend: () => void }) {
  const { order, setFulfillment, setCustomerName } = useCart();
  const catalog = getCatalog();
  const resolvedLines = resolveOrderLines(order, catalog);
  const itemCount = orderItemCount(order);
  const pickupSummary = describeWhenNeeded(order.whenNeeded, estimatedReadyTime());
  const total = formatAed(orderTotal(order, catalog));
  const hasUnpriced = hasUnpricedLines(order, catalog);

  return (
    <div className={styles.page}>
      <ResponsiveHeader title="Your order" backHref={ROUTES.menu} backLabel="MENU" />

      <div className={styles.desktopReview}>
        <div className={styles.mainColumn}>
          <h1 className={styles.desktopHeading}>Review your order</h1>

          <div className={styles.lineList}>
            {resolvedLines.map(({ item, line }) => (
              <CartLineItem key={line.lineId} item={item} line={line} />
            ))}
          </div>

          <WhenNeededPicker />

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
              <span>{total}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Collection</span>
              <span>{order.fulfillment === "pickup" ? pickupSummary : "Not needed"}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>{order.fulfillment === "delivery" ? "Confirmed in chat" : "Not needed"}</span>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span>{total}</span>
            </div>
            {hasUnpriced && <UnpricedNote />}
            <button type="button" className={styles.tealButton} onClick={onSend}>
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
          <span>{total}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.totalRowMuted}`}>
          <span>{order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</span>
          <span>{order.fulfillment === "delivery" ? "Confirmed in chat" : pickupSummary}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total</span>
          <span>{total}</span>
        </div>
        {hasUnpriced && <UnpricedNote />}
        <p className={styles.disclaimer}>
          Prices reflect the menu as shown and don&apos;t include delivery. If you
          add a cake message, request changes, or choose delivery, the bakery
          will confirm final pricing with you on WhatsApp.
        </p>
      </section>

      <button type="button" className={styles.tealButtonBlock} onClick={onSend}>
        SEND ORDER ON WHATSAPP
      </button>

      <Footer />
    </div>
  );
}
