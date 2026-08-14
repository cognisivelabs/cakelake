# System Overview — Cake Lake

**Scale note:** this is one small site for one (soon a few) bakery
branches, not a multi-tenant platform. Read this alongside
[`docs/adr/`](../adr/) — every shape described here traces back to an ADR
that explains why it's sized the way it is, not just what it is.

## 1. High-Level Architecture

Cake Lake is a single repository (see [ADR-002](../adr/ADR-002-single-repo-structure.md)),
containing:

- **Planning docs** (`docs/`) — requirements, design references, ADRs. No
  application code lives here; this is the trail from "what the client
  asked for" to "what got built."
- **`design-system/`** — a read-only mirror of the Claude Design project;
  Claude Design is the source of truth for visual design, not this repo.
- **`prototype/`** — working click-through prototypes built against the
  design system, used for client sign-off before development starts.
- **`app/`** — the real build, once scaffolded (see [ADR-001](../adr/ADR-001-tech-stack.md)):
  a Next.js frontend and a Node/Express backend, both JavaScript/TypeScript,
  living as sibling directories in this same repo rather than split across
  services.

There is no separate infra repo, no separate API repo, no separate web
repo — see ADR-002 for why that split (used on other Cognisive Labs
projects) doesn't apply here.

## 2. Runtime Components (once `app/` is built)

```
Customer's browser
      |
      v
Next.js frontend  <---- catalogue, cart, checkout UI, order tracker,
      |                 account / guest login
      v
Express API  <-------- catalogue, cart, orders, staff order-status
      |                 updates, payment gateway calls
      v
MongoDB Atlas  <------- catalogue items, orders, offers, customers —
                         every relevant document carries a storeId
                         (ADR-007), even with one store today

Payment gateway (ADCB if available, else PayTabs as confirmed
fallback; Apple Pay + Google Pay only, see ADR-006) — called from the
Express API for checkout; webhook confirms payment back to the API.
```

One compute node runs both the Next.js app and the Express API at launch
(see [ADR-003](../adr/ADR-003-hosting.md)) — no load balancer, no
multi-node topology, until real load says otherwise.

## 3. Order Placement Flow

```
1. Customer builds a cart in the Next.js frontend (catalogue is
   store-scoped — see ADR-007, even though there's one store today)

2. Customer checks out one of two ways (ADR-005):
   - Account: identified by mobile number, logged in
   - Guest: no account, provides an email address for tracking

3. Frontend calls the Express API to create the order and initiate
   payment via the chosen gateway (ADR-006)

4. Gateway redirects/confirms; a webhook to the Express API marks the
   order paid

5. Order is created with status "placed", storeId set, and (for guest
   checkout) the tracking email queued
```

## 4. Order Tracking Flow

```
1. Customer lands on the order-tracking page (from account order
   history, or the link/email sent at guest checkout)

2. Page polls GET /orders/:id/status every 15-30s while the order is
   in progress (ADR-004 — plain HTTP polling, not WebSockets; the load
   doesn't justify a persistent-connection layer)

3. Staff advance the order's status (placed -> baking -> decorating
   -> ready) with a simple tap on a counter screen -- a plain
   authenticated POST to the Express API, filtered to their store

4. Polling stops once the order reaches "ready" or the page closes
```

## 5. In-Store / Reorder QR Flows

Two distinct QR codes (see requirement #6 in
[requirements.md](../requirements/requirements.md)), both resolving to the
store-scoped catalogue (ADR-007):

- **Counter QR** — at the shop counter, opens the ordering site scoped to
  that store, so an in-store customer can order instead of queuing
- **Leaflet QR** — sent home with an order, a distinct short link meant to
  bring the customer back to order online next time; can carry its own
  offer/promo code independently of the counter QR

Neither QR flow needs infrastructure beyond what's already described above
— they're just entry points into the same store-scoped catalogue and
checkout, distinguished by which link/code was scanned.

## 6. Order Notifications — Email + WhatsApp

