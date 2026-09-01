# Cake Lake Bakery — project plan

Agreed four-step sequence. Do not jump ahead to a finished design; each step is signed off before the next begins.

1. **Wireframes** — DONE. Greyscale, structure only. 15 screens in `CLB Wireframes.dc.html` (+ A3 print copy).
2. **Colour themes** — DONE. **Client picked 1b — balanced yellow.** Six directions in `CLB Colour Themes.dc.html` (+ A3 print copy): 1a quiet cream, 1b yellow-led (CHOSEN), 2a berry serif, 2b ink & gold, 3a hot pink on white, 4a pale teal. (1c "loud" was rejected and removed.)
3. **Type & component system** — IN PROGRESS in `CLB Type and Components.dc.html`, built in 1b. Plan canvas lives in `UI Steps.dc.html`. Type scale, buttons, chips, cards, inputs, badges, spacing, and all states (default / pressed / disabled / unavailable) in the chosen colours.
4. **Hi-fi screens** — all screens built from that kit, plus empty/edge states and desktop variants. **Canvas sizes: mobile 393pt (iPhone 14 Pro), desktop 1512pt (14" MacBook).** Breakpoint stays 1024px. Real menu content landed Aug 2026 (see below).

## Real menu — Cake Lake Bakery 2023 printed menu (source of truth)
Currency **AED**, prefix, no decimals. Brand-wide: **eggless only · pure veg · live bakery**. Address: Building B8, Shop No. 05, Sheikh Hamdan Colony, Karama, Dubai. Shop 04 221 7761 · WhatsApp 050 328 7761 (second line 052 981 1358). Also on talabat, noon, Careem.

The printed menu prices **groups, not single items** — one price band plus a flavour list. So an item in the app IS a group (e.g. *Exotic Premium Cakes*, ½ kg AED 85 / 1 kg AED 160), with **flavour and size as options**. Full extraction lives in `content/items.csv` (39 groups), `content/categories.csv`, `content/settings.csv`.

**ONLINE SCOPE — settled Aug 2026.** Online ordering is **Cakes and Custom Cakes only**. Cupcakes & minis, Cookies & bites and Pastries & desserts are **counter-only**: removed from the app (`CLB Hi-Fi Screens.dc.html`) and from the printed PDF (`CLB Printed Menu.dc.html`), with a line on Home saying they're sold at the counter — ask on WhatsApp. Their data stays in `content/*.csv` flagged `online_orderable=no`, so they can be switched back on. Teal `#2EB4B0`, orange-red `#E74612` and deep brown `#4F352F` are therefore no longer in use as category coding — brown remains chrome (cart bar), teal survives only inside the `#228883` WhatsApp family.

**Five categories** (24 printed groups mapped onto them), chip colours re-bound:
- **Cakes** `#CD346F` — Classic, Premium, Exotic, Exotic Premium, Cheesecakes, Flavourful Indian, Travel, Well
- **Custom Cakes** `#91134B` (replaces "Party Extras") — Photo, Shape, 3D Customized, Pull Me Up, Hammer, Pinata
- **Cupcakes & Minis** `#2EB4B0` — Cupcakes, Mug Cakes, Mini Cakes
- **Cookies & Bites** `#E74612` — Cookies, Brownies, Truffle Balls
- **Pastries & Desserts** `#4F352F` — pastries, jar desserts, shot glasses, other desserts, savoury

Deep brown `#4F352F` is the fifth coding colour (no colour invented; `#228883` stays WhatsApp-only, `#7B6049` stays unavailable-only).

**talabat listing (found Aug 2026) — use for content, NOT prices.** The bakery runs higher prices on talabat to absorb the commission cut, so talabat prices are inflated; our app is direct-to-bakery, so it carries **shop prices** (printed menu). talabat is the source for per-flavour **photos** and per-flavour **descriptions** (bakery's own voice), and it shows the bakery's catalogue is **flat per-flavour**, not grouped, plus occasion categories the print menu lacks (Independence Day, Halloween, Valentine, Mother's/Father's Day, Friendship Day, New Trending) and a merchandised "Picks for you" row. Catalogue model and seasonal-category handling still undecided.

**Lead times — from the client, Aug 2026.** It is a live bakery, so **Classic, Premium, Exotic and Exotic Premium cakes need 1 hour**. **Custom cakes need 24 hours.** Everything else the client will confirm (cheesecakes, Indian cakes, mini cakes, home-made chocolates currently marked TBC). **Delivery time is extra and never quoted in the UI** — past orders landed within ~6 hours, so the UI says "confirmed in chat" rather than promising a window.

**Assumed, needs client confirmation:** opening hours (not printed), the TBC lead times above, and min order.

## Flavour photos — SETTLED: Option A
Client picked **A** (`CLB Flavour Photos A.dc.html`; B kept as record): one large hero on the group page that swaps when you tap a flavour, with a scrolling strip of 60px flavour thumbnails and a "1 / 9" counter. Menu cards show the lead flavour with a `+N FLAVOURS` overlay. Launches on one photo per group and improves as talabat's per-flavour photos come across; B needed ~70 photos to not look broken.

## Brand colours — from the logo PDF, nothing invented
`#EFD400` yellow · `#E74612` orange-red · `#CD346F` pink · `#91134B` berry · `#2EB4B0` teal · `#228883` dark teal · `#7B6049` mid brown · `#4F352F` deep brown. Cream base `#FBF4E4`.

Fixed regardless of theme:
- Text on yellow is always `#4F352F` (yellow holds neither white nor black at accessible contrast).
- WhatsApp actions always use `#228883`, so "send" never reads as "add".
- Unavailable items use `#7B6049`, never red.
- Category coding (rebound to the real menu): Cakes pink · Custom cakes berry · Cupcakes & minis teal · Cookies & bites orange-red · Pastries & desserts deep brown.

## Theme 1b rules (chosen)
Yellow header + yellow primary buttons (2px `#c9b400` drop shadow, collapses on press); brown `#4F352F` cart bar so top and bottom chrome never match; white cards on cream; category colour appears as chip fill and section rule only, never on buttons. Type: Bricolage Grotesque (names/prices/headlines) + DM Sans (prose). Minimum readable text 11.5px — sole exception uppercase tracked mono badges at 9.5px; simulated device chrome is exempt. Hit targets 44px, screen gutter 16px mobile / 32px desktop.

## Decisions settled in step 1
Per-item cake inscriptions (not order-level) · lead-time enforcement per item · delivery-only items hide Pickup entirely · WhatsApp handoff with manual "did you send it?" confirm · Party Extras as a category · "UNAVAILABLE" not "SOLD OUT" · no featured section.

## WhatsApp message format — SETTLED (see `CLB WhatsApp Message.dc.html`)
WhatsApp allows ~65,536 chars, so it never constrains us. The real ceiling is the wa.me `text` parameter: ~2,000 chars **encoded**, and encoding inflates this kind of text ~2.2× (spaces `%20`, newlines `%0A`) — so the raw budget is ~900, minus ~150 for header/totals/date = ~750 for line items at ~70 chars each.

**Full detail up to 15 line items; compress from the 16th.** A line item costs ~33 raw chars (~46 effective with inscriptions), so 830 ÷ 46 ≈ 18 — the rule sits at 15 to keep headroom for long names. Line order fixed: name → items → total → fulfilment + date. One line per item with quantity prefixed (identical items merge); inscriptions indent under their item in curly quotes; options inline only when chosen. Past fifteen: keep cakes itemised, roll the rest into a per-category count, then send a second message with the remainder (same "did you send it?" confirm). Measure encoded length before opening the link and roll up one more item if it exceeds 2,000. Plain text only — no emoji, no markup.

## Printed menu — `CLB Printed Menu.dc.html`
Three A4 pages: yellow cover, Cakes, Custom Cakes. Built on `doc-page.js` with explicit pagination (one `.page` per sheet) — never let a page overflow; measure `scrollHeight - clientHeight` after edits. Art system is abstract **Dubai skyline** silhouettes in pure CSS (spire, sail, arch frame, twisted stack, dome) as a low 20mm band along the foot of each page in that section's colour, plus piped-icing scallop edges under the full-bleed section bands and sprinkle-tick rules. Cover puts the skyline over horizontal lake ripples. Plain pre-art version kept at `CLB Printed Menu v1 plain.dc.html`.

Only Classic, Premium, Exotic and Exotic Premium carry a "Ready in 1 hour" pill — the banner says "Baked fresh · live bakery", never a blanket 1-hour claim. **In-app there is no PDF affordance on the Menu screens at all (Option A, settled Aug 2026).** The square PDF button beside the search field read as a submit control; a text link under the chips was tried and also rejected. The only entry point is the **DOWNLOAD MENU (PDF)** button on Home (mobile and desktop) — someone already browsing the live menu has no need of a static one.

## Still open
- `CLB Hi-Fi Screens-print.dc.html` is STALE — still holds the placeholder menu. Regenerate before any client print.
- A second handoff confirm for the follow-up message (orders past 15 items) — screen not yet drawn.
- An item going unavailable while already in a day-old cart.
- Optional live-kitchen callout on Home.
