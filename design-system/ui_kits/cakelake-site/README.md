# Cake Lake — site UI kit

Click-through recreation of the Cake Lake bakery site, rebuilt from the CSS and markup in
`design/design-system.html` (the only source supplied). Four routes, all composed from the
design-system components — nothing is re-implemented locally.

| File | What it is |
|---|---|
| `index.html` | Interactive shell — loads the compiled bundle, then each screen as a Babel script |
| `SiteChrome.jsx` | Sticky blurred header (nav, cart bubble, order CTA) + footer with payment chips |
| `HomeScreen.jsx` | Hero, offers strip, menu preview, ink tracker block, in-store phone mock, locations |
| `MenuScreen.jsx` | Category tab row + 3-up product grid |
| `TrackOrderScreen.jsx` | Order page built around `OrderTracker`, plus order + collection cards |
| `LocationsScreen.jsx` | 2-up grid of live and dashed "opening soon" shops |
| `data.jsx` | Sample bakes, offers, locations |

**Interactions:** nav switches routes and underlines the current one; the "+" on any product card
increments the header cart bubble; menu tabs filter the grid; "Simulate next stage" advances the
tracker so the cake gains a layer.

**Not in the source, therefore omitted:** checkout, account, cake customiser, blog. The source
document showed no such screens, so none were invented.

**Icon substitution:** the source had no icon set (only inline one-off SVGs), so utility glyphs
(bag, QR) come from Lucide Static via CDN. Swap for real assets when available.
