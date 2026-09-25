"use client";

import type { FilterGroup, PriceRange } from "@/lib/search";
import { PriceSlider } from "./PriceSlider";
import styles from "./menu.module.css";

// The menu's filters — category, price, flavour, occasion. Checkbox groups
// only report which option was toggled; whether a group is single- or
// multi-choice is the caller's rule. The count beside an option is how many
// cakes you'd get, given every other filter already set, and an option that
// would leave nothing is greyed out. Price is a range slider.
export function FilterPanel({
  groups,
  onToggle,
  onPriceChange,
}: {
  groups: FilterGroup[];
  onToggle: (key: Exclude<FilterGroup["key"], "priceRange">, optionId: string) => void;
  onPriceChange: (range: PriceRange) => void;
}) {
  return (
    <div className={styles.filterPanel}>
      {groups.map((group) => {
        if (group.kind === "range") return <PriceSlider key={group.key} group={group} onChange={onPriceChange} />;
        return (
          <div key={group.key} className={styles.filterGroup}>
            <div className={`${styles.filterGroupLabel} mono-tag`}>{group.label}</div>
            <div className={styles.filterList}>
              {group.options.map((option) => {
                const checked = group.selected.includes(option.id);
                const disabled = option.count === 0 && !checked;
                return (
                  <label key={option.id} className={styles.filterOption} data-disabled={disabled}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onToggle(group.key, option.id)}
                    />
                    <span className={styles.filterOptionLabel}>{option.label}</span>
                    <span className={styles.filterCount}>{option.count}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
