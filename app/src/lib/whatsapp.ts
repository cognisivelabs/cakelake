import type { CatalogItem } from "@/types/catalog";
import type { CartLine, Order, WhenNeeded } from "@/types/order";
import { CONFIG } from "@/lib/config";
import { lineTotal, orderTotal, formatAed } from "@/lib/pricing";

// Matches docs/adr/ADR-003-whatsapp-order-handoff.md's template, updated
// for the weight/flavour pricing model and the optional name field.

function formatItemLine(item: CatalogItem, line: CartLine): string {
  const tier = item.weightTiers.find((t) => t.id === line.weightTierId);
  const flavour = item.flavours.find((f) => f.id === line.flavourId);
  const descriptors = [tier?.label, flavour?.label].filter(Boolean).join(", ");
  const namePart = descriptors ? `${item.name}, ${descriptors}` : item.name;

  const total = lineTotal(item, line);
  const priceText = total === undefined ? "price to confirm" : formatAed(total);

  const detailLines: string[] = [];
  if (line.customDescription?.trim()) {
    detailLines.push(`   Design: ${line.customDescription.trim()}`);
  }
  if (line.cakeMessage?.trim()) {
    detailLines.push(`   Message: "${line.cakeMessage.trim()}"`);
  }

  return [`${line.quantity}× ${namePart} — ${priceText}`, ...detailLines].join("\n");
}

function formatWhenNeeded(whenNeeded: WhenNeeded): string {
  const shortDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  switch (whenNeeded.kind) {
    case "today":
      return `Needed: Today, ${shortDate(new Date())}`;
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

  const itemLines = resolvedLines.map(({ item, line }) => formatItemLine(item, line));

  // Client-confirmed: keep the name field, but never send a placeholder —
  // if it's blank, the header just reads "New order" with no name.
  const name = order.customerName.trim();
  const header = name ? `New order — ${name}` : "New order";

  const fulfillmentLine = order.fulfillment === "delivery" ? "Delivery" : "Pickup";

  const lines = [
    header,
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

/**
 * The bakery's wa.me link — with a pre-filled message for the order
 * handoff, or bare for every general "message us" link across the site,
 * so the URL format only exists in one place.
 */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${CONFIG.bakeryWhatsAppNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * An installed PWA has a single window — window.open(url, "_blank") has
 * nowhere to open a new tab into, so it can navigate that one window away
 * to the wa.me URL instead, wiping the app's in-memory state. A real
 * anchor click is handled the same way a link tap would be, which mobile
 * platforms are more consistent about routing to an external app/tab
 * rather than the PWA's own window.
 */
export function openWhatsAppUrl(url: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
