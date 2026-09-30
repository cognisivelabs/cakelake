import type { Banner } from "@/types/banner";

/** Home's hero banners, in rotation order. */
export const HOME_BANNERS: Banner[] = [
  {
    id: 1,
    tone: "light",
    badge: "READY IN 1 HOUR",
    title: ["Eggless cakes,", "baked after you order"],
    body: "Classic, Premium, Exotic and Exotic Premium leave the counter about an hour after we confirm on WhatsApp.",
    cta: { label: "ORDER A CAKE", href: "/menu" },
    secondaryCta: { label: "See all categories →", href: "/menu" },
    // A bakery display case, by Ulysse Pointcheval on Unsplash.
    bleedPhotoUrl: "/images/hero-bakery-case.jpg",
  },
  {
    id: 2,
    tone: "brand",
    badge: "ORDER 24 HOURS AHEAD",
    title: ["Your photo,", "printed on the cake"],
    body: "Send the picture on WhatsApp with your order. Eggless sponge in any of our flavours, AED 170 a kilo.",
    cta: { label: "ORDER A PHOTO CAKE", href: "/menu?category=photo-cakes" },
    secondaryCta: { label: "See custom cakes →", href: "/menu/custom-cakes" },
    // A cake with an edible photo print.
    bleedPhotoUrl: "/images/hero-photo-cake.jpg",
  },
];
