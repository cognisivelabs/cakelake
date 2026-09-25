import { CONFIG } from "@/lib/config";
import { THEMES, themeToCss, type Theme } from "@/theme/themes";

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
