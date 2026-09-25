import type { FilterKey } from "@/lib/search";
import styles from "./menu.module.css";

// The filters currently applied, each a chip that removes itself.
export function ActiveFilters({
  chips,
  onRemove,
}: {
  chips: { key: FilterKey; label: string }[];
  onRemove: (key: FilterKey) => void;
}) {
  if (chips.length === 0) return null;
  return (
    <div className={styles.activeFilters}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className={styles.activeFilter}
          onClick={() => onRemove(chip.key)}
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label} <span aria-hidden="true">×</span>
        </button>
      ))}
    </div>
  );
}
