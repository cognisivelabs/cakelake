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

Development does not start until the client signs off on the design in
Claude Design.

### 3. Development

- [`app/`](app/) — the real build. Left empty until the client approves a
  prototype and development is explicitly greenlit. Tentative stack (not
  locked in): Next.js frontend, Node/Express + MongoDB backend, AWS
  `me-central-1` hosting, Telr or PayTabs for UAE payments. Final choices are
  confirmed in `docs/requirements/requirements.md` once the prototype is
  approved.

## Workflow

- Client answers get folded into `docs/requirements/requirements.md` as they
  come in, shrinking the open-questions section over time.
- Design work happens entirely in Claude Design. `design-system/` in this
  repo is a pulled-down mirror for version history, not a place to edit —
  when the Claude Design project changes, re-pull it rather than editing the
  mirror directly.
- `app/` scaffolding starts only once the client has approved the design in
  Claude Design and development is explicitly requested.
