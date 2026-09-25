"use client";

import { useEffect } from "react";
import { getActiveTheme } from "@/theme";

// Only fires if the root layout itself throws (Script setup, CartProvider,
// etc.) — error.tsx handles everything below that. Next.js requires this
// file to render its own <html>/<body> since it replaces the whole root
// layout, and recommends keeping it as dependency-free as possible since
// it's the last line of defense.
//
// Its colours come straight from the active theme's data (theme/), not
// from the CSS custom properties the root layout injects — this page
// exists for when that layout has already failed, so it can't assume
// the injected stylesheet is there. theme/ is plain data, so it's safe
// to import; keep this file free of anything heavier.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const colors = getActiveTheme().colors;

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 13,
          padding: "40px 30px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: colors.bg,
          color: colors.ink,
        }}
      >
        <h1>Something went wrong</h1>
        <p style={{ maxWidth: 280, color: colors.inkMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>
          Sorry about that. Reloading the page usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: colors.accent,
            color: colors.accentInk,
            border: "none",
            borderRadius: 8,
            padding: "14px 20px",
            fontWeight: 800,
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          RELOAD
        </button>
      </body>
    </html>
  );
}
