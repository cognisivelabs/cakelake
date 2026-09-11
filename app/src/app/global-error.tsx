"use client";

import { useEffect } from "react";

// Only fires if the root layout itself throws (Script setup, CartProvider,
// etc.) — error.tsx handles everything below that. Next.js requires this
// file to render its own <html>/<body> since it replaces the whole root
// layout, and recommends keeping it as dependency-free as possible since
// it's the last line of defense.
//
// The colors below are deliberately hardcoded literals, not
// CONFIG.themeColor/backgroundColor or globals.css's custom properties,
// even though that duplicates them a third time (see config.ts's own
// note on the CONFIG/globals.css duplication) — this page exists
// specifically for when the layout that would normally load
// globals.css has already failed, so it can't safely assume that
// stylesheet (or CONFIG, or any other app module) loaded correctly.
// Import nothing that isn't guaranteed to work standalone.
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
          background: "#FBF4E4",
          color: "#4F352F",
        }}
      >
        <h1>Something went wrong</h1>
        <p style={{ maxWidth: 280, color: "#7B6049", fontSize: "0.85rem", lineHeight: 1.6 }}>
          Sorry about that. Reloading the page usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#EFD400",
            color: "#4F352F",
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
