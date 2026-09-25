import { mix } from "@/theme/color";

/**
 * Colour themes — the whole "skin". The site reads every colour from CSS
 * variables generated here, so switching CONFIG.theme (lib/config.ts)
 * re-skins every page, the browser's theme colour and the PWA manifest.
 *
 * A theme authors the colours the designs specify (ThemeColors). The
 * small tints the designs don't spell out — a pale pink behind a tag, a
 * stronger border — are derived from those (deriveTokens), so a new
 * theme needs only the authored set.
 *
 * Sources: "strawberry-cream" is the client-selected design (docs: CLB
 * Desktop Home v2). "balanced-yellow" is the previous skin. The other
 * four are the remaining directions from CLB Colour Refresh, read off
 * its desktop screens.
 */
export type ThemeColors = {
  /** Page background. */
  bg: string;
  /** Cards and panels. */
  surface: string;
  /** Quiet panels, hover and notice fills. */
  surfaceMuted: string;
  /** Behind a photo (and the empty-photo placeholder). */
  photoBg: string;
  border: string;
  placeholderBorder: string;

  /** Headings and primary text. */
  ink: string;
  /** Body copy a shade lighter than headings. */
  inkSoft: string;
  /** Secondary text. */
  inkMuted: string;

  /** Primary buttons and selected states. */
  accent: string;
  /** Text on `accent`. */
  accentInk: string;
  /** The button's drop-shadow edge. */
  accentShadow: string;
  /** Category colour, badges, counts — the brand's second voice. */
  pink: string;
  /** The one category that stands apart (3D cakes). */
  berry: string;
  /** Solid ground of the promotional (Photo cakes) hero banner. */
  bannerBg: string;

  /** Solid "ready in 1 hour" pill on the hero. */
  readySolid: string;
  /** Pale lead-time pills (Home cards, footer payment note). */
  readyBg: string;
  readyInk: string;
  /** Notices and the counter-only card. */
  noticeBg: string;
  noticeInk: string;
  /** WhatsApp / message actions. */
  whatsapp: string;

  headerBg: string;
  headerInk: string;
  utilityBg: string;
  utilityInk: string;
  /** The bold parts of the utility bar (place, phone). */
  utilityStrong: string;
  utilityDivider: string;
  footerBg: string;
  footerInk: string;
  footerMuted: string;
  /** Footer brand name and phone. */
  footerStrong: string;
  footerRule: string;
};

export type Theme = { id: string; label: string; description: string; colors: ThemeColors };

const STRAWBERRY_CREAM: Theme = {
  id: "strawberry-cream",
  label: "Strawberry cream & blush",
  description: "Blush page, strawberry actions, plum ink; pistachio only for the timing pills.",
  colors: {
    bg: "#FFF7F6",
    surface: "#FFFFFF",
    surfaceMuted: "#FDF0F2",
    photoBg: "#FCEBED",
    border: "#F3DEE1",
    placeholderBorder: "#EFC9CF",
    ink: "#43272E",
    inkSoft: "#6B3B45",
    inkMuted: "#8A6670",
    accent: "#CE4469",
    accentInk: "#FFFFFF",
    accentShadow: "#A83554",
    pink: "#CE4469",
    berry: "#91134B",
    bannerBg: "#A83554",
    readySolid: "#6F8F5A",
    readyBg: "#EFF3E8",
    readyInk: "#4C6140",
    noticeBg: "#FDF0F2",
    noticeInk: "#6B3B45",
    whatsapp: "#1F7A72",
    headerBg: "#F9DCE2",
    headerInk: "#43272E",
    utilityBg: "#FBE7E9",
    utilityInk: "#6B3B45",
    utilityStrong: "#6B3B45",
    utilityDivider: "#F3DEE1",
    footerBg: "#FBE7E9",
    footerInk: "#6B3B45",
    footerMuted: "#8A6670",
    footerStrong: "#6B3B45",
    footerRule: "#F3DEE1",
  },
};

const BALANCED_YELLOW: Theme = {
  id: "balanced-yellow",
  label: "Balanced yellow",
  description: "The previous skin: yellow header and buttons, deep-brown chrome, cream page.",
  colors: {
    bg: "#FBF4E4",
    surface: "#FFFFFF",
    surfaceMuted: "#F6EFE0",
    photoBg: "#F3E7CF",
    border: "#ECE0C8",
    placeholderBorder: "#CBB89A",
    ink: "#4F352F",
    inkSoft: "#5C463F",
    inkMuted: "#7B6049",
    accent: "#EFD400",
    accentInk: "#4F352F",
    accentShadow: "#C9B400",
    pink: "#CD346F",
    berry: "#91134B",
    bannerBg: "#91134B",
    readySolid: "#CD346F",
    readyBg: "#FDF6D9",
    readyInk: "#6B5A42",
    noticeBg: "#FDF6D9",
    noticeInk: "#7F6630",
    whatsapp: "#228883",
    headerBg: "#EFD400",
    headerInk: "#4F352F",
    utilityBg: "#4F352F",
    utilityInk: "#E8DCC6",
    utilityStrong: "#EFD400",
    utilityDivider: "#6D4F47",
    footerBg: "#4F352F",
    footerInk: "#E8DCC6",
    footerMuted: "#C9B9A2",
    footerStrong: "#EFD400",
    footerRule: "#6D4F47",
  },
};

