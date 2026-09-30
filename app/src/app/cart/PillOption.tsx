"use client";

import type { ReactNode } from "react";
import styles from "./cart.module.css";

/** One button in a .pillRow — Pickup/Delivery, Today/Tomorrow/Pick a
 * date. `subtext` renders below the label in the shared .pillSubtext
 * style, when given. */
export function PillOption({
  selected,
  disabled,
  onClick,
  children,
  subtext,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  subtext?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={styles.pillOption}
      data-selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {subtext && <span className={styles.pillSubtext}>{subtext}</span>}
    </button>
  );
}
