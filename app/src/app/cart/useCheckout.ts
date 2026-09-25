"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { estimatedReadyTime } from "@/lib/dates";
import { buildAckSummary, type AckSummary } from "@/lib/orderSummary";
import { buildOrderMessage, buildWhatsAppUrl, openWhatsAppUrl } from "@/lib/whatsapp";

// A discriminated union, not a bare stage name plus a separate summary
// — the "acknowledged" screen needs its summary to render at all, so the
// type only allows reaching it with one attached.
export type CartScreen =
  | { kind: "review" }
  | { kind: "handoff" }
  | { kind: "confirming" }
  | { kind: "acknowledged"; summary: AckSummary };

/**
 * The cart's checkout flow — review → handoff to WhatsApp → "did you
 * send it?" → order sent — and everything each step needs.
 */
export function useCheckout() {
  const { order, startHandoff, declineHandoff, clearCart } = useCart();
  const catalog = getCatalog();

  // Not plain local state: an installed PWA can navigate its one window
  // away to wa.me instead of opening a separate tab, wiping in-memory
  // state entirely. order.pendingHandoff is persisted, so a customer who
  // comes back to a blank/reloaded app still lands on "did you send it?"
  // instead of a reset cart. `chosenScreen` overrides it once the
  // customer takes an explicit action in this session.
  const [chosenScreen, setChosenScreen] = useState<CartScreen | null>(null);
  const screen: CartScreen =
    chosenScreen ?? (order.pendingHandoff ? { kind: "confirming" } : { kind: "review" });

  const [sentMessage, setSentMessage] = useState("");
  const [chatUrl, setChatUrl] = useState("");
  const message = sentMessage || buildOrderMessage(order, catalog);

  function goToHandoff() {
    setSentMessage(buildOrderMessage(order, catalog));
    setChosenScreen({ kind: "handoff" });
  }

  function openWhatsApp() {
    const url = buildWhatsAppUrl(message);
    setChatUrl(url);
    // Persist before navigating — see the pendingHandoff comment above.
    startHandoff();
    openWhatsAppUrl(url);
    setChosenScreen({ kind: "confirming" });
  }

  function backToReview() {
    // Only an explicit decline from the "did you send it?" prompt counts
    // as ADR-003's 24-hour case — this same handler also runs for the
    // "Send order" screen's plain back button, before a handoff was ever
    // attempted, which shouldn't start any abandonment clock at all.
    if (order.pendingHandoff) declineHandoff();
    setChosenScreen({ kind: "review" });
  }

  function confirmSent() {
    // Freeze the chat link before clearing — if we recovered straight into
    // "confirming" after a reload, openWhatsApp() (which normally sets
    // this) never ran this session.
    setChatUrl((current) => current || buildWhatsAppUrl(message));
    const summary = buildAckSummary(order, catalog, estimatedReadyTime(), new Date());
    clearCart();
    setChosenScreen({ kind: "acknowledged", summary });
  }

  return { screen, message, chatUrl, goToHandoff, openWhatsApp, backToReview, confirmSent };
}