const PISTACHIO_CREAM: Theme = {
  id: "pistachio-cream",
  label: "Pistachio & cream",
  description: "Pistachio green as the brand colour, deep leaf-green ink, one raspberry accent for badges.",
  colors: {
    bg: "#F6F9F1",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F6E8",
    photoBg: "#E7EFDD",
    border: "#DDE7CF",
    placeholderBorder: "#C6D7B4",
    ink: "#2E3A28",
    inkSoft: "#3D5033",
    inkMuted: "#6C7B62",
    accent: "#4E7C3E",
    accentInk: "#FFFFFF",
    accentShadow: "#3C6230",
    pink: "#B8456A",
    berry: "#3C6230",
    bannerBg: "#3C6230",
    readySolid: "#B8456A",
    readyBg: "#EFF5E6",
    readyInk: "#4A5C3F",
    noticeBg: "#F1F6E8",
    noticeInk: "#3D5033",
    whatsapp: "#1F7A72",
    headerBg: "#DCEBCE",
    headerInk: "#2E3A28",
    utilityBg: "#EAF1E0",
    utilityInk: "#3D5033",
    utilityStrong: "#3D5033",
    utilityDivider: "#DDE7CF",
    footerBg: "#EAF1E0",
    footerInk: "#3D5033",
    footerMuted: "#6C7B62",
    footerStrong: "#3D5033",
    footerRule: "#DDE7CF",
  },
};

const VANILLA_LILAC: Theme = {
  id: "vanilla-lilac",
  label: "Vanilla & lilac (gift box)",
  description: "Vanilla page, lilac band, ribbon-gold accents — the wrapped-present direction.",
  colors: {
    bg: "#FCF9F2",
    surface: "#FFFFFF",
    surfaceMuted: "#F6F1FB",
    photoBg: "#F2ECF9",
    border: "#E9E2F0",
    placeholderBorder: "#D6C9E8",
    ink: "#35303C",
    inkSoft: "#4A3F5C",
    inkMuted: "#7A7286",
    accent: "#6E52A8",
    accentInk: "#FFFFFF",
    accentShadow: "#543E84",
    pink: "#6E52A8",
    berry: "#543E84",
    bannerBg: "#543E84",
    // Deepened a touch from the design's #C2922B so white text on the pill
    // reaches 3:1 contrast.
    readySolid: "#B8871F",
    readyBg: "#F6EFDD",
    readyInk: "#6B5423",
    noticeBg: "#F6F1FB",
    noticeInk: "#4A3F5C",
    whatsapp: "#1F7A72",
    headerBg: "#E6DCF4",
    headerInk: "#35303C",
    utilityBg: "#EFE8F7",
    utilityInk: "#4A3F5C",
    utilityStrong: "#4A3F5C",
    utilityDivider: "#E9E2F0",
    footerBg: "#EFE8F7",
    footerInk: "#4A3F5C",
    footerMuted: "#7A7286",
    footerStrong: "#4A3F5C",
    footerRule: "#E9E2F0",
  },
};

const CANDY_WHITE: Theme = {
  id: "candy-white",
  label: "Candy-shop white",
  description: "Clean white page, cobalt actions, hot-pink badges — the Crumbs & Doilies feel.",
  colors: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#FBF3F7",
    photoBg: "#F3E9F7",
    border: "#E4E4E4",
    placeholderBorder: "#DCCBE4",
    ink: "#111111",
    inkSoft: "#1B1B1B",
    inkMuted: "#6E6E6E",
    accent: "#1B3FD8",
    accentInk: "#FFFFFF",
    accentShadow: "#132FA4",
    pink: "#EC5AA0",
    berry: "#132FA4",
    bannerBg: "#132FA4",
    readySolid: "#EC5AA0",
    readyBg: "#FFF3C4",
    readyInk: "#4A3A00",
    noticeBg: "#FBF3F7",
    noticeInk: "#1B1B1B",
    whatsapp: "#1F7A72",
    headerBg: "#FFFFFF",
    headerInk: "#111111",
    utilityBg: "#F4F4F4",
    utilityInk: "#1B1B1B",
    utilityStrong: "#1B1B1B",
    utilityDivider: "#E4E4E4",
    footerBg: "#F4F4F4",
    footerInk: "#1B1B1B",
    footerMuted: "#6E6E6E",
    footerStrong: "#1B1B1B",
    footerRule: "#E4E4E4",
  },
};

