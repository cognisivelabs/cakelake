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
- [`docs/design/`](docs/design/) — the written design system reference:
  palette, type, and the signature order-tracker component. The visual
  prototyping itself happens in Claude Design, not in this repo; this doc is
  what keeps that tool and this repo aligned.

No application code is written in this phase.

### 2. Prototype approval

Static HTML mockups — built in Claude Design against the reference in
`docs/design/design-system.md`, then exported back into this repo.

- [`prototype/`](prototype/) — static HTML mockups: design system reference,
  home, menu, offers, order tracker, and locations pages.

Development does not start until the client signs off on this prototype.

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
- Design work happens in Claude Design, referencing `docs/design/design-system.md`.
  Finished prototypes land in `prototype/`.
- `app/` scaffolding starts only once the client has approved a prototype and
  development is explicitly requested.
