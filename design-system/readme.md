# Cake Lake Design System

Cake Lake is a small Dubai bakery (est. 2019) selling celebration cakes, cupcakes and everyday
bakes through a marketing-plus-ordering website, with two physical shops and two more announced.
The product surface is **one website** covering browse → order → collect, with an order tracker as
its signature feature. There is no separate app, dashboard or docs site in the material supplied.

## Sources given

- **Attached codebase:** `design/design-system.html` — a single self-contained internal
  "visual language" reference page for *Cake Lake Bakery*, containing the live site's full CSS
  (header, hero, offers, menu, tracker, in-store, locations, footer), the palette, the type scale,
  component demos and a spacing/radius token table. It links back to a sibling `index.html`
  (the site itself) which was **not** attached.
- No Figma file, no decks, no repo, no font binaries, no image or icon assets were provided.

Every value in this system is lifted verbatim from that file. Nothing was rounded to a grid.

## Index

| Path | What it is |
|---|---|
| `styles.css` | Consumer entry point — `@import` list only |
| `tokens/` | `fonts`, `colors`, `typography`, `spacing`, `radius`, `elevation`, `motion` |
| `components/core/` | Button, IconButton, Eyebrow, Chip, StatusPill, Tab, Stat, SectionHead |
| `components/commerce/` | ItemCard, OfferCard, LocationCard |
| `components/tracking/` | OrderTracker |
| `ui_kits/cakelake-site/` | Click-through recreation of the site (see its README) |
| `guidelines/` | 17 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `assets/` | `logo-mark.svg`, `layer-cake.svg`, `cake-icon.svg` |
| `SKILL.md` | Agent-skill wrapper for use outside this project |

### Components

**Core** — `Button`, `IconButton`, `Eyebrow`, `Chip`, `StatusPill`, `Tab`, `Stat`, `SectionHead`.
**Commerce** — `ItemCard`, `OfferCard`, `LocationCard`.
**Tracking** — `OrderTracker`.

Each has a sibling `.d.ts` (props) and `.prompt.md` (when to use it).

**Intentional additions** (not literally named in the source, but assembled from patterns it shows):
`SectionHead` (the repeated eyebrow + H2 + description + right-aligned action block) and
`Stat` (the hero `.stat` figure/caption pair). Both are compositions of source markup, not new design.

## Content fundamentals

**Voice: a baker talking, not a brand talking.** Plain, specific, slightly dry. Confidence comes
from concrete facts, never from adjectives — the source's own line is *"Warm and fresh rather than
the typical bakery 'cream + terracotta' default"*, and the copy follows the same logic: say the real
thing, skip the flourish.

- **Casing:** sentence case everywhere — headings, buttons, nav. The only uppercase is mono:
  eyebrows (`DESIGN SYSTEM`), chips, prices, codes, hours.
- **Person:** mostly no pronoun ("Order online", "Track an order"). "You/your" for the customer's
  things ("your cake", "when you order 48h ahead"); "we" only for the bakery's promises
  ("we text you"). Never "I".
- **Punctuation:** em-dash asides are the house move — *"Custom cakes, cupcakes and celebration
  bakes — order online."* Full stops on headlines are allowed and used: *"Cake, made properly."*
  Middle dots separate mono data: `AED 145 · ORDER #LY-4471`.
- **Numbers:** always literal and mono. `AED 145`, `48h`, `72h`, `#LY-4471`, `08:00 — 22:00`.
  Currency prefixed `AED`, never a symbol.
- **Buttons:** verb-first, 2–3 words. "Order online →", "Track an order". A trailing `→` only on
  the single primary action; ghost buttons never carry it.
- **Headline pattern:** short declarative with one italic berry word carrying the emotion —
  *Cake, **made properly**.* Use once per page at most.
- **Emoji: never.** The only non-alphanumeric glyphs are `→` (primary CTA), `✓` (completed tracker
  stage), `★` (rating), `·` (mono separator), `—` (em dash / time ranges), `+` (add to cart).
- **Explain the rule, not the benefit.** *"Hover states only, never at rest."* / *"Never more than
  one primary button visible at a time in a section."* Internal copy is written as instructions.

## Visual foundations

**Colour.** Cream page (`#FBF6EC`), white paper cards, warm-brown ink type (`#2B241D`) — never pure
black. Three accents, each with exactly one job: **honey** `#E2A233` = the primary CTA fill,
**berry** `#C7355A` = brand accent, links, dots and dashed coupons, **pistachio** `#6F9463` =
fresh/success/open and the illustration well tint (`#E4EEDF`). Two background colours per page
maximum: cream, plus ink for one full-width dark block. Dark blocks get their own scale
(`#241d16 → #332b22 → #46402f → #5c5340`) with text stepping `#fff → #c9c0b2 → #9c9384 → #8a8171`.
No gradients anywhere except the two shadows.

