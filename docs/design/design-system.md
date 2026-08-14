# Cake Lake Bakery — Design System Reference

This is the **written** reference. The visual prototype lives in Claude
Design, and a static HTML export of it lives in [`/prototype`](../../prototype),
including [`prototype/design-system.html`](../../prototype/design-system.html)
as an interactive version of everything below. Keep this file and Claude
Design in sync — when the palette, type, or a component changes in one place,
update the other.

Direction: warm and fresh rather than the typical bakery "cream + terracotta"
default. Cream stays light and neutral; personality comes from raspberry,
pistachio, and honey each doing a distinct job rather than existing as
decoration.

## Color

| Token | Value | Use |
|---|---|---|
| Cream | `#FBF6EC` | Page background |
| Paper | `#FFFFFF` | Cards, surfaces |
| Ink | `#2B241D` | Body text, dark sections |
| Ink soft | `#6b6155` | Secondary text |
| Berry | `#C7355A` | Primary brand accent |
| Berry deep | `#9E2645` | Berry hover/active state |
| Pistachio | `#6F9463` | Fresh / success accent |
| Pistachio soft | `#E4EEDF` | Pistachio background fill |
| Honey | `#E2A233` | Primary CTA |
| Honey deep | `#C4830F` | Honey hover state |
| Line | `#E7DECC` | Borders, dividers |

## Typography

Three typefaces, each with one job:

- **Fraunces** — headlines only, used with restraint. Weight 600 for display
  text, italic 500 for emphasis within a headline.
- **Inter** — everything readable: body copy, UI labels, nav.
- **JetBrains Mono** — anything transactional: prices, order numbers, promo
  codes, timestamps. This is what gives the transactional moments (cart,
  checkout, tracker) a distinct, receipt-like texture against the warm serif
  headlines.

Google Fonts import used in the prototype:
```
Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500
Inter:wght@400;500;600;700
JetBrains+Mono:wght@400;500;700
```

## Signature UI element: the layered-cake order tracker

Order status is not a generic 1-2-3-4 stepper. It's shown as a cake literally
being built layer by layer, stage by stage:

1. **Order placed** — payment confirmed
2. **In the oven** — sponge baking
3. **Decorating** — icing and final touches
4. **Ready** — pickup at counter

Each completed stage adds a visual layer to an illustrated cake (berry,
pistachio, honey layers stacking bottom to top). This is the one deliberately
bold, illustrated moment in an otherwise restrained design — reserved for
order tracking specifically so it stays meaningful rather than decorative.
See the `.tracker-card` / `.stage` components in
[`prototype/design-system.html`](../../prototype/design-system.html) and the
full flow in [`prototype/track-order.html`](../../prototype/track-order.html).

## Components (see prototype for live versions)

- **Buttons** — pill-shaped (100px radius). Honey primary for the one action
  per screen that matters most; outlined ghost for everything secondary.
  Never more than one primary button visible in a section at once.
- **Tags & status** — small pill chips for dietary/product tags (e.g.
  "Eggless option", "Bestseller"), and status pills for open/opening-soon
  branch states.
- **Product card** — icon/photo, tag chips, name, description, price (mono),
  add button.
- **Offer card** — dashed border, coupon-style with punch-hole detail on
  each side, mono promo code.
- **Cards & radius** — `22px` radius for cards and large containers, `12px`
  for chips/small tiles. Shadow (`0 18px 40px -20px rgba(43,36,29,.25)`) is
  hover-only, never present at rest.
- **Spacing** — `64px` vertical padding between major sections.

## Pages prototyped so far

All in [`/prototype`](../../prototype):

- `index.html` — home
- `menu.html` — full catalogue with category tabs and search
- `offers.html` — active promotions
- `track-order.html` — live order status (the signature tracker)
- `locations.html` — current + future branches
- `design-system.html` — this reference, as an interactive page

Note: the content in these pages (menu items, prices, offer copy, delivery
zones, payment badges) is illustrative sample data used to build out the
design, not confirmed client requirements — see
[`docs/requirements/requirements.md`](../requirements/requirements.md) for
what's actually confirmed vs. still open.
