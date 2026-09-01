"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EXTERNAL_LINK_PROPS } from "@/lib/externalLink";

// Inline styles, not a CSS Module — this boundary can activate on any
// page at any moment, so Next preloads its CSS on every single page
// load just in case. Since it's rarely actually shown, that preload
// almost never gets used in time and Chrome logs an "unused preload"
// warning. Inline styles mean there's no separate stylesheet to
// preload at all, which also keeps the recovery UI from depending on
// a stylesheet successfully loading in the first place.
const wrapStyle: CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 13,
  padding: "40px 30px",
  textAlign: "center",
};

const mutedStyle: CSSProperties = {
  margin: 0,
  color: "var(--color-ink-muted)",
  fontSize: "0.8rem",
  lineHeight: 1.6,
  maxWidth: 280,
};

const actionsStyle: CSSProperties = {
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  gap: 9,
  width: "100%",
  maxWidth: 280,
};

const primaryButtonStyle: CSSProperties = {
  background: "var(--color-accent)",
  color: "var(--color-ink)",
  border: "none",
  borderRadius: "var(--radius-md)",
  padding: 14,
  textAlign: "center",
  fontWeight: 800,
  fontSize: "0.78rem",
  letterSpacing: "0.04em",
  boxShadow: "0 2px 0 var(--color-accent-shadow)",
  cursor: "pointer",
  textDecoration: "none",
};

const outlineButtonStyle: CSSProperties = {
  border: "1.5px solid var(--color-ink)",
  color: "var(--color-ink)",
  background: "none",
  borderRadius: "var(--radius-md)",
  padding: 12,
  textAlign: "center",
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.04em",
  cursor: "pointer",
  textDecoration: "none",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No error-reporting service wired up (POC phase) — the console is
    // the only record, same as any other unhandled error on this site.
    console.error(error);
  }, [error]);

  return (
    <div style={wrapStyle}>
      <h1>Something went wrong</h1>
      <p style={mutedStyle}>
        Sorry about that — nothing was lost, but this page hit a snag. Try
        again, or message us directly if it keeps happening.
      </p>
      <div style={actionsStyle}>
        <button type="button" style={primaryButtonStyle} onClick={reset}>
          TRY AGAIN
        </button>
        <Link href={ROUTES.home} style={outlineButtonStyle}>
          BACK TO HOME
        </Link>
        <a href={buildWhatsAppUrl()} {...EXTERNAL_LINK_PROPS} style={outlineButtonStyle}>
          MESSAGE US ON WHATSAPP
        </a>
      </div>
    </div>
  );
}
