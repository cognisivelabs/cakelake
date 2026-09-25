import type { Category } from "@/types/catalog";
import { getCatalog, getCategories, getCategoriesByKind } from "@/lib/catalog";
import { categoryRoute, ROUTES } from "@/lib/routes";
import { categoryPriceLabel } from "@/lib/pricing";

export type MenuGroupEntry = { category: Category; priceLabel: string };
export type MenuGroup = { id: string; label: string; entries: MenuGroupEntry[] };

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
  const standard = categories.filter((c) => c.kind !== "custom");
  return [
    { id: "ready-1h", label: "CAKES · READY IN 1 HOUR", entries: standard.filter(isSameDay).map(entry) },
    { id: "notice-24h", label: "CAKES ON 24 HOURS", entries: standard.filter((c) => !isSameDay(c)).map(entry) },
    {
      id: "custom",
      label: "PHOTO & 3D",
      entries: getCategoriesByKind("custom").map(entry),
    },
  ].filter((group) => group.entries.length > 0);
}

/** Where the "Photo & 3D" links go: the first custom category (Photo
 * cakes), or the whole menu if a build has none. */
export function getCustomCategoriesRoute(): string {
  const first = getCategoriesByKind("custom")[0];
  return first ? categoryRoute(first.id) : ROUTES.menu;
}
