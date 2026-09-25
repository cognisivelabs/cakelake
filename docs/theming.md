# Colour themes

The whole site's colours come from one place, so a new skin is a one-line change.

## Switching theme

In `app/src/lib/config.ts`, set `theme` to one of the ids below, then rebuild:

```ts
theme: "strawberry-cream" as ThemeId,
```

| id | Name | Notes |
|---|---|---|
| `strawberry-cream` | Strawberry cream & blush | **Current.** Client-selected; from CLB Desktop Home v2. |
| `balanced-yellow` | Balanced yellow | The previous skin. |
| `pistachio-cream` | Pistachio & cream | From CLB Colour Refresh. |
| `vanilla-lilac` | Vanilla & lilac (gift box) | From CLB Colour Refresh. |
| `candy-white` | Candy-shop white | From CLB Colour Refresh. |
| `blush-gold` | Blush & gold | From CLB Colour Refresh. |

The change re-skins every page, the browser's theme colour (the address-bar
tint on mobile) and the PWA manifest colours. Nothing else needs editing.

## How it works

- `app/src/theme/themes.ts` holds each theme's colours and turns the active
  one into a `:root { --color-… }` block of CSS variables.
- The root layout inlines that block, so there is no flash of the wrong
  colours, and every stylesheet reads `var(--color-…)`. No colour is
  hard-coded in a stylesheet.
- Category colours (`lib/catalog.ts`) are variables too, so they follow the theme.

## Adding a theme

1. Copy a theme in `themes.ts`, give it a new `id`, and set its colours
   (every colour is a `#RRGGBB` value; the comments say what each is for).
2. Add it to the `THEMES` object.
3. Set `CONFIG.theme` to its id.

Small tints the designs don't spell out (a pale wash behind a tag, a stronger
border) are derived automatically from the colours you author.

`npm test` checks every theme: all colours are valid, every `var(--color-…)`
used in any stylesheet is defined for every theme, and text is legible on the
colour it sits on (WCAG contrast).

## Not themed

The logo, favicon, app icons and the maskable PWA icons are fixed brand
artwork (yellow), so they stay the same under every theme.
