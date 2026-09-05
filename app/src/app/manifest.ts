import type { MetadataRoute } from "next";
import { CONFIG } from "@/lib/config";

export const dynamic = "force-static";

// Icon paths are relative (no leading slash) so they resolve against this
// manifest's own URL — which already sits under the GitHub Pages basePath —
// instead of needing to duplicate that basePath logic here.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cake Lake Bakery",
    short_name: "Cake Lake",
    description: "Browse the menu, build an order, and send it to us on WhatsApp.",
    start_url: ".",
    scope: ".",
    display: "standalone",
    background_color: CONFIG.backgroundColor,
    theme_color: CONFIG.themeColor,
    icons: [
      {
        src: "icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        // A distinct file, not icon-192.png reused — maskable icons get
        // cropped to whatever shape the OS applies (circle, squircle,
        // etc.), so this one is the logo scaled down onto an opaque
        // brand-yellow square with a safe margin, instead of the "any"
        // icon's transparent background and edge-to-edge circle.
        src: "icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
