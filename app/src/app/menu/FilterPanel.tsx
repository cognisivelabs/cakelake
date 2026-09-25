"use client";

import type { FilterGroup } from "@/lib/search";
import styles from "./menu.module.css";

// The menu's filter checkboxes — categories, price, flavour, occasion. The
// panel only reports which option was toggled; whether a group is single-
// or multi-choice is the caller's rule. The count beside an option is how
// many cakes you'd get, given every other filter already set, and an
// option that would leave nothing is greyed out.
export function FilterPanel({
  groups,
  onToggle,
}: {
  groups: FilterGroup[];
  onToggle: (key: FilterGroup["key"], optionId: string) => void;
}) {
  return (
    <div className={styles.filterPanel}>
      {groups.map((group) => (
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
      ))}
    </div>
  );
}
