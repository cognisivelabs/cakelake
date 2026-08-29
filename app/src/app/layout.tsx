import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cake Lake Bakery",
  description:
    "Browse the menu, build an order, and send it to us on WhatsApp.",
  appleWebApp: {
    capable: true,
    title: "Cake Lake",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#EFD400",
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
            window.addEventListener("beforeinstallprompt", function (e) {
              e.preventDefault();
              window.__cakelakeInstallPrompt = e;
            });
            window.addEventListener("appinstalled", function () {
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
