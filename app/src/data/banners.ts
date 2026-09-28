import { SPECIAL_ITEM_IDS } from "@/data/items";
import { getCatalog } from "@/lib/catalog";
import { formatAed } from "@/lib/pricing";
import { categoryRoute, itemRoute, ROUTES } from "@/lib/routes";

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
  /** "boxed" hero style only: a plain background photo behind a "light"
   * banner. */
  imageUrl?: string;
  /** "boxed" hero style only: a framed picture beside a "brand" banner's
   * text (desktop). */
  photoUrl?: string;
  /** "photo" hero style only (CONFIG.heroStyle): this banner's photo,
   * bleeding behind the whole thing — see docs CLB Desktop Home v2,
   * screens 6a/6b (light) and 7a/7b (brand). */
  bleedPhotoUrl?: string;
};

// The Photo cakes banner quotes the real per-kilo price, and bleeds a
// real photo-print photo, rather than typing either in by hand — Photo
// Cakes is now three shape items (Round/Rectangle/Heart), not one, so
// this picks the first as a representative rather than a single id.
const photoCakes = getCatalog().find((item) => item.categoryId === SPECIAL_ITEM_IDS.photoCakes);
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
    // The design's own stand-in (a bakery display case by Ulysse
    // Pointcheval on Unsplash, free licence) — swap for a real shot of
    // the Karama counter when the client supplies one.
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
    secondaryCta: { label: "See 3D cakes →", href: itemRoute(SPECIAL_ITEM_IDS.threeDCakes) },
    photoUrl: photoCakes?.imageUrl,
    // The banner's own photo, kept separate from the catalog's — reusing
    // an item's imageUrl here meant renaming or re-cropping a catalog
    // photo could silently change the banner too. A genuine edible photo
    // print (unlike anything findable free on Unsplash/Pexels/Pixabay/
    // Alamy/Freepik — that search turned up only cartoon prints or 3D
    // fondant cakes, nothing with an actual personal photo on it).
    bleedPhotoUrl: "/images/hero-photo-cake.jpg",
  },
];
