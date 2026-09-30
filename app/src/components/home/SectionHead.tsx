import type { ReactNode } from "react";
import styles from "./HomeSections.module.css";

/** A rail/grid section's title row — the title plus whatever sits to its
 * right (meta text and arrows for RailSection, a "View all" link for
 * MostOrdered). */
export function SectionHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.sectionHead}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}
