"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

/** How far from the viewport's top a section's heading counts as "current" —
 * just under the sticky chip rail. */
const TRIGGER_LINE = 110;

/**
 * Tracks which of a long page's sections is currently in view, for the
 * mobile menu's sticky category chips: `activeId` is the last section whose
 * heading has scrolled up past the trigger line (or the final one at the
 * very bottom of the page, which may be too short to ever reach it).
 *
 * One scroll listener and a position scan is deliberate. An
 * IntersectionObserver plus a second listener patching the short-last-
 * section case raced each other — whichever ran last on a scroll won, so
 * the patch could be silently overwritten with the wrong section.
 */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const sections = useRef(new Map<string, HTMLElement>());
  const chips = useRef(new Map<string, HTMLElement>());

  const update = useEffectEvent(() => {
    const last = sectionIds[sectionIds.length - 1];
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && last) {
      setActiveId(last);
      return;
    }

    let bestId: string | undefined;
    let bestTop = -Infinity;
    sections.current.forEach((el, id) => {
      const top = el.getBoundingClientRect().top;
      if (top <= TRIGGER_LINE && top > bestTop) {
        bestTop = top;
        bestId = id;
      }
    });
    // Above the very first section (right at the page top) nothing has
    // crossed the line yet, so default to the first one.
    setActiveId(bestId ?? sectionIds[0] ?? "");
  });

  // Re-scan when the set of sections changes (a search narrowed them),
  // not on every render — the ids joined stand in for the array.
  const idKey = sectionIds.join(",");
  useEffect(() => {
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Measure once now, after layout, for wherever the page already is.
    const frame = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [idKey]);

  // Keep the highlighted chip inside its horizontally-scrolling strip.
  useEffect(() => {
    chips.current.get(activeId)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  /** Callback ref for a section's element. */
  const sectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sections.current.set(id, el);
    else sections.current.delete(id);
  };
  /** Callback ref for a section's chip. */
  const chipRef = (id: string) => (el: HTMLElement | null) => {
    if (el) chips.current.set(id, el);
    else chips.current.delete(id);
  };

  return { activeId, sectionRef, chipRef };
}
