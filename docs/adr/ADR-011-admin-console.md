# ADR-011: Admin Console

**Status:** Accepted
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
content-management tool for whoever manages the catalogue and offers.

Cake Lake is one small team building one small site, per
[ADR-002](ADR-002-single-repo-structure.md) — whatever the admin console
turns out to be, it shouldn't become a second application to build,
deploy, and maintain independently.

**This ADR went through a round worth keeping for context.** The working
prototype (`prototype/Cake Lake Admin.dc.html`) designed a materially
fuller system than requested: three roles (Owner / Catalogue manager /
Counter staff), invite-based staff onboarding, and an audit log of every
change. That was flagged for confirmation rather than silently accepted.
**Confirmed 2026-08-14: simplify to plain CRUD for MVP — roles, invites,
and the audit log are deferred**, not part of the current build. The
prototype's fuller design isn't discarded; it's kept as a ready reference
for when a second branch or a bigger team actually needs it (see
Alternatives).

## Decision

The admin console is a **protected section of the same Next.js app**
(e.g. routes under `/admin`), calling the **same Express API** with
admin-authenticated requests — not a separate application, not a separate
repo. **MVP scope, deliberately flat:**

- Catalogue CRUD (items: name, price, description, photos, tags,
  availability), store-scoped
- Offers CRUD (create/edit/end time-limited promotions), store-scoped
- The order/traffic metrics view from ADR-010

No role tiers — any staff member with admin access can do all of the
above. No invite flow — staff accounts are set up directly (by whoever's
doing the initial setup), not through a self-service in-app invite. No
audit log.

Authentication for admin users is still a separate concern from customer
identity (ADR-005) — staff are their own collection/identity space, not
customer accounts, confirmed as settled regardless of how simple or
elaborate the admin scope is.

## Rationale

**One app, protected routes — not a second app.** Splitting the admin
console into its own Next.js project (or worse, its own repo) would double
the deployment surface, the dependency management, and the hosting
footprint for a feature used by a handful of staff, occasionally. Reusing
the same app and API — just with an authenticated route section — is the
smaller, cheaper answer that still fully satisfies the requirement, and
it's consistent with the single-repo reasoning in
[ADR-002](ADR-002-single-repo-structure.md).

**Flat access matches one shop and a small trusted team.** Roles exist to
answer "who's allowed to do what, and how do we know if that's not
enough" — a real question once there's a second branch, more staff, and
reasons to limit who can touch offers/pricing vs. who just needs to
manage orders. None of that is true yet: one shop, presumably a handful
of people who all already need full catalogue/offer access to do their
jobs. Building role enforcement, an invite flow, and an audit trail now
would be solving a team-management problem that doesn't exist yet, at the
cost of real build time better spent elsewhere for MVP.

**Same backend, same data model, either way.** The admin console reads and
writes the exact same store-scoped catalogue/offers/orders collections the
customer site already uses (see [ADR-007](ADR-007-store-scoped-data-model.md))
— there's no separate admin database or sync process to keep consistent,
regardless of whether roles exist on top of that access.

**Store-scoping falls out of ADR-007 for free.** Because every catalogue
item and offer already carries a `storeId`, a future second branch's staff
sees and edits only their own store's catalogue/offers without any
additional design work — the admin console just needs to filter by the
logged-in staff member's store, the same way every other store-scoped
query already does. This holds whether or not roles are ever added.

**Staff auth stays deliberately separate from customer auth regardless of
scope.** A customer OTP (ADR-005) lets someone place an order; a staff
login lets someone write to the live catalogue and offers. Keeping them
separate collections/checks avoids a customer session ever reaching admin
capability by accident — this doesn't change whether the admin side has
one flat access level or three roles.

## Consequences

- `/admin` routes need their own auth guard (middleware) distinct from
  customer session handling — a customer session must never grant access
  here
- Admin users are a small, separate concept from customers — a short list
  of staff accounts per store, set up directly rather than through a
  self-serve or in-app invite flow
- No per-permission enforcement needed server-side for MVP — any
  authenticated staff member can reach any admin route — which also means
  this is simpler to build and to reason about than the role system would
  have been
- No audit log for MVP — catalogue/offer changes aren't attributed to a
  specific staff member or timestamped beyond normal document
  updated-at fields
- The admin console covers catalogue, offers, and (once built) the
  metrics view from [ADR-010](ADR-010-metrics-and-analytics.md) — it does
  **not** include an orders view, same as before
- Photo upload for catalogue items needs a storage answer (e.g. S3, given
  [ADR-003](ADR-003-hosting.md)'s AWS hosting) — a small addition to that
  ADR's scope once development starts, not a new infrastructure decision
- Because it's the same Next.js/Express app, admin console changes ship on
  the same deploy as customer-site changes — acceptable at this scale (see
  [ADR-002](ADR-002-single-repo-structure.md))
- The order-status tap screen (requirement #5's staff side) and the admin
  console can share the same auth mechanism — one staff login, two things
  they might do with it
- **Deferred to a later phase, kept as a ready reference, not thrown
  away:** the prototype's role system (Owner / Catalogue manager / Counter
  staff), invite-based onboarding, and activity log. Revisit when a second
  branch or a larger team makes flat access genuinely insufficient — the
  design work doesn't need redoing at that point, just building

## Alternatives Considered

**Building the full role/invite/audit-log system now, as the prototype
designed it**
Genuinely well-designed and already prototyped — not rejected because it's
a bad idea, but because it solves a team-management problem this project
doesn't have yet (one shop, a small trusted team). Explicitly deferred
rather than rejected outright: the prototype stays as the reference design
for when it's actually needed, so this isn't lost work, just sequenced
later.

**Separate admin application (its own Next.js project or repo)**
Cleaner separation of concerns, could scale independently. Rejected: no
scale problem exists that this would solve, and it directly contradicts
the single-repo, single-app reasoning already established in
[ADR-002](ADR-002-single-repo-structure.md).

**A generic off-the-shelf admin panel / headless-CMS-style tool
(e.g. a database-admin UI generator)**
Would save some UI-building effort for the CRUD screens. Rejected for now:
most of these tools assume they own the data model or add their own
abstraction layer over MongoDB, which sits awkwardly against the
store-scoped, application-specific rules already established (ADR-007) —
and a small number of well-scoped custom screens (catalogue, offers,
metrics) isn't a lot of UI to build directly against the existing API
anyway.
