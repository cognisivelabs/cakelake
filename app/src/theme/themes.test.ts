import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CONFIG } from "@/lib/config";
import { contrastRatio, mix } from "@/theme/color";
import { getActiveTheme, getActiveThemeCss, getBackgroundColor, getThemeColor } from "@/theme";
import { THEMES, themeToCss, type ThemeColors } from "@/theme/themes";

const themes = Object.values(THEMES);

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return path.endsWith(".css") ? [path] : [];
  });
}

describe("color helpers", () => {
  it("mixes two colours by weight", () => {
    expect(mix("#000000", "#FFFFFF", 0.5)).toBe("#808080");
    expect(mix("#FF0000", "#0000FF", 0)).toBe("#FF0000");
    expect(mix("#FF0000", "#0000FF", 1)).toBe("#0000FF");
  });

  it("computes WCAG contrast ratios", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });
});

describe("themes", () => {
  it("keys each theme by its own id", () => {
    for (const [key, theme] of Object.entries(THEMES)) expect(theme.id).toBe(key);
  });

  it("defines every colour as a #RRGGBB value", () => {
    for (const theme of themes) {
      for (const [name, value] of Object.entries(theme.colors)) {
        expect(value, `${theme.id}.${name}`).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  it("gives every theme a label and description a client can choose from", () => {
    for (const theme of themes) {
      expect(theme.label.length, theme.id).toBeGreaterThan(0);
      expect(theme.description.length, theme.id).toBeGreaterThan(0);
    }
  });

  it("is switched by CONFIG.theme, which names a real theme", () => {
    expect(Object.keys(THEMES)).toContain(CONFIG.theme);
    expect(getActiveTheme().id).toBe(CONFIG.theme);
  });

  it("makes Strawberry cream & blush the current theme", () => {
    expect(CONFIG.theme).toBe("strawberry-cream");
    expect(getActiveTheme().label).toBe("Strawberry cream & blush");
  });

  it("drives the browser theme colour and PWA background from the active theme", () => {
    expect(getThemeColor()).toBe(getActiveTheme().colors.headerBg);
    expect(getBackgroundColor()).toBe(getActiveTheme().colors.bg);
  });
});

describe("themeToCss", () => {
  it("emits one :root block for the active theme", () => {
    const css = getActiveThemeCss();
    expect(css.startsWith(":root{")).toBe(true);
    expect(css).toContain(`--color-accent:${getActiveTheme().colors.accent}`);
  });

  it("gives every theme a definition for every --color-* the stylesheets use", () => {
    const used = new Set<string>();
    for (const file of cssFiles(join(process.cwd(), "src"))) {
      for (const match of readFileSync(file, "utf8").matchAll(/var\((--color-[a-z0-9-]+)\)/g)) used.add(match[1]);
    }
    expect(used.size).toBeGreaterThan(20);
    for (const theme of themes) {
      const css = themeToCss(theme);
      for (const name of used) expect(css, `${theme.id} is missing ${name}`).toContain(`${name}:`);
    }
  });

  it("makes themes visibly different from one another", () => {
    const accents = new Set(themes.map((t) => t.colors.accent));
    expect(accents.size).toBeGreaterThan(4);
  });
});

// Text that has to be read must be legible on the colour it sits on.
// 3:1 is WCAG's floor for large or bold text (button labels, headings,
// pills); body copy on the page is held to the stricter 4.5:1.
describe("theme legibility", () => {
  const pairs: { label: string; fg: keyof ThemeColors; bg: keyof ThemeColors; min: number }[] = [
    { label: "ink on page", fg: "ink", bg: "bg", min: 4.5 },
    { label: "ink on cards", fg: "ink", bg: "surface", min: 4.5 },
    { label: "soft ink on page", fg: "inkSoft", bg: "bg", min: 4.5 },
    { label: "muted ink on page", fg: "inkMuted", bg: "bg", min: 3 },
    { label: "button label on accent", fg: "accentInk", bg: "accent", min: 3 },
    { label: "header text on header", fg: "headerInk", bg: "headerBg", min: 4.5 },
    { label: "utility text on utility bar", fg: "utilityInk", bg: "utilityBg", min: 4.5 },
    { label: "utility strong on utility bar", fg: "utilityStrong", bg: "utilityBg", min: 4.5 },
    { label: "footer text on footer", fg: "footerInk", bg: "footerBg", min: 4.5 },
    { label: "footer muted on footer", fg: "footerMuted", bg: "footerBg", min: 3 },
    { label: "footer strong on footer", fg: "footerStrong", bg: "footerBg", min: 4.5 },
    { label: "pale lead pill", fg: "readyInk", bg: "readyBg", min: 4.5 },
    { label: "notice text", fg: "noticeInk", bg: "noticeBg", min: 4.5 },
  ];

  for (const theme of themes) {
    for (const pair of pairs) {
      it(`${theme.id}: ${pair.label} ≥ ${pair.min}:1`, () => {
        const ratio = contrastRatio(theme.colors[pair.fg], theme.colors[pair.bg]);
        expect(ratio).toBeGreaterThanOrEqual(pair.min);
      });
    }
    it(`${theme.id}: white text on its solid pills and banner ground ≥ 3:1`, () => {
      for (const key of ["pink", "readySolid", "whatsapp", "bannerBg", "berry"] as const) {
        expect(contrastRatio("#FFFFFF", theme.colors[key]), `${theme.id}.${key}`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
