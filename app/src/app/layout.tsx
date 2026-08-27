import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cake Lake Bakery",
  description:
    "Browse the menu, build an order, and send it to us on WhatsApp.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
