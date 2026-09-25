import type { CatalogItem, Category } from "@/types/catalog";
import styles from "./ItemDetailView.module.css";

/** The category as a coloured tag. */
export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className={`${styles.tag} mono-tag`} style={{ background: category.tint, color: category.accent }}>
      {category.label}
    </span>
  );
}

/** "Ready in 1 hour" (calm) or "24 hours notice" (a heads-up) — coloured by
 * whether the item needs notice. */
export function ReadyTag({ item }: { item: CatalogItem }) {
  return (
    <span className={`${styles.tag} ${item.leadTimeHours > 0 ? styles.tagNotice : styles.tagReady} mono-tag`}>
      {item.readyLabel}
    </span>
  );
}
