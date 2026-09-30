import type { CatalogItem, Category } from "@/types/catalog";
import { readyLabel } from "@/lib/catalog";
import styles from "./ItemDetailView.module.css";
import { categoryColours } from "@/theme";

/** The category as a coloured tag. */
export function CategoryTag({ category }: { category: Category }) {
  const { accent, tint } = categoryColours(category.colour);
  return (
    <span className={`${styles.tag} mono-tag`} style={{ background: tint, color: accent }}>
      {category.label}
    </span>
  );
}

/** "Ready in 1 hour" (calm) or "24 hours notice" (a heads-up) — coloured by
 * whether the item needs notice. */
export function ReadyTag({ item }: { item: CatalogItem }) {
  return (
    <span className={`${styles.tag} ${item.leadTimeHours > 0 ? styles.tagNotice : styles.tagReady} mono-tag`}>
      {readyLabel(item)}
    </span>
  );
}

/** "Most ordered" — one of Home's featured best-sellers (an item with a
 * `mostOrderedRank`). Renders nothing for any other item, so callers can just
 * always place it rather than checking `mostOrderedRank` themselves. */
export function MostOrderedTag({ item }: { item: CatalogItem }) {
  if (item.mostOrderedRank === undefined) return null;
  return <span className={`${styles.tag} ${styles.tagMostOrdered} mono-tag`}>Most ordered</span>;
}
