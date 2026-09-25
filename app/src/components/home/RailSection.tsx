"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./HomeSections.module.css";

// A titled, horizontally scrolling row. Touch scrolls it natively; on
// desktop the ← → buttons page through it (← greys out at the start,
// → at the end).
export function RailSection({
  title,
  meta,
  mobileMeta,
  arrows = true,
  children,
}: {
  title: string;
  meta?: string;
  mobileMeta?: string;
  /** Desktop ← → buttons — off for rows that lay out as a grid there. */
  arrows?: boolean;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function page(direction: 1 | -1) {
    const el = railRef.current;
    el?.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {meta && (
          <div className={`${styles.sectionMeta} ${styles.metaDesktop}`}>
            {meta}
          </div>
        )}
        {mobileMeta && (
          <div className={`${styles.sectionMeta} ${styles.metaMobile}`}>
            {mobileMeta}
          </div>
        )}
        {arrows && (
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label={`Scroll ${title} back`}
            >
              ←
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label={`Scroll ${title} forward`}
            >
              →
            </button>
          </div>
        )}
      </div>
      <div ref={railRef} className={styles.rail}>
        {children}
      </div>
    </section>
  );
}
