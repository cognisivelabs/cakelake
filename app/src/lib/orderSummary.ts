import type { CatalogItem } from "@/types/catalog";
import type { Order, WhenNeeded } from "@/types/order";
import { CONFIG } from "@/lib/config";
import { formatShortDate, formatTime, parseIsoDateLocal } from "@/lib/dates";
import { describeLine, resolveOrderLines, resolveSelection } from "@/lib/order";
import { formatAed, lineTotal, orderTotal } from "@/lib/pricing";

/** When the customer needs the order, in the words the cart shows them.
 * (The WhatsApp message words it differently — see lib/whatsapp.) */
export function describeWhenNeeded(whenNeeded: WhenNeeded, readyTime: string): string {
  switch (whenNeeded.kind) {
    case "today":
      return `Today, from ${readyTime}`;
    case "tomorrow":
      return "Tomorrow";
    case "date":
      return formatShortDate(parseIsoDateLocal(whenNeeded.date));
    case "unsure":
      return "Not sure yet";
  }
}

/** The recap shown after an order is sent. The itemised lines, fulfilment
 * line and sent-at time feed the desktop screen's fuller recap; mobile
 * shows just `lines` and `total`. */
export type AckSummary = {
  lines: string;
  total: string;
  itemizedLines: {
    quantity: number;
    name: string;
    descriptor?: string;
    message?: string;
    price: string;
  }[];
  fulfillmentLine: string;
  sentAt: string;
};

/** Snapshots the order into its post-send recap — taken before the cart
 * is cleared, since nothing is left to read afterwards. */
export function buildAckSummary(
  order: Order,
  catalog: CatalogItem[],
  readyTime: string,
  sentAt: Date,
): AckSummary {
  const resolved = resolveOrderLines(order, catalog);
  const when = describeWhenNeeded(order.whenNeeded, readyTime);
  return {
    lines: resolved.map(({ item, line }) => describeLine(item, line)).join(" · "),
    total: formatAed(orderTotal(order, catalog)),
    itemizedLines: resolved.map(({ item, line }) => {
      const { tier } = resolveSelection(item, line);
      const price = lineTotal(item, line);
      return {
        quantity: line.quantity,
        name: item.name,
        descriptor: tier?.label,
        message: line.cakeMessage,
        price: price === undefined ? "Ask us" : formatAed(price),
      };
    }),
    fulfillmentLine:
      order.fulfillment === "pickup"
        ? `Pickup · ${when} — ${CONFIG.address.line1}`
        : `Delivery · ${when}`,
    sentAt: formatTime(sentAt),
  };
}
