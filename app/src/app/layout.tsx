import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { CONFIG } from "@/lib/config";
import { INSTALL_PROMPT_EVENT, APP_INSTALLED_EVENT } from "@/lib/installEvents";
import { withBasePath } from "@/lib/assets";
import { SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from "@/lib/og";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  appleWebApp: {
    capable: true,
    title: "Cake Lake",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: withBasePath("/"),
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: CONFIG.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Android can fire beforeinstallprompt before React hydrates, and
            a missed event can't be replayed later — this has to run ahead
            of our own bundle to reliably catch it. useInstallPrompt reads
            the stash. */}
        <Script id="install-prompt-capture" strategy="beforeInteractive">
          {`
            window.__cakelakeInstallPrompt = null;
            window.addEventListener("${INSTALL_PROMPT_EVENT}", function (e) {
              e.preventDefault();
              window.__cakelakeInstallPrompt = e;
            });
            window.addEventListener("${APP_INSTALLED_EVENT}", function () {
              window.__cakelakeInstallPrompt = null;
            });
          `}
        </Script>
        {/* No shared header — the Hi-Fi uses a different header per
            screen (Home: hamburger/wordmark/WhatsApp; sub-pages: a
            back link + page title), so each page renders its own. */}
        <CartProvider>
          <main>{children}</main>
        </CartProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
