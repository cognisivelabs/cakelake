# Design source files

These are working files from the client's design process (Claude Design
canvases + a planning doc), pulled into the repo so the desktop-layout
spec they contain isn't solely dependent on someone's local `Downloads`
folder — see [ADR-003](../adr/ADR-003-whatsapp-order-handoff.md)'s
corrected breakpoint entry for why that mattered in practice.

- **`CLAUDE.md`** — the project's step-by-step planning log: the
  four-step process (wireframes → colour themes → type/components →
  hi-fi), decisions made at each step, the real menu content mapping,
  and settled details like the WhatsApp message format and the
  1024px breakpoint. This is the actual source of truth other docs
  point to — **not** related to this repo's own `app/CLAUDE.md` (that
  one is unrelated Next.js/Claude Code tooling config); the shared name
  is a coincidence of the design tool's own convention.
- **`CLB-Hi-Fi-Screens.dc.html`** — the finished screens, mobile and
  desktop, in the chosen colour theme (1b) with real menu content. This
  is what `app/README.md` calls "the visual/content reference."
- **`CLB-Type-and-Components.dc.html`** — the design system (type
  scale, buttons, chips, cards, inputs, badges, spacing, and all
  states) every screen in the Hi-Fi file is built from.

## What's deliberately not here

The source folder also has wireframes, colour-theme explorations, print
layouts of the above, a plain (non-canvas) HTML export of the Hi-Fi
file, the printed-menu design, the WhatsApp-message-format design, and
the flavour-photo A/B decision record. Those document the *process* that
led here or cover features not yet built (the PDF menu). Left out to
keep this folder to what's actually needed for ongoing development
rather than the full design-process archive — ask if any of those
turn out to be needed and they can be added the same way.
