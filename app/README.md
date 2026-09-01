# Cake Lake Bakery — Site

Next.js (static export) + TypeScript, per
[ADR-001](../docs/adr/ADR-001-tech-stack.md). No backend, no database —
the cart lives in the browser (`localStorage`), and placing an order
hands off to WhatsApp per
[ADR-003](../docs/adr/ADR-003-whatsapp-order-handoff.md).

## Status

Real, continuing code — not a throwaway spike. Restyled and restructured
against the client's Hi-Fi design (`CLB Hi-Fi Screens.dc.html`, Claude
Design), which is now the visual/content reference — colours, type
(Bricolage Grotesque / DM Sans), and copy throughout come from there,
not invented.

**Scope, client-confirmed:** only cakes are ordered online, in two
categories — Cakes (Classic/Premium/Exotic/Premium Exotic/Hammer/Pull
Me Up/Pinata) and Custom Cakes (Photo/Cheese/Shape/3D, priced per kg,
delivery-only, 24h notice, no flavour choice — a free-text description
instead). Cupcakes, cookies, pastries, desserts, and savoury items
aren't taken online at all.

**Pricing model:** each item is priced by weight tier (not a single
price) — flavour is a free choice that never changes price. A weight
tier can have no fixed price at all ("Ask us"), for the largest custom
sizes; the cart and WhatsApp message both handle that case honestly
("price to confirm") rather than showing AED 0.

**Built:**

- Home, Menu (2 categories, weight-tiered pricing, flavour-count
  badges), a dedicated Item Detail page per item
  (`/menu/[itemId]`) with flavour picker / weight tiers / cake
  message / custom-cake description, Cart, and Contact
- The full three-stage WhatsApp handoff from the Hi-Fi: review the
  exact message → "OPEN WHATSAPP" → a "Did you send it?" confirmation
  → an acknowledged screen with a recap and next actions
- An optional customer name field — client-confirmed: kept, but never
  sent as a placeholder; omitted from the message entirely if left blank
- Real contact details (address, phone numbers) and the confirmed
  ordering WhatsApp number

**Deliberately deferred** (noted so it's not mistaken for forgotten):

- Lead-time enforcement (disabling infeasible "when needed" dates)
- Sold-out state rendering (the `available` flag exists in the data
  model, the unavailable branch is built in `ItemDetailView`, but no
  placeholder item is marked unavailable yet to exercise it)
- `requiresDelivery` forcing Delivery as the only fulfillment choice
- The downloadable PDF menu (ADR-004), PWA installability (ADR-005)
- Desktop-specific layouts (category sidebar, 3-up grid, cart right
  column) — the Hi-Fi designs these; this pass is mobile-first only
- Real catalogue content and photography — see below

None of the above needs a rewrite to add — the data model already
carries the fields; the UI just doesn't act on all of them yet.

## Placeholder content

`src/lib/catalog.ts` is **not the real catalogue** — the client will
provide the actual items/prices/flavours (see the "Content checklist"
in [requirements.md](../docs/requirements/requirements.md)). Every
screen reads from `getCatalog()`/`getCategories()`; swapping in real
data is a data change, not a code change. `src/lib/config.ts` holds the
real contact numbers and address already confirmed by the client.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # local build, no basePath
GITHUB_PAGES=true npm run build   # matches the deployed GitHub Pages build
```

Output is a static export in `out/`.

## Testing

```bash
npm test
```

Unit tests (Vitest) cover the pure business logic in `src/lib/` —
pricing, the WhatsApp message/order-line helpers, date handling, and
catalogue lookups. No component/UI tests yet; those are still verified
manually in-browser per change.

## Deployment

Deployed to **GitHub Pages** for this POC phase, not AWS — see
[ADR-002](../docs/adr/ADR-002-hosting-and-deployment.md), which still
names AWS (S3 + CloudFront) as the intended target once development
moves past proof-of-concept. GitHub Pages needs no cloud account setup,
which matters for validating the core mechanism cheaply before that
investment. Moving to AWS later only changes
`.github/workflows/deploy.yml` and `next.config.ts`'s `basePath` —
nothing in `src/` depends on the hosting target.

`.github/workflows/deploy.yml` builds and deploys on every push to
`main` that touches `app/`. One manual, one-time step is needed in the
repo's own settings (not something a workflow file can do): **Settings →
Pages → Build and deployment → Source: GitHub Actions.**
