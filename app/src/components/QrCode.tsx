"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { CONFIG } from "@/lib/config";
import { THEMES } from "@/theme/themes";
import styles from "./QrCode.module.css";

// Plum dots on the theme's own cream, matching "2a/2b/2c" in
// Downloads/Cake Lake Bakery/CLB QR Codes.dc.html — that design's
// palette (ink #43272E, accent #CE4469) turned out to already be this
// site's "strawberry-cream" theme, so this reads it from the live
// theme rather than repeating the hex values.
const QR_THEME = THEMES[CONFIG.theme].colors;

// Highest correction first, for the most reliable scan off a screen or
// print. A very large order's encoded WhatsApp link can exceed level
// "H"'s capacity outright (QR capacity shrinks as correction strength
// rises), so this steps down only as far as the payload actually
// requires.
const CORRECTION_LEVELS = ["H", "M", "L"] as const;

/** Renders a scannable QR code for `value` — Cart — desktop's handoff
 * screen, so a customer can send the WhatsApp order from their phone
 * instead of this desktop browser. Client-side only (static export has
 * no server to render it ahead of time). */
export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function render() {
      for (const level of CORRECTION_LEVELS) {
        if (!canvasRef.current) return;
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            errorCorrectionLevel: level,
            color: {
              dark: QR_THEME.ink,
              light: QR_THEME.surface,
            },
          });
          return;
        } catch {
          // Too much data for this level — try the next, lower one.
        }
      }
      // Exhausted every level (an extremely large order) — leave the
      // canvas blank; "open WhatsApp Web" below stays a working fallback.
    }

    render();
  }, [value, size]);

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        role="img"
        aria-label="QR code to open this order in WhatsApp"
      />
    </div>
  );
}
