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

**Each item's data also includes an `available` flag,** defaulting to
true. When false, the item stays visible on the Menu (not removed) but
shows grayed out with a "Sold out" label, and "Add to Cart" is disabled
on both the Menu list and Item Detail — without this, every sold-out
item turns into a "sorry, none left" conversation on WhatsApp instead.

**Each item's data also includes a `leadTimeHours` field,** defaulting
to 0/none for standard items and a real number (e.g. 72) for custom or
tiered cakes needing advance notice. It's shown on Item Detail for that
specific item, and it's why Home and Contact both carry a short,
general "custom cakes need advance notice" note — the site-wide framing
lives in those two places while the specific number lives on Item
Detail. See [ADR-003](ADR-003-whatsapp-order-handoff.md) for how the
Cart screen enforces it against "when needed."

**`leadTimeHours` can be set per size/option within an item, not just
once per item.** A cake's smallest size might be same-day feasible while
its largest tier needs 72 hours — the field needs to live at whichever
level (item or option) actually varies, rather than forcing one number
for the whole item. The real numbers, and whether they vary by size,
are still the client's to confirm — this just makes sure the data shape
doesn't need to change again once those numbers come in.

**The catalogue isn't cakes-only.** Party/event add-ons (candles, a
cake knife, a party cap, balloons — a backdrop was raised but is out of
scope for now) are just items in the same catalogue, in their own Menu
category, using the same `available`/`requiresDelivery`/`leadTimeHours`
flags and the same options structure as cakes. This is exactly why
options needed to be a flexible, generic set of groups per item rather
than a hardcoded size+flavour pattern — most add-ons don't follow that
shape at all (a knife or cap likely has no options; balloons might have
a colour or quantity choice).

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
- **The `available` flag inherits this ADR's core limitation: it's only
  as fast as a commit and a redeploy.** That's fine for predictable
  unavailability (an item retired, out of season, a multi-day restock
  delay) — it does not solve a same-day, mid-afternoon sellout, since
  nobody at the counter can realistically push a code change in the
  moment. Whether that gap matters depends on how often it actually
  happens — see the open question in
  [requirements.md](../requirements/requirements.md). If it turns out to
  be routine, that's the trigger for a small, dedicated
  availability-toggle mechanism later, not a reason to build one now on
  a guess
- The `leadTimeHours` field needs the same care as `requiresDelivery` —
  set incorrectly, it either blocks a date that was actually fine, or
  lets a customer select a date the bakery can't realistically meet
- Real lead-time numbers, and whether they vary by size within an item,
  are still needed from the client — see the open question in
  [requirements.md](../requirements/requirements.md). The 72-hour figure
  used elsewhere in these docs is a placeholder, not a confirmed number

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
