// localStorage.getItem/setItem can throw — Safari private browsing in
// older versions, a full quota, or a browser/extension policy blocking
// storage outright. Every call site should degrade to "storage isn't
// available" rather than crash the page.

export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Best-effort — if storage is unavailable, the value just won't persist.
  }
}
