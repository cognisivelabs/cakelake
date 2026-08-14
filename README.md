# Cake Lake Bakery

Web ordering platform for Cake Lake Bakery, a cake shop in Dubai, UAE currently
taking orders through WhatsApp Business. This repo covers the move to a proper
web presence: online catalogue, time-limited offers, live order tracking, and
UAE-gateway payments — built store-scoped from day one so a second and third
branch can come online without a data model rewrite.

## Project phases

This project runs in three phases. Each phase has a clear output and a clear
home in this repo.

### 1. Planning (current phase)

Requirements gathering, open questions, and design direction, all versioned
here so the trail from "what the client asked for" to "what got built" is
traceable.

- [`docs/requirements/`](docs/requirements/) — the requirements doc, the
  client-facing questionnaire, and (as answers come in) a decisions log.
- [`docs/design/`](docs/design/) — a short written pointer to the design
  system's canonical home (see below).
- [`docs/adr/`](docs/adr/) — Architecture Decision Records: tech stack,
  hosting, and other technical decisions, with the reasoning behind them.
- [`docs/architecture/`](docs/architecture/) — a short system overview
  tying the ADRs together into one picture of how the pieces fit.

No application code is written in this phase.

### 2. Prototype approval

**Claude Design is the single source of truth for the design system** — not
this repo. The live project is
["Cake Lake Design System"](https://claude.ai/design) on claude.ai/design:
a real React component library (Button, ItemCard, OrderTracker, etc.), design
tokens, foundation guidelines, and a click-through recreation of the site,
all built and maintained there.

- [`design-system/`](design-system/) — a **read-only mirror** of that Claude
  Design project, pulled down so the design trail stays versioned in git
  alongside requirements and code. Claude Design always wins on conflict: if
  this folder and the live project disagree, re-pull from Claude Design
  rather than hand-editing files here. See
  [`design-system/readme.md`](design-system/readme.md) for the full index.
- [`prototype/`](prototype/) — the working ordering-flow prototype, built in
  Claude Design against the components in `design-system/` (paths point at
  `../design-system/` and `../docs/design/photos/` rather than separate
  copies). Two versions: `Cake Lake Ordering Prototype.dc.html` (v1) and
  `Cake Lake Ordering Prototype v2.dc.html` ("The Case" direction —
  photography-led catalogue, sticky category rail, persistent order bar; the
  current one). Open either `.dc.html` file in a browser to view it — v2
  also needs `image-slot.js` alongside it, both need `support.js`.
  [`prototype/explorations/`](prototype/explorations/) keeps the layout and
  logo directions that were explored but not carried forward, for the
  record. See [`github.md`](github.md) for the sync notes on what each
  covers and what it reconciled against the requirements doc.

Development does not start until the client signs off on this prototype.

### 3. Development

- [`app/`](app/) — the real build. Left empty until the client approves a
  prototype and development is explicitly greenlit. Tech stack is proposed
  in [`docs/adr/`](docs/adr/), not locked in — see the Tech Stack table
  below. Final choices are confirmed in `docs/requirements/requirements.md`
  once the prototype is approved.

## Documentation

| Area | Where | What it covers |
|---|---|---|
| Requirements | [`docs/requirements/`](docs/requirements/) | Confirmed scope, open questions, decisions log |
| Design | [`docs/design/`](docs/design/) | Pointer to the canonical Claude Design project |
| Design system mirror | [`design-system/`](design-system/) | Read-only pull of the Claude Design components/tokens |
| Prototype | [`prototype/`](prototype/) | Click-through builds for client sign-off, plus explored-but-not-picked directions |
| Architecture decisions | [`docs/adr/`](docs/adr/) | ADRs — tech stack, hosting, identity, order tracking, payments, data model, notifications, logging, metrics, admin console |
| System overview | [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md) | How the ADRs fit together into one picture |

### Tech Stack

Proposed, not locked in — see [`docs/adr/`](docs/adr/) for the full
reasoning behind each choice, and note the scale this is sized for: a
single bakery shop today, a few branches down the line, not a
high-traffic platform.

| Layer | Technology | ADR |
|---|---|---|
| Frontend | Next.js (React) | [ADR-001](docs/adr/ADR-001-tech-stack.md) |
| Backend | Node.js / Express | [ADR-001](docs/adr/ADR-001-tech-stack.md) |
| Database | MongoDB (Atlas) | [ADR-001](docs/adr/ADR-001-tech-stack.md) |
| Repo structure | Single repo, no polyrepo split | [ADR-002](docs/adr/ADR-002-single-repo-structure.md) |
| Hosting | AWS `me-central-1`, one small compute node | [ADR-003](docs/adr/ADR-003-hosting.md) |
| Order tracking | HTTP polling, no WebSockets | [ADR-004](docs/adr/ADR-004-order-tracking-strategy.md) |
| Customer identity | Mobile number (accounts) / email (guests) | [ADR-005](docs/adr/ADR-005-customer-identity.md) |
| Payments | Telr or PayTabs — pending client info | [ADR-006](docs/adr/ADR-006-payment-gateway.md) |
| Data model | Store-scoped from day one | [ADR-007](docs/adr/ADR-007-store-scoped-data-model.md) |
| Notifications | Order confirmation email via AWS SES | [ADR-008](docs/adr/ADR-008-order-confirmation-email.md) |
| Logging | Structured logs to CloudWatch + Sentry-style error tracking | [ADR-009](docs/adr/ADR-009-logging-and-error-tracking.md) |
| Metrics | Mongo aggregation (orders) + lightweight cookie-free analytics (traffic) | [ADR-010](docs/adr/ADR-010-metrics-and-analytics.md) |
| Admin console | Protected route section of the same app, not a separate one | [ADR-011](docs/adr/ADR-011-admin-console.md) |

## Workflow

- Client answers get folded into `docs/requirements/requirements.md` as they
  come in, shrinking the open-questions section over time.
- Design work happens entirely in Claude Design. `design-system/` in this
  repo is a pulled-down mirror for version history, not a place to edit —
  when the Claude Design project changes, re-pull it rather than editing the
  mirror directly.
- `app/` scaffolding starts only once the client has approved the design in
  Claude Design and development is explicitly requested.
- Technical decisions get an ADR in `docs/adr/` — Proposed while still
  tentative, Accepted once settled. See [`docs/adr/README.md`](docs/adr/README.md)
  for the format and when to write one.
