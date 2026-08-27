import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order, WhenNeeded } from "@/types/order";
import { CONFIG } from "@/lib/config";
import { deliveryFee, orderTotal, formatAed } from "@/lib/pricing";

// Exact template from docs/adr/ADR-003-whatsapp-order-handoff.md — one
// line per item (name, options, quantity, inscription), then
// fulfillment, when-needed, and total each on their own line.

function formatOptions(item: CatalogItem, line: CartLine): string {
  const labels = item.optionGroups
    .map((group) => {
      const chosenId = line.selectedOptions[group.id];
      return group.choices.find((c) => c.id === chosenId)?.label;
    })
    .filter((label): label is string => Boolean(label));
  return labels.length > 0 ? ` (${labels.join(", ")})` : "";
}

function formatLine(item: CatalogItem, line: CartLine, index: number): string {
  const options = formatOptions(item, line);
  const inscription = line.cakeMessage
    ? ` — "${line.cakeMessage.trim()}"`
    : "";
  return `${index + 1}. ${item.name}${options} x${line.quantity}${inscription}`;
}

function formatWhenNeeded(whenNeeded: WhenNeeded): string {
  const shortDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  switch (whenNeeded.kind) {
    case "today": {
      return `Needed: Today, ${shortDate(new Date())}`;
    }
    case "tomorrow": {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `Needed: Tomorrow, ${shortDate(tomorrow)}`;
    }
    case "date": {
      // whenNeeded.date is an ISO yyyy-mm-dd string from a <input type="date">.
      const d = new Date(`${whenNeeded.date}T00:00:00`);
      return `Needed: ${shortDate(d)}`;
    }
    case "unsure":
      return "Needed: Not sure yet — I'll confirm on WhatsApp";
  }
}

export function buildOrderMessage(order: Order, catalog: CatalogItem[]): string {
  const resolvedLines = order.lines
    .map((line) => {
      const item = catalog.find((c) => c.id === line.itemId);
      return item ? { item, line } : null;
    })
    .filter((x): x is { item: CatalogItem; line: CartLine } => x !== null);

  const itemLines = resolvedLines.map(({ item, line }, i) =>
    formatLine(item, line, i),
  );

  const fee = deliveryFee(order);
  const fulfillmentLine =
    order.fulfillment === "delivery"
      ? `Delivery (${formatAed(fee)})`
      : "Pickup";

  const lines = [
    "Order from the Cake Lake website 🎂",
    "",
    ...itemLines,
    "",
    fulfillmentLine,
    formatWhenNeeded(order.whenNeeded),
    `Total: ${formatAed(orderTotal(order, catalog))}`,
    "",
    "Sent via the website",
  ];

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONFIG.bakeryWhatsAppNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
