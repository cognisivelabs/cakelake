"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import styles from "./QrCode.module.css";

// Highest correction first — safest for the centered "CL" badge below,
// which needs headroom to be scanned around. A very large order's
// encoded WhatsApp link can exceed level "H"'s capacity outright (QR
// capacity shrinks as correction strength rises), so this steps down
// only as far as the payload actually requires.
const CORRECTION_LEVELS = ["H", "M", "L"] as const;

/** Renders a scannable QR code for `value` — Cart — desktop's handoff
 * screen, so a customer can send the WhatsApp order from their phone
 * instead of this desktop browser. Client-side only (static export has
 * no server to render it ahead of time). Branded with a centered "CL"
 * monogram and the ink colour instead of plain black-on-white. */
export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      for (const level of CORRECTION_LEVELS) {
        if (!canvasRef.current) return;
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            errorCorrectionLevel: level,
            color: {
              dark: "#4f352f", // --color-ink
              light: "#ffffff",
            },
          });
          if (!cancelled) setRendered(true);
          return;
        } catch {
          // Too much data for this level — try the next, lower one.
        }
      }
      // Exhausted every level (an extremely large order) — leave the
      // canvas blank; "open WhatsApp Web" below stays a working fallback.
    }

    render();
    return () => {
      cancelled = true;
    };
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
      {rendered && (
        <span className={styles.badge} aria-hidden="true">
          CL
        </span>
      )}
    </div>
  );
}
