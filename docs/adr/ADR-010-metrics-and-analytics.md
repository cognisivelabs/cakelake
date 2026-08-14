# ADR-010: Metrics & Analytics — Orders and Traffic

**Status:** Proposed
**Date:** 2026-08-14

## Context

Operational requirement (see [requirements.md](../requirements/requirements.md)):
visibility into order volume and site traffic — "how many orders today,"
"what's selling," "how many people are visiting" — without digging through
raw data by hand.

This is a business-visibility need, not an engineering-observability need
(see [ADR-009](ADR-009-logging-and-error-tracking.md) for that side).
Whoever runs the bakery day to day — likely via the admin console, see
[ADR-011](ADR-011-admin-console.md) — needs simple numbers, not a BI
platform. At Cake Lake's order volume (tens a day), even a fairly basic
approach gives a complete, accurate picture.

## Decision

Two separate, small answers for two separate questions:

**Order metrics — computed from the app's own database.** MongoDB
aggregation queries over the `orders` collection (already store-scoped per
[ADR-007](ADR-007-store-scoped-data-model.md)), surfaced as a simple
dashboard section in the admin console: orders today/this week, revenue,
top-selling items, by store. No separate analytics database or ETL — the
orders collection already has everything needed.

**Traffic metrics — a lightweight, privacy-friendly web analytics tool**
(e.g. Plausible or Simple Analytics — cookie-free, no consent-banner
overhead) embedded on the customer-facing Next.js site, for page views,
visitor counts, and basic traffic sources. Not built in-house.

## Rationale

**Order metrics are just queries over data that already exists.** There's
no separate reporting/analytics infrastructure needed to answer "how many
orders today" or "what sold this week" — it's a `count`/`aggregate` query
against the same MongoDB collection the app already writes to for every
order. Building this as a small admin-console view (ADR-011) is
proportionate: real numbers, no new data pipeline.

**Traffic metrics are a different kind of data — better bought than
built.** Page views and visitor counts require client-side tracking,
bot filtering, and session/visitor deduplication — genuinely fiddly to get
right, and multiple mature tools already do it well and cheaply.
Plausible/Simple-Analytics-style tools are chosen specifically because
they're lightweight (a single small script tag, not a heavy tag-manager
setup) and cookie-free, which sidesteps needing a cookie-consent banner —
one less thing to build and one less thing that hurts the site's own
performance and UX.

**No full BI/analytics platform.** Something like a data warehouse +
Looker/Metabase setup is the right tool when there are many data sources to
join and non-trivial ad-hoc analysis needs. Cake Lake has one data source
(its own orders collection) and a short, known list of questions to
answer. Standing up a BI platform for that would be solving a problem that
doesn't exist yet.

## Consequences

- The admin console (ADR-011) needs a small metrics/dashboard section —
  this is the natural home for order numbers, not a separate tool
- One more small third-party script (the analytics tool's tracking tag) on
  the customer-facing site — chosen specifically to be lightweight and
  cookie-free to minimize performance and compliance overhead
- No historical trend analysis beyond what MongoDB queries can reasonably
  produce on demand — acceptable at this data volume; revisit only if the
  business genuinely needs year-over-year cohort-style analysis that raw
  aggregation queries can't answer well
- Traffic analytics tool needs an account and (small) subscription cost —
  budgeted as a minor operating cost, not a line item requiring its own
  ADR-level debate

## Alternatives Considered

**Google Analytics for traffic**
Free, extremely capable, industry-standard. Rejected as the default choice
specifically because of its cookie/consent-banner requirements and heavier
client-side footprint — for a small bakery site where "how many visitors
today" is the actual question being asked, a lightweight cookie-free tool
answers it just as well without the UX and compliance overhead. Could be
reconsidered if the client specifically wants GA's deeper marketing-funnel
features later.

**Building a custom admin analytics pipeline (event tracking table,
scheduled aggregation jobs)**
The "own it fully" option. Rejected as unnecessary engineering effort for
numbers that direct MongoDB aggregation queries already answer correctly
at this data volume — see [ADR-003](ADR-003-hosting.md)'s stance against
adding infrastructure (here, a scheduled job runner) before it's earned.

**A full BI tool (Metabase, Looker, etc.) connected to the database**
Would give more flexible ad-hoc querying than a fixed admin dashboard.
Rejected as more tool than the actual, known set of questions ("orders
today," "top sellers," "traffic") requires — see Rationale.
