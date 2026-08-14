# ADR-011: Admin Console

**Status:** Proposed
**Date:** 2026-08-14

## Context

Confirmed requirement #9: a staff-facing tool, separate from the customer
site, for managing the catalogue (insert/update/remove items) and offers
(requirement #2), scoped to a store (requirement #6). It's also the natural
home for the order/traffic metrics view from
[ADR-010](ADR-010-metrics-and-analytics.md).

This is distinct from the staff order-status screen already implied by
requirement #5 (a few taps to move an order from placed → baking →
decorating → ready) — that's a lightweight in-the-moment tool for whoever's
at the counter during service; the admin console is a less-frequent,
content-management tool for whoever manages the catalogue and offers
(likely the owner or a manager, not necessarily the same person tapping
order statuses all day).

Cake Lake is one small team building one small site, per
[ADR-002](ADR-002-single-repo-structure.md) — whatever the admin console
turns out to be, it shouldn't become a second application to build,
deploy, and maintain independently.

## Decision

The admin console is a **protected section of the same Next.js app**
(e.g. routes under `/admin`), calling the **same Express API** with
admin-authenticated requests — not a separate application, not a separate
repo. It covers:

- Catalogue CRUD (items: name, price, description, photos, tags,
  availability), store-scoped
- Offers CRUD (create/edit/end time-limited promotions), store-scoped
- The order/traffic metrics view from ADR-010

Authentication for admin users is a separate concern from customer identity
(ADR-005) — staff log in with their own credentials (email/password or
similar), not a customer mobile-number account. Exact auth mechanism is an
implementation detail left open, but it must be clearly separated from the
customer-facing login so a customer account can never reach admin routes.

## Rationale

**One app, protected routes — not a second app.** Splitting the admin
console into its own Next.js project (or worse, its own repo) would double
the deployment surface, the dependency management, and the hosting
footprint for a feature used by a handful of staff, occasionally. Reusing
the same app and API — just with an authenticated, role-gated route
section — is the smaller, cheaper answer that still fully satisfies the
requirement, and it's consistent with the single-repo reasoning in
[ADR-002](ADR-002-single-repo-structure.md).

**Same backend, same data model.** The admin console reads and writes the
exact same store-scoped catalogue/offers/orders collections the customer
site already uses (see [ADR-007](ADR-007-store-scoped-data-model.md)) —
there's no separate admin database or sync process to keep consistent.
An item added in the admin console is immediately the same item the
customer site's catalogue query returns.

**Store-scoping falls out of ADR-007 for free.** Because every catalogue
item and offer already carries a `storeId`, a future second branch's
manager sees and edits only their own store's catalogue/offers without any
additional design work — the admin console just needs to filter by the
logged-in staff member's store, the same way every other store-scoped
query already does.

**Staff auth is deliberately separate from customer auth.** Customer
identity (ADR-005) is intentionally lightweight — a mobile number, no
password required for guests. Admin access needs to be a real,
password-protected login precisely because it can write to the live
catalogue and offers, not just place orders. Conflating the two would
either weaken admin security or add unnecessary friction to customer
checkout — keeping them separate avoids both.

## Consequences

- `/admin` routes need their own auth guard (middleware) distinct from
  customer session handling — a customer's mobile-number session must
  never grant access here
- Admin users are a small, separate concept from customers — likely just a
  short list of staff accounts per store, not a self-serve signup flow
- Photo upload for catalogue items needs a storage answer (e.g. S3, given
  [ADR-003](ADR-003-hosting.md)'s AWS hosting) — a small addition to that
  ADR's scope once development starts, not a new infrastructure decision
- Because it's the same Next.js/Express app, admin console changes ship on
  the same deploy as customer-site changes — acceptable at this scale (see
  [ADR-002](ADR-002-single-repo-structure.md)); revisit only if that
  coupling becomes a real deployment-cadence problem
- The order-status tap screen (requirement #5's staff side) and the admin
  console can share the same auth mechanism even though they're different
  route sections with different purposes — one staff login, two things
  they might do with it

## Alternatives Considered

**Separate admin application (its own Next.js project or repo)**
Cleaner separation of concerns, could scale independently. Rejected: no
scale problem exists that this would solve, and it directly contradicts
the single-repo, single-app reasoning already established in
[ADR-002](ADR-002-single-repo-structure.md) for exactly this kind of
"do we split it further" question.

**A generic off-the-shelf admin panel / headless-CMS-style tool
(e.g. a database-admin UI generator)**
Would save some UI-building effort for the CRUD screens. Rejected for now:
most of these tools assume they own the data model or add their own
abstraction layer over MongoDB, which sits awkwardly against the
store-scoped, application-specific rules already established (ADR-007) —
and a small number of well-scoped custom screens (catalogue, offers,
metrics) isn't a lot of UI to build directly against the existing API
anyway.
