# ADR-001: Tech Stack — Next.js + Node/Express + MongoDB

**Status:** Proposed
**Date:** 2026-08-14

## Context

Cake Lake needs:
- A customer-facing ordering site: catalogue, cart, checkout, live pickup
  tracker, account/guest flows (see [requirements #1–7](../requirements/requirements.md))
- A small staff-facing surface to update order status (placed → baking →
  decorating → ready) — likely a handful of taps on a phone or tablet at
  the counter, not a full back-office system
- A payment gateway integration (ADCB, Apple Pay + Google Pay only — see [ADR-006](ADR-006-payment-gateway.md))
- A data model that's store-scoped from day one so a second branch is a new
  `store` document, not a rewrite (see [ADR-007](ADR-007-store-scoped-data-model.md))

The client is an early-stage, budget-conscious single-shop bakery currently
running entirely on WhatsApp. There is no existing engineering team on the
client side — this is a small build handled externally. Expected load is
low: a boutique bakery doing tens of orders a day, not hundreds, even after
a second or third branch opens. There is no requirement anywhere in scope
for high-frequency real-time fan-out, and nothing resembling Kram's
many-concurrent-writers-to-one-queue problem — an order's status is written
by one member of staff at a time, for that one order.

## Decision

- **Frontend:** Next.js (React), rendering the customer site and the small
  staff order-status screen from the same codebase
- **Backend:** Node.js / Express, a single REST API service
- **Database:** MongoDB (hosted on Atlas, not self-managed)
- **Payments:** ADCB gateway, Apple Pay + Google Pay only, called from the backend (see ADR-006)

## Rationale

**One language end-to-end lowers cost for a small build.** Next.js and
Express are both JavaScript/TypeScript. For a budget-conscious client with
no in-house engineering, minimizing the number of languages and runtimes in
play directly reduces build cost and, later, the cost of finding someone to
maintain it. This is the opposite trade-off from Kram, where a dedicated
team with prior Elixir interest was training up on a second stack
deliberately — there's no such team here.

**Express is intentionally boring here.** Cake Lake's backend is CRUD over
a catalogue, cart, and orders, plus one webhook (payment gateway callback)
and one polling endpoint (order status — see ADR-004). None of that needs a
concurrency model beyond what Node's event loop already gives it. Reaching
for something like Elixir/Phoenix — chosen on Kram specifically to make
concurrent-queue-mutation races structurally impossible — would be solving
a problem Cake Lake doesn't have, at the cost of a stack nobody involved
here has used before.

**MongoDB fits the shape of the data and the budget.** The catalogue (cake
items with variable attributes — sizes, flavours, add-ons, dietary tags)
and orders (a snapshot of cart contents at time of purchase) are both
naturally document-shaped rather than relational. MongoDB Atlas has a free
tier sufficient for a single-shop launch, and scales in dollar terms roughly
with the client's own growth (more branches, more orders) rather than
requiring an upfront commitment. This matters for a client with limited and
uncertain initial revenue.

**Next.js for one reason: it's already the plan.** The requirements doc has
carried "Next.js frontend" as the tentative direction since the first
planning pass, and nothing in the confirmed scope argues against it — SSR
for the public catalogue helps with basic SEO (a small bakery relies on
local search), and the API-route pattern is familiar and well-documented
for a small team to pick up quickly if needed, even though the primary
backend is the separate Express service.

## Consequences

- Two deployable pieces: the Next.js site and the Express API — not four
  repos/services like Kram, see [ADR-002](ADR-002-single-repo-structure.md)
- No dedicated real-time transport layer (no WebSocket server, no Phoenix
  Channels equivalent) — order status is polled, see ADR-004
- MongoDB schema is enforced at the application layer (e.g. via a schema
  library like Zod or Mongoose schemas), not by the database itself —
  acceptable at this scale, worth revisiting only if the catalogue/order
  model grows materially more relational (e.g. complex inventory tracking)
- Hiring/handoff pool for "JavaScript full-stack" is large and inexpensive
  compared to a specialised runtime — appropriate for a project that may
  change hands after initial delivery
- This ADR is Proposed, not Accepted, because it's contingent on the
  prototype being approved and development being greenlit (see root
  [README](../../README.md)) — nothing here is built yet

## Alternatives Considered

**Next.js API routes only, no separate Express backend**
Would collapse to one deployable service instead of two. Simpler for this
scale. Kept as a live option rather than fully rejected — if the Express
backend never grows beyond what Next.js API routes could handle, folding it
in later is a reasonable simplification. Not chosen up front only because
a distinctly separate backend is the working assumption already recorded in
the requirements doc, and it keeps the door open to a native mobile client
later without re-plumbing the API.

**PostgreSQL instead of MongoDB**
A relational schema would suit the store/order/item relationships fine, and
would give stronger consistency guarantees for financial data (orders,
payments). Rejected for now because the catalogue's variable-attribute shape
(different cakes have different customization options) is a better natural
fit for documents, and because Mongo Atlas's free/low tiers are a better
match for the client's budget at this stage. Worth reconsidering if
inventory or multi-branch reporting needs grow complex enough to want joins
and transactions across many entities.

**Elixir/Phoenix (Kram's stack)**
Rejected outright — solves problems (massive concurrent WebSocket fan-out,
structural race-condition elimination) that don't exist at Cake Lake's
scale, at the cost of a runtime nobody on this build has used. See Context.
