// Date helpers shared across the WhatsApp message formatting and the
// cart's "when needed" picker — both need to parse/format the same
// "YYYY-MM-DD" shape consistently.
import { CONFIG } from "@/lib/config";
import type { Fulfillment } from "@/types/order";

/** "Aug 29" style — used everywhere a date is shown without a year. */
export function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "9:41 AM" style — the customer-facing time format used for both the
 * same-day "ready by" estimate and the WhatsApp handoff timestamp. */
export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** A rough same-day estimate — every standard range is "ready in an
 * hour" (CONFIG.sameDayPrepHours). Items that need real advance notice
 * aren't meant to be ordered for today in the first place, so this
 * doesn't try to account for those. */
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

/** CONFIG.sameDayPickupCutoff for pickup, CONFIG.sameDayDeliveryCutoff
 * for delivery — delivery's is earlier since the cake still has to be
 * baked and then delivered by the same pickup cutoff. */
function sameDayCutoff(fulfillment: Fulfillment): { hour: number; minute: number } {
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
  const cutoff = sameDayCutoff(fulfillment);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= cutoff.hour * 60 + cutoff.minute;
}

/** "11:30 PM" style — the cutoff time shown next to a disabled "Today"
 * option so the customer knows why and when it stops being available. */
export function sameDayCutoffLabel(fulfillment: Fulfillment): string {
  const cutoff = sameDayCutoff(fulfillment);
  const d = new Date();
  d.setHours(cutoff.hour, cutoff.minute, 0, 0);
  return formatTime(d);
}

/**
 * Today's date in the viewer's local timezone, as "YYYY-MM-DD".
 * toISOString() converts to UTC first, which is wrong here for the same
 * reason as parseIsoDateLocal above.
 */
export function todayIsoDate(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
