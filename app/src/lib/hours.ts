export type DayHours = { day: string; hours: string };

/**
 * Collapses consecutive days sharing the same hours into one "Day - Day"
 * range (or a bare day name for a range of one) — so config.ts's compact
 * two-row summary (Footer, mobile) can be derived from its per-day
 * schedule (Find us — desktop) instead of the two being separate
 * hand-typed copies that could silently drift apart.
 */
export function groupOpeningHours(byDay: readonly DayHours[]): { days: string; hours: string }[] {
  const groups: { days: string[]; hours: string }[] = [];
  for (const entry of byDay) {
    const current = groups[groups.length - 1];
    if (current && current.hours === entry.hours) {
      current.days.push(entry.day);
    } else {
      groups.push({ days: [entry.day], hours: entry.hours });
    }
  }
  return groups.map(({ days, hours }) => ({
    days: days.length > 1 ? `${days[0]} - ${days[days.length - 1]}` : days[0],
    hours,
  }));
}
