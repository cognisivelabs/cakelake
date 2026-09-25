"use client";

import { useEffect, useEffectEvent } from "react";
import { useCart } from "@/context/CartContext";
import {
  estimatedReadyTime,
  sameDayCutoffLabel,
  sameDayCutoffPassed,
  sameDayOrderingNotYetOpen,
  sameDayOrderingOpensAtLabel,
  todayIsoDate,
} from "@/lib/dates";
import type { WhenNeeded } from "@/types/order";
import styles from "./cart.module.css";

// "When do you need it?" — Today / Tomorrow / Pick a date. Today closes
// when the shop isn't open yet or the day's cutoff (earlier for
// delivery) has passed.
export function WhenNeededPicker() {
  const { order, setWhenNeeded } = useCart();
  const kind = order.whenNeeded.kind;
  const readyTime = estimatedReadyTime();
  const tooEarly = sameDayOrderingNotYetOpen();
  const cutoffPassed = sameDayCutoffPassed(order.fulfillment);
  const todayUnavailable = tooEarly || cutoffPassed;

  // "Today" can go from available to not (the shop isn't open yet, past
  // the cutoff, or the customer switches to delivery's earlier cutoff)
  // without the customer touching this control at all — drop a
  // now-invalid "today" selection to "tomorrow" instead of silently
  // letting an order that can't be fulfilled today stay selected.
  const moveOffToday = useEffectEvent(() => setWhenNeeded({ kind: "tomorrow" }));
  useEffect(() => {
    if (kind === "today" && todayUnavailable) moveOffToday();
  }, [kind, todayUnavailable]);

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
    if (kind === "date") return;
    setWhenNeeded({ kind: "date", date: todayIsoDate() });
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>WHEN DO YOU NEED IT?</div>
      <div className={styles.pillRow}>
        <button
          type="button"
          className={styles.pillOption}
          data-selected={kind === "today"}
          disabled={todayUnavailable}
          onClick={() => handleWhenNeededChange("today")}
        >
          Today
          <span className={styles.pillSubtext}>
            {cutoffPassed
              ? `Order by ${sameDayCutoffLabel(order.fulfillment)}`
              : tooEarly
                ? `Opens at ${sameDayOrderingOpensAtLabel()}`
                : `from ${readyTime}`}
          </span>
        </button>
        <button
          type="button"
          className={styles.pillOption}
          data-selected={kind === "tomorrow"}
          onClick={() => handleWhenNeededChange("tomorrow")}
        >
          Tomorrow
        </button>
        <button
          type="button"
          className={styles.pillOption}
          data-selected={kind === "date"}
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
  );
}