**Type.** Three families, strictly divided. **Fraunces 600** (tracking −0.01em, leading 1.02) for
headlines only, with italic 500 in berry for the emphasis word. **Inter** 400/500/600 for all
readable text at 17/15/14/13px, 1.6 leading (1.7 in long body). **JetBrains Mono** for anything
transactional or systemic: prices, order numbers, promo codes, hours, stats, eyebrows (12px /
0.14em / uppercase) and chips (10.5px / 0.06em). If it's a number a customer might read aloud,
it's mono.

**Spacing & layout.** 1180px content max, 24px gutters, 64px vertical section padding, 22px grid
gap. Menu grid 3-up → 2-up at 860px → 1-up at 520px. The header is the only fixed element:
sticky, `rgba(251,246,236,0.88)` with `blur(10px)` — the single use of transparency and blur in the
system, and it exists only so cream content scrolls under it legibly. No scrim/protection
gradients; contrast is handled by solid surfaces instead.

**Corners.** 22px cards, 16px offer/comp cards, 14px media wells, 12px small tiles, 32px dark
full-width blocks, 36px phone mock, and 100px pills for every button and status pill. Nothing is
square-cornered.

**Borders & shadow.** Structure is drawn with 1px `#E7DECC` hairlines; emphasis borders are 1.5px.
**Dashed lines are a motif, not decoration:** 1.5px dashed `--line` = an empty or not-yet state
(the "opening 2026" shop), 1.5px dashed berry = a coupon (plus two 18px punch-hole notches
matching the page background), 1px dashed hairline = a receipt rule separating price from content.
Exactly one shadow exists — `0 18px 40px -20px rgba(43,36,29,.25)` — used on card hover and under
the floating phone mock, **never at rest**; plus a honey glow `0 10px 24px -10px rgba(226,162,51,.7)`
that belongs to the primary button only. No inner shadows.

**Cards.** Paper fill, 1px hairline, 22px radius, 22px padding, no shadow at rest, contents stacked
with a 14px gap, and a dashed rule above the price/footer row.

**Motion.** Short and unshowy: 0.15s on buttons and colour changes, 0.18s on card lift, 0.2s on
tracker state, all plain `ease`. **Hover** = a colour swap (honey→honey-deep, ink "+"→berry) or an
inversion (ghost button fills with ink; nav link grows a 2px berry underline left-to-right in
0.2s); cards translate −5px and gain the shadow. **Press** = `scale(0.97)` on buttons, nothing else.
The only ambient animation is the hero crumbs floating ±14px on a 6s loop, and it's disabled under
`prefers-reduced-motion`. No bounces, no spring, no parallax, no entrance animations.

**Imagery.** The source ships no photography — bakes are represented by flat geometric SVG
illustrations (stacked rounded rects in a single accent colour with stepped opacity) sitting in a
pistachio-tinted well. Colour vibe is warm, clean and flat: no grain, no filters, no drop shadows on
art. The **layer cake** is the one bold illustrated moment and is reserved for order tracking.

## Iconography

The source uses **no icon library, icon font, or sprite** — glyphs are one-off inline SVGs, and the
only real assets are the three copied into `assets/`:

- `logo-mark.svg` — three stacked rounded bars, berry / honey / pistachio bottom-up, 26px in the header.
- `layer-cake.svg` — the signature tracker illustration.
- `cake-icon.svg` — the 88px product-card illustration (berry at 100/75/55% opacity plus a cherry).

Where an interface glyph is genuinely needed (shopping bag, QR code) the UI kit links
**Lucide Static** from CDN — `https://unpkg.com/lucide-static@0.436.0/icons/<name>.svg` — chosen for
its 2px-stroke outline style, closest to the source's thin geometric drawing. **This is a
substitution and should be replaced with real assets.** Interface *symbols* are typographic, not
iconographic: `→ ✓ ★ · + —`. Emoji are never used.

## Substitutions to confirm

- **Fonts:** no binaries were supplied. Fraunces, Inter and JetBrains Mono load from Google Fonts,
  exactly as the source document did — so this matches production, but ship self-hosted files if
  the real site does.
- **Icons:** Lucide Static via CDN (see above).
- **Photography:** none supplied; illustrations only.
