// Date helpers shared across the WhatsApp message formatting and the
// cart's "when needed" picker — both need to parse/format the same
// "YYYY-MM-DD" shape consistently.

/** "Aug 29" style — used everywhere a date is shown without a year. */
export function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
