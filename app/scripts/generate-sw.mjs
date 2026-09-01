// Bakes the current git commit into public/sw.js's cache name, so every
// deploy gets a cache the activate handler in sw-template.js has never
// seen before and correctly deletes the previous one. Without this, the
// version string is a hardcoded literal that never changes between
// deploys — the "delete anything that isn't the current version" cleanup
// then has nothing to ever clean up, and hashed static-asset entries from
// every past deploy just accumulate in the one cache forever.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

function currentVersion() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: here }).toString().trim();
  } catch {
    // No git available (e.g. a source-only install) — a timestamp still
    // guarantees each generated build gets a distinct cache name.
    return String(Date.now());
  }
}

const template = readFileSync(join(here, "sw-template.js"), "utf8");
const output = template.replace("VERSION_PLACEHOLDER", currentVersion());
writeFileSync(join(here, "..", "public", "sw.js"), output);
