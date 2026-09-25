"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { PRICE_STEP, type PriceRange, type RangeGroup } from "@/lib/search";
import styles from "./menu.module.css";

type Edge = "min" | "max";

// The price filter: "AED [min] to [max]" boxes above a two-handle slider.
// The slider is Radix's (keyboard, touch and screen-reader support come
// with it); the boxes take an exact figure, applied on Enter or when you
// leave the box, so half-typed numbers don't jump the results around.
export function PriceSlider({
  group,
  onChange,
}: {
  group: RangeGroup;
  onChange: (range: PriceRange) => void;
}) {
  const { bounds, value, count } = group;
  // What's being typed in a box; null shows the current value instead.
  const [draft, setDraft] = useState<Record<Edge, string | null>>({ min: null, max: null });

  function commit(edge: Edge) {
    const typed = Number(draft[edge]);
    setDraft((d) => ({ ...d, [edge]: null }));
    if (draft[edge] === null || draft[edge] === "" || Number.isNaN(typed)) return;
    // onChange orders and clamps, so a min typed above the max just swaps.
    onChange(edge === "min" ? { min: typed, max: value.max } : { min: value.min, max: typed });
  }

  const box = (edge: Edge, label: string) => (
    <label className={styles.priceBox}>
      <span className={styles.priceBoxCurrency}>AED</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={draft[edge] ?? String(value[edge])}
        onChange={(e) => setDraft((d) => ({ ...d, [edge]: e.target.value.replace(/\D/g, "") }))}
        onBlur={() => commit(edge)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />
    </label>
  );

  return (
    <div className={styles.filterGroup}>
      <div className={`${styles.filterGroupLabel} mono-tag`}>{group.label}</div>
      <div className={styles.priceInputs}>
        {box("min", "Lowest price")}
        <span className={styles.priceTo}>to</span>
        {box("max", "Highest price")}
      </div>
      <Slider.Root
        className={styles.priceSlider}
        min={bounds.min}
        max={bounds.max}
        step={PRICE_STEP}
        minStepsBetweenThumbs={1}
        value={[value.min, value.max]}
        onValueChange={([min, max]) => onChange({ min, max })}
      >
        <Slider.Track className={styles.priceTrack}>
          <Slider.Range className={styles.priceRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.priceThumb} aria-label="Lowest price" />
        <Slider.Thumb className={styles.priceThumb} aria-label="Highest price" />
      </Slider.Root>
      <div className={styles.priceCount}>
        {count} {count === 1 ? "cake" : "cakes"}
      </div>
    </div>
  );
}
