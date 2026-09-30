import { CONFIG } from "@/lib/config";
import { THEMES, themeToCss, type Theme } from "@/theme/themes";
import type { CategoryColour } from "@/types/catalog";

/** The theme CONFIG.theme names (the default if it ever names one that
 * doesn't exist, so a typo can't leave the site unstyled). */
export function getActiveTheme(): Theme {
  return THEMES[CONFIG.theme] ?? THEMES["strawberry-cream"];
}

/** The active theme as the `:root { --color-… }` block the layout inlines. */
export function getActiveThemeCss(): string {
  return themeToCss(getActiveTheme());
}

/** Browser chrome / PWA colours follow the theme's header and page. */
export function getThemeColor(): string {
  return getActiveTheme().colors.headerBg;
}

export function getBackgroundColor(): string {
  return getActiveTheme().colors.bg;
}

/** A category colour as theme CSS variables: `accent` for chips and
 * headings, `tint` (a pale version) for tag backgrounds. */
export function categoryColours(colour: CategoryColour): { accent: string; tint: string } {
  return { accent: `var(--color-${colour})`, tint: `var(--color-${colour}-bg)` };
}
