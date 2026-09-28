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

// Modules of quiet zone drawn around the code. qrcode's own toCanvas
// defaults to 4; 2 keeps the printed code bigger without dropping
// below what phone cameras still read reliably.
const MARGIN_MODULES = 2;

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// The three position-detection squares always sit in these 7x7-module
// corners, whatever the code's overall size — see the QR spec.
function isFinderZone(row: number, col: number, n: number): boolean {
  return (row < 7 && col < 7) || (row < 7 && col >= n - 7) || (row >= n - 7 && col < 7);
}

/** Renders a scannable QR code for `value` — Cart — desktop's handoff
 * screen, so a customer can send the WhatsApp order from their phone
 * instead of this desktop browser. Client-side only (static export has
 * no server to render it ahead of time).
 *
 * Drawn from the raw module matrix (qrcode's own `create`, not its
 * `toCanvas`) rather than a flat colour swap over a plain render, so
 * the three finder squares can be rounded and two-toned — an accent
 * ring around a plum centre — matching CLB QR Codes.dc.html's "2"
 * series instead of qrcode's plain black squares. */
export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let matrix: ReturnType<typeof QRCode.create>["modules"] | undefined;
    for (const level of CORRECTION_LEVELS) {
      try {
        matrix = QRCode.create(value, { errorCorrectionLevel: level }).modules;
        break;
      } catch {
        // Too much data for this level — try the next, lower one.
      }
    }

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = QR_THEME.surface;
    ctx.fillRect(0, 0, size, size);
    // An extremely large order exhausted every level — leave the code
    // blank; "open WhatsApp Web" below stays a working fallback.
    if (!matrix) return;

    const n = matrix.size;
    const moduleSize = size / (n + MARGIN_MODULES * 2);

    ctx.fillStyle = QR_THEME.ink;
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (isFinderZone(row, col, n) || !matrix.get(row, col)) continue;
        ctx.fillRect(
          (col + MARGIN_MODULES) * moduleSize,
          (row + MARGIN_MODULES) * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }

    const corners: Array<[number, number]> = [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ];
    for (const [row, col] of corners) {
      const fx = (col + MARGIN_MODULES) * moduleSize;
      const fy = (row + MARGIN_MODULES) * moduleSize;

      // Outer ring — a rounded 6x6-module stroke inset half a module
      // from the finder's own 7x7 block.
      roundedRectPath(
        ctx,
        fx + 0.5 * moduleSize,
        fy + 0.5 * moduleSize,
        6 * moduleSize,
        6 * moduleSize,
        1.8 * moduleSize
      );
      ctx.strokeStyle = QR_THEME.accent;
      ctx.lineWidth = moduleSize;
      ctx.stroke();

      // Inner solid square, 3x3 modules, centred in the ring.
      roundedRectPath(
        ctx,
        fx + 2 * moduleSize,
        fy + 2 * moduleSize,
        3 * moduleSize,
        3 * moduleSize,
        moduleSize
      );
      ctx.fillStyle = QR_THEME.ink;
      ctx.fill();
    }
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
