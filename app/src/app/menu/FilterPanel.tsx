"use client";

import type { FilterGroup, FilterKey } from "@/lib/search";
import styles from "./menu.module.css";

// The menu's Price / Flavour / Occasion filters. Each group is single-
// choice — ticking one option replaces the group's previous pick, and
// ticking it again clears it. The count beside an option is how many
// cakes you'd get, given every other filter already set, and an option
// that would leave nothing is greyed out.
export function FilterPanel({
  groups,
  onChange,
}: {
  groups: FilterGroup[];
  onChange: (key: FilterKey, value: string) => void;
}) {
  return (
    <div className={styles.filterPanel}>
      {groups.map((group) => (
        <div key={group.key} className={styles.filterGroup}>
          <div className={`${styles.filterGroupLabel} mono-tag`}>{group.label}</div>
          <div className={styles.filterList}>
            {group.options.map((option) => {
              const checked = group.selected === option.id;
              const disabled = option.count === 0 && !checked;
              return (
                <label key={option.id} className={styles.filterOption} data-disabled={disabled}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onChange(group.key, checked ? "" : option.id)}
                  />
                  <span className={styles.filterOptionLabel}>{option.label}</span>
                  <span className={styles.filterCount}>{option.count}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
