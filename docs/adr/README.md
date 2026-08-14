# Architecture Decision Records — Cake Lake

This directory contains Architecture Decision Records (ADRs) for the Cake Lake
project. ADRs document significant technical decisions, the context that led
to them, and the reasoning behind the chosen approach.

**Scale note:** Cake Lake is a single-shop (soon multi-branch) bakery ordering
site, not a high-traffic platform. Every decision here is made against that
reality — low concurrent load, a small budget-conscious client, and a small
build team. Where Kram (a sister project at Cognisive Labs) needed
BEAM-level concurrency guarantees and a four-repo split, Cake Lake generally
doesn't — and the ADRs say so explicitly rather than importing complexity
that isn't earned yet.

## Format

Each ADR follows this structure:

```
Status: Proposed | Accepted | Deprecated | Superseded by ADR-XXX
Date: YYYY-MM-DD

Context:
  The situation requiring a decision. What constraints exist? What are the forces at play?

Decision:
  What was decided. Be specific.

Rationale:
  Why this decision is right for Cake Lake specifically — referencing the
  client's budget, the actual expected load, and team/tooling constraints.

Consequences:
  What this decision means going forward. What becomes easier. What becomes harder.

Alternatives Considered:
  What else was evaluated and why it was rejected.
```

`Proposed` means the decision is the working plan but not yet locked in —
most of Cake Lake's ADRs are Proposed until the prototype is approved and
development is greenlit (see root [`README.md`](../../README.md)). `Accepted`
is reserved for decisions that don't depend on that approval — data model
and identity shape, mainly.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](ADR-001-tech-stack.md) | Tech Stack — Next.js + Node/Express + MongoDB | Proposed |
| [ADR-002](ADR-002-single-repo-structure.md) | Single Repository, Not Polyrepo | Accepted |
| [ADR-003](ADR-003-hosting.md) | AWS `me-central-1` Hosting, Minimal Footprint | Proposed |
| [ADR-004](ADR-004-order-tracking-strategy.md) | Order Tracking — Polling, Not WebSockets | Proposed |
| [ADR-005](ADR-005-customer-identity.md) | Customer Identity — Mobile Number for Accounts, Email for Guests | Accepted |
| [ADR-006](ADR-006-payment-gateway.md) | Payment Gateway — Telr vs. PayTabs | Proposed |
| [ADR-007](ADR-007-store-scoped-data-model.md) | Store-Scoped Data Model From Day One | Accepted |

## How to Propose a New ADR

This is a single-repo, small-team project — no formal issue-linking process
like Kram's polyrepo workflow. To propose an ADR:

1. Write the file directly in `docs/adr/ADR-NNN-short-title.md`, Status: Proposed
2. Discuss it in chat (with Claude Code) or with whoever else is deciding
3. Once settled, flip Status to Accepted and add a one-line entry to the
   [requirements decisions log](../requirements/requirements.md#decisions-log)
   if it also resolves a product-facing open question
4. If this ADR supersedes an existing one, update the old ADR's status to
   "Superseded by ADR-NNN"
