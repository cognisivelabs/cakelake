const listFormatter = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

/** "talabat, noon and Careem" — no Oxford comma, matching the Hi-Fi's copy. */
export function formatList(items: readonly string[]): string {
  return listFormatter.format(items);
}
