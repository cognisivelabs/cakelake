"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { INSTALL_STEPS } from "@/components/installSteps";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = STORAGE_KEYS.installDismissed;

// A slim strip above the header (design: CLB Install Banner, 1b Android /
// 1c iPhone Safari & manual Android) — pushes the page down and scrolls
// away with it, rather than floating over the lower third of the first
// screen the way the card this replaces did. The eligibility/dismissal
// logic is unchanged: useInstallPrompt still decides the platform, and
// the × still sets the same dismissed key.
export function InstallPrompt() {
  const { platform, triggerInstall } = useInstallPrompt();
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  function dismiss() {
    safeSetItem(DISMISSED_KEY, "1");
    setSessionDismissed(true);
  }

  async function handleAction() {
    if (platform === "android") {
      const outcome = await triggerInstall();
      if (outcome === "accepted") {
        safeSetItem(DISMISSED_KEY, "1");
      }
      setSessionDismissed(true);
      return;
    }
    // iOS and android-manual can't install from a button — the action
    // toggles the numbered steps instead. Once they're open, the same
    // button reads "GOT IT" and dismisses the strip, same as ×.
    if (open) {
      dismiss();
      return;
    }
    setOpen(true);
  }

  if (platform === "none") return null;
  const dismissed = sessionDismissed || safeGetItem(DISMISSED_KEY) === "1";
  if (dismissed) return null;

  const steps = platform === "ios" || platform === "android-manual" ? INSTALL_STEPS[platform] : null;

  return (
    <div className={styles.strip}>
      <div className={styles.row}>
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss">
          ×
        </button>
        <div className={styles.badge}>CL</div>
        <div className={styles.body}>
          <div className={styles.title}>Save Cake Lake to home</div>
          <div className={styles.subtitle}>Order in two taps · no app store</div>
        </div>
        <button type="button" className={styles.action} data-open={open} onClick={handleAction}>
          {platform === "android" ? "INSTALL" : open ? "GOT IT" : "HOW?"}
        </button>
      </div>
      {steps && open && (
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li key={i}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
