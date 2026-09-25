import type { CSSProperties } from "react";

// The recovery pages (error.tsx, global-error.tsx) use inline styles, not
// a stylesheet — they can be shown when CSS itself failed to load — and
// share this layout. Plain data, so it's safe for global-error to import.
export const errorWrapStyle: CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 13,
  padding: "40px 30px",
  textAlign: "center",
};
