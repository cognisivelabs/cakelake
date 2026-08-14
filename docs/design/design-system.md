# Cake Lake Bakery — Design System

**Canonical source: Claude Design.** The design system — palette, type,
components (Button, ItemCard, OfferCard, LocationCard, OrderTracker, etc.),
tokens, and the click-through site recreation — is built and maintained live
in the "Cake Lake Design System" project on claude.ai/design. This repo does
not define design decisions; it mirrors them.

A read-only pull of that project lives in [`/design-system`](../../design-system)
so the design trail stays versioned in git alongside requirements and code.
Start there for anything concrete — component props (`*.d.ts`), usage
examples (`*.prompt.md`), and the full written reference in
[`design-system/readme.md`](../../design-system/readme.md) (palette, type
scale, spacing, motion, the layer-cake order tracker, content/voice rules).

**Claude Design always wins.** If `/design-system` and the live Claude
Design project ever disagree, the live project is correct — re-pull rather
than hand-editing the mirror.

## Quick orientation

- **Signature element:** order status shown as a cake built layer by layer
  (placed → oven → decorating → ready) — see `design-system/components/tracking/OrderTracker.*`
  and `design-system/guidelines/signature-cake.card.html`.
- **Palette:** cream base, ink text, three single-purpose accents — berry
  (brand accent), honey (primary CTA), pistachio (fresh/success). Full values
  in `design-system/tokens/colors.css`.
- **Type:** Fraunces (headlines only), Inter (body/UI), JetBrains Mono
  (anything transactional — prices, order numbers, codes, hours).
- **Site recreation:** `design-system/ui_kits/cakelake-site/` — a working
  click-through of Home, Menu, Track Order, and Locations, composed entirely
  from the real components.
