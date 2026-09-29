import { SPECIAL_ITEM_IDS } from "@/data/items";
import { getCatalog } from "@/lib/catalog";
import { formatAed } from "@/lib/pricing";
import { categoryRoute, itemRoute, ROUTES } from "@/lib/routes";

/** One of Home's hero banners. */
export type Banner = {
  id: string;
  /** "light" is the soft panel; "brand" is the deep, promotional one. */
  tone?: "light" | "brand";
  /** Small pill above the headline, e.g. "READY IN 1 HOUR". */
  badge: string;
  /** Headline, one entry per line. */
  title: string[];
  /** Text under the headline. */
  body: string;
  /** The main button. */
  cta: { label: string; href: string };
  /** A quieter second link beside the button. */
  secondaryCta?: { label: string; href: string };
  /** "boxed" hero style only: a plain background photo behind a "light"
   * banner. */
  imageUrl?: string;
  /** "boxed" hero style only: a framed picture beside a "brand" banner's
   * text (desktop). */
  photoUrl?: string;
  /** "photo" hero style only: a photo filling the whole banner, behind
   * its text. */
  bleedPhotoUrl?: string;
};

/** The first Photo Cakes item (Round Photo Cake). */
const photoCakes = getCatalog().find((item) => item.categoryId === SPECIAL_ITEM_IDS.photoCakes);
/** That item's 1 kg price. */
const photoPerKg = photoCakes?.weightTiers.find((tier) => tier.id === "1kg")?.price;

/** Home's hero banners, in rotation order. */
export const HOME_BANNERS: Banner[] = [
  {
    id: "ready-in-an-hour",
    tone: "light",
    badge: "READY IN 1 HOUR",
    title: ["Eggless cakes,", "baked after you order"],
    body: "Classic, Premium, Exotic and Exotic Premium leave the counter about an hour after we confirm on WhatsApp.",
    cta: { label: "ORDER A CAKE", href: ROUTES.menu },
    secondaryCta: { label: "See all categories →", href: ROUTES.menu },
    // A bakery display case, by Ulysse Pointcheval on Unsplash.
    bleedPhotoUrl: "/images/hero-bakery-case.jpg",
  },
  {
    id: "photo-cakes",
    tone: "brand",
    badge: "ORDER 24 HOURS AHEAD",
    title: ["Your photo,", "printed on the cake"],
    body: `Send the picture on WhatsApp with your order. Eggless sponge in any of our flavours${
      photoPerKg !== undefined ? `, ${formatAed(photoPerKg)} a kilo` : ""
    }.`,
    cta: { label: "ORDER A PHOTO CAKE", href: categoryRoute(SPECIAL_ITEM_IDS.photoCakes) },
    secondaryCta: { label: "See custom cakes →", href: itemRoute(SPECIAL_ITEM_IDS.customCakes) },
    photoUrl: photoCakes?.imageUrl,
    // A cake with an edible photo print.
    bleedPhotoUrl: "/images/hero-photo-cake.jpg",
  },
];