const BLUSH_GOLD: Theme = {
  id: "blush-gold",
  label: "Blush & gold",
  description: "Blush header, rose actions and gold pills — the gifting-site feel.",
  colors: {
    bg: "#FFFDFC",
    surface: "#FFFFFF",
    surfaceMuted: "#FDF4F7",
    photoBg: "#F8EDF1",
    border: "#EEE0E6",
    placeholderBorder: "#E3C9D4",
    ink: "#2B1620",
    inkSoft: "#5C1230",
    inkMuted: "#7C6270",
    accent: "#D8386F",
    accentInk: "#FFFFFF",
    accentShadow: "#AE2757",
    pink: "#D8386F",
    berry: "#AE2757",
    bannerBg: "#AE2757",
    readySolid: "#B08A3C",
    readyBg: "#F7EFDD",
    readyInk: "#6B5423",
    noticeBg: "#FDF4F7",
    noticeInk: "#5C1230",
    whatsapp: "#1F7A72",
    headerBg: "#F7E3EA",
    headerInk: "#2B1620",
    utilityBg: "#FBEFF3",
    utilityInk: "#5C1230",
    utilityStrong: "#5C1230",
    utilityDivider: "#EEE0E6",
    footerBg: "#FBEFF3",
    footerInk: "#5C1230",
    footerMuted: "#7C6270",
    footerStrong: "#5C1230",
    footerRule: "#EEE0E6",
  },
};

/** Every theme the site can wear, by id. Add a theme here and it becomes
 * a valid value for CONFIG.theme. */
export const THEMES = {
  "strawberry-cream": STRAWBERRY_CREAM,
  "balanced-yellow": BALANCED_YELLOW,
  "pistachio-cream": PISTACHIO_CREAM,
  "vanilla-lilac": VANILLA_LILAC,
  "candy-white": CANDY_WHITE,
  "blush-gold": BLUSH_GOLD,
} as const satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;

/** The tints derived from a theme's authored colours. */
function deriveTokens(c: ThemeColors) {
  return {
    surfaceAlt: mix(c.surfaceMuted, c.photoBg, 0.35),
    borderStrong: mix(c.border, c.placeholderBorder, 0.5),
    inkFaint: mix(c.inkMuted, c.bg, 0.45),
    pinkBg: mix(c.surface, c.pink, 0.1),
    berryBg: mix(c.surface, c.berry, 0.1),
    whatsappBg: mix(c.surface, c.whatsapp, 0.12),
    bannerCircle: mix(c.bannerBg, "#FFFFFF", 0.18),
    unavailableBg: c.inkMuted,
    onInkSoft: mix(c.ink, c.bg, 0.85),
    onInkLine: mix(c.ink, c.bg, 0.45),
  };
}

/**
 * The theme's colours as a `:root` block of CSS custom properties — the
 * names every stylesheet already reads (--color-ink, --color-accent…),
 * plus the header/utility/footer/banner ones.
 */
export function themeToCss(theme: Theme): string {
  const c = theme.colors;
  const d = deriveTokens(c);
  const vars: Record<string, string> = {
    bg: c.bg,
    surface: c.surface,
    "surface-muted": c.surfaceMuted,
    "surface-alt": d.surfaceAlt,
    "photo-bg": c.photoBg,
    border: c.border,
    "border-strong": d.borderStrong,
    "placeholder-border": c.placeholderBorder,
    ink: c.ink,
    "ink-soft": c.inkSoft,
    "ink-muted": c.inkMuted,
    "ink-faint": d.inkFaint,
    accent: c.accent,
    "accent-ink": c.accentInk,
    "accent-shadow": c.accentShadow,
    pink: c.pink,
    "pink-bg": d.pinkBg,
    berry: c.berry,
    "berry-bg": d.berryBg,
    "banner-bg": c.bannerBg,
    "banner-circle": d.bannerCircle,
    "ready-solid": c.readySolid,
    "ready-bg": c.readyBg,
    "ready-ink": c.readyInk,
    "warn-bg": c.noticeBg,
    "warn-ink": c.noticeInk,
    teal: c.whatsapp,
    "teal-bg": d.whatsappBg,
    "unavailable-bg": d.unavailableBg,
    "on-ink-soft": d.onInkSoft,
    "on-ink-line": d.onInkLine,
    danger: "#AA3333",
    "header-bg": c.headerBg,
    "header-ink": c.headerInk,
    "utility-bg": c.utilityBg,
    "utility-ink": c.utilityInk,
    "utility-strong": c.utilityStrong,
    "utility-divider": c.utilityDivider,
    "footer-bg": c.footerBg,
    "footer-ink": c.footerInk,
    "footer-muted": c.footerMuted,
    "footer-strong": c.footerStrong,
    "footer-rule": c.footerRule,
  };
  return `:root{${Object.entries(vars)
    .map(([name, value]) => `--color-${name}:${value}`)
    .join(";")}}`;
}
