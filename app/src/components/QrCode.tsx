"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

/** Renders a scannable QR code for `value` — Cart — desktop's handoff
 * screen, so a customer can send the WhatsApp order from their phone
 * instead of this desktop browser. Client-side only (static export has
 * no server to render it ahead of time). */
export function QrCode({ value, size = 168 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 1 }).catch(() => {
      // Best-effort — "open WhatsApp Web" stays a working fallback either way.
    });
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} role="img" aria-label="QR code to open this order in WhatsApp" />;
}
