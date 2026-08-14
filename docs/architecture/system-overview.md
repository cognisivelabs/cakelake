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

Payment gateway (Telr or PayTabs, see ADR-006) — called from the
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

## 6. What's Deliberately Not Here (Yet)

Matching the ADRs, these are explicitly deferred, not overlooked:

- No WebSocket/real-time push layer (ADR-004)
- No Redis, no background job queue (ADR-003)
- No multi-node/load-balanced compute (ADR-003)
- No finalized payment gateway integration — pending client information
  (ADR-006)
- No branch-selector UI — the data model supports it (ADR-007), but
  whether it's live at launch is still an open question in
  [requirements.md](../requirements/requirements.md)
