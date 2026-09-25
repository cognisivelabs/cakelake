import type { Category } from "@/types/catalog";
import { getCatalog, getCategories } from "@/lib/catalog";
import { categoryPriceLabel } from "@/lib/pricing";

export type MenuGroupEntry = { category: Category; priceLabel: string };
export type MenuGroup = { id: string; label: string; entries: MenuGroupEntry[] };

/** Categories that are a from-scratch custom brief rather than a menu
 * flavour — grouped on their own in menus. */
const CUSTOM_CATEGORY_IDS = ["photo-cakes", "3d-cakes"];

/**
 * The categories grouped by how soon they're ready — the layout of the
 * header's Cakes mega-menu and the mobile "All cakes" sheet. Built from
 * the catalog's own lead times, so a category whose notice changes moves
 * group without editing any menu.
 */
export function getMenuGroups(): MenuGroup[] {
  const catalog = getCatalog();
  const entry = (category: Category): MenuGroupEntry => ({
    category,
    priceLabel: categoryPriceLabel(catalog.filter((item) => item.categoryId === category.id)),
  });
  const isSameDay = (category: Category) =>
    catalog.filter((item) => item.categoryId === category.id).every((item) => item.leadTimeHours === 0);

  const categories = getCategories();
  const standard = categories.filter((c) => !CUSTOM_CATEGORY_IDS.includes(c.id));
  return [
    { id: "ready-1h", label: "CAKES · READY IN 1 HOUR", entries: standard.filter(isSameDay).map(entry) },
    { id: "notice-24h", label: "CAKES ON 24 HOURS", entries: standard.filter((c) => !isSameDay(c)).map(entry) },
    {
      id: "custom",
      label: "PHOTO & 3D",
      entries: categories.filter((c) => CUSTOM_CATEGORY_IDS.includes(c.id)).map(entry),
    },
  ].filter((group) => group.entries.length > 0);
}
