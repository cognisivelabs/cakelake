# Cake Lake Bakery — Site

Next.js (static export) + TypeScript, per
[ADR-001](../docs/adr/ADR-001-tech-stack.md). No backend, no database —
the cart lives in the browser (`localStorage`), and placing an order
hands off to WhatsApp per
[ADR-003](../docs/adr/ADR-003-whatsapp-order-handoff.md).

## Status: proof-of-concept

This is real, continuing code — not a throwaway spike — but it's
deliberately scoped to prove the two things that mattered before
investing in the rest of the build: **can a customer generate an order,
and does it actually reach WhatsApp correctly?**

**Built:**

- Menu, grouped by category, reading from a single catalogue source
  (`src/lib/catalog.ts`) — see below, this is placeholder content
- Flexible, generic option groups per item (not hardcoded to
  size+flavour — see [ADR-004](../docs/adr/ADR-004-content-management.md))
- Cart: quantity, remove, per-item cake-message field
- Pickup/delivery choice (flat fee) and a "when needed" field
- The exact WhatsApp order-message template from ADR-003, with a working
  `wa.me` handoff
- A manual "Yes, sent it" / "No, take me back to my cart" confirmation
  after handoff (see below — this is a POC simplification of ADR-003's
  full design)

**Deliberately deferred** (noted here so it's not mistaken for
forgotten):

- The mobile auto-detect "did you send it?" prompt (tab-focus-based) and
  the desktop QR-code handoff — this POC uses one manually-confirmed
  flow on every device instead of ADR-003's device-split behaviour
- Cart expiry (2-hour/24-hour rules from ADR-003) — the cart persists
  indefinitely in this POC
- Lead-time enforcement (disabling infeasible dates) — `leadTimeHours`
  exists in the data model and displays on Menu, but the "when needed"
  field doesn't yet cross-reference it
- Sold-out state and sold-out-in-cart handling (ADR-004) — the
  `available` flag exists in the data model but isn't rendered yet
- `requiresDelivery` forcing Delivery as the only choice
- The downloadable PDF menu (ADR-004)
- PWA installability (ADR-005)
- Real catalogue content and photography — see below

None of the above needs a rewrite to add — the data model
(`src/types/catalog.ts`, `src/types/order.ts`) already carries the
fields (`available`, `requiresDelivery`, `leadTimeHours`); the UI just
doesn't act on all of them yet.

## Placeholder content

`src/lib/catalog.ts` is **not client-approved menu data** — it exists so
the flow above has something real to click through. Every screen reads
from `getCatalog()`; swapping in real content is a data change, not a
code change. `src/lib/config.ts` holds the placeholder WhatsApp number
and delivery fee, both still pending the client (see the "Content
checklist" in
[requirements.md](../docs/requirements/requirements.md)).

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
