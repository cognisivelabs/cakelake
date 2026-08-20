# ADR-004: Menu & Content Management — Git-Managed, No CMS

**Status:** Proposed
**Date:** 2026-08-15

## Context

[ADR-001](ADR-001-tech-stack.md) established a static site with no
backend and no database. The menu/catalogue (items, prices, photos,
descriptions, options) still needs to live somewhere the build can read
from, and the business needs some way to get changes made — new items,
price updates, seasonal removals.

The client explicitly listed "a dashboard for staff to manage orders or
the menu" as out of scope for this phase (see
[requirements.md](../requirements/requirements.md)) — there's no ask for
staff to self-serve content changes right now.

## Decision

Menu/catalogue content lives as **structured files in the repository**
(e.g. a JSON or Markdown file per item, or one structured file for the
whole catalogue — exact shape decided at implementation time), read at
build time by the static site generator. Content changes are made by
editing those files and pushing to the repo, which triggers the existing
GitHub Actions build/deploy (see
[ADR-002](ADR-002-hosting-and-deployment.md)).

No admin dashboard, no CMS, no database-backed content editing for this
phase.

**Each item's data includes a `requiresDelivery` flag.** Most items
default to false (pickup or delivery, customer's choice). Items that
need on-site installation (large or custom cakes) are flagged true —
see [ADR-003](ADR-003-whatsapp-order-handoff.md) for how the Cart screen
uses this to remove Pickup as a choice for those orders.

## Rationale

**Matches the confirmed scope exactly.** The client explicitly deferred a
staff dashboard — building one anyway would be scope the client didn't
ask for and doesn't want to pay for right now.

**Zero additional cost or infrastructure.** Content living in the repo
needs no database, no CMS subscription, no extra service to host or
secure — it rides entirely on infrastructure already needed for the site
itself.

**A real, honest trade-off worth stating plainly.** This means menu/price
changes go through whoever manages the repo (initially, the dev team) as
a change request, not a self-service action for bakery staff. That's a
deliberate cost/control trade-off the client is accepting for this phase,
not an oversight.

## Consequences

- Every menu/price change requires a commit and a redeploy — not
  instant, not self-service for non-technical staff
- Photos need to be optimized/sized before being committed (no
  server-side image processing pipeline exists to do this automatically)
- This is a natural, well-scoped upgrade path later: if the business
  grows past "occasional changes via a request," a lightweight
  headless CMS or a small admin tool can be layered on top of the same
  content structure without redesigning the site itself
- Content structure (the JSON/Markdown shape) should be simple enough
  that even a non-developer could technically edit it directly in
  GitHub's web UI in a pinch — worth keeping in mind when designing the
  format, even though that's not the primary supported workflow
- The `requiresDelivery` flag needs to be set correctly whenever an item
  is added or edited — getting it wrong either blocks pickup for
  something that didn't need it, or lets an installation-required cake
  through as pickup-eligible. Worth a one-line reminder in whatever
  process/template is used for adding catalogue items

## Alternatives Considered

**A headless CMS (e.g. a hosted content-management service)**
Would let non-technical staff edit the menu directly, no developer
involved. Rejected for this phase — most options add either a
subscription cost or their own backend/database to host, which
contradicts the zero/near-zero cost goal. A strong candidate for a later
phase if the business decides self-service content editing is worth
paying for.

**A small custom admin tool backed by a database**
Would give the client exactly the self-service editing a CMS would,
tailored to this catalogue's shape. Rejected for the same reason as
[ADR-001](ADR-001-tech-stack.md) rejected a backend generally — real
ongoing hosting cost for a need the client explicitly said isn't needed
this phase.
