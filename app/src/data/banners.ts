import { SPECIAL_ITEM_IDS } from "@/data/items";
import { getItemById } from "@/lib/catalog";
import { formatAed } from "@/lib/pricing";
import { itemRoute, ROUTES } from "@/lib/routes";

export type Banner = {
  id: string;
  /** "light" is the soft panel; "brand" is the deep, promotional one. */
  tone?: "light" | "brand";
  /** Small pill above the headline, e.g. "READY IN 1 HOUR". */
  badge: string;
  /** Headline, one entry per line. */
  title: string[];
  body: string;
  cta: { label: string; href: string };
  /** A quieter second link beside the button. */
  secondaryCta?: { label: string; href: string };
  /** The banner's own photo. In the "photo" hero style (CONFIG.heroStyle)
   * it bleeds behind the whole banner — see docs CLB Desktop Home v2,
   * screens 6a/6b (light) and 7a/7b (brand). In "boxed" it's a plain
   * background photo (light) or a framed picture beside the text (brand). */
  imageUrl?: string;
  photoUrl?: string;
};

// The Photo cakes banner quotes the real per-kilo price rather than a
// typed-in number that could drift from the menu.
const photoCakes = getItemById(SPECIAL_ITEM_IDS.photoCakes);
const photoPerKg = photoCakes?.weightTiers.find((tier) => tier.id === "1kg")?.price;

/**
 * Home's hero banners, auto-rotating in order when there's more than
 * one (see docs CLB Desktop Home v2). The design's third slide — a
 * seasonal Halloween banner — is left out until the client supplies
 * the seasonal cakes it would link to; add it here as another entry.
 */
export const HOME_BANNERS: Banner[] = [
  {
    id: "ready-in-an-hour",
    tone: "light",
    badge: "READY IN 1 HOUR",
    title: ["Eggless cakes,", "baked after you order"],
    body: "Classic, Premium, Exotic and Exotic Premium leave the counter about an hour after we confirm on WhatsApp.",
    cta: { label: "ORDER A CAKE", href: ROUTES.menu },
    secondaryCta: { label: "See all categories →", href: ROUTES.menu },
    // Stand-in, like the design's own placeholder photo — swap for a real
    // shot of the Karama counter when the client supplies one.
    imageUrl: "/images/premium-dark-chocolate-truffle.jpg",
    photoUrl: "/images/premium-dark-chocolate-truffle.jpg",
  },
  {
    id: "photo-cakes",
    tone: "brand",
    badge: "ORDER 24 HOURS AHEAD",
    title: ["Your photo,", "printed on the cake"],
    body: `Send the picture on WhatsApp with your order. Eggless sponge in any of our flavours${
      photoPerKg !== undefined ? `, ${formatAed(photoPerKg)} a kilo` : ""
    }.`,
    cta: { label: "ORDER A PHOTO CAKE", href: itemRoute(SPECIAL_ITEM_IDS.photoCakes) },
    secondaryCta: { label: "See 3D cakes →", href: itemRoute(SPECIAL_ITEM_IDS.threeDCakes) },
    photoUrl: photoCakes?.imageUrl,
  },
];
