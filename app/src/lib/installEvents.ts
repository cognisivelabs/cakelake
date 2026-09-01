// Shared between the beforeInteractive capture script in layout.tsx (a
// server component) and useInstallPrompt.ts (a "use client" module) — a
// plain module with no "use client" directive, since importing a value
// from a client module into a server component doesn't give you the
// real value at render time (Next replaces it with a client-reference
// stub instead), only a component you can render.
export const INSTALL_PROMPT_EVENT = "beforeinstallprompt";
export const APP_INSTALLED_EVENT = "appinstalled";
