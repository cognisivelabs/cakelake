// Shared between the hamburger menu's "Add to Home Screen" entry
// (Header.tsx) and the floating InstallPrompt card — the exact same
// instructions were previously typed out twice.
import type { ReactNode } from "react";

export const INSTALL_STEPS: Record<"ios" | "android-manual", ReactNode[]> = {
  ios: [
    <>
      Tap the <b>Share</b> icon in Safari&apos;s toolbar.
    </>,
    <>
      Scroll down and tap <b>Add to Home Screen</b>.
    </>,
    <>Tap Add.</>,
  ],
  "android-manual": [
    <>
      Tap the <b>⋮</b> menu in your browser&apos;s toolbar.
    </>,
    <>
      Tap <b>Add to Home screen</b> (or <b>Install app</b>).
    </>,
    <>Tap Add.</>,
  ],
};
