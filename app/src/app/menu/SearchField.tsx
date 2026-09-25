import { SearchIcon } from "@/components/Icons";
import styles from "./menu.module.css";

// The menu's own search box — mobile's plain field, or desktop's with the
// magnifier, which sits at the top of the main column.
export function SearchField({
  variant,
  value,
  onChange,
}: {
  variant: "mobile" | "desktop";
  value: string;
  onChange: (value: string) => void;
}) {
  const clear = (
    <button
      type="button"
      className={variant === "desktop" ? styles.desktopClearButton : styles.clearButton}
      onClick={() => onChange("")}
      aria-label="Clear search"
    >
      ×
    </button>
  );

  if (variant === "desktop") {
    return (
      <div className={styles.desktopSearchField} data-active={value.length > 0}>
        <SearchIcon size={17} className={styles.desktopSearchIcon} />
        <input
          type="text"
          className={`${styles.desktopSearchInput} no-focus-ring`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search cakes…"
        />
        {value && clear}
      </div>
    );
  }

  return (
    <div className={styles.searchRow}>
      <div className={styles.searchField}>
        <input
          type="text"
          className={`${styles.searchInput} no-focus-ring`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search items…"
        />
        {value && clear}
      </div>
    </div>
  );
}
