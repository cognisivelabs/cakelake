# ADR-004: Order Tracking — Polling, Not WebSockets

**Status:** Proposed
**Date:** 2026-08-14

## Context

Live order status — placed → baking → decorating → ready — is Cake Lake's
signature feature (confirmed requirement #5). A customer needs to see their
own order's status update without refreshing the page, from the moment they
order until pickup.

The obvious comparison is Kram, which built a full real-time layer (Phoenix
Channels over WebSocket) because its secretary and patient apps need
sub-second, high-frequency updates across potentially hundreds of
simultaneous clinic queues. Cake Lake's version of this problem is much
smaller: one customer, watching one order, updated a handful of times
(placed, baking, decorating, ready) over the course of maybe an hour, by
one staff member tapping a status forward at the counter. There is no
queue of many concurrently-changing entities that many viewers all need to
see update in real time — just one order, watched by (usually) one person.

## Decision

**HTTP polling**, not WebSockets: the customer's order-tracking page polls
a `GET /orders/:id/status` endpoint on a short interval (e.g. every 15–30
seconds) while the order is in progress, and stops polling once the order
reaches "ready" or the page is closed.

## Rationale

**The load doesn't justify a persistent-connection layer.** WebSockets earn
their complexity when many events need to reach many clients with low
latency and high frequency — that's Kram's actual problem (a queue
mutation must reach every viewer of that queue in under 100ms). Cake Lake's
version is one status field on one document, changing a few times per
order. Polling every 15–30 seconds is imperceptibly different from
real-time push for this use case, at a fraction of the implementation and
operational cost.

**No new infrastructure.** Polling is a plain REST endpoint on the same
Express API already being built (see [ADR-001](ADR-001-tech-stack.md)) — no
WebSocket server, no Phoenix-Channels-equivalent, no separate connection
management or reconnection logic on the frontend. This matches the minimal
hosting footprint in [ADR-003](ADR-003-hosting.md): nothing extra to
provision or keep alive.

**Cheaper to build and to reason about.** A polling endpoint is stateless
and trivially horizontally scalable — no connection affinity, no pub/sub
fan-out to design. For a small budget-conscious build, this is meaningfully
less code and less that can go wrong, for a feature difference customers
won't notice at this order volume.

## Consequences

- The order-tracking page needs simple polling logic (interval fetch, stop
  on terminal status or unmount) — a small, well-understood frontend
  pattern, not a new subsystem
- Slight update latency (up to the poll interval) is an accepted trade-off
  — acceptable because the underlying event (a staff member tapping "move
  to baking") is itself not sub-second in nature
- If order volume or the need for true instant updates grows materially
  (e.g. many simultaneous in-progress orders being watched by many staff
  screens at once, or a future kitchen-display-style feature), this is the
  ADR to revisit — the polling endpoint can coexist with a WebSocket layer
  added later without a rewrite, since it's just an additional way to read
  the same status field
- Staff-side order status updates (the tap that advances an order) are a
  plain authenticated POST — no special handling needed beyond normal API
  auth

## Alternatives Considered

**WebSockets (Socket.IO or similar) from day one**
Would give true instant updates and mirror Kram's approach. Rejected: the
load doesn't justify it (see Context/Rationale), it requires infrastructure
Cake Lake's minimal hosting setup doesn't otherwise need (see ADR-003), and
it's meaningfully more code — connection lifecycle, reconnection handling,
scaling connections across instances if the app ever runs on more than one
node — for a UX difference customers won't perceive at this scale.

**Server-Sent Events (SSE)**
A lighter-weight middle ground between polling and full WebSockets — one-way
push over plain HTTP, simpler than WebSockets to implement and scale.
Genuinely considered. Not chosen over plain polling because it still adds a
persistent-connection concern (keeping the connection alive, handling
proxy/timeout behavior) that a stateless poll simply doesn't have, for a
feature where the extra responsiveness isn't the point — polling is the
simpler tool that's already sufficient. Worth a second look if polling
interval tuning ever starts to feel like it's fighting the requirement,
which isn't expected at this order volume.
