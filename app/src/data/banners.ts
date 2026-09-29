import type { Banner } from "@/types/banner";
import { SPECIAL_ITEM_IDS } from "@/data/items";
import { categoryRoute, itemRoute, ROUTES } from "@/lib/routes";

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
    body: "Send the picture on WhatsApp with your order. Eggless sponge in any of our flavours, AED 170 a kilo.",
    cta: { label: "ORDER A PHOTO CAKE", href: categoryRoute(SPECIAL_ITEM_IDS.photoCakes) },
    secondaryCta: { label: "See custom cakes →", href: itemRoute(SPECIAL_ITEM_IDS.customCakes) },
    // A cake with an edible photo print.
    bleedPhotoUrl: "/images/hero-photo-cake.jpg",
  },
];
