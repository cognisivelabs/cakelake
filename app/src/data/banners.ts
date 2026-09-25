import { ROUTES } from "@/lib/routes";

export type Banner = {
  id: string;
  /** Small pill above the headline, e.g. "READY IN 1 HOUR". */
  badge: string;
  /** Headline, one entry per line. */
  title: string[];
  body: string;
  cta: { label: string; href: string };
  /** Banner photo, when there is one — otherwise the design's beige
   * placeholder panel. */
  imageUrl?: string;
};

/**
 * Home's hero banners, auto-rotating in order when there's more than
 * one. The design has three; only the first is written so far — the
 * client is supplying the other two, which are added here as more
 * entries (nothing else needs to change).
 */
export const HOME_BANNERS: Banner[] = [
  {
    id: "ready-in-an-hour",
    badge: "READY IN 1 HOUR",
    title: ["Eggless cakes,", "baked after you order"],
    body: "Classic, Premium, Exotic and Exotic Premium leave the counter about an hour after we confirm on WhatsApp.",
    cta: { label: "ORDER A CAKE", href: ROUTES.menu },
  },
];
