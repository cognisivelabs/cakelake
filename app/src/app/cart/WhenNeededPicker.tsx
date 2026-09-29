"use client";

import { useEffect, useEffectEvent } from "react";
import { useCart } from "@/context/CartContext";
import { getCatalog, readyLabel } from "@/lib/catalog";
import {
  earliestNeededIsoDate,
  estimatedReadyTime,
  fitWhenNeeded,
  formatShortDate,
  isoDateInDays,
  parseIsoDateLocal,
  sameDayCutoffLabel,
  sameDayCutoffPassed,
  sameDayOrderingNotYetOpen,
  sameDayOrderingOpensAtLabel,
} from "@/lib/dates";
import { orderLeadTimeHours } from "@/lib/order";
import type { WhenNeeded } from "@/types/order";
import styles from "./cart.module.css";

// "When do you need it?" — Today / Tomorrow / Pick a date. Dates before
// the cart's lead time allows are disabled; Today also closes when the
// shop isn't open yet or the day's cutoff (earlier for delivery) has
// passed.
export function WhenNeededPicker() {
  const { order, setWhenNeeded } = useCart();
  const kind = order.whenNeeded.kind;
  const readyTime = estimatedReadyTime();
  const tooEarly = sameDayOrderingNotYetOpen();
  const cutoffPassed = sameDayCutoffPassed(order.fulfillment);
  const leadTimeHours = orderLeadTimeHours(order, getCatalog());
  const earliestIso = earliestNeededIsoDate(leadTimeHours);
  const tomorrowIso = isoDateInDays(1);
  const needsNotice = leadTimeHours > 0;
  const todayUnavailable = needsNotice || tooEarly || cutoffPassed;
  const tomorrowUnavailable = earliestIso > tomorrowIso;

  // The allowed dates can change without the customer touching this
  // control (the shop isn't open yet, past the cutoff, delivery's earlier
  // cutoff, a notice item added) — move a now-invalid selection to the
  // earliest valid one.
  const fitted = fitWhenNeeded(order.whenNeeded, earliestIso, !(tooEarly || cutoffPassed));
  const moveToFitted = useEffectEvent(() => setWhenNeeded(fitted));
  const outOfRange = fitted !== order.whenNeeded;
  useEffect(() => {
    if (outOfRange) moveToFitted();
  }, [outOfRange]);

  function handleWhenNeededChange(value: string) {
    const next: WhenNeeded =
      value === "today"
        ? { kind: "today" }
        : value === "tomorrow"
          ? { kind: "tomorrow" }
          // Some browsers let a date be typed in rather than only picked
          // from the min-constrained widget — clamp rather than trust that.
          : { kind: "date", date: value < earliestIso ? earliestIso : value };
    setWhenNeeded(next);
  }

  function pickADate() {
    if (kind === "date") return;
    setWhenNeeded({ kind: "date", date: earliestIso });
  }

  const earliestText = earliestIso === tomorrowIso ? "tomorrow" : formatShortDate(parseIsoDateLocal(earliestIso));

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
            {needsNotice
              ? "Needs notice"
              : cutoffPassed
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
          disabled={tomorrowUnavailable}
          onClick={() => handleWhenNeededChange("tomorrow")}
        >
          Tomorrow
          {tomorrowUnavailable && <span className={styles.pillSubtext}>Needs notice</span>}
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
          min={earliestIso}
          onChange={(e) => handleWhenNeededChange(e.target.value)}
        />
      )}
      <div className={styles.infoBox}>
        {needsNotice ? (
          <>
            Something here needs {readyLabel({ leadTimeHours }).toLowerCase()}, so the earliest is{" "}
            {earliestText}. Delivery runs on top and is confirmed in chat.
          </>
        ) : (
          <>
            Everything here is ready within the hour. Pick a later slot if
            you&apos;d rather — delivery runs on top and is confirmed in chat.
          </>
        )}
      </div>
    </section>
  );
}
