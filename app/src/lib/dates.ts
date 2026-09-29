// Date helpers shared across the WhatsApp message formatting and the
// cart's "when needed" picker — both need to parse/format the same
// "YYYY-MM-DD" shape consistently.
import { CONFIG } from "@/lib/config";
import type { Fulfillment, WhenNeeded } from "@/types/order";

/** "Aug 29" style — used everywhere a date is shown without a year. */
export function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "9:41 AM" style — the customer-facing time format used for both the
 * same-day "ready by" estimate and the WhatsApp handoff timestamp. */
export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** A rough same-day estimate: now plus CONFIG.sameDayPrepHours. Only
 * shown for "today", which a cart with any notice item can't pick
 * (see fitWhenNeeded). */
export function estimatedReadyTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + CONFIG.sameDayPrepHours);
  return formatTime(d);
}

/**
 * Parses a "YYYY-MM-DD" string as local midnight, not UTC midnight —
 * `new Date(iso)` parses as UTC, which rolls back to the previous
 * calendar day in any timezone ahead of UTC. Matches todayIsoDate()'s
 * local-date convention below.
 */
export function parseIsoDateLocal(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

type ClockTime = { hour: number; minute: number };

function minutesSinceMidnight(t: ClockTime): number {
  return t.hour * 60 + t.minute;
}

function nowMinutesSinceMidnight(): number {
  const now = new Date();
  return minutesSinceMidnight({ hour: now.getHours(), minute: now.getMinutes() });
}

/** "11:30 PM" style — today's date at the given clock time, formatted.
 * Used to show the customer a cutoff/opening time next to a disabled
 * "Today" option. */
function timeLabel(t: ClockTime): string {
  const d = new Date();
  d.setHours(t.hour, t.minute, 0, 0);
  return formatTime(d);
}

/** CONFIG.sameDayPickupCutoff for pickup, CONFIG.sameDayDeliveryCutoff
 * for delivery — delivery's is earlier since the cake still has to be
 * baked and then delivered by the same pickup cutoff. */
function sameDayCutoff(fulfillment: Fulfillment): ClockTime {
  return fulfillment === "delivery" ? CONFIG.sameDayDeliveryCutoff : CONFIG.sameDayPickupCutoff;
}

/**
 * Whether it's already too late, right now, to place a same-day order
 * for the given fulfillment — see sameDayCutoff. Evaluated against the
 * current time at call time, not kept live-updating while a page sits
 * open across the cutoff (matches todayIsoDate()/estimatedReadyTime()'s
 * same per-call convention).
 */
export function sameDayCutoffPassed(fulfillment: Fulfillment): boolean {
  return nowMinutesSinceMidnight() >= minutesSinceMidnight(sameDayCutoff(fulfillment));
}

/** "11:30 PM" style — the cutoff time shown next to a disabled "Today"
 * option so the customer knows why and when it stops being available. */
export function sameDayCutoffLabel(fulfillment: Fulfillment): string {
  return timeLabel(sameDayCutoff(fulfillment));
}

/**
 * Whether the shop hasn't opened yet, right now — a same-day order
 * (pickup or delivery) can't be placed before CONFIG.sameDayOrderingOpensAt,
 * since there's no one there yet to start baking it.
 */
export function sameDayOrderingNotYetOpen(): boolean {
  return nowMinutesSinceMidnight() < minutesSinceMidnight(CONFIG.sameDayOrderingOpensAt);
}

/** "10:00 AM" style — the opening time shown next to a disabled "Today"
 * option when it's too early in the day, so the customer knows when it
 * becomes available. */
export function sameDayOrderingOpensAtLabel(): string {
  return timeLabel(CONFIG.sameDayOrderingOpensAt);
}

/**
 * Today's date in the viewer's local timezone, as "YYYY-MM-DD".
 * toISOString() converts to UTC first, which is wrong here for the same
 * reason as parseIsoDateLocal above.
 */
export function todayIsoDate(): string {
  return isoDateInDays(0);
}

/** The local date `days` days from today, as "YYYY-MM-DD". */
export function isoDateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** The earliest "YYYY-MM-DD" an order with this lead time can be needed:
 * today for 0, then one more day per started 24 hours (24 → tomorrow,
 * 72 → three days out). */
export function earliestNeededIsoDate(leadTimeHours: number): string {
  return isoDateInDays(Math.ceil(leadTimeHours / 24));
}

/**
 * `whenNeeded` if it's on or after `earliestIso` (and, for "today", while
 * same-day ordering is open) — otherwise the earliest choice that is:
 * "tomorrow" when that's allowed, else a date of `earliestIso`.
 */
export function fitWhenNeeded(whenNeeded: WhenNeeded, earliestIso: string, todayOpen: boolean): WhenNeeded {
  const tomorrowIso = isoDateInDays(1);
  const fits =
    whenNeeded.kind === "today"
      ? todayOpen && earliestIso <= todayIsoDate()
      : whenNeeded.kind === "tomorrow"
        ? earliestIso <= tomorrowIso
        : whenNeeded.kind === "date"
          ? whenNeeded.date >= earliestIso
          : true;
  if (fits) return whenNeeded;
  return earliestIso <= tomorrowIso ? { kind: "tomorrow" } : { kind: "date", date: earliestIso };
}
