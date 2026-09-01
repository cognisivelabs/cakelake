"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = STORAGE_KEYS.installDismissed;

export function InstallPrompt() {
  const { platform, triggerInstall } = useInstallPrompt();
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setSessionDismissed(true);
  }

  async function handlePrimaryAction() {
    if (platform === "android") {
      const outcome = await triggerInstall();
      if (outcome === "accepted") {
        window.localStorage.setItem(DISMISSED_KEY, "1");
      }
      setSessionDismissed(true);
      return;
    }
    setShowSteps(true);
  }

  if (platform === "none") return null;
  const dismissed = sessionDismissed || window.localStorage.getItem(DISMISSED_KEY) === "1";
  if (dismissed) return null;

  return (
    <div className={styles.card}>
      <div className={styles.badge}>CL</div>
      <div className={styles.body}>
        <div className={styles.title}>Keep Cake Lake on your home screen</div>
        {showSteps && platform === "ios" && (
          <ol className={styles.steps}>
            <li>
              Tap the <b>Share</b> icon in Safari&apos;s toolbar.
            </li>
            <li>
              Scroll down and tap <b>Add to Home Screen</b>.
            </li>
            <li>Tap Add.</li>
          </ol>
        )}
        {showSteps && platform === "android-manual" && (
          <ol className={styles.steps}>
            <li>
              Tap the <b>⋮</b> menu in your browser&apos;s toolbar.
            </li>
            <li>
              Tap <b>Add to Home screen</b> (or <b>Install app</b>).
            </li>
            <li>Tap Add.</li>
          </ol>
        )}
        {!showSteps && (
          <div className={styles.text}>
            {platform === "ios" && (
              <>
                Tap <b>Share</b>, then <b>Add to Home Screen</b>. No app to install.
              </>
            )}
            {platform === "android-manual" && (
              <>
                Tap your browser&apos;s <b>⋮</b> menu, then <b>Add to Home screen</b>. No app to
                install.
              </>
            )}
            {platform === "android" && <>Add Cake Lake to your home screen. No app to install.</>}
          </div>
        )}
        {!showSteps && (
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={handlePrimaryAction}>
              {platform === "android" ? "INSTALL" : "SHOW ME HOW"}
            </button>
            <button type="button" className={styles.dismissButton} onClick={dismiss}>
              Not now
            </button>
          </div>
        )}
        {showSteps && (
          <button type="button" className={styles.primaryButton} onClick={dismiss}>
            GOT IT
          </button>
        )}
      </div>
    </div>
  );
}
