# ADR-007: Store-Scoped Data Model From Day One

**Status:** Accepted
**Date:** 2026-08-14

## Context

Confirmed requirement #6: every order, catalogue item, and offer is scoped
to a `store`, even though there's a single store today. This was explicit,
confirmed scope from the very first planning pass, not something inferred
later — the client has real plans to open more branches, and wants
in-store QR ordering (counter QR) and take-home reorder QR (leaflet QR)
from day one, both of which only make sense if "which store is this order
for" is a first-class fact the system already knows how to represent.

The alternative — building single-store now and retrofitting a store
concept later — is the classic trap: every place the codebase assumes
"there is exactly one store" (hardcoded catalogue queries, a single set of
offers, one order-status board) becomes a place that has to be found and
changed when store #2 opens, under time pressure, instead of being correct
by construction from the start.

## Decision

Every relevant document carries a `storeId` (or equivalent) from the first
migration onward:

- **Catalogue items** belong to a store (even if, today, every item belongs
  to the same one store)
- **Offers/promotions** are scoped to a store (a leaflet-QR offer for one
  branch doesn't silently apply at another)
- **Orders** record which store they were placed for/collected from
- **Staff order-status views** are filtered by store, not global-by-default

The branch-selector *UI* is a separate, still-open question (see
requirements.md) — this ADR fixes the *data model* shape, not whether
customers see a store picker on day one.

## Rationale

**This is cheap now and expensive later.** Adding a `storeId` field to
every relevant document and every query from the start costs almost
nothing when there's only one store to filter by — it's a constant, not a
choice, in every query. Retrofitting it after a second branch exists means
auditing the entire codebase for implicit single-store assumptions, under
the pressure of an actual second location that needs to go live. The
asymmetry is large enough that "build it store-scoped from day one" is the
right call even though it's genuinely unnecessary for correctness today.

**It directly enables two confirmed requirements, not just future
branches.** Counter QR and leaflet QR (requirement #6's own elaboration —
see the requirements doc) both need "which store" as a concept that exists
now, in the MVP, for a single store — because a QR code encodes a specific
counter at a specific shop, and the system needs somewhere to hang that
fact even before branch #2 exists.

**It's a modeling decision, not an infrastructure one.** This doesn't imply
multi-tenant infrastructure, per-store databases, or anything operationally
heavier — see [ADR-003](ADR-003-hosting.md), which keeps hosting minimal
regardless. It's purely about what fields exist on which documents and what
every query filters by, which has no bearing on server count or hosting
cost.

## Consequences

- Every catalogue/offer/order query includes a store filter, even when
  there's only one possible value today — this is a small, constant
  discipline cost applied consistently from the first line of backend code
- The counter-QR and leaflet-QR flows (requirement #6) have an obvious home
  in the data model rather than needing to be bolted on
- Opening a second branch is "add a new `store` document and point new
  QR codes/orders at it," not a data migration
- The branch-selector UI question (open in requirements.md) can be resolved
  independently, later, without touching the data model — the model doesn't
  force a UI decision either way
- Staff tooling (order-status updates) needs a store-scoping concept from
  the start too, even if in practice it's "the one store" for a while

## Alternatives Considered

**Single-store model now, add `storeId` when branch #2 is real**
The "build it simple, generalize later" instinct. Rejected specifically
because requirement #6 was confirmed scope from the start, not a guess
about the future — the client already told us multiple branches and
in-store QR ordering both matter, so there's no ambiguity to hedge against
by deferring. Deferring a decision that's already been made just adds
rework later for no benefit now.

**Multi-tenant infrastructure (per-store database or schema)**
Considered and rejected as premature — this conflates "data is logically
scoped to a store" (which this ADR requires) with "each store gets its own
infrastructure" (which nothing in scope needs, and which [ADR-003](ADR-003-hosting.md)'s
minimal hosting footprint argues directly against at this order volume). A
`storeId` field on shared collections is sufficient; separate databases per
store would be solving a scale problem Cake Lake doesn't have.
