"use client";

import { useCart } from "@/context/CartContext";
import { getCatalog } from "@/lib/catalog";
import { resolveOrderLines } from "@/lib/order";
import { AcknowledgedView } from "./AcknowledgedView";
import { EmptyCartView } from "./EmptyCartView";
import { HandoffView } from "./HandoffView";
import { ReviewView } from "./ReviewView";
import { useCheckout } from "./useCheckout";

// The cart, one screen at a time: review → send to WhatsApp → order sent.
// The flow's state lives in useCheckout; each screen is its own view.
export default function CartPage() {
  const { order } = useCart();
  const { screen, message, chatUrl, goToHandoff, openWhatsApp, backToReview, confirmSent } = useCheckout();

  if (screen.kind === "acknowledged") {
    return <AcknowledgedView summary={screen.summary} chatUrl={chatUrl} />;
  }

  if (screen.kind === "handoff" || screen.kind === "confirming") {
    return (
      <HandoffView
        stage={screen.kind}
        message={message}
        chatUrl={chatUrl}
        onOpenWhatsApp={openWhatsApp}
        onConfirmSent={confirmSent}
        onBack={backToReview}
      />
    );
  }

  if (resolveOrderLines(order, getCatalog()).length === 0) return <EmptyCartView />;

  return <ReviewView onSend={goToHandoff} />;
}