```
1. Order is created and payment is confirmed (ADR-006's webhook marks
   the order paid)

2. Express API calls SES (ADR-008) AND the WhatsApp Business Platform
   (ADR-012) directly, inline in the order-creation path -- two sends,
   no queue, proportionate to order volume

3. Email contains the order summary and the order-tracking link -- for
   guests, this IS how they reach tracking (ADR-005); for account
   customers it's a convenience alongside their order history

4. WhatsApp gets a pre-approved template message: what was ordered,
   total, fulfilment method and slot -- exactly one message, no more,
   at this moment (ADR-012)

5. Later, when staff mark the order "ready" (the same action from
   section 4's staff order-status flow), the SAME WhatsApp call site
   fires a second, different template: ready for collection/delivery.
   This is the only other automated WhatsApp message an order ever
   gets -- deliberately capped at two total, so the thread doesn't get
   muted

6. A send failure (email or WhatsApp) is logged (see 7, below) but
   never fails the order or status update itself
```

## 7. Logging, Error Tracking, and Metrics

Three separate small answers to three separate questions (ADR-009,
ADR-010):

```
"What happened, in sequence?"     -> structured JSON logs -> CloudWatch
"Did something break unexpectedly?" -> exceptions -> Sentry (or similar)
"How many orders / how much traffic?" -> Mongo aggregation queries
                                          (orders) + a lightweight,
                                          cookie-free analytics tool
                                          (traffic) -> surfaced in the
                                          admin console
```

None of these are a shared platform — deliberately three small, boring
tools instead of one heavyweight observability stack, sized for a team
without dedicated ops.

## 8. Admin Console

```
Staff member logs in at /admin (own credentials, separate from
customer accounts -- ADR-005, ADR-011)
      |
      v
Same Next.js app, same Express API, same MongoDB -- an authenticated,
store-scoped route section:
  - Catalogue CRUD (items, prices, photos, availability)
  - Offers CRUD (create/edit/end time-limited promotions)
  - Metrics view (orders + traffic, from section 7 above)     [not yet built]
```

MVP scope is deliberately flat: catalogue and offers management, no role
tiers. This is not a second application — see
[ADR-011](../adr/ADR-011-admin-console.md) for why reusing the same app was
chosen over splitting it out. The counter order-status taps (section 4,
requirement #5's staff side) and the admin console are different route
sections of the same app, usable by the same staff login.

**Deferred to a later phase, not built now:** the prototype
(`Cake Lake Admin.dc.html`) designed a fuller system — three roles (Owner /
Catalogue manager / Counter staff), invite-based onboarding, and an
activity log of every change. Confirmed 2026-08-14 as out of MVP scope,
worth revisiting once a second branch or a bigger team actually needs the
access control — the design stays in the prototype as a ready reference,
not thrown away.

## 9. What's Deliberately Not Here (Yet)

Matching the ADRs, these are explicitly deferred, not overlooked:

- No WebSocket/real-time push layer (ADR-004)
- No Redis, no background job queue (ADR-003)
- No multi-node/load-balanced compute (ADR-003)
- No finalized payment gateway — ADCB used if they have a web product,
  PayTabs as the confirmed fallback otherwise; not blocking, since
  development can proceed against PayTabs's API either way (ADR-006)
- No branch-selector UI — the data model supports it (ADR-007), but
  whether it's live at launch is still an open question in
  [requirements.md](../requirements/requirements.md)
- No queue-based/outbox notification system — order confirmation email is
  one inline SES call (ADR-008)
- No full observability stack (no ELK, no APM/tracing platform) — just
  structured logs, an error tracker, and a couple of aggregation queries
  (ADR-009, ADR-010)
- No separate admin application — it's a protected route section of the
  same app (ADR-011)
- No WhatsApp-native ordering (catalog browsing, cart, in-chat checkout) —
  scoped to exactly two outbound notifications per order (ADR-012); no
  in-chat payment exists in the UAE regardless
